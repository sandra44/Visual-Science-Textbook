import { useState } from 'react';
import type { TopicStory } from '../simulations/topicStories';
import { PotatoExperiment } from './PotatoExperiment';
import Cells from './scenes/Cells';
import Chemistry from './scenes/Chemistry';
import Physics from './scenes/Physics';
import LifeEarth from './scenes/LifeEarth';

const chapters: Record<string, typeof Physics> = {
  1: Physics, 2: Cells, 3: Cells, 4: Physics, 5: Chemistry,
  6: Physics, 7: Physics, 8: Chemistry, 9: Chemistry, 10: Physics,
  11: LifeEarth, 12: LifeEarth, 13: LifeEarth,
};

export function TopicScene({story,number,p,flat}:{story:TopicStory;number:string;p:number;flat:boolean}) {
  const [angle,setAngle]=useState(14);
  if(number==='Activity 2.2') return <PotatoExperiment p={p} flat={flat}/>;
  const Scene=chapters[number.replace(/^Activity /,'').split('.')[0]];
  if(!Scene) throw new Error(`No illustrated scene for textbook topic ${number}`);
  return <div className="lesson-scene my-3 w-full" style={{perspective:900}}>
    <svg viewBox="0 0 480 220" role="img" aria-label={story.title} className="mx-auto w-full max-h-[40vh]" style={{transform:flat?'none':`rotateY(${angle}deg)`}}>
      <Scene number={number} p={p} flat={flat}/>
    </svg>
    {!flat && <label className="flex justify-center gap-2 text-xs">Rotate view <input type="range" min="-35" max="35" value={angle} onChange={e=>setAngle(+e.target.value)}/></label>}
  </div>;
}
