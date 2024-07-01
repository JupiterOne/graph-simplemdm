import fetch, { Response } from 'node-fetch';
import { retry } from '@lifeomic/attempt';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  SimpleMDMResponse,
  SimpleMDMAccount,
  SimpleMDMDevice,
  SimpleMDMUser,
} from './types';

import { URL, URLSearchParams } from 'url';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private baseUri = new URL(`https://a.simplemdm.com`);
  private encodedApiKey = Buffer.from(this.config.apiKey + ':').toString(
    'base64',
  );

  private withBaseUri = (path: string, params?: Record<string, string>) => {
    const url = new URL(path, this.baseUri);
    url.search = new URLSearchParams(params).toString();
    return url.toString();
  };

  private checkStatus = (response: Response) => {
    if (response.ok) {
      return response;
    } else {
      throw new IntegrationProviderAPIError(response);
    }
  };

  private async request(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<any> {
    try {
      // Handle rate-limiting
      const response = await retry(
        async () => {
          const res: Response = await fetch(uri, {
            method,
            headers: {
              Authorization: `Basic ${this.encodedApiKey}`,
            },
          });
          return this.checkStatus(res);
        },
        {
          delay: 5000,
          maxAttempts: 10,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            )
              context.abort();
          },
        },
      );
      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Pagination logic based on docs found here: https://api.simplemdm.com/#pagination
   * @param uri
   * @param method
   * @param iteratee
   * @private
   */
  private async paginatedRequest<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    try {
      let nextUri: string | null = null;
      do {
        const response: SimpleMDMResponse = await this.request(
          nextUri || uri,
          method,
        );

        if (response.has_more && response.data.length > 0) {
          nextUri = this.withBaseUri(uri, {
            limit: '100',
            starting_after:
              response.data[response.data.length - 1].id.toString(),
          });
        } else {
          nextUri = null;
        }

        for (const item of response.data) {
          await iteratee(item as unknown as T);
        }
      } while (nextUri);
    } catch (err) {
      if (err instanceof IntegrationProviderAPIError) {
        throw err;
      }

      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: uri,
        status: err.status,
        statusText: err.message,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const uri = this.withBaseUri('/api/v1/account');
    try {
      await this.request(uri);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Fetch the account resource in the provider.
   */
  public async fetchAccount(): Promise<SimpleMDMAccount> {
    return this.request(this.withBaseUri(`/api/v1/account`), 'GET');
  }

  /**
   * Iterates each device resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateDevices(
    iteratee: ResourceIteratee<SimpleMDMDevice>,
  ): Promise<void> {
    await this.paginatedRequest<SimpleMDMDevice>(
      this.withBaseUri(`/api/v1/devices`, { limit: '100' }),
      'GET',
      iteratee,
    );
  }

  /**
   * Iterates each device's installed application in the provider.
   *
   * @param deviceId
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateInstalledApplications(
    deviceId: string,
    iteratee: ResourceIteratee<any>,
  ): Promise<void> {
    await this.paginatedRequest<any>(
      this.withBaseUri(`/api/v1/devices/${deviceId}/installed_apps`, {
        limit: '100',
      }),
      'GET',
      iteratee,
    );
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param deviceId
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    deviceId: string,
    iteratee: ResourceIteratee<SimpleMDMUser>,
  ): Promise<void> {
    await this.paginatedRequest<SimpleMDMUser>(
      this.withBaseUri(`/api/v1/devices/${deviceId}/users`, {
        limit: '100',
      }),
      'GET',
      iteratee,
    );
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
