import { useId, type CSSProperties } from 'react';
import { type Frame, span } from './LifeEarthReproArt';
import { Bud, Fission, Fusion, Meiosis } from './LifeEarthReproCells';
import { Cutting, FloralSection, Mould, Transfer } from './LifeEarthReproPlants';
import { Female, Male, Placenta } from './LifeEarthReproAnatomy';
import { AnimalComparison, Care, FishCycle, Protection, Puberty, Readiness } from './LifeEarthReproLife';

function Specimen({number,p}:{number:string;p:number}){
  switch(number){
    case '11.1': return <Fission p={p}/>;
    case '11.1.1': case 'Activity 11.1': return <Cutting p={p} layer={number==='Activity 11.1'}/>;
    case 'Activity 11.2': return <Bud p={p}/>;
    case 'Activity 11.3': return <Mould p={p}/>;
    case '11.2': case '11.5.5': return <Fusion p={p} genes={number==='11.2'}/>;
    case 'Activity 11.4': case '11.5.4': return <Meiosis p={p} beads={number==='Activity 11.4'}/>;
    case '11.2.2': case 'Activity 11.5': return <FloralSection p={p} whorls={number==='Activity 11.5'}/>;
    case 'Activity 11.6': case '11.2.3': case '11.2.4': case 'Activity 11.7': return <Transfer number={number} p={p}/>;
    case '11.3': return <FishCycle p={p}/>;
    case '11.4': return <AnimalComparison p={p}/>;
    case '11.5': case '11.5.3': case '11.5.6': return <Female number={number} p={p}/>;
    case '11.5.1': return <Puberty p={p}/>;
    case '11.5.2': return <Male p={p}/>;
    case '11.5.7': return <Placenta p={p}/>;
    case '11.5.8': return <Care p={p}/>;
    case '11.5.9': return <Readiness p={p}/>;
    case '11.5.10': return <Protection p={p}/>;
    default: return null;
  }
}

export default function LifeEarthReproduction({number,p,flat}:Frame){
  const id=`repro-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  const palette=[
    ['cell','#f4cbb5','#fff0d4','#ce9592'],
    ['leaf','#96b27b','#c2d59b','#6c9566'],
    ['petal','#e6a3a6','#f8d1bc','#c28292'],
  ];
  const style=Object.fromEntries(palette.map(([name,color])=>[`--repro-${name}`,flat?color:`url(#${id}-${name})`])) as CSSProperties;
  return <g style={style}>{!flat&&<defs>{palette.map(([name,color,light,dark])=><radialGradient key={name} id={`${id}-${name}`} cx=".3" cy=".23" r=".91">
    <stop stopColor={light}/><stop offset=".52" stopColor={color}/><stop offset="1" stopColor={dark}/>
  </radialGradient>)}<filter id={`${id}-relief`} x="-10%" y="-15%" width="120%" height="130%"><feDropShadow dx=".7" dy="1.5" stdDeviation=".85" floodColor="#374b46" floodOpacity=".23"/></filter></defs>}
    <g filter={flat?undefined:`url(#${id}-relief)`}><Specimen number={number} p={span(p)}/></g>
  </g>;
}
