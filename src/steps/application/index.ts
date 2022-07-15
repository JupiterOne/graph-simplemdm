import {
  Entity,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { SimpleMDMDevice } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Steps, Relationships } from '../constants';
import {
  createApplicationEntity,
  createAccountApplicationRelationship,
  createDeviceApplicationRelationship,
} from './converter';

export async function fetchInstalledApplications({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await jobState.iterateEntities(
    {
      _type: Entities.DEVICE._type,
    },
    async (deviceEntity) => {
      const device = getRawData<SimpleMDMDevice>(deviceEntity);
      if (!device) {
        logger.warn(
          { _key: deviceEntity._key },
          'Could not get raw data for device entity',
        );
        return;
      }

      await apiClient.iterateInstalledApplications(
        device.id.toString(),
        async (app) => {
          const applicationEntity = await jobState.addEntity(
            createApplicationEntity(app),
          );

          await jobState.addRelationships([
            createAccountApplicationRelationship(
              accountEntity,
              applicationEntity,
            ),
            createDeviceApplicationRelationship(
              deviceEntity,
              applicationEntity,
            ),
          ]);
        },
      );
    },
  );
}

export const applicationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.APPLICATIONS,
    name: 'Fetch Installed Applications',
    entities: [Entities.APPLICATION],
    relationships: [
      Relationships.ACCOUNT_HAS_APPLICATION,
      Relationships.DEVICE_INSTALLED_APPLICATION,
    ],
    dependsOn: [Steps.ACCOUNT, Steps.DEVICES],
    executionHandler: fetchInstalledApplications,
  },
];
