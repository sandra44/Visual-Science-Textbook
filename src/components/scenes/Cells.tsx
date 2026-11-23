import Animal from './CellsAnimal';
import {type SceneProps} from './CellsArt';
import Micro from './CellsMicro';
import Plant from './CellsPlant';
import Skeleton from './CellsSkeleton';

export default function Cells(props:SceneProps){
  const {number,flat}=props;
  const Scene=/^(Activity )?2\./.test(number)?Micro:
    /^(3\.1|3\.2(?:\.\d+)?|Activity 3\.1)$/.test(number)?Plant:
    /^(3\.5(?:\.\d+)?|3\.6|Activity 3\.5)$/.test(number)?Skeleton:Animal;
  return <g stroke="none" strokeLinecap="round" strokeLinejoin="round" textAnchor="start" fill="#35484c"
    transform={flat?undefined:'translate(9 4) skewX(-2) scale(.98 .96)'}
    style={flat?undefined:{filter:'drop-shadow(1px 2px 1px rgb(42 54 49 / 18%))'}}><Scene {...props}/></g>;
}
