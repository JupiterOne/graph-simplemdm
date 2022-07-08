import { accountSteps } from './account';
import { applicationSteps } from './application';
import { deviceSteps } from './device';
import { userSteps } from './user';

const integrationSteps = [
  ...accountSteps,
  ...applicationSteps,
  ...deviceSteps,
  ...userSteps,
];

export { integrationSteps };
