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
  SimpleMDMApplication,
  SimpleMDMUser,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private perPage = 100;
  private baseUri = `https://a.simplemdm.com`;
  private encodedApiKey = Buffer.from(this.config.apiKey + ':').toString(
    'base64',
  );

  private withBaseUri = (path: string) => `${this.baseUri}${path}`;

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
        nextUri = response['has_more']
          ? `${uri}&starting_after=${
              response.data[response.data.length - 1].id
            }`
          : null;
        for (const item of response.data) {
          await iteratee(item as unknown as T);
        }
      } while (nextUri);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: uri,
        status: err.statusCode,
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
   * Iterates each application resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateApplications(
    iteratee: ResourceIteratee<SimpleMDMApplication>,
  ): Promise<void> {
    await this.paginatedRequest<SimpleMDMApplication>(
      this.withBaseUri(`/api/v1/apps?limit=${this.perPage}`),
      'GET',
      iteratee,
    );
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
      this.withBaseUri(`/api/v1/devices?limit=${this.perPage}`),
      'GET',
      iteratee,
    );
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    deviceId: string,
    iteratee: ResourceIteratee<SimpleMDMUser>,
  ): Promise<void> {
    await this.paginatedRequest<SimpleMDMUser>(
      this.withBaseUri(
        `/api/v1/devices/${deviceId}/users?limit=${this.perPage}`,
      ),
      'GET',
      iteratee,
    );
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
