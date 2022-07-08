import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Steps, Relationships } from '../constants';
import {
  createDeviceEntity,
  createAccountDeviceRelationship,
} from './converter';

export async function fetchDevices({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateDevices(async (device) => {
    const deviceEntity = await jobState.addEntity(createDeviceEntity(device));

    await jobState.addRelationship(
      createAccountDeviceRelationship(accountEntity, deviceEntity),
    );
  });
}

export const deviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.DEVICE],
    relationships: [Relationships.ACCOUNT_HAS_DEVICE],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchDevices,
  },
];
