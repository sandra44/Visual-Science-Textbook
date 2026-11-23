import Biodiversity from './LifeEarthBiodiversity';
import EarthSystem from './LifeEarthSystem';
import Reproduction from './LifeEarthReproduction';

export interface LifeEarthProps {
  number: string;
  p: number;
  flat: boolean;
}

export default function LifeEarth(props: LifeEarthProps) {
  const chapter = props.number.replace(/^Activity /, '').split('.')[0];
  switch (chapter) {
    case '11': return <Reproduction {...props}/>;
    case '12': return <Biodiversity {...props}/>;
    case '13': return <EarthSystem {...props}/>;
    default: throw new Error(`No life or Earth scene for ${props.number}`);
  }
}
