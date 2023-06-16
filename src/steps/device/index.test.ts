import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';
import { omit } from 'lodash';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-devices', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-devices',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.DEVICES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
  expect(
    stepResult.collectedEntities.map((e) => omit(e, ['_rawData'])),
  ).toMatchSnapshot();
});
