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
  createApplicationEntity,
  createAccountApplicationRelationship,
} from './converter';

export async function fetchApplications({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateApplications(async (app) => {
    const applicationEntity = await jobState.addEntity(
      createApplicationEntity(app),
    );

    await jobState.addRelationship(
      createAccountApplicationRelationship(accountEntity, applicationEntity),
    );
  });
}

export const applicationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.APPLICATIONS,
    name: 'Fetch Applications',
    entities: [Entities.APPLICATION],
    relationships: [Relationships.ACCOUNT_HAS_APPLICATION],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchApplications,
  },
];
