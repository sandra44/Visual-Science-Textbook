import type { Model } from './Physics3DKit';
import { motionModels } from './Physics3DMotion';
import { forceModels } from './Physics3DForces';
import { energyModels } from './Physics3DEnergy';
import { soundModels } from './Physics3DSound';

export const physicsModels: Record<string, Model> = {
  ...motionModels,
  ...forceModels,
  ...energyModels,
  ...soundModels,
};
