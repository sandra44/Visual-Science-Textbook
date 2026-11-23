import type { Factory } from './Cells3DShapes';
import {microModels} from './Cells3DMicro';
import {plantModels} from './Cells3DPlant';
import {jointModels} from './Cells3DJoints';
import {tissueModels} from './Cells3DTissue';

export const cellsModels:Record<string,Factory>={
  ...microModels,...plantModels,...jointModels,...tissueModels,
};
