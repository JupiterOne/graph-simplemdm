import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { SimpleMDMAccount } from '../../types';
import { Entities } from '../constants';

export function getAccountKey(name: string): string {
  const formattedName = name.replace(/[^a-z0-9 ]/gi, '').replace(' ', '_');
  return `simplemdm_account:${formattedName}`;
}

export function createAccountEntity(account: SimpleMDMAccount): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: getAccountKey(account.data.attributes.name),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: account.data.attributes.name,
        appleStoreCountryCode: account.data.attributes.apple_store_country_code,
      },
    },
  });
}
