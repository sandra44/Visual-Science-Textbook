import {type PhysicsProps,arrow,at,ball,cart,dot,floor,gauge,gold,ink,label,line,note,path,rect,rust,seq,sky,tau,teal,wood} from './PhysicsKit';

function lever(n:string,p:number,flat:boolean){
  const pans=n==='Activity 7.5',stapler=n==='Activity 7.4',pivot=pans?240:stapler?160:220-70*p;
  const angle=pans?9*(1-p):stapler?-6+10*p:3*Math.cos(Math.PI*p);
  return <g>{pans?<>{rect(211,22,58,8,wood)}{line(240,29,240,98)}</>:floor(151,flat)}
    {at(pivot,pans?98:129,<g transform={`rotate(${angle})`}>
      {rect(64-pivot,-5,352,9,gold,1)}{seq(31).map(i=><g key={i}>{line(68-pivot+i*11.4,-5,68-pivot+i*11.4,i%5===0?2:-1,ink,1)}</g>)}
      {pans?[[-110,1],[110-55*p,2]].map(([x,count])=><g key={count} transform={`translate(${x} 2) rotate(${-angle})`}>{path('M0 0l-18 42h36z','none',ink,1.5)}{path('M-19 40h38l-7 22h-24z',sky)}{seq(count).map(i=><g key={i}>{rect(-9,34-i*5,18,5,gold)}</g>)}</g>):<>
        {stapler?at(109-pivot,-6,<>{path('M-26 -2h52v-5h-46l-4 -17 -7 2z','#647682')}{path('M-24 -22q15 -5 49 1l-1 8 -41 -1z',rust)}{dot(-20,-12,3,gold)}</>):rect(95-pivot,-28,32,22,'#ad9381')}
        {stapler?<>{rect(352-pivot,-20,34,14,'#dd91a1')}{p>.35&&rect(352-pivot,-34,34,14,'#dd91a1')}{p>.7&&rect(352-pivot,-48,34,14,'#dd91a1')}</>:arrow(374-pivot,-43,374-pivot,-8,rust)}</>}
    </g>)}
    {!pans&&(stapler?<>{path(`M${pivot-8} 142l19 -12 12 2 -18 15z`,wood)}{dot(pivot,140,7,gold)}{dot(pivot,140,2,ink)}</>:path(`M${pivot} 134l-15 16h30z`,wood))}
    {label(240,55,pans?'Slide the two-coin cup inward':stapler?'Stapler on short arm · erasers on long arm':'Move the fulcrum towards the load')}
    {note(pans?`One coin × 20 cm   vs   two coins × ${(20-10*p).toFixed(1)} cm`:stapler?'30 cm ruler rests on a pencil; adding erasers raises the stapler.':'A longer effort arm needs less force for the same turning effect.')}</g>;
}
export default function Energy({number:n,p,flat}:PhysicsProps){
  if(['7.6.3','Activity 7.4','Activity 7.5'].includes(n))return lever(n,p,flat);
  if(n==='7.6.1'){
    return <g>{rect(168,22,117,9,wood)}{line(226,31,226,57)}{dot(226,66,24,wood)}{at(226,66,<g transform={`rotate(${-140*p})`}>{line(-20,0,20,0)}{line(0,-20,0,20)}</g>)}{dot(226,66,5,ink)}{path(`M201 ${106+51*p}V66a25 25 0 0 1 50 0v${86-51*p}`,'none',ink,3)}{rect(230,152-51*p,42,26,gold)}{arrow(177,92,177,128,rust)}{arrow(289,145,289,109)}{label(134,153,'Pull down')}{label(331,96,'Load rises')}{note(`Rope pulled ${(0.5*p).toFixed(2)} m  ·  Load lifted ${(0.5*p).toFixed(2)} m`)}</g>;
  }
  if(n==='Activity 7.3'||n==='7.6'){
    const two=n==='Activity 7.3';
    return <g>{(two?[0,1]:[1]).map(i=>{const y=two?87+i*85:163,x=two?150:72,L=i?215:120,H=two?46:76,a=-Math.atan(H/L)*180/Math.PI;
      return <g key={i}>{path(`M${x} ${y}h${L}v-${H}z`,'#e0c4a1')}{line(x,y,x+L,y-H,ink,3)}{at(x+L*p,y-H*p,<g transform={`rotate(${a})`}>{cart(0,0,flat,teal,.65)}{two?gauge(27,-10,i?2:3,.55):arrow(19,-13,61,-13)}</g>)}{label(two?20:43,two?y-43:44,two?(i?'Gentle incline':'Steep incline'):'Ideal ramp · 100 N load','start')}</g>})}{note(two?'Same height · a longer plank needs a smaller steady pull.':'Raise 1 m along 3 m of ramp: input work = output work = 100 J.')}</g>;
  }
  if(n==='7.4.3'||n==='Activity 7.2'){
    const pend=n==='Activity 7.2',a=.78*Math.cos((pend?2:0.5)*tau*p)*(pend?1-.22*p:1),length=125,x=240+length*Math.sin(a),y=37+length*Math.cos(a);
    return <g>{rect(176,21,128,10,wood)}{dot(240,37,5,ink)}{line(240,37,x,y,ink,2)}{pend?<>{line(87,37+length*Math.cos(.78),389,37+length*Math.cos(.78),rust,1.5,'5 4')}{ball(x,y,11,flat)}{label(46,117,'Release level','start',rust)}</>:<>{line(251,37,x+24,y)}{path(`M${x-8} ${y}l36 -1 6 6h-43z`,wood)}{dot(x+10,y-34,7,gold)}{path(`M${x+9} ${y-24}v16l13 1 8 11m-22 -25 -9 10`,'none',teal,5)}</>}{note(pend?'Compare each peak with the release line · losses lower the peaks.':'At the lowest point the rider moves fastest; at each end speed is zero.')}</g>;
  }
  if(n==='Activity 7.1'){
    return <g>{[1,2].map((h,i)=>{const x=141+i*191,k=Math.max(0,Math.min(1,2*p-i)),fall=Math.min(1,k/.82),sink=Math.max(0,(k-.82)/.18)*(6+7*i),y=146-53*h*(1-fall*fall)+sink;
      return <g key={h}>{path(`M${x-68} 157h47q21 ${sink*2} 42 0h47v24h-136z`,gold)}{seq(12).map(j=><g key={j}>{dot(x-62+11*j,174+(j%2)*3,1,'#aa7845','#aa7845')}</g>)}{line(x-37,146-53*h,x-37,146,rust,1,'4 3')}{label(x-43,149-48*h,`${h} m`,'end')}{ball(x,y,12,flat)}</g>})}{note('Drop the same ball on fresh sand · compare the two depressions.')}</g>;
  }
  if(n==='7.4'||n==='7.4.2'||n==='7.5'){
    const fall=n==='7.4',two=n==='7.5',shelf=n==='7.4.2';
    return <g>{floor(173,flat)}{(two?[0,1]:[0]).map(i=>{const x=two?145+i*189:224,h=fall?1-p*p:two?Math.min(1,p*(i?1:2)):p,y=154-99*h;return <g key={i}>{line(x-43,55,x-43,154,ink,1)}{[0,1,2].map(j=><g key={j}>{line(x-48,154-j*49.5,x-38,154-j*49.5)}{label(x-55,158-j*49.5,`${j} m`,'end')}</g>)}{shelf&&<>{rect(x-22,165,74,6,wood)}{rect(x+16,65,58,6,wood)}</>}{fall?ball(x,y,11,flat):<>{rect(x-15,y-10,30,20,gold)}{line(x,y-10,x,27,ink,2)}{label(x+22,y+4,'1 kg','start')}</>}{two&&label(x,28,i?'4 s lift':'2 s lift')}</g>})}{note(fall?`1 kg ball · potential ${(19.6*(1-p*p)).toFixed(1)} J + kinetic ${(19.6*p*p).toFixed(1)} J = 19.6 J`:two?'Both lifts do 19.6 J of work · average power: 9.8 W vs 4.9 W.':`Height ${(2*p).toFixed(1)} m · gravitational energy gained ${(19.6*p).toFixed(1)} J`)}</g>;
  }
  if(n==='7.4.1')return <g>{[1,2].map((v,i)=><g key={v}>{floor(79+i*91,flat)}{cart(71+v*150*p,79+i*91,flat,i?rust:teal)}{label(31,39+i*91,`Mass 2 kg    ·    ${v} m/s    ·    kinetic energy ${v*v} J`,'start')}</g>)}{note('Doubling speed quadruples kinetic energy.')}</g>;
  if(n==='7.3'){
    return <g>{path('M112 115V62h197v30m0 37v25H112v-19')}{rect(92,101,40,43,teal)}{rect(103,96,18,6,gold)}{label(112,127,'+','middle','#fff')}{dot(310,103,23,`rgb(250,${212+Math.round(p*28)},${129-Math.round(p*55)})`)}{path('M299 119l3 10h15l4 -10m-17 -4 -4 -14 9 6 9 -6 -4 14')}{seq(8).map(i=>{const a=i*tau/8;return <g key={i}>{line(310+28*Math.cos(a),103+28*Math.sin(a),310+(33+9*p)*Math.cos(a),103+(33+9*p)*Math.sin(a),'#c28b2c',2)}</g>})}{dot(112+197*p,62,4,gold)}{label(107,178,'Battery')}{label(328,178,'Lamp: light + heat')}{note('Chemical energy in the battery supplies the closed circuit.')}</g>;
  }
  if(n==='7.1.1'){
    const x=88+255*p;
    return <g>{floor(167,flat)}{at(x,0,<>{dot(0,64,12,wood)}{path(`M0 81v39l${10*Math.sin(tau*p*3)+3} 44m${-10*Math.sin(tau*p*3)-3} -44l${-10*Math.sin(tau*p*3)-3} 44m0 -81 16 33h12`,'none',teal,7)}{path('M19 127q0 -21 16 0')}{rect(8,126,39,28,wood)}{arrow(40,120,40,77,rust)}</>)}{arrow(67,43,402,43)}{label(238,30,'Horizontal displacement')}{note('Upward support acts at 90° to motion; its work on the bag is 0 J.')}</g>;
  }
  const braking=n==='7.1.2',energy=n==='7.2',k=braking?(p<.5?2*p*p:1-2*(1-p)**2):energy?p*p:p,x=65+335*k;
  return <g>{floor(144,flat)}{energy||braking?cart(x,144,flat):rect(x-23,109,46,34,wood)}{arrow(x,99,x+(braking&&p>.5?-40:40),99,braking&&p>.5?rust:teal)}{label(240,45,braking?(p<=.5?'Forward push: positive work':'Brakes oppose motion: negative work'):energy?'Net work increases the cart’s kinetic energy':'A 10 N force pulls the crate horizontally')}{line(65,167,x,167,teal,2)}{note(braking?'The cart moves right throughout, speeding up and then slowing down.':energy?`From rest · work done ${(20*k).toFixed(1)} J  =  kinetic energy gained ${(20*k).toFixed(1)} J`:`Displacement ${(4*k).toFixed(1)} m  ·  Work done ${(40*k).toFixed(1)} J`)}</g>;
}
