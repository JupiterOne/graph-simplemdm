import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://a.simplemdm.com/api/v1/devices/{device_id}/users
     * PATTERN: Fetch Child Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'simplemdm_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'simplemdm_device_has_user',
        sourceType: 'simplemdm_device',
        _class: RelationshipClass.HAS,
        targetType: 'simplemdm_user',
      },
    ],
    dependsOn: ['fetch-devices'],
    implemented: true,
  },
];
