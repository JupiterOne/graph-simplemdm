import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SimpleMDMApplication } from '../../types';

export function getApplicationKey(id: number): string {
  return `simplemdm_application:${id}`;
}

export function createApplicationEntity(app: SimpleMDMApplication): Entity {
  return createIntegrationEntity({
    entityData: {
      source: app,
      assign: {
        _type: Entities.APPLICATION._type,
        _class: Entities.APPLICATION._class,
        _key: getApplicationKey(app.id),
        id: app.id.toString(),
        name: app.attributes.name,
        appType: app.attributes.app_type,
        itunesStoreId: app.attributes.itunes_store_id,
        bundleIdentifier: app.attributes.bundle_identifier,
      },
    },
  });
}

export function createAccountApplicationRelationship(
  account: Entity,
  application: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: application,
  });
}
