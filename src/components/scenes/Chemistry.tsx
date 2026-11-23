import Mixtures from './ChemistryMixtures';
import Atoms from './ChemistryAtoms';
import Compounds from './ChemistryCompounds';
import { clamp, type SceneProps } from './ChemistryArt';

export default function Chemistry({number,p,flat}:SceneProps) {
  const id=number.replace(/^Activity\s+/, 'A');
  const props={number:id,p:clamp(p),flat};
  return <g fill="none" stroke="none" strokeLinejoin="round" strokeLinecap="round">
    {/^(?:A)?5\./.test(id)?<Mixtures {...props}/>:id.startsWith('8.')?<Atoms {...props}/>:<Compounds {...props}/>}
  </g>;
}
