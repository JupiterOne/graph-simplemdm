export interface SimpleMDMResponse {
  data: SimpleMDMEntity[];
  has_more: boolean;
}

export interface SimpleMDMEntity {
  type: string;
  id: number;
}

export interface SimpleMDMAccount {
  data: {
    attributes: {
      name: string;
      apple_store_country_code: string;
    };
  };
}

export interface SimpleMDMApplication extends SimpleMDMEntity {
  attributes: {
    name: string;
    app_type: string;
    itunes_store_id: string;
    bundle_identifier: string;
  };
}

export interface SimpleMDMDevice extends SimpleMDMEntity {
  attributes: {
    name: string;
    last_seen_at: string;
    last_seen_ip: string;
    status: string;
    enrollment_channels: string[];
    device_name: string;
    os_version: string;
    build_version: string;
    model_name: string;
    model: string;
    product_name: string;
    unique_identifier: string;
    serial_number: string;
    processor_architecture: string;
    device_capacity: number;
    bluetooth_mac: string;
    ethernet_macs: string[];
    wifi_mac: string;
  };
}

export interface SimpleMDMUser extends SimpleMDMEntity {
  attributes: {
    username: string;
    full_name: string;
    uid: number;
    user_guid: string;
    enrollment_channels: string[];
    data_quota: number | null;
    data_used: number | null;
    data_to_sync: boolean;
    secure_token: boolean;
    logged_in: boolean;
    mobile_account: boolean;
  };
}
