# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.1.2 & 1.1.3 - 2024-07-02

### Fixed

- Pagination was incorrectly adding search params to the URL. Fixed.
- Handle 422s for devices that are not running MacOS and therefore don't support
  fetching of users.

### Upgraded

- Upgraded to Nodejs 18 and SDK v12

## 1.1.1 - 2022-06-20

### Added

- `lastSeenOn` and `macAddress` on Device entities.

## 1.1.0 - 2022-07-15

### Added

- Added new relationship
  - `simplemdm_device_installed_application`

## 1.0.0 - 2022-07-12

### Added

- Ingest new entities
  - `simplemdm_account`
  - `simplemdm_application`
  - `simplemdm_device`
  - `simplemdm_user`
- Build new relationships
  - `simplemdm_account_has_application`
  - `simplemdm_account_has_device`
  - `simplemdm_device_has_user`
