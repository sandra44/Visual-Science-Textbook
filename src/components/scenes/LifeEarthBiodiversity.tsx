import { useId } from 'react';
import { beetle, bird, gold, ground, ink, label, leaf, line, part, place, repeat, shape, tree } from './LifeEarthBiodivArt';
import { cellScene } from './LifeEarthBiodivCells';
import { plantScene } from './LifeEarthBiodivPlants';

function bat(wing:number) {
  return <>{[-1,1].map(s=><g key={s} transform={`scale(${s} 1)`}>
    {shape(`M0 0Q11 -10 19 ${-18-wing*8}L39 ${-9-wing*11}Q32 -8 31 1Q22 -6 21 6Q12 -1 5 11Z`, '#706279','#473e50')}
    {line(`M4 3L19 ${-18-wing*8}l2 ${24+wing*8}`,'#998696',1)}</g>)}
    <ellipse rx="5" ry="10" fill="#524850"/>{shape('M-6 -5l1 -11 5 7 5 -7 1 11Z','#524850')}</>;
}
function crab() {
  return <>{repeat(3,i=>line(`M-7 ${i*2}l-9 ${i*3-4} -6 5M7 ${i*2}l9 ${i*3-4} 6 5`,'#975742',2))}
    {line('M-7 0l-9 -8m24 8 9 -8','#a26146',3)}
    {shape('M-16 -6q-10 -2 -6 -11l4 6 4 -6q4 6 -2 11Zm33 0q-6 -4 -3 -11l4 6 5 -6q2 10 -6 11Z','#b56c4c')}
    <ellipse rx="12" ry="7" fill="#cc865b" stroke="#90553b"/><circle cx="-5" cy="-6" r="1.5"/><circle cx="5" cy="-6" r="1.5"/></>;
}
function ecology(number:string,p:number,flat:boolean) {
  switch(number) {
    case '12.1': return <>
      {!flat&&shape('M0 84L46 43 78 68 111 35 207 130 278 154H0Z','#9bafa9')}
      {shape('M0 126L77 49 177 131 280 163H0Z','#7f948c')}
      {shape('M49 77l28 -28 33 28 -22 -9 -7 7 -10 -9Z','#e5e5da')}
      {shape('M0 127Q82 100 171 137Q231 157 312 149L480 139V220H0Z','#a4b886')}
      {shape('M197 158Q274 144 337 146L480 138V220H269Q296 188 197 158Z','#e2c79a')}
      {shape('M287 150Q376 132 480 130V181Q414 184 367 166Z','#8abbb8')}
      {repeat(4,i=>line(`M${349+i*33} ${149+i*2}q8 -3 18 -1`,'#d5ebe1'))}
      {tree(29,152,.64)}{place(106,145,bird('finch'),.73)}{place(368+9*p,166,crab(),.82)}
      {place(421,154,bird('heron'),.59)}
      {label(96,30,'Mountain woodland')}{label(382,94,'Coastal shallows')}
      {line(`M${65+270*p} 181h55`,gold,3)}
      {label(240,205,p<.72?'Different habitats support different communities':'Hotspots have many endemic species and serious habitat loss')}</>;
    case '12.2': return <>{ground(flat)}
      {shape('M0 104Q118 96 233 111T480 110V181Q368 165 239 179T0 172Z','#987b60')}
      {repeat(15,i=>line(`M${i*33} ${117+i*13%40}q14 -6 29 -2`,'#796550',2))}
      {repeat(8,i=>place(44+i%4*37,126+Math.floor(i/4)*30,beetle(i%2===0),.69,(-1)**i*24))}
      {repeat(8,i=>place(303+i%4*37,127+Math.floor(i/4)*29,beetle(i===0),.34+.38*p,(-1)**i*19))}
      {repeat(4,i=><ellipse cx={219+i%2*8} cy={139+Math.floor(i/2)*7} rx="4" ry="2.8" fill="#e8dcb5"/>)}
      {label(101,77,'Parent generation')}{label(357,77,'Offspring generation')}
      {label(240,39,'Inherited shell colour on dark bark',16)}
      {label(240,205,'More offspring of dark parents → a higher dark-shell frequency')}</>;
    case '12.3': return <>{ground(flat)}
      {place(92,120,bat(.2),.97)}{place(245,124,bird('finch'),1.05)}{place(379,124,bird('heron'),.92)}
      {label(91,149,'Bat · hair')}{label(243,149,'Finch')}{label(386,157,'Heron')}
      {line('M41 164v18h395v-18','#537c79',2)}
      <g opacity={.22+.78*p}>{line('M197 155v11h228v-11','#996b40',2)}{label(305,169,'Birds · feathers')}</g>
      {label(240,202,'All three are vertebrates; wings alone do not define birds')}</>;
    case 'Activity 12.1': return <>{ground(flat)}
      <rect width="480" height="220" fill="#425073" opacity={.54*p}/>
      <circle cx={81+100*p} cy={48+150*p} r="14" fill="#f1c36b" opacity={1-p}/>
      <circle cx="398" cy={108-70*p} r="12" fill="#ece7c6" opacity={p}/>
      {tree(50,172,1.18)}{tree(433,164,.98)}
      {shape('M0 166Q77 147 131 128L153 123Q112 149 0 181Z','#78634f')}
      {place(126,127+p*4,bird('warbler',9*Math.sin(p*9)),.82)}
      {place(386-116*p,101-29*p,bat(p*.9),.88)}
      {label(145,182,'Warbler · day forager')}{label(346,148,'Bat · dusk flight')}
      {label(240,205,'Activity time groups observations, not ancestry')}</>;
    case '12.4': return <>{ground(flat)}
      {shape('M0 143Q113 118 235 142T480 136V148Q357 159 219 151T0 154Z','#927355')}
      {place(124,123,<>{bird('warbler')}{shape('M12 -24q7 -6 12 2l-5 4q1 16 -11 15q-2 -10 4 -21Z','#c77b4a')}
        <circle cx="20" cy="-22" r="1.6" fill={ink}/></>,1.04)}
      {place(332,127,<>{bird('warbler')}{shape('M10 -22q9 4 12 0q2 17 -11 22q-14 5 -22 -4q15 -1 21 -18Z','#bd6d42')}
        {shape('M7 -19q-1 -12 10 -11q9 0 10 8l-7 3 -10 -1Z','#515852')}
        <circle cx="20" cy="-23" r="1.5" fill="#fff4d9"/></>,1.4)}
      {label(240,34,'Which bird did the observer call “robin”?',16)}
      {label(129,72,'European robin')}{label(337,72,'American robin')}
      <g opacity={.3+.7*p}>{label(129,174,'Erithacus rubecula',14,true)}{label(339,174,'Turdus migratorius',14,true)}</g>
      {label(240,206,'Scientific names distinguish two species called “robin”')}</>;
    case 'Activity 12.2': return <>{ground(flat)}
      {!flat&&repeat(7,i=>tree(25+i*74,153,.74,true))}
      {shape('M0 145Q87 144 184 114L229 108Q146 148 0 158Z','#785e49')}
      {shape('M270 151Q378 135 480 109V119Q366 155 270 158Z','#80644e')}
      {place(112+11*p,129-3*p,bird('hornbill'),1.02)}{place(363,131,bird('pied'),.77)}
      {label(240,28,'Pakke · illustrative field survey',16)}
      {label(120,173,'Great hornbill')}{label(355,173,'Oriental pied hornbill')}
      {label(240,204,p<.35?'Sighting 1: great hornbill':p<.7?'Sighting 2: another great hornbill · still one species':'3 sightings, 2 species · do not count the repeat twice')}
      {line(`M${p<.7?62:300} 180h${p<.7?24+80*p:35+55*p}`,gold,3)}</>;
    case '12.7': return <>{ground(flat)}
      {shape('M0 134Q122 146 222 131T480 127V145Q346 139 239 152T0 148Z','#8f7355')}
      {place(109,124,bird('finch',24*p),1.25)}{place(335,118,bird('warbler',19*p),1.18)}
      {repeat(4,i=>place(150+i*6,133+(i%2)*3,shape('M-3 0q0 -7 6 -8q1 6 -6 8Z','#a47b46','#715639',1)))}
      {place(410,132,leaf(),.5,60)}
      {place(400-14*p,127-18*p, <>{repeat(5,i=><circle cx={i*3} cy={-2*Math.sin(i)} r="2.8" fill="#738d49" stroke="#486942"/>)}</>)}
      {label(117,63,'Deep, strong bill')}{label(345,63,'Slender, pointed bill')}
      {label(135,175,'Cracks hard seeds')}{label(358,175,'Picks insects from leaves')}
      {label(240,205,'Inherited bill shape can affect feeding success')}</>;
    case '12.9': return <>
      {shape('M0 141Q119 130 234 145T480 132V220H0Z','#9e836a')}
      {place(173,149,<><ellipse rx="28" ry="17" fill="#bc9d75" stroke="#705e4c" strokeWidth="2"/>
        {line('M25 1C20 -19 -11 -20 -20 -6S-5 18 9 9S11 -7 2 -7S-7 3 0 3','#766149',2)}
        {repeat(9,i=>line(`M${22*Math.cos(i*.66)} ${12*Math.sin(i*.66)}l${5*Math.cos(i*.66)} ${4*Math.sin(i*.66)}`,'#816c51'))}</>,1.1)}
      {repeat(3,i=>{const h=part(p,i/3,(i+1)/3)*24,y=138-i*24;
        return shape(`M0 ${y}q122 -11 241 3t239 -8v${-h}q-112 20 -239 8T0 ${y-h}Z`,['#bea685','#d2bb95','#ae977c'][i]);})}
      {place(347,102,<g opacity={part(p,.38,.65)}>{shape('M-26 0Q-4 -20 26 0Q-2 17 -26 0Z','#816f54')}{line('M-23 0h45m-32 0 8 -6m0 6 10 -7m-16 7 8 5','#c5af87')}</g>)}
      {!flat&&repeat(32,i=><ellipse cx={8+i*57%465} cy={171+i*17%41} rx={3+i%4} ry="1" fill="#89735f"/>)}
      {label(240,30,'Burial leaves a record in rock',16)}
      {label(166,181,'Older shell')}{label(352,80,p>.52?'Younger leaf impression':'Sediment accumulates')}
      {label(240,207,'In undisturbed layers, deeper fossils are generally older')}</>;
    case '12.10': return <>{ground(flat)}
      {!flat&&repeat(11,i=>tree(12+i*46,131,.74,true))}
      {repeat(13,i=><g opacity={Math.abs(i-6)<2?1-p:1}>{tree(8+i*39,144+i%2*8,.8+i%3*.1)}</g>)}
      {shape(`M${237-30*p} 75l${-62*p} 113h${138*p}L${237+16*p} 75Z`,'#c9b28f')}
      {repeat(6,i=>place(i<3?71+i*36+15*p:301+(i-3)*38-9*p,155+i%2*10,beetle(),.55))}
      <path d="M133 163Q202 183 269 159T360 159" stroke="#486d50" strokeWidth="2" fill="none" strokeDasharray="4 5" opacity={1-p}/>
      {label(240,33,p<.48?'Continuous woodland':'Separated woodland patches',16)}
      {label(240,205,'A widening clearing can limit movement and gene flow')}</>;
    default:return null;
  }
}

export default function LifeEarthBiodiversity({number,p,flat}:{number:string;p:number;flat:boolean}) {
  const sky = `biodiv-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  const progress=part(p);
  const scene=ecology(number,progress,flat)??plantScene(number,progress,flat)??cellScene(number,progress,flat);
  return <g fill={ink}>{scene&&<>
    {!flat&&<defs><linearGradient id={sky} x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop stopColor="#dce8dd"/><stop offset="1" stopColor="#fbf2d9"/></linearGradient></defs>}
    <rect width="480" height="220" fill={flat?'#f4f2e6':`url(#${sky})`}/>{scene}</>}</g>;
}
