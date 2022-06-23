# Development

This integration focuses on [SimpleMDM](https://simplemdm.com/) and is using
[SimpleMDM API](https://simplemdm.com/docs/api/#introduction) for interacting
with the Datastax resources.

## Provider account setup

1. Sign-up for a SimpleMDM account
2. In the dashboard, under Account, click API
3. Click "Add API Key"
4. Provide a name for the API Key
5. The following permissions should have roles set to `read`:

   - Account
   - Apps
   - Devices

6. Click Save
7. Under Secret Access Key, click `reveal` and save the details. This will serve
   as your API Key.

## Authentication

Provide the `API_KEY` to the `.env`. You can use
[`.env.example`](../.env.example) as a reference.

The API Key will be used to authorize requests using token authentication.
