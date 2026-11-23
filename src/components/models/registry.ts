import type { Group } from 'three';
import { potato } from './potato';
import { chemistryModels } from './Chemistry3D';
import { physicsModels } from './Physics3D';
import { cellsModels } from './Cells3D';
import { lifeEarthModels } from './LifeEarth3D';

export type ModelFactory=(root:Group)=>(progress:number)=>void;
export const lessonModels:Record<string,ModelFactory>={
  ...chemistryModels,...physicsModels,...cellsModels,...lifeEarthModels,'topic:Activity 2.2':potato,
};
