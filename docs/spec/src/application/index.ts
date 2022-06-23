import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const applicationSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://a.simplemdm.com/api/v1/apps
     * PATTERN: Fetch Entities
     */
    id: 'fetch-applications',
    name: 'Fetch Applications',
    entities: [
      {
        resourceName: 'Application',
        _type: 'simplemdm_application',
        _class: ['Application'],
      },
    ],
    relationships: [
      {
        _type: 'simplemdm_account_has_application',
        sourceType: 'simplemdm_account',
        _class: RelationshipClass.HAS,
        targetType: 'simplemdm_application',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
