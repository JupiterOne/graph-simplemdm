import {
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { SimpleMDMDevice } from '../../types';
import { Entities, Steps, Relationships } from '../constants';
import { createUserEntity, createDeviceUserRelationship } from './converter';

export async function fetchUsers({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.DEVICE._type },
    async (deviceEntity) => {
      const device = getRawData<SimpleMDMDevice>(deviceEntity);
      if (!device) {
        logger.warn(
          { _key: deviceEntity._key },
          'Could not get raw data for device entity',
        );
        return;
      }

      await apiClient.iterateUsers(device.id.toString(), async (user) => {
        const userEntity = await jobState.addEntity(createUserEntity(user));

        await jobState.addRelationship(
          createDeviceUserRelationship(deviceEntity, userEntity),
        );
      });
    },
  );
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.DEVICE_HAS_USER],
    dependsOn: [Steps.DEVICES],
    executionHandler: fetchUsers,
  },
];
