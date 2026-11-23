import { biodiversityModels } from './LifeEarth3DBiodiversity';
import { earthModels } from './LifeEarth3DEarth';
import { reproductionModels } from './LifeEarth3DRepro';
import type { Model } from './LifeEarth3DKit';

export const lifeEarthModels: Record<string, Model> = {
  ...reproductionModels,
  ...biodiversityModels,
  ...earthModels,
};
