import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SimpleMDMDevice } from '../../types';

export function getDeviceKey(id: number): string {
  return `simplemdm_device:${id}`;
}

export function createDeviceEntity(device: SimpleMDMDevice): Entity {
  const lastSeenAt = parseTimePropertyValue(device.attributes.last_seen_at);

  return createIntegrationEntity({
    entityData: {
      source: device,
      assign: {
        _type: Entities.DEVICE._type,
        _class: Entities.DEVICE._class,
        _key: getDeviceKey(device.id),
        id: device.id.toString(),
        deviceId: device.id.toString(),
        name: device.attributes.name,
        lastSeenAt: lastSeenAt && lastSeenAt > 0 ? lastSeenAt : undefined,
        lastSeenOn: lastSeenAt,
        lastSeenIp: device.attributes.last_seen_ip,
        status:
          device.attributes.status == 'enrolled'
            ? 'assigned'
            : device.attributes.status,
        enrollmentChannels: device.attributes.enrollment_channels,
        deviceName: device.attributes.device_name,
        osVersion: device.attributes.os_version,
        buildVersion: device.attributes.build_version,
        modelName: device.attributes.model_name,
        model: device.attributes.model,
        productName: device.attributes.product_name,
        uniqueIdentifier: device.attributes.unique_identifier,
        serial: device.attributes.serial_number,
        processorArchitecture: device.attributes.processor_architecture,
        deviceCapacity: device.attributes.device_capacity,
        bluetoothMac: device.attributes.bluetooth_mac,
        ethernetMacs: device.attributes.ethernet_macs,
        wifiMac: device.attributes.wifi_mac,
        macAddress: [
          device.attributes.wifi_mac,
          device.attributes.bluetooth_mac,
        ].concat(device.attributes.ethernet_macs),
        category: `other`,
        make: `Apple Inc.`,
      },
    },
  });
}

export function createAccountDeviceRelationship(
  account: Entity,
  device: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: device,
  });
}
