import * as T from 'three';
import {box,cone,group,leaf,mesh,oval,particle,phase,tree,tube,type Model,type V} from './LifeEarth3DKit';

function microbe(g:T.Group,type:'bacterium'|'amoeba'|'ciliate'){
  const body=group(g);
  if(type==='bacterium'){
    const env=mesh(body,new T.CapsuleGeometry(.62,1.58,10,22),0x91b9a0,[0,0,0],.37);env.rotation.z=Math.PI/2;
    const pts:V[]=Array.from({length:37},(_,j)=>[(j-18)/19,.2*Math.sin(j*.61)+.08*Math.cos(j),.19*Math.cos(j*.76)]);
    tube(body,0x87587c,pts,.04);
    for(let j=0;j<22;j++)oval(body,0xc19459,[1.1*Math.cos(j*2.2),.45*Math.sin(j*.93),.37*Math.cos(j*.67)],[.036,.038,.04]);
    const tail=tube(body,0x7d9b81,[[1.3,.04,-.1],[1.81,-.12,-.12],[2.04,.21,-.18],[2.48,.09,-.1]],.042);
    return(p:number)=>{body.rotation.y=-.25+.57*p;env.material.opacity=.57-.34*phase(p,.12,.8);tail.rotation.x=.08*Math.sin(p*5);};
  }
  const amoeba=type==='amoeba';
  const env=oval(body,amoeba?0x9ec2a4:0x9fb7c2,[0,0,0],amoeba?[1.17,.57,.86]:[1.39,.48,.61],.49);
  oval(body,0x916b97,[-.23,.06,.07],[.33,.25,.27]);const food=oval(g,0xd59950,[2,0,.22],[.13,.13,.13]);
  const vac=oval(body,0xb9d7ba,[.49,.04,.15],[.28,.22,.24],.4);
  const limbs=Array.from({length:amoeba?8:34},(_,j)=>{const a=2*Math.PI*j/(amoeba?8:34);
    const x=Math.cos(a),z=Math.sin(a);
    if(amoeba){const joint=group(body,.77*x,0,.67*z);joint.rotation.y=-a;
      oval(joint,0x9ec2a4,[.17,0,0],[.43,.28,.29],.62);return joint;}
    const base=group(body,1.26*x,.08,.55*z);
    tube(base,0x879e9e,[[0,0,0],[.12*x,.12,.12*z],[.21*x-.09,.06,.22*z]],.019);return base;
  });
  const arms=[-1,1].map(s=>{const o=group(body,.7,0,s*.31);
    tube(o,0xaac7aa,[[0,0,0],[.35,-.04,s*.12],[.78,0,s*.19],[1.02,.03,s*.04]],.14);return o;});
  return(p:number)=>{if(amoeba){const ext=phase(p,0,.57),close=phase(p,.49,.88);
    arms.forEach((o,j)=>{o.scale.x=.03+ext*.92-close*.36;o.rotation.y=(j?1:-1)*close*.48;});
    food.position.set(1.77-1.25*close,0,.18);vac.visible=p>.69;vac.scale.setScalar(.06+.22*phase(p,.65,.96));env.scale.x=1.17+.06*close;
    limbs.forEach((o,i)=>o.rotation.z=.042*Math.sin(i+p*6));}
    else {food.visible=false;arms.forEach(v=>v.visible=false);body.position.set(-1.35+2.7*p,.19*Math.sin(p*5),.31*Math.sin(p*7));
      limbs.forEach((o,i)=>o.rotation.z=.55*Math.sin(i*.6+p*24));body.rotation.y=.32*Math.cos(p*7);}};
}
function feeding(g:T.Group){
  const wood=mesh(g,new T.CylinderGeometry(.58,.68,3.9,12),0x8a6a4d,[0,-.48,0]);wood.rotation.z=Math.PI/2;
  for(let j=0;j<5;j++){const z=(j-2)*.19;tube(g,0xd7c6a4,[[-1.9,-.1,z],[-1.39,.12,z],[-.72,.15,z*.8],[-.32,.05,z*1.5]],.053);
    tube(g,0xeee0c9,[[-1.4,.1,z],[-1,.16,z+.19],[-.74,.12,z+.32]],.031);}
  const solids=Array.from({length:6},(_,i)=>mesh(g,new T.DodecahedronGeometry(.16),0xd8a16a,[.65+(i%3)*.32,.15,Math.floor(i/3)*.2]));
  const moves=solids.map((o,i)=>particle(g,[[o.position.x,.22,o.position.z],[.37,.29,.11*i],[-.29,.13,.2],[-1.14,.13,i*.046]],0xe0b766,.064));
  return(p:number)=>{solids.forEach(o=>o.scale.setScalar(1-.85*phase(p,.21,.74)));moves.forEach((v,i)=>v(phase(p,.33+i*.026,1)));};
}
function chloroplast(g:T.Group){
  oval(g,0x8ab166,[0,0,0],[1.93,.73,1.05],.28);
  for(const [x,z] of [[-.87,.2],[-.25,-.47],[.65,.24],[1.11,-.31]])for(let j=0;j<5;j++){
    mesh(g,new T.CylinderGeometry(.25,.25,.066,20),j%2?0x579353:0x467d4a,[x,-.21+j*.096,z]);}
  tube(g,0x658d59,[[-.87,-.07,.2],[-.25,-.07,-.47],[.65,-.07,.24],[1.11,-.07,-.31]],.048);
  const rays=Array.from({length:4},(_,i)=>particle(g,[[-2.22+.21*i,1.64,-.16],[-1.46+.16*i,.91,-.04],[-.89+.12*i,.21,.02]],0xffc351,.072));
  const sugar=Array.from({length:6},(_,i)=>oval(g,0xe3b875,[1.18+.23*Math.cos(i*Math.PI/3),.25+.23*Math.sin(i*Math.PI/3),.34],[.088,.088,.088]));
  return(p:number)=>{rays.forEach((v,i)=>v(phase(p,.035*i,.69)));sugar.forEach((o,i)=>o.scale.setScalar(.005+.1*phase(p,.48+i*.045,1)));};
}
function moss(g:T.Group){
  const rock=mesh(g,new T.DodecahedronGeometry(1,1),0x839489,[0,-.9,-.25]);rock.scale.set(2.24,.62,1.16);
  const shoots=Array.from({length:11},(_,i)=>{const x=1.36*Math.cos(i*2.4)*Math.sqrt((i+1)/11),z=.76*Math.sin(i*2.4);
    const b=group(g,x,-.58,z);
    tube(b,0x7f9f55,[[0,0,0],[.04,.49,0],[.1,.86,.01]],.033);
    for(let j=0;j<5;j++)leaf(b,[.04,j*.13+.08,0],.32,.085,(j%2?1:-1)*.8,0x789b49).rotation.y=j*1.02;
    if(i%3===0){tube(b,0x99815a,[[.03,.44,0],[.07,1.04,0],[.21,1.38,0]],.025);
      oval(b,0x9c7651,[.24,1.4,0],[.12,.083,.071]);}
    for(let j=0;j<3;j++)tube(b,0xa78761,[[0,.02,.12],[.1*j,-.09,.26],[.18*j-.17,-.21,.43]],.025);return b;
  });
  return(p:number)=>shoots.forEach((o,i)=>{o.rotation.x=.07*Math.sin(i+p*3);rock.material.opacity=1-.53*phase(p,.32,.88);rock.material.transparent=true;rock.material.depthWrite=false;});
}
function stem(g:T.Group){
  function specimen(x:number,ring:boolean){
    const o=group(g,x,-.1,0);const body=mesh(o,new T.CylinderGeometry(.72,.67,1.63,30),0x9eb780,[0,0,0],.43);
    const points=Array.from({length:ring?10:5},(_,i)=>{const a=2*Math.PI*i/(ring?10:5),r=ring?.51:.25;
      const px=r*Math.cos(a),pz=r*Math.sin(a);mesh(o,new T.CylinderGeometry(.077,.074,1.65,10),0x84915e,[px,0,pz]);
      mesh(o,new T.CylinderGeometry(.042,.042,1.66,10),0xb37458,[px+.055,0,pz]);return particle(o,[[px,-.78,pz],[px,0,pz],[px,.86,pz]],0x56a5b5,.059);});
    return(p:number)=>{body.material.opacity=.52-.29*p;points.forEach(move=>move(p));};
  }const a=specimen(-1.17,false),b=specimen(1.17,true);return(p:number)=>{a(p);b(p);};
}
function venation(g:T.Group){
  const a=group(g,-1.4,-.98,0),b=group(g,1,-1.03,0);
  leaf(a,[0,0,0],2.46,.38,-.12);leaf(b,[0,0,0],2.2,.91,.16);
  const veins:ReturnType<typeof tube>[]=[];
  for(let j=-2;j<=2;j++){veins.push(tube(a,0xc4cc81,[[.04,0,.06],[.12+j*.085,.88,.15],[.2+j*.092,1.52,.15],[.27+j*.015,2.28,.08]],.018));}
  for(let j=0;j<4;j++)for(const sign of [-1,1]){const y=.31+j*.34,x=-.14*y,w=.4*Math.sin(y/2.2*Math.PI)+.13;
    veins.push(tube(b,0xc3c780,[[x,y,.15],[x+sign*.31,y+.2,.15],[x+sign*w,y+.38,.13]],.023));
    veins.push(tube(b,0xaebc76,[[x+sign*.24,y+.16,.15],[x+sign*.4,y+.16,.145],[x+sign*.48,y+.22,.14]],.011));}
  return(p:number)=>veins.forEach((o,j)=>{o.material.color.setHex((j<5?p<.55:p>=.48)?0xdfe393:0x96b46c);});
}
function fossil(g:T.Group){
  const layers=[0xb08b67,0xdeba8b,0xad9b79,0xc69f78].map((c,i)=>box(g,c,[0,-1.3+i*.38,0],[4.18,.37,1.8]));
  const spiral:V[]=Array.from({length:69},(_,i)=>{const a=i*.155,r=.025+i*.009;return[-.49+r*Math.cos(a),-.76+.18*r*Math.sin(a),.74+r*Math.sin(a)*.3];});
  tube(g,0x765f49,spiral,.075);for(let i=18;i<66;i+=3){const [x,y,z]=spiral[i];tube(g,0x947555,[[x-.036,y-.01,z],[x,y+.09,z+.042],[x+.04,y+.02,z+.08]],.025);}
  return(p:number)=>{layers.forEach((v,i)=>{v.position.y=-1.3+i*.38+i*.14*phase(p,.46,1);v.scale.y=i===0?1:.02+.98*phase(p,.12+i*.1,.52+i*.09);});};
}
function fragment(g:T.Group){
  box(g,0x857455,[0,-.94,0],[5.4,.32,2.5]);const patches=[-1,1].map(s=>box(g,0x78965e,[1.34*s,-.71,0],[2.7,.18,2.5]));
  const trees=Array.from({length:20},(_,i)=>tree(g,[((i%10)-4.5)*.5,-.63,Math.floor(i/10)*1.18-.68+.14*Math.cos(i)],.55+.11*(i%3)));
  const road=box(g,0xaa9279,[0,-.595,0],[.8,.08,2.5]);
  return(p:number)=>{const t=phase(p,.19,.89);road.scale.x=.01+1.24*t;trees.forEach((v,i)=>{const s=Math.abs(i%10-4.5)<1.1?1-t:1;v.scale.setScalar((.55+.11*(i%3))*Math.max(.001,s));});
    patches.forEach((v,i)=>{v.scale.x=1-.16*t;v.position.x=(i?1:-1)*(1.34+.21*t);});};
}
function finch(g:T.Group){
  const birds=[-1,1].map((s,i)=>{const f=group(g,s*1.26,-.08,0);
    oval(f,0xa98769,[0,0,0],[.56,.44,.37]);oval(f,0x9c826a,[.34,.37,0],[.33,.33,.31]);
    oval(f,0x4c453b,[.5,.47,.23],[.045,.045,.035]);
    oval(f,0x7d6957,[-.16,.04,.27],[.41,.22,.13]).rotation.z=.18;
    cone(f,0x705d4b,[-.59,-.01,0],.15,.63).rotation.z=1.88;
    cone(f,0xb29464,[.72,.35,0],i?.1:.19,i?.58:.36).rotation.z=-Math.PI/2;
    for(const z of [-.13,.13])tube(f,0x866d4b,[[.04,-.27,z],[.1,-.54,z],[.23,-.55,z]],.034);
    return f;
  });
  box(g,0xaf996e,[0,-.77,0],[4.8,.23,1.47]);
  const seeds=Array.from({length:4},(_,i)=>oval(g,0x97713f,[-.63+.13*(i%2),-.59+.04*(i%2),.11*(i-2)],[.115,.08,.065]));
  return(p:number)=>{birds.forEach((o,i)=>{const dip=Math.sin(Math.PI*phase(p,i?.06:.44,i?.52:.97));o.rotation.z=-.64*dip;o.position.y=-.08-.24*dip;});
    seeds[0].position.y=-.59+.58*phase(p,.86,1);};
}
function worm(g:T.Group){
  const tract:V[]=[[-2.1,.05,0],[-1.67,.18,0],[-1.05,.06,.09],[-.43,-.14,.17],[.19,-.11,.22],[.83,.07,.16],[1.49,.1,.1],[2.08,-.04,.06]];
  for(let j=0;j<27;j++){const x=-2.03+j*.153,y=.14*Math.sin(-x*1.9),r=.23+.095*Math.sin(Math.PI*j/26);
    oval(g,j%2?0xc48878:0xc99282,[x,y,.04],[.17,r,r],.28);}
  tube(g,0xbc936e,tract,.081);oval(g,0xc09573,[-.88,.02,.09],[.27,.16,.17],.66);
  oval(g,0xb17f69,[-.42,-.11,.16],[.24,.15,.17],.65);
  const meal=particle(g,tract,0x9c6a3d,.124),sugars=Array.from({length:4},(_,i)=>particle(g,[[.64,.04,.2],[.82,.05,.24],[.86+.12*i,.14+.035*i,.29]],0xf0bc65,.048));
  return(p:number)=>{meal(phase(p,0,1)*.73);meal.mesh.scale.setScalar(.124-.094*phase(p,.4,.78));sugars.forEach(s=>{s.mesh.visible=p>.54;s(phase(p,.54,1));});};
}
function adaptations(g:T.Group){
  box(g,0xb09a74,[0,-1.15,0],[5.1,.26,1.45]);
  for(let i=0;i<4;i++){const fr=group(g,-1.55,-1,0);fr.rotation.y=i*1.53;fr.rotation.z=(i%2?-.35:.42);
    tube(fr,0x6a8f52,[[0,0,0],[.05,.77,0],[.23,1.51,0]],.034);for(let j=0;j<5;j++)for(const d of [-1,1])leaf(fr,[.04,j*.22+.19,0],.46-j*.054,.072,d*1.14,0x68955a);}
  tube(g,0x8f7554,[[0,-1,0],[0,-.11,0],[.02,.92,0]],.065);
  for(let i=0;i<4;i++)cone(g,0x648665,[0,-.42+i*.33,0],.56-i*.088,.74,10);
  const pinecone=oval(g,0x986f4b,[.39,-.23,.23],[.14,.21,.13]);for(let i=0;i<8;i++)oval(g,0xb59160,[.39+.11*Math.cos(i),-.35+.038*i,.23+.1*Math.sin(i)],[.065,.062,.065]);
  const flower=group(g,1.53,-1,0);tube(flower,0x6b8851,[[0,0,0],[0,.85,0],[-.03,1.66,0]],.051);
  leaf(flower,[0,.56,0],.61,.21,-.99);leaf(flower,[0,.84,0],.54,.18,.94);
  const head=group(flower,0,1.64,0);oval(head,0x8c613d,[0,0,.02],[.22,.22,.12]);for(let j=0;j<11;j++){const a=j*.571;
    oval(head,0xe2b650,[.28*Math.sin(a),.28*Math.cos(a),0],[.09,.18,.055]).rotation.z=-a;}
  const water=particle(g,[[-1.55,-.93,.09],[-1.55,-.34,.09],[-1.39,.33,.08]],0x6fb0c4,.073);
  return(p:number)=>{water(phase(p,0,.38));pinecone.rotation.z=.22*phase(p,.33,.72);head.scale.setScalar(.56+.44*phase(p,.6,1));};
}
export const biodiversityModels:Record<string,Model>={
  'topic:Activity 12.4':g=>microbe(g,'bacterium'),'topic:12.6.2':g=>microbe(g,'amoeba'),
  'topic:Activity 12.5':g=>microbe(g,'ciliate'),'topic:12.6.3':feeding,'topic:12.6.4':chloroplast,
  'topic:Activity 12.6':moss,'topic:Activity 12.7':stem,'topic:Activity 12.8':venation,
  'topic:Activity 12.9':adaptations,'topic:12.6.5':worm,'topic:12.7':finch,'topic:12.9':fossil,'topic:12.10':fragment,
};
