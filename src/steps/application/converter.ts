import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
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
        identifier: app.attributes.identifier,
        version: app.attributes.version,
        shortVersion: app.attributes.short_version,
        bundleSize: app.attributes.bundle_size,
        dynamicSize: app.attributes.dynamic_size,
        managed: app.attributes.managed,
        discoveredOn: parseTimePropertyValue(app.attributes.discovered_at),
        lastSeenOn: parseTimePropertyValue(app.attributes.last_seen_at),
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

export function createDeviceApplicationRelationship(
  device: Entity,
  application: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.INSTALLED,
    from: device,
    to: application,
  });
}
