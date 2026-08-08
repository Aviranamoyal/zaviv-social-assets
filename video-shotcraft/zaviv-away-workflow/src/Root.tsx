import React from 'react';
import {Composition} from 'remotion';
import {ZavivAwayWorkflow} from './ZavivAwayWorkflow';

const shared = {
  component: ZavivAwayWorkflow,
  durationInFrames: 990,
  fps: 30,
  width: 1080,
  height: 1920,
};

export const Root: React.FC = () => (
  <>
    <Composition
      id="ZavivAwayWorkflow"
      {...shared}
      defaultProps={{bgm: true}}
    />
    <Composition
      id="ZavivAwayWorkflowNoBgm"
      {...shared}
      defaultProps={{bgm: false}}
    />
  </>
);
