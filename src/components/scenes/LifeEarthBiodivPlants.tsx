import { fern, gold, ground, label, leaf, line, part, place, repeat, shape, sunflower } from './LifeEarthBiodivArt';

function moss(p:number) {
  return <>{repeat(6,i=>line(`M0 0q${i-3} 6 ${i*3-8} 12t${i-4} 9`, '#93694a',1.4))}
    {line('M0 0q4 -22 -2 -47','#456e49',2.5)}
    {repeat(13,i=>place(1,-2-i*3.3,shape('M0 0Q-1 -10 4 -15Q8 -4 0 0Z','#81a755','#4c764b',1),.94-i*.028,(i%2?1:-1)*(36+p*3)))}</>;
}
function stem(fernStem:boolean,p:number) {
  return <><ellipse rx="45" ry="37" fill="#b5ca92" stroke="#56805a" strokeWidth="3"/>
    <ellipse rx="39" ry="32" fill="#d7d9a2" stroke="#9fb783"/>
    {repeat(fernStem?4:12,i=>{
      const a=fernStem?i*1.55:i*Math.PI/6;
      return place((fernStem?20:32)*Math.cos(a),(fernStem?16:25)*Math.sin(a),<>
        <ellipse rx={fernStem?10:6.2} ry={fernStem?6:4.5} fill="#7eac89" stroke="#416e63"/>
        <ellipse rx={fernStem?6:3.1} ry="2.6" fill={gold} stroke="#a17c50" strokeWidth=".7"/>
      </>,1+p*.08,a*180/Math.PI+90);
    })}</>;
}
export function plantScene(number:string,p:number,flat:boolean) {
  switch(number) {
    case '12.6.4': return <>{ground(flat)}<circle cx="70" cy="50" r="21" fill="#efc15c"/>
      {repeat(5,i=>line(`M${85+i*5} ${71-i*4}l${33+23*p} ${24+12*p}`,'#deb35b',2))}
      {place(173,166,sunflower(),1.22)}
      {line('M198 121l84 -39m-83 41 87 24','#80977b')}
      {place(354,115,<><ellipse rx="69" ry="41" fill="#b5d290" stroke="#5b885b" strokeWidth="3"/>
        <ellipse rx="64" ry="36" fill="none" stroke="#7eaa70"/>
        {repeat(5,i=>place(-38+19*i,(i%2)*15-5,<>{repeat(4,j=><ellipse cy={j*2.7} rx="9" ry="2.8" fill="#69a269" stroke="#467a53"/>)}</>))}
        {repeat(4,i=><circle cx={i*8+6} cy={-19+3*(i%2)} r={1+2*p} fill="#d7a444" opacity={.2+.8*p}/>)}</>)}
      {label(350,57,'Inside a chloroplast')}{label(240,200,'Light energy helps the leaf make sugars')}</>;
    case 'Activity 12.6': return <>{ground(flat)}
      {shape('M0 155Q59 124 127 139Q180 149 221 137Q296 108 366 128L480 137V220H0Z','#836f52')}
      {shape('M0 150Q64 121 124 134T222 131Q299 103 367 123L480 132V142Q404 145 365 133Q291 118 222 144T125 148Q65 135 0 163Z','#759968')}
      {repeat(12,i=>place(14+i*15,145-9*Math.sin(i*.36),moss(p),.45+i%3*.09))}
      {place(294,132,moss(p),1.68+.14*p)}{line('M313 83l41 -32h21')}{label(407,48,'Leafy shoot')}
      {line('M303 155l44 12h26')}{label(410,173,'Rhizoids')}
      {label(109,173,'Moist surface')}{label(240,203,'Rhizoids anchor moss; they are not true roots')}</>;
    case 'Activity 12.7': return <>{ground(flat)}
      {place(78,153,fern(),1.1)}{place(399,154,sunflower(),1.03)}
      {line('M81 145l58 -34m258 34 -47 -36','#70836a')}
      {place(175,103,stem(true,p))}{place(301,103,stem(false,p))}
      {label(172,49,'Fern stem')}{label(309,49,'Sunflower stem')}
      {label(240,171,'Vascular bundles in cross-section')}
      {label(240,204,p<.55?'Both contain water- and nutrient-conducting tissues':'The bundle patterns differ; ferns bear spores, sunflowers make seeds')}</>;
    case 'Activity 12.8': return <>{ground(flat)}
      {place(117,178,leaf(false,p),1.53,19)}{place(130,178,leaf(false,p),1.1,-17)}
      {place(337,178,leaf(true,p),1.78,13)}
      {label(119,32,'Grass · parallel veins')}{label(344,32,'Bean · net-like veins')}
      {label(240,206,'Venation is one clue; compare other traits too')}</>;
    case 'Activity 12.9': return <>{ground(flat)}
      {place(92,157,fern(),1.13)}
      {place(239,154,<>{line('M0 0q2 -44 0 -98','#795e45',3)}
        {repeat(10,i=>place(0,-12-i*7,<>{line('M-25 -12L0 0 24 -14','#655b40',2)}
          {repeat(7,j=><>{line(`M${j*3} ${-j*1.7}l6 -14m-6 14 11 -6`,'#527d5e',1.8)}
            {line(`M${-j*3} ${-j*1.5}l-6 -14m6 14 -11 -6`,'#527d5e',1.8)}</>)}</>,1-i*.075))}
        {place(18,-34,<><ellipse rx="7" ry="13" fill="#89674a"/>{repeat(4,i=>line(`M-5 ${i*4-7}l5 3 5 -3`,'#c29b69'))}</>)}</>)}
      {place(388,157,sunflower(),1.17)}
      {label(90,182,'Fern · spores')}{label(239,182,'Pine · seed cones')}{label(389,182,'Sunflower · flowers')}
      {line(`M${54+290*p} 163h75`,gold,3)}
      {label(240,208,p<.33?'All three have conducting tissues':p<.67?'Seeds enclose an embryo in pine and sunflower':'Flowers aid reproduction in flowering plants')}</>;
    case '12.8': return <>{!flat&&shape('M-10 158Q77 101 188 98L176 104Q83 120 0 166Z','#ad9b7b')}
      {shape('M0 126Q86 112 130 72L196 50Q127 84 95 110L0 142Z','#78634e')}
      {place(99,100,leaf(true),.91,-65)}{place(126,79,leaf(true),.83,95)}
      {line('M110 94q23 14 21 40','#6b7750',3)}
      {shape('M131 125Q156 116 168 139Q177 157 159 174Q130 195 109 169Q93 144 113 131Z','#dfa849','#8d733f',2)}
      {!flat&&shape('M111 139q8 -12 21 -9q-12 4 -16 19Z','#f0ca71')}
      {label(324,94,'Mangifera indica',27,true)}
      {line(`M229 105h${18+89*part(p,0,.55)}`,'#648567',3)}
      {line(`M347 105h${4+67*part(p,.4,1)}`,gold,3)}
      {label(280,133,'Genus')}{label(383,133,'Specific epithet')}
      {label(240,204,'One species name: capitalised genus, lowercase epithet')}</>;
    default:return null;
  }
}
