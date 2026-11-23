import {type PhysicsProps,arrow,at,dot,floor,gold,ink,label,line,note,path,rect,rust,seq,sky,tau,teal,wood} from './PhysicsKit';

function speaker(x:number,y:number,p:number){
  const d=3*Math.sin(tau*4*p);
  return at(x,y,<>{rect(-20,-24,16,48,'#6c858d')}{path(`M-4 -17l${19+d} -15v64l-${19+d} -15z`,sky)}{line(15+d,-31,15+d,31,teal,4)}</>);
}
function ear(x:number,y:number,scale=1){
  return at(x,y,<>{path('M-14 -6c-4 -22 22 -30 31 -15 7 12 -4 21 -8 28 -2 16 -16 17 -19 5 -3 -6 -5 -11 -4 -18z','#e8bb9c')}{path('M-7 -5c-2 -14 14 -18 17 -8 2 7 -5 8 -7 13q2 6 -4 9','none','#935b45',2)}</>,scale);
}
function fork(x:number,y:number,p:number,down=false){
  const d=4*Math.sin(tau*p*5);
  return at(x,y,<g transform={`rotate(${down?155:0})`}>{path(`M${-13-d} -48L-13 -2q0 20 13 20t13 -20l${d} -46M0 18v32`,'none','#405765',7)}{path(`M${-14-d} -47l${d} 42`,'none','#b7d0d6',2)}</g>);
}
function ripples(x:number,y:number,p:number,w=60) {
  return <g>{seq(3).map(i=>{const k=(p*2+i/3)%1;return <ellipse key={i} cx={x} cy={y} rx={2+w*k} ry={1+8*k} fill="none" stroke={teal} strokeWidth="1.5" opacity={1-k}/>})}</g>;
}
function microphone(x:number,y:number){
  return at(x,y,<>{rect(-9,-29,18,35,ink,8)}{seq(4).map(i=><g key={i}>{line(-5,-23+i*5,5,-23+i*5,sky,1)}</g>)}{path('M-14 -8v7a14 14 0 0 0 28 0v-7m-14 21v16m-13 1h26','none',ink,3)}</>);
}
function air(x:number,y:number,p:number,cols:number,spacing=9,mark=false){
  return <g>{seq(cols).map(i=>{const dx=4.3*Math.sin(tau*(p*2-i/10));return <g key={i}>{seq(5).map(j=><g key={j}>{dot(x+i*spacing+dx,y+10*j,mark&&i===Math.floor(cols/2)?3:1.6,mark&&i===Math.floor(cols/2)?rust:teal,'none')}</g>)}</g>})}</g>;
}
function waveGraph(n:string,p:number){
  const spectrum=n==='Activity 10.7',mic=n==='10.5',space=n==='10.6.1',pitch=n==='Activity 10.8',both=n==='10.6';
  const hz=spectrum?Math.round((220+220*p)/10)*10:pitch?100+100*Math.min(9,Math.floor(10*p)):both?(p<.5?200:400):200;
  const amp=mic||space||pitch?1:both?1+Math.max(0,2*p-1):1+p;
  const x=mic||spectrum?132:75,w=422-x,cy=spectrum?154:105;
  const pts=seq(201).map(i=>{const f=i/200,cycles=space?2.5:hz*.01;return `${x+w*f},${cy- (spectrum?96*Math.exp(-((f*660-hz)**2)/80):29*amp*Math.sin(tau*(cycles*f-(space?p:mic?p:0))))}`}).join(' ');
  return <g>{(mic||spectrum)&&microphone(59,104)}{line(x,38,x,157)}{line(x,cy,430,cy)}{label(x,24,spectrum?'Relative level':space?'Pressure change (Pa)':'Pressure change (Pa)','start')}{[0,1,2].map(i=><g key={i}>{line(x+w*i/2,cy,x+w*i/2,cy+5)}{label(x+w*i/2,174,spectrum?i*330:space?i*2.5:i*5)}</g>)}{!spectrum&&[-1,0,1].map(v=><g key={v}>{line(x-4,cy-29*v,x+3,cy-29*v)}{label(x-8,cy-29*v+3,v,'end',ink,10)}</g>)}<polyline points={pts} stroke={teal} fill="none" strokeWidth="2.5"/>{label(430,190,spectrum?'Frequency (Hz)':space?'Distance (m)':'Time (ms)','end')}
    {space&&<>{line(x+w*.1+w*.4*p,53,x+w*.5+w*.4*p,53,rust,2)}{label(x+w*.3+w*.4*p,46,'λ = 2 m','middle',rust)}</>}
    {note(spectrum?`Strongest peak: ${hz} Hz`:mic?'Microphone pressure at one place over 10 ms.':space?'170 Hz × 2 m = 340 m/s · one wavelength per period.':pitch?`${hz} Hz · more cycles in 10 ms; same amplitude.`:both?`${hz} Hz (pitch)  ·  ${amp.toFixed(1)} Pa peak (amplitude)`:`Peak amplitude ${amp.toFixed(1)} Pa · relative intensity ${(amp*amp).toFixed(1)}×`)}</g>;
}
export default function Sound({number:n,p,flat}:PhysicsProps){
  if(['10.5','Activity 10.7','10.6','10.6.1','10.6.2','Activity 10.8'].includes(n))return waveGraph(n,p);
  if(n==='Activity 10.1'){
    const d=32*Math.exp(-3*p)*Math.cos(tau*p*6)*(1-p);
    return <g>{!flat&&path('M91 151l15 21h278l-13 -21z','#ad825d')}{rect(91,65,280,87,wood)}{rect(103,76,256,63,'#78644f')}{path(`M87 108Q164 ${108+d*.55} 231 ${108+d}Q299 ${108+d*.55} 376 108`,'none', '#ffde89',4)}{line(93,108,369,108,'#f6e2bd',1,'4 4')}{label(230,43,'Rubber band across an open cardboard box')}{note('After release, the band oscillates about its rest position and settles.')}</g>;
  }
  if(n==='10.1.1'||n==='Activity 10.2'){
    const water=n==='Activity 10.2';
    return <g>{water?<>{path('M145 128q88 -8 186 0l-9 40H154z','#afdce6','#619dab')}{fork(235,82,p,true)}{ripples(246,129,p,73)}{label(351,94,'Water ripples')}</>:<>{fork(185,110,p)}{air(213,70,p,20,8)}{label(126,72,'Prongs')}{label(134,153,'Stem')}</>}{note(water?'One vibrating prong touches the water surface.':'The two prongs move apart and together, disturbing nearby air.')}</g>;
  }
  if(n==='Activity 10.3'){
    const k=Math.min(1,p*1.3);
    return <g>{rect(59,102,356,28,wood)}{[72,393].map(x=><g key={x}>{rect(x,131,11,42,wood)}</g>)}{at(90,95-12*Math.abs(Math.cos(tau*p*2)),<>{path('M-30 -18l24 -8q12 -1 21 10l7 12q-1 8 -7 6l-5 -4q0 7 -7 4l-7 -8 -15 4z','#e5b699')}</>)}{ear(391,84,.85)}{path(`M${86+k*288} 108q8 7 0 15`,'none',teal,3)}{label(103,46,'Knock here')}{label(367,46,'Ear on desktop')}{note('Vibration travels along the solid wood to the ear.')}</g>;
  }
  if(n==='Activity 10.4'){
    const underwater=p>=.5,y=underwater?122:70,a=6*Math.abs(Math.sin(tau*p*4));
    return <g>{path('M115 99h247l-17 71H131z','#c7e9ed','#578a98',2)}{line(117,103,359,103,'#65aebc',2)}{[-1,1].map(s=><g key={s} transform={`translate(${239+s*(8+a)} ${y}) rotate(${s*22})`}>{rect(-2.7,-49,5.4,43,'#aabfc7',2)}<ellipse rx="8" ry="13" fill="#c1d1d6" stroke={ink} strokeWidth="2"/></g>)}{underwater?ripples(239,128,p,61):path('M267 59q11 9 0 18m9 -24q16 15 0 28','none',teal)}{label(239,19,underwater?'Tap submerged spoons':'First tap the spoons in air')}{note(underwater?'Metal → water → air → ear · spoons clear the tub’s sides and base.':'The vibrating metal sets the surrounding air in motion.')}</g>;
  }
  if(n==='Activity 10.5'){
    const x=(i:number)=>53+8.4*i+12*Math.exp(-((i-44*p)**2)/22);
    return <g>{floor(137,flat)}{seq(45).map(i=><ellipse key={i} cx={x(i)} cy="111" rx="6" ry="22" fill="none" stroke={i===21?rust:'#738a91'} strokeWidth={i===21?4:2}/>)}{label(237,64,'Marked turn','middle',rust)}{line(237,68,x(21),86,rust,1)}{arrow(103,155,368,155)}{note('Compression travels down the slinky; the marked turn stays near home.')}</g>;
  }
  if(n==='10.2.1'){
    return <g>{rect(112,158,228,11,wood)}{path('M131 157V99a94 76 0 0 1 188 0v58z','#e7f2f1','#79989e',3)}{seq(55).filter(i=>(i*23%55)/55>=p).map(i=><g key={i}>{dot(152+(i*47)%147+2*Math.sin(tau*p*5),81+(i*19)%69,1.8,teal,'none')}</g>)}{fork(225,113,p)}{path('M323 164h39v-33h48','none',ink,4)}{label(381,115,'To pump')}{note(p===1?'Ideal vacuum: the fork still vibrates but sound cannot cross the gap.':'Bell jar · removing air leaves fewer particles to transmit sound.')}</g>;
  }
  if(n==='Activity 10.6'){
    const a=Math.sin(tau*p*5);
    return <g>{at(113,107,<><ellipse rx="28" ry="43" fill={gold} stroke={ink} strokeWidth="3"/><ellipse rx="18" ry="33" fill="none" stroke="#b68743"/>{line(-60,-47,-29+9*a,-7,wood,7)}</>)}{path('M247 116h129q-8 61 -63 61t-66 -61z',sky)}{path(`M245 115q68 ${a*7} 133 0`,'none',teal,5)}{seq(10).map(i=><ellipse key={i} cx={256+12*i} cy={110-(5+i%3*5)*Math.abs(Math.sin(tau*p*5+i*.22))} rx="4" ry="2" fill={gold} stroke="#8b703e"/>)}{label(111,44,'Metal plate + beater')}{label(311,61,'Rice on stretched sheet')}{note('The plate never touches the bowl; sound sets the sheet vibrating.')}</g>;
  }
  if(n==='10.6.4'){
    return <g>{ear(84,105,2.2)}{path('M111 98q34 -3 68 3v16q-31 -4 -70 3z','#e9c7b1')}{line(175+2*Math.sin(tau*p*4),90,186,127,rust,4)}{path('M184 104l17 -16 12 16 15 -10 10 16','none','#ac855b',6)}{path('M238 110c-6 -39 55 -47 68 -14 12 35 -38 53 -49 22 -6 -21 27 -28 32 -9 4 12 -13 16 -15 6','none','#a96c70',7)}{path('M306 107q33 -9 74 10','none',gold,8)}{dot(307+69*p,107-3*Math.sin(Math.PI*p)+10*p,4,rust)}{label(146,153,'Eardrum')}{label(271,161,'Cochlea')}{label(385,80,'Auditory nerve')}{note('Eardrum → tiny bones → cochlea · sensory cells produce nerve signals.')}</g>;
  }
  if(n==='10.8'){
    const f=10**(1+4*p),X=(v:number)=>49+(Math.log10(v)-1)*95;
    return <g>{[[10,20,sky],[20,20000,'#a6d4b6'],[20000,100000,'#e4b58f']].map(([lo,hi,c])=><rect key={lo} x={X(+lo)} y="96" width={X(+hi)-X(+lo)} height="26" fill={String(c)}/>)}{[10,20,1000,20000,100000].map((v,i)=><g key={v}>{line(X(v),122,X(v),129)}{label(X(v),i===0?150:143,`${v>=1000?v/1000+'k':v}`,'middle',ink,11)}</g>)}{arrow(X(f),71,X(f),94,rust)}{label(240,49,`${Math.round(f).toLocaleString('en-US')} Hz · ${f<20?'infrasound':f>20000?'ultrasound':'typical human hearing'}`)}{label(240,174,'Frequency (Hz) · logarithmic scale')}{note('Typical hearing range: 20 Hz to 20 kHz. Loudness is a separate property.')}</g>;
  }
  if(n==='10.7.2'){
    return <g>{path('M48 164V63l79 -34h236l69 34v101z','#f1e4cd')}{speaker(90,126,p)}{ear(373,127,.8)}{[[90,126,235,30,373,127],[90,126,165,164,373,127],[90,126,430,68,373,127]].map(([x,y,b,c,X,Y],i)=>{const d1=Math.hypot(b-x,c-y),d2=Math.hypot(X-b,Y-c),dist=Math.min(p*480,d1+d2),k=dist<d1?dist/d1:(dist-d1)/d2;return <g key={i}>{path(`M${x} ${y}L${b} ${c} ${X} ${Y}`,'none','#b9a98e',1.4)}{dot(dist<d1?x+(b-x)*k:b+(X-b)*k,dist<d1?y+(c-y)*k:c+(Y-c)*k,4,[rust,teal,ink][i])}</g>})}{note('Ceiling, floor and wall reflections reach the listener at different times.')}</g>;
  }
  if(n==='10.7'||n==='10.7.1'||n==='10.8.1'||n==='10.6.3'){
    const bat=n==='10.8.1',one=n==='10.6.3',echo=n==='10.7.1',out=one||p<=.5,k=one?p:1-Math.abs(2*p-1),x=96+293*k;
    return <g>{bat?<>{path('M35 102q17 -7 32 2l5 -13 8 9 9 -6v12q17 -12 37 -7 -12 5 -12 22 -9 -9 -19 0 -8 -5 -15 6 -7 -11 -14 -6 -7 -11 -16 -2 -1 -10 -15 -17z','#4f4359')}{at(396,105,<>{path('M-2 0q-21 -23 -19 -3 2 9 18 4m5 -1q18 -24 18 -7 2 10 -16 10','#c7d6be')}{dot(0,2,4,ink)}</>)}</>:<>{speaker(67,107,p)}{one?microphone(399,105):<>{rect(397,52,25,102,wood)}{seq(7).map(i=><g key={i}>{line(399,61+i*14,419,54+i*14,'#ac8968',1)}</g>)}</>}</>}
      {path(`M${x} 85q${out?12:-12} 20 0 40m${out?-5:5} -37q${out?9:-9} 17 0 34`,'none',out?teal:rust,2.5)}{line(96,154,394,154,ink,1)}{label(245,174,bat?'3.4 m':one?'340 m':'17 m')}{label(240,43,one?'Source pulse → microphone':out?'Outgoing pulse':'Reflected pulse')}{note(bat?`Bat call → moth → bat · elapsed ${(20*p).toFixed(1)} ms`:one?`Travel time ${p.toFixed(2)} s · at arrival: 340 m ÷ 1 s = 340 m/s`:echo?`Clock ${(100*p).toFixed(0)} ms · wall distance = 340 m/s × 0.10 s ÷ 2`:'The boundary returns part of the sound energy to the air.')}</g>;
  }
  const recv=n==='10.4',particle=n==='10.2',d=5*Math.sin(tau*2*p);
  return <g>{speaker(55,109,p)}{air(91,89,p,33,8.8,particle)}{recv?<>{path(`M404 71q${d} 36 0 75`,'none',rust,4)}{rect(395,65,19,6,wood)}{rect(395,146,19,6,wood)}{label(398,171,'Membrane')}</>:particle?ear(410,110,.75):null}{label(240,45,recv?'Energy travels through the air to the receiver':particle?'Track the marked layer of air':'Speaker cone compresses and rarefies air')}{note(particle?'Individual particles oscillate locally as the disturbance moves right.':recv?'Pressure changes make the receiving membrane vibrate.':'Close spacing means higher local air pressure.')}</g>;
}
