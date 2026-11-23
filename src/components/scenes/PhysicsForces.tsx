import {type PhysicsProps,arrow,at,ball,cart,dot,floor,gauge,gold,ink,label,line,note,path,rect,rust,seq,sky,spring,teal,wood} from './PhysicsKit';

function coin(x:number,y:number){
  return <g>{rect(x-15,y-4,30,6,gold)}<ellipse cx={x} cy={y-4} rx="15" ry="4" fill="#f4d189" stroke={ink}/></g>;
}
export default function Forces({number:n,p,flat}:PhysicsProps){
  if(n==='Activity 6.7'){
    const x=107+253*(1-(1-p)**1.6),w=57-37*p,h=40-23*p;
    return <g>{rect(22,45,8,118,wood)}{rect(450,45,8,118,wood)}{line(26,73,453,73)}{rect(x-25,69,50,8,sky,3)}
      {at(x,78,<>{path(`M${-w} ${h} C${-w*.6} ${h} ${-w} 0 0 0 C${w*1.32} 0 ${w*1.32} ${2*h} 0 ${2*h} Q${-w*.52} ${2*h} ${-w} ${h}z`,'#e69176')}{path(`M${-w} ${h}l-9 -4v10z`,rust)}{!flat&&path(`M0 7q${w*.4} -2 ${w*.6} 9`,'none','#f7cabb',4)}{rect(-12,-4,23,10,'#c5cba0')}{[0,1,2].map(i=><g key={i}>{line(-w-15,h+i*6-6,-w-23-(i+1)*5*Math.sin(p*Math.PI),h+i*9-9,teal,2)}</g>)}</>)}
      {label(240,32,'Straw taped to balloon · thread through straw')}{arrow(x-24,171,x-70,171,rust)}{label(x-48,191,'Air')}{arrow(x+12,171,x+68,171)}{label(x+43,191,'Balloon')}</g>;
  }
  if(n==='6.1.1'){
    const load=5*p,end=111+32*p;
    return <g>{rect(165,25,108,9,wood)}{line(211,34,211,49)}{rect(189,48,45,100,'#e7f0e9',6)}<g transform="translate(211 55) rotate(90)">{spring(0,0,end-55,8)}</g>{line(211,end,253,end,rust,3)}{seq(6).map(i=><g key={i}>{line(247,111+i*6.4,255,111+i*6.4,ink,1)}{i%5===0&&label(264,115+i*6.4,`${i} N`,'start')}</g>)}{path(`M211 ${end}v17q-9 10 -12 1`)}{rect(185,end+15,29,16,gold)}{label(340,82,'Calibrated spring')}{note(`Extension increases with load  ·  ${load.toFixed(1)} N`)}</g>;
  }
  if(n==='6.1'){
    const x=160+245*Math.max(0,(p-.32)/.68),foot=42*Math.sin(Math.min(1,p/.32)*Math.PI/2)-40*Math.max(0,p-.32);
    return <g>{floor(157,flat)}{at(foot,0,<>{path('M44 48l30 7 -10 45 15 25 -17 12 -25 -36z','#879bb5')}{path('M62 126q9 8 17 -3l19 9q10 1 10 11H66l-11 -9z',ink)}</>)}{ball(x,141,16,flat,'#fcf3da')}{path(`M${x-6} 138l7 -4 7 7 -4 8 -9 -2z`,ink)}{p>.32&&arrow(x-16,112,x+28,112)}{note(p<.32?'Boot approaches the stationary football.':'After contact ends, the ball keeps moving.')}</g>;
  }
  if(n==='Activity 6.1'){
    return <g>{['Polished tile','Rough wood'].map((s,i)=>{const y=78+i*85,k=Math.min(p/(i?.7:.35),1),x=90+Math.max(0,p-(i?.7:.35))*110,len=65+k*(i?108:48);
      return <g key={s}>{rect(35,y+3,412,10,i?wood:'#b7d4d3')}{seq(i?15:5).map(j=><g key={j}>{line(45+j*(i?25:79),y+5,54+j*(i?25:79),y+10,'#9e8c71',1)}</g>)}{seq(4).map(j=><g key={j}>{coin(x,y-4*j)}</g>)}{rect(x-4,y-16,7,18,'#d3c8ac')}{path(`M${x-14} ${y-7}Q${x} ${y-16} ${x+len} ${y-12}Q${x+len+12} ${y-10} ${x+len} ${y-7}L${x} ${y-3}z`,'none',rust,2)}{label(432,y-15,s,'end')}{label(43,y-34,k<1?'Stretching':'Sliding','start',teal)}</g>})}{note('Same four taped coins · more stretch before sliding on rough wood.')}</g>;
  }
  if(n==='Activity 6.3'||n==='Activity 6.4'){
    const mass=n==='Activity 6.4';
    return <g>{[0,1].map(i=>{const y=65+i*86,travel=(mass?(i?19:32):(i?35:20))*p*p,x=116+travel,end=y+8+travel;
      return <g key={i}>{rect(50,y,291,7,wood)}{rect(322,y+7,9,48,wood)}{cart(x,y,flat,teal,.85)}{mass&&i===1&&rect(x-15,y-39,30,17,gold)}{dot(348,y-4,7,ink)}{path(`M${x+20} ${y-11}H348q8 0 8 8v${end-y+3}`)}{path(`M343 ${end}h26l-5 17h-16z`,'#b2d8d5')}{seq(mass?1:i+1).map(j=><g key={j}>{line(346,end-2-3*j,365,end-2-3*j,'#b78c3e',3)}</g>)}{label(48,y-32,mass?(i?'Double cart mass':'Original cart mass'):(i?'Two coins in cup':'One coin in cup'),'start')}</g>})}{note(mass?'Same hanging load · the heavier cart travels less in the same time.':'Same cart · the heavier cup produces greater acceleration.')}</g>;
  }
  if(n==='Activity 6.5'){
    const x=195-84*p,arm=Math.min(286-x,94);
    return <g>{floor(165,flat)}{rect(286,94,140,11,wood)}{[294,411].map(i=><g key={i}>{rect(i,105,7,60,wood)}</g>)}{at(x,0,<>{path('M-29 90v42h51m-24 0v20m-22 5 22 -7 22 7','none',ink,6)}{dot(-21,160,5,ink)}{dot(22,160,5,ink)}{dot(5,61,13,wood)}{path('M0 77l-10 42 35 1 19 25 11 -5','none',teal,10)}{path(`M4 83l26 13 ${arm-30} -2`,'none',wood,8)}</>)}{arrow(178,41,105,41,rust)}{arrow(294,69,354,69)}{label(360,49,'Push on table')}{note('The table pushes the rider back; the feet stay off the floor.')}</g>;
  }
  if(n==='Activity 6.6')return <g>{floor(137,flat)}{rect(48,62,13,75,wood)}{line(60,105,100,105)}{gauge(110,105,6*p,1.3)}<g transform="translate(370 105) rotate(180)">{gauge(0,0,6*p,1.3)}</g>{line(390,105,420,105)}{arrow(412,105,443,105)}{label(158,74,`${(6*p).toFixed(1)} N`)}{label(317,74,`${(6*p).toFixed(1)} N`)}{note('Hook to hook · equal tension, not twice the reading.')}</g>;
  if(n==='6.6'||n==='6.7'){
    const system=n==='6.7',travel=p<.18?84*p*p/.36:84*(p-.09),x=system?72+64*p*p:202-travel,X=system?x+146:264+travel;
    return <g>{floor(150,flat)}{cart(x,150,flat)}{cart(X,150,flat,rust)}{system?<>{line(x+25,133,X-25,133)}<rect x={x-37} y="84" width="225" height="74" fill="none" stroke={teal} strokeDasharray="6 4"/>{arrow(X+25,133,X+95,133)}{label(241,51,'Dashed boundary encloses both carts')}</>:<>{spring(x+26,131,10+2*Math.min(travel,7.56),4)}{label(240,51,'Two carts push apart as a spring expands')}</>}{(system||p<.18)&&<>{arrow(x,110,x+(system?33:-33),110,rust)}{arrow(X,110,X+(system?-33:33),110,rust)}</>}{note(system?'Internal tension cancels for the pair; the external pull does not.':'Equal and opposite forces act on different carts during contact.')}</g>;
  }
  if(n==='6.5')return <g>{[0,1].map(i=><g key={i}>{floor(83+83*i,flat)}{cart(60+(i?292:146)*p*p,83+83*i,flat)}{arrow(89+(i?292:146)*p*p,65+83*i,89+(i?292:146)*p*p+(i?44:22),65+83*i)}{label(38,39+83*i,`1 kg cart · ${i?4:2} N → ${i?4:2} m/s²`,'start')}</g>)}{note('Twice the net force gives twice the acceleration for the same mass.')}</g>;
  const steady=n==='Activity 6.2',coast=n==='6.4',x=60+(steady?208:335)*(coast||steady?p:1-(1-p)**2);
  return <g>{floor(145,flat)}{coast?cart(x,145,flat):rect(x-26,111,52,33,wood)}{coast?<>{arrow(x-18,95,x+28,95)}{label(240,46,'Low-friction track · no net force')}</>:<>{arrow(x,140,x-41,140,rust)}{steady&&gauge(x+40,124,3,.95)}{label(237,42,steady?'Pull at a steady speed · balance reads 3 N':'Sliding block slows on the rough surface')}{label(so(x),170,'Friction','middle',rust)}</>}{note(coast?'Equal distances in equal times · velocity stays constant.':steady?'Pull: 3 N right    ·    Friction: 3 N left    ·    Net: 0 N':'Friction on the block points opposite its motion.')}</g>;
}
const so=(x:number)=>Math.max(47,x-28);
