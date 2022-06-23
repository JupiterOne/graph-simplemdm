import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const deviceSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://a.simplemdm.com/api/v1/devices
     * PATTERN: Fetch Entities
     */
    id: 'fetch-devices',
    name: 'Fetch Devices',
    entities: [
      {
        resourceName: 'Device',
        _type: 'simplemdm_device',
        _class: ['Device'],
      },
    ],
    relationships: [
      {
        _type: 'simplemdm_account_has_device',
        sourceType: 'simplemdm_account',
        _class: RelationshipClass.HAS,
        targetType: 'simplemdm_device',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
