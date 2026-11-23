import {type PhysicsProps,arrow,at,ball,cart,dot,floor,gold,ink,label,line,note,path,rect,rust,seq,sky,tau,teal,wood} from './PhysicsKit';

function house(x:number,y:number,school=false){
  return at(x,y,<>{rect(-28,-38,56,38,school?'#dbc39d':'#e7bb9a')}{path('M-34 -37L0 -60l34 23z',school?teal:rust)}{rect(-5,-18,10,18,wood)}{[-18,11].map(a=><g key={a}>{rect(a,-27,9,10,sky)}</g>)}{school&&dot(0,-43,5,'#fff')}</>);
}
function cyclist(x:number,p:number){
  return at(x,152,<>{[-17,17].map(a=><g key={a}>{dot(a,-12,12,'#eef4eb')}{line(a,-12,a+10*Math.cos(tau*p*6),-12+10*Math.sin(tau*p*6),'#879e9c',1.4)}</g>)}{path('M-17 -12l10 -15 8 15h-18m18 0l12 -18 4 18','none',teal,3)}{path('M-9 -42l-4 14 13 5 -3 12m-6 -30 12 10h11','none',ink,4)}{dot(-7,-49,6,wood)}</>);
}
function car(x:number,y:number,c:string){
  return at(x,y,<>{path('M-29 -8v-12l10 -4 8 -10h17l11 12 12 5v9z',c)}{path('M-13 -23l6 -8h13l7 8z',sky)}{dot(-16,-7,6,ink)}{dot(17,-7,6,ink)}</>);
}
function walker(x:number,y:number,p:number) {
  const s=Math.sin(tau*4*p)*9;
  return at(x,y,<>{dot(0,-48,7,wood)}{path(`M0 -39l-1 17m0 0l${s+2} 20m${-s-2} -20l${-s-2} 20M0 -34l${8-s} 10`, 'none',teal,5)}</>);
}
function graph(n:string,p:number){
  const area=n==='4.2.3', predict=n==='4.3', point=n==='4.2.1', table=n==='Activity 4.3', slope=n==='Activity 4.4';
  const X=(t:number)=>62+45*t, Y=(v:number)=>area?111-24*v:170-v;
  const v=(t:number)=>area?t-3:predict?5*t+2.5*t*t:20*t;
  const t=point?4:slope?1+4*p:6*p, base=area?111:170;
  const trace=(end:number)=>seq(41).map(i=>`${X(end*i/40)},${Y(v(end*i/40))}`).join(' ');
  return <g>{label(62,21,area?'Velocity (m/s)':'Position (m)','start')}{seq(7).map(i=><g key={i}>{line(X(i),33,X(i),176,'#d6dfdc',1)}{label(X(i),189,i,'middle',ink,11)}{line(57,area?Y(i-3):Y(20*i),339,area?Y(i-3):Y(20*i),'#d6dfdc',1)}{label(51,(area?Y(i-3):Y(20*i))+4,area?i-3:i*20,'end',ink,11)}</g>)}{line(62,32,62,area?184:172)}{line(62,base,340,base)}{label(375,188,'Time (s)')}
    {area&&<polygon points={`${X(0)},${base} ${trace(t)} ${X(t)},${base}`} fill={sky}/>}
    {!point&&<polyline points={trace(slope?6:t)} stroke={teal} fill="none" strokeWidth="3"/>}
    {point?<>{line(62,170,X(4*Math.min(1,2*p)),170,rust,3)}{p>=.5&&line(X(4),170,X(4),170-80*(2*p-1),rust,2,'4 3')}{dot(X(4*Math.min(1,2*p)),170-80*Math.max(0,2*p-1),5,gold)}</>:dot(X(t),Y(v(t)),5,gold)}
    {slope&&<>{line(X(1),Y(20),X(t),Y(20),rust,2,'4 3')}{line(X(t),Y(20),X(t),Y(v(t)),rust,2,'4 3')}{label(X(1),Y(20)-9,'A')}{label(X(t)+12,Y(v(t))-4,'B')}</>}
    {table?<>{label(403,39,'t (s)   x (m)')}{seq(7).map(i=><g key={i}>{label(389,57+16*i,i,'middle',i<=t?teal:ink,12)}{label(423,57+16*i,20*i,'middle',i<=t?teal:ink,12)}{i<=t&&dot(X(i),Y(20*i),3,gold)}</g>)}</>:<>{label(406,75,area?'Net area':point?'Reading':predict?'a = 5 m/s²':slope?'Rise / run':'Reading')}{label(406,96,area?`${(t*t/2-3*t).toFixed(1)} m`:point?'4 s, 80 m':slope?'20 m/s':`${v(t).toFixed(0)} m`,'middle',teal)}</>}
    {note(area?'Below the time axis, area counts as negative displacement.':point?'Locate 4 s first, then rise to 80 m.':predict?'Starting at 5 m/s, the vehicle gains 5 m/s each second.':slope?'From 1 s to 5 s: 80 m ÷ 4 s = 20 m/s.':table?'Each time–position pair becomes one point.':`At ${t.toFixed(1)} s the position is ${v(t).toFixed(0)} m.`)}</g>;
}
export default function Motion({number:n,p,flat}:PhysicsProps){
  if(n==='Activity 1.1')return <g>{house(64,122,true)}{house(416,122)}{label(64,49,'School')}{label(416,49,'Home')}{floor(153,flat)}{cyclist(65+p*350,p)}{label(241,40,'1.2 km at 12 km/h')}{note(`${(1.2*p).toFixed(2)} km ridden  ·  ${(6*p).toFixed(1)} min elapsed`)}</g>;
  if(['4.2','4.2.1','Activity 4.3','Activity 4.4','4.2.3','4.3'].includes(n)) return graph(n,p);
  if(n==='Activity 4.1'){
    const h=120*4*p*(1-p);
    return <g>{floor(174,flat)}{seq(7).map(i=><g key={i}>{line(157,160-20*i,174,160-20*i)}{label(149,164-20*i,20*i,'end')}</g>)}{label(149,20,'Height (cm)')}{line(213,160,213,40,'#99aeaa',1,'4 4')}{ball(213,160-h,11,flat)}{label(327,79,`Path: ${Math.round(p>.5?240-h:h)} cm`)}{label(327,105,`Displacement: ${Math.round(h)} cm`)}{note(p<.5?'Rising on the same vertical line':p===1?'Back at launch height: displacement is zero.':'Falling towards the launch point')}</g>;
  }
  if(n==='Activity 4.2'){
    const t=10*p;
    return <g>{[5,10].map((T,i)=>{const y=76+80*i,k=Math.min(t/T,1),distance=t<=T?t*t/(2*T):t-T/2;return <g key={T}>{floor(y,flat)}{car(52+distance*42,y,i?rust:teal)}{label(26,y+20,`Car ${i?'B':'A'}: ${Math.round(100*k)} km/h`,'start')}{label(452,y+20,`0–100 in ${T} s`,'end')}</g>})}{note(`Clock: ${t.toFixed(1)} s  ·  Car A: 5.56 m/s²  ·  Car B: 2.78 m/s²`)}</g>;
  }
  if(n==='4.4.1'||n==='Activity 4.5'){
    const ring=n==='Activity 4.5',released=ring&&p>.65,a=(ring?Math.min(p/.65,1):p)*tau-Math.PI/2,x=209+61*Math.cos(a)+(released?(p-.65)*385:0),y=114+61*Math.sin(a);
    return <g><circle cx="209" cy={114-(released?20:0)} r="71" fill="none" stroke={ring?wood:'#a3bfbb'} strokeWidth={ring?12:2} opacity={released?.35:1}/>{ring&&line(209,53,358,53,'#91a19e',1,'4 3')}{ball(x,y,9,flat)}{!ring&&arrow(x,y,209+35*Math.cos(a),114+35*Math.sin(a),rust)}{arrow(x,y,x-35*Math.sin(a),y+35*Math.cos(a))}{label(370,115,ring?(released?'Ring lifted':'Tape ring'):'Velocity: tangent')}{!ring&&label(370,138,'Acceleration: inward','middle',rust)}{note(ring?'Top view · Without the ring, the marble continues straight.':'Top view · Speed is constant; velocity changes direction.')}</g>;
  }
  if(n==='4.4'){
    const x=55+365*p,y=157-430*p*(1-p);
    return <g>{floor(168,flat)}{line(55,157,x,157,teal,2,'5 3')}{line(x,157,x,y,rust,2,'5 3')}<polyline points={seq(61).map(i=>{const k=i*p/60;return `${55+365*k},${157-430*k*(1-k)}`}).join(' ')} stroke={ink} fill="none" strokeWidth="2"/>{ball(x,y,10,flat)}{label(240,28,'Horizontal travel + vertical rise and fall')}{note(`x = ${(12*p).toFixed(1)} m   ·   y = ${(12*p*(1-p)).toFixed(1)} m`)}</g>;
  }
  const back=n==='4.1.2'||n==='4.1.3',origin=n==='4.1.1',acc=n==='4.1.4',k=back?1-Math.abs(2*p-1):acc?p*p:p,x=68+344*k;
  return <g>{floor(145,flat)}{seq(5).map(i=><g key={i}>{line(68+86*i,146,68+86*i,155)}{label(68+86*i,173,`${origin?i*10-20:i*10} m`)}</g>)}
    {back?<>{house(60,108)}{line(412,80,412,144,wood,4)}{path('M412 79l30 8 -30 8z',rust)}{walker(x,144,p)}</>:<>{(origin?[240]:[68,412]).map(a=><g key={a}>{line(a,69,a,144,wood,4)}{path(`M${a} 69l28 7 -28 8z`,a===412?rust:teal)}</g>)}{cart(x,144,flat)}</>}
    {label(240,32,n==='4.1'?'Start flag → finish flag':origin?'Reference post at 0 m  ·  east is positive':acc?'From rest: 5 m/s² for 4 seconds':n==='4.1.2'?'Home → turnaround → home':'Out and back at 2 m/s')}
    {note(back?(n==='4.1.2'?`Walked ${(80*p).toFixed(0)} m  ·  Displacement ${(40*k).toFixed(0)} m east`:`Time ${(40*p).toFixed(1)} s  ·  Mean speed ${p?'2':'—'} m/s  ·  Mean velocity ${p?(k/p).toFixed(1):'—'} m/s`):acc?`t = ${(4*p).toFixed(1)} s   ·   velocity = ${(20*p).toFixed(1)} m/s east`:`Position: ${(40*p-(origin?20:0)).toFixed(1)} m`)}</g>;
}
