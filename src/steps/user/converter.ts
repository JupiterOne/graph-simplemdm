import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SimpleMDMUser } from '../../types';

export function getUserKey(id: number): string {
  return `simplemdm_user:${id}`;
}

export function createUserEntity(user: SimpleMDMUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.id),
        id: user.id.toString(),
        username: user.attributes.username,
        name: user.attributes.full_name,
        uid: user.attributes.uid,
        dataQuota: user.attributes.data_quota,
        dataUsed: user.attributes.data_used,
        dataToSync: user.attributes.data_to_sync,
        secureToken: user.attributes.secure_token,
        loggedIn: user.attributes.logged_in,
        mobileAccount: user.attributes.mobile_account,
        active: true,
      },
    },
  });
}

export function createDeviceUserRelationship(
  device: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: device,
    to: user,
  });
}
