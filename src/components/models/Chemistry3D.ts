import type { Factory } from './Chemistry3DArt';
import { atomModels, carbon } from './Chemistry3DAtoms';
import { compoundModels } from './Chemistry3DCompounds';
import { chromatography, mixtureModels } from './Chemistry3DMixtures';

export const chemistryModels:Record<string,Factory>={
  'mixtures-lab':chromatography,
  'bohr-atom':carbon,
  ...Object.fromEntries(Object.entries({...mixtureModels,...atomModels,...compoundModels}).map(([section,make])=>[`topic:${section}`,make])),
};
