import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  APPLICATIONS: 'fetch-applications',
  DEVICES: 'fetch-devices',
  USERS: 'fetch-users',
};

export const Entities: Record<
  'ACCOUNT' | 'APPLICATION' | 'DEVICE' | 'USER',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'simplemdm_account',
    _class: ['Account'],
  },
  APPLICATION: {
    resourceName: 'Application',
    _type: 'simplemdm_application',
    _class: ['Application'],
  },
  DEVICE: {
    resourceName: 'Device',
    _type: 'simplemdm_device',
    _class: ['Device'],
  },
  USER: {
    resourceName: 'User',
    _type: 'simplemdm_user',
    _class: ['User'],
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_APPLICATION' | 'ACCOUNT_HAS_DEVICE' | 'DEVICE_HAS_USER',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_APPLICATION: {
    _type: 'simplemdm_account_has_application',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.APPLICATION._type,
  },
  ACCOUNT_HAS_DEVICE: {
    _type: 'simplemdm_account_has_device',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DEVICE._type,
  },
  DEVICE_HAS_USER: {
    _type: 'simplemdm_device_has_user',
    sourceType: Entities.DEVICE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
};
