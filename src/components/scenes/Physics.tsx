import Energy from './PhysicsEnergy';
import Forces from './PhysicsForces';
import Motion from './PhysicsMotion';
import Sound from './PhysicsSound';
import {type PhysicsProps} from './PhysicsKit';

export default function Physics(props: PhysicsProps) {
  const chapter=props.number.replace(/^Activity /,'').split('.')[0];
  const Scene=chapter==='1'||chapter==='4'?Motion:chapter==='6'?Forces:chapter==='7'?Energy:chapter==='10'?Sound:null;
  if(!Scene)throw new Error(`No physics scene for ${props.number}`);
  return <g fill="none" stroke="none" strokeLinecap="round" strokeLinejoin="round"><Scene {...props}/></g>;
}
