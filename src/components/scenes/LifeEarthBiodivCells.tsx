import { amoeba, bacterium, beetle, fern, freshwater, gold, ground, label, leaf, line, mushroom, part, place, repeat, shape, sunflower } from './LifeEarthBiodivArt';

function filament(p:number) {
  return <>{repeat(6,i=>place(i*21,4*Math.sin(i*.8),<>
    <ellipse rx="12" ry="15" fill="#a7cda4" stroke="#4a7c70" strokeWidth="2"/>
    {line('M-6 -7q7 -5 12 0m-13 11q7 5 14 0','#4e9884',2)}
    <circle cx={-3+3*p} r="2" fill="#a0849c"/></>))}</>;
}
function paramecium(p:number) {
  return <>{repeat(34,i=>{
    const a=i*Math.PI/17, x=45*Math.cos(a),y=20*Math.sin(a);
    return line(`M${x} ${y}l${7*Math.cos(a)+3*Math.sin(p*30+i)} ${7*Math.sin(a)}`, '#537f79',1.4);
  })}
    {shape('M-45 -1C-43 -25 -11 -24 12 -16Q30 -8 44 -6Q52 9 29 16C1 29 -44 23 -45 -1Z','#b3d5c4','#4b847b',2)}
    {shape('M-9 -6Q7 -16 13 -4Q15 4 2 3Q-8 6 -9 -6Z','#9888ab')}
    {line('M28 -9q-10 4 -13 14','#748f87',2)}<circle cx="-28" cy="4" r="5" fill="#dff2e5" stroke="#8ebcab"/></>;
}
function kingdomEvidence(key:boolean, p:number,flat:boolean) {
  const names=['Monera','Protista','Fungi','Plantae','Animalia'];
  const specimens=[bacterium(),amoeba(.5),mushroom(),fern(),beetle()];
  // The classification key follows one specimen (a mushroom); the overview keeps all five.
  const emphasis=[1-part(p,.04,.28),1-part(p,.31,.57),1,1-part(p,.65,.91),1-part(p,.65,.91)];
  return <>{ground(flat)}
    {shape('M0 135Q43 130 83 144T195 145Q173 171 88 171T0 159Z','#91bdb4')}
    {repeat(5,i=><g opacity={key?.24+.76*emphasis[i]:1}>
      {place(50+94*i,138,specimens[i],[.72,.64,1,.82,1.6][i])}
      {label(50+94*i,187,names[i])}</g>)}
    {label(240,27,key?'Reading the key: a mushroom':'Historical five-kingdom comparison',16)}
    {label(240,58, p<.34?'Cell type: is the DNA inside a nucleus?':p<.67?'Organisation: one cell or many?':'Nutrition: absorb, photosynthesise or ingest?')}
    {key?label(240,210,p<.34?'Enclosed nuclei in the fungal cells':p<.67?'Many cells form branching hyphae':'External digestion and absorption → Fungi'):
      <>{line(`M22 165h${60+375*p}`,gold,3)}
      {label(240,210,p<.34?'Bacteria lack an enclosed nucleus':p<.67?'Amoeba is one cell; the fern has many':'Fungus absorbs • fern makes sugars • beetle ingests')}</>}
  </>;
}
export function cellScene(number:string,p:number,flat:boolean) {
  switch(number) {
    case '12.3.1': return <>{freshwater(flat)}
      {label(240,27,'What is the green specimen made of?',16)}
      {place(42,106,filament(p),1.2)}{place(352,153,leaf(),1.18,18)}
      {line('M307 106l-28 -12','#668866')}
      {place(250,92,<><rect x="-34" y="-22" width="68" height="44" rx="8" fill="#cadcaa" stroke="#699460" strokeWidth="3"/>
        <ellipse rx="9" ry="7" fill="#a088a7"/>{repeat(6,i=><ellipse cx={-24+i%3*24} cy={i<3?-14:14} rx="6" ry="3" fill="#609559"/>)}</>,.86+.16*p)}
      {label(108,157,'Cyanobacterial filament')}{label(361,175,'Leaf with many cells')}
      {label(240,204,p<.5?'No enclosed nucleus in cyanobacteria':'Both capture light; only the leaf cells have chloroplasts')}</>;
    case '12.5': return <>{ground(flat)}
      {place(66,151,mushroom(),1.4)}{place(170,151,sunflower(),.96)}
      {label(120,181,'Similar outward habit')}
      {place(305,110,<><circle r="53" fill="#ede8cf" stroke="#767c68" strokeWidth="3"/>
        {repeat(4,i=>line(`M-40 ${-16+i*12}q22 -19 41 2l22 -18m-20 17 27 8`, '#b28e74',4))}
        {repeat(5,i=><circle cx={-31+i*13} cy={-10+i*9%23} r="2.7" fill="#85708c"/>)}</>,.82+.1*p)}
      {label(305,181,'Fungal hyphae')}
      <g opacity={.2+.8*p}>{place(413,115,<>{repeat(8,i=>{
        const x=9*Math.sin(i*.9);return <>{line(`M${-x} ${i*8-32}h${2*x}`,gold,2)}
        {line(`M${-x} ${i*8-32}l${x-9*Math.sin((i+1)*.9)} 8`,'#497e81',2)}
        {line(`M${x} ${i*8-32}l${9*Math.sin((i+1)*.9)-x} 8`,'#976e89',2)}</>;
      })}</>)}{label(417,181,'DNA')}</g>
      {label(240,29,'Why fungi are not plants',16)}
      {label(240,207,p<.45?'Both grow in place, but appearance can mislead':'Cell structure and DNA distinguish the fungal lineage')}</>;
    case '12.6': return kingdomEvidence(false,p,flat);
    case 'Activity 12.3': return kingdomEvidence(true,p,flat);
    case 'Activity 12.4': return <>{freshwater(flat)}
      {place(176,105,bacterium(),2.12)}
      {line('M83 79L60 54h-19')}{label(62,43,'Cell boundary')}
      <g opacity={.45+.55*p}>{line('M182 106l52 53h41')}{label(226,182,'Nucleoid · no nuclear envelope')}</g>
      {place(328,103,filament(p),1.06,8)}{label(385,63,'Cyanobacteria')}
      {label(240,206,'Photosynthetic membranes, not chloroplasts')}</>;
    case '12.6.2': {
      const close=part(p,0,.68), ingest=part(p,.52,1), x=182+22*p;
      return <>{freshwater(flat)}{place(x,104,amoeba(close),1.4)}
        <circle cx={x+94-62*ingest} cy={102+8*ingest} r={8+5*ingest} fill="#c9e2c7" fillOpacity={ingest} stroke="#547f74" strokeOpacity={ingest} strokeWidth="2.4"/>
        <ellipse cx={x+94-62*ingest} cy={102+8*ingest} rx="6" ry="5" fill="#b08043" stroke="#805c39"/>
        {label(132,41,'Amoeba')}{line(`M${x+81} 71l32 -30h24`)}{label(351,38,'Pseudopods')}
        {label(240,193,p<.55?'Temporary projections reach around the particle':'Food enclosed in a vacuole inside one cell')}</>;
    }
    case 'Activity 12.5': {
      const x=87+298*p,y=111-31*Math.sin(p*Math.PI*2);
      const path=Array.from({length:40},(_,i)=>{const t=p*i/39;return `${i?'L':'M'}${87+298*t} ${111-31*Math.sin(t*Math.PI*2)}`;}).join(' ');
      return <>{freshwater(flat)}{label(240,28,'Pond water under magnification',16)}
        <path d={path} stroke="#53847b" fill="none" strokeWidth="2" strokeDasharray="3 4"/>
        {place(x,y,paramecium(p),1.02,Math.atan(-.65*Math.cos(p*Math.PI*2))*180/Math.PI)}
        {place(310+5*p,144,shape('M-10 -2l9 -4 15 6 -12 4Z','#aa9b7b'))}
        {label(327,171,'Drifting debris')}{label(240,203,'Cilia propel the paramecium along the traced path')}</>;
    }
    case '12.6.3': return <>{ground(flat)}
      {shape('M18 154Q39 121 84 128L429 115Q463 130 454 159Q448 180 410 178L51 192Q24 189 18 154Z','#ab8060','#775842',2)}
      {place(103,132,mushroom(),1.45)}{place(63,139,mushroom(),.67,-12)}
      {repeat(7,i=>line(`M96 132q${12+i*6} ${i*6} ${45+i*16} ${10+i*4}t${57+i*7} -4m-29 4 24 -12`,'#f3e1bc',2))}
      {repeat(4,i=>place(375+i*16,146+6*(i%2),shape('M-8 -3l6 -5 7 3 1 6 -9 2Z','#664c3e'),1-.65*p))}
      {repeat(10,i=><circle cx={374+i*5-p*(91+i*6)} cy={143+(i*7%24)} r={1.4+1.8*p} fill="#ffdf79"/>)}
      {label(88,36,'Fruit body')}{label(330,65,'Digestion outside the hyphae')}{line('M361 75l42 53')}
      {label(240,209,'Soluble breakdown products enter the hyphal network')}</>;
    case '12.6.5': {
      const route=[[101,107],[141,105],[185,121],[218,122],[246,109],[279,109],[310,123],[330,113]];
      const t=p*(route.length-1), i=Math.min(route.length-2,Math.floor(t)), f=t-i;
      return <>{shape('M0 140Q83 124 196 140T480 132V220H0Z','#98735a')}
        {!flat&&repeat(13,i=>place(12+i*38,177+(i%3)*7,shape('M-7 0l9 -4 6 4 -7 4Z','#b59878')))}
        {shape('M69 107Q79 73 134 84Q176 89 205 98T286 89Q334 77 405 102Q439 113 425 121Q383 116 341 131Q306 147 253 142T157 137Q93 135 69 115Z','#d39987','#855f53',2)}
        {repeat(29,i=>line(`M${88+i*11.2} ${i<12?92+i*.65:98-5*Math.sin(i*.5)}q-6 21 -2 35`,'#af776b',1))}
        {shape('M75 105Q115 97 151 107Q172 109 186 116Q197 107 209 115Q224 102 235 114Q263 98 294 105L399 111Q351 116 310 124Q264 112 243 129Q221 140 207 129Q189 140 176 125Q130 108 75 115Z','#e8bd94','#906449')}
        {place(route[i][0]*(1-f)+route[i+1][0]*f,route[i][1]*(1-f)+route[i+1][1]*f,
          <>{repeat(5,j=><circle cx={(j-2)*(1+2*p)} cy={(j%2-.5)*4+part(p,.76,1)*j*2} r={3-p} fill="#824c30"/>)}</>)}
        {label(97,65,'Mouth')}{label(212,65,'Gizzard')}{label(342,65,'Intestine')}
        {line('M94 71l-17 30m137 -30 -3 37m130 -37 -15 34')}
        {label(240,180,'Earthworm · digestive tract in cutaway',15)}
        {label(240,205,p<.35?'Organic matter enters the mouth':p<.72?'Grinding and digestion break down the food':'Small nutrients pass through the intestinal wall')}</>;
    }
    default:return null;
  }
}
