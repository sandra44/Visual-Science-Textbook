import * as T from 'three';
import {box,cone,group,leaf,mesh,oval,particle,path,phase,roots,shoot,tube,type Model,type V} from './LifeEarth3DKit';

const shell=0xe5b7a9,nucleus=0x9a557c,pollen=0xe1a32e;
function division(g:T.Group,bud:boolean){
  const cell=(x:number)=>{const b=group(g,x,0,0);oval(b,shell,[0,0,0],[1.02,.82,.84],.46);
    oval(b,nucleus,[0,.04,.14],[.27,.25,.22]);oval(b,0xe2cdb5,[-.38,-.12,.14],[.22,.27,.18]);return b;};
  const a=cell(-.65),b=cell(.35);
  return(p:number)=>{const k=phase(p,0,.78),s=bud?.04+.69*k:.03+.94*k;b.scale.setScalar(s);
    b.position.set(bud?.28+.43*k+.72*phase(p,.76,1):.05+1.31*k,bud?.33+.25*k:0,.04);
    a.scale.x=bud?1:1+.28*Math.sin(Math.PI*k);a.position.x=-.65-(bud?0:.45*k);};
}
function cutting(g:T.Group,layer:boolean){
  box(g,0x9f7c54,[0,-1.43,-.37],[5.4,.39,1.55]);const base=shoot(g,[-1.45,-1.15,-.3],1.5);
  const x=layer?1.05:1.4;
  if(layer)tube(g,0x718547,[[-1.43,-.34,-.27],[-.83,.33,-.2],[-.1,.03,0],[.48,-.97,.27],[x,-1.15,.45]],.076);
  const newPlant=shoot(g,[x,-1.15,.47],1),r=roots(g,[x,-.92,.5]);r.rotation.x=-.65;
  return(p:number)=>{r.scale.setScalar(.03+.98*phase(p,.06,.7));newPlant.scale.setScalar((layer?.29:.53)+.65*phase(p,.31,1));base.rotation.z=.025*Math.sin(p*3);};
}
function fungus(g:T.Group) {
  const crumb=mesh(g,new T.DodecahedronGeometry(1,1),0xc7a069,[0,-1.16,0]);crumb.scale.set(2.55,.43,1.25);
  const threads=group(g,0,-.8,0),heads=group(g,0,-.78,0);
  for(let i=0;i<10;i++){const a=i*2.4,x=1.65*Math.cos(a),z=.84*Math.sin(a);
    tube(threads,0xece2c7,[[0,0,0],[.46*x,.08,.48*z],[x,-.02,z]],.042);
    tube(threads,0xd8cdae,[[.42*x,.06,.5*z],[.64*x+.24,.09,.77*z],[.83*x+.31,.02,z+.2]],.024);
    if(i%2===0){const h=.91+(i%3)*.26;tube(heads,0xb5ac94,[[x,0,z],[x+.06,h*.5,z],[x+.15,h,z]],.035);
      oval(heads,0x433b37,[x+.15,h,z],[.19,.22,.19]);}}
  const sp=oval(g,0x75604d,[0,-.78,0],[.13,.13,.13]);
  return(p:number)=>{threads.scale.setScalar(.015+.985*phase(p,.05,.69));heads.visible=p>.48;heads.scale.y=.01+.99*phase(p,.48,1);sp.scale.setScalar(.13-.07*p);};
}
function flower(g:T.Group,x:number,s:number){
  const f=group(g,x,-.25,0);f.scale.setScalar(s);
  tube(f,0x577b4e,[[0,-1.45,0],[-.09,-.82,-.04],[0,-.2,0]],.075);
  leaf(f,[-.03,-1.05,0],.69,.2,-.96);
  const petals:T.Group[]=[],sepals:T.Group[]=[];
  for(let j=0;j<5;j++){const a=j*2*Math.PI/5;
    const petal=group(f);petal.rotation.y=a;const l=leaf(petal,[0,-.13,.07],1.22,.54,0,0xdc8592);l.rotation.x=.97;
    petals.push(petal);
    const sepal=group(f);sepal.rotation.y=a+.55;leaf(sepal,[0,-.31,0],.74,.19,0,0x71934e).rotation.x=1.18;sepals.push(sepal);
  }
  oval(f,0x92b668,[0,-.17,0],[.33,.36,.3],.52);
  const ovule=oval(f,0xf4c67b,[.06,-.19,.13],[.13,.17,.11]);
  tube(f,0x98a65c,[[0,.02,0],[.01,.45,0],[0,.86,0]],.067);
  oval(f,0xbdbe68,[0,.9,0],[.18,.08,.17]);
  for(let i=0;i<6;i++){const a=i*Math.PI/3,x=.47*Math.cos(a),z=.47*Math.sin(a);
    tube(f,0xccb681,[[x*.25,-.12,z*.25],[x*.78,.27,z*.78],[x,.53,z]],.027);
    oval(f,pollen,[x,.56,z],[.115,.17,.08]);}return {f,petals,sepals,ovule};
}
function blossom(g:T.Group,kind:'guided'|'parts'|'whorls'|'bee'|'wind'|'seed'){
  const pair=['bee','wind','seed'].includes(kind),s=pair?1.08:1.53;
  const a=flower(g,pair?-1.65:0,s),b=pair?flower(g,1.55,s):a;
  const bee=group(g);oval(bee,0xaf7025,[0,0,0],[.23,.14,.14]);
  oval(bee,0x463c31,[.2,.025,0],[.12,.12,.12]);oval(bee,0x493c30,[-.07,0,0],[.055,.146,.144]);
  for(const z of [-1,1])oval(bee,0xc2dfe1,[0,.13,z*.1],[.18,.04,.12],.7);
  bee.visible=kind==='bee'||kind==='wind';const start:V=[(pair?-1.65:0)+s*.47,-.25+s*.56,0],end:V=[pair?1.55:0,-.25+s*.93,0];
  const track=path([start,[pair?-.45:.73,1.63,.32],[pair?.88:.26,1.55,.21],end]);
  const grain=oval(g,pollen,start,[.094,.094,.094]);
  const route:V[]=[[0,.93,.05],[.024,.47,.074],[.045,.12,.088],[.06,-.18,.14]];
  const tract=tube(b.f,0xb9583a,route,.031),gamete=oval(b.f,0x77446d,route[0],[.066,.066,.066]);
  const tr=path(route),grains=kind==='wind'?Array.from({length:11},(_,j)=>particle(g,[start,[j*.14-1,1.3-.1*(j%4),.3*Math.sin(j)],[j*.24-.4,.5-.16*(j%3),.4*Math.cos(j)]],pollen,.05)):[];
  const n=tract.geometry.index!.count;
  return(p:number)=>{const flight=phase(p,kind==='wind'?.45:0,kind==='guided'?.34:.87);
    track.getPointAt(flight,grain.position);bee.position.copy(grain.position);bee.position.y+=.13;bee.rotation.y=.28*Math.sin(flight*5);
    grain.visible=kind!=='whorls'&&kind!=='parts';grains.forEach(move=>move(phase(p,0,.75)));
    const cutaway=kind==='guided'||kind==='parts';
    tract.visible=kind==='guided'&&p>.32;tract.geometry.setDrawRange(0,Math.floor(n*phase(p,.32,.7)/3)*3);
    gamete.visible=kind==='guided'&&p>.67;tr.getPointAt(phase(p,.67,.94),gamete.position);
    const seed=(kind==='seed'||kind==='guided')?phase(p,.77,1):0;b.ovule.scale.set(.13+.12*seed,.17+.12*seed,.11+.08*seed);
    a.petals.forEach((v,j)=>{v.rotation.x=(kind==='whorls'?1.06*phase(p,.26,.8):cutaway?.82*phase(p,.3,.7):.15)*Math.cos(j*2*Math.PI/5);});
    if(kind==='whorls')a.sepals.forEach((v,j)=>v.rotation.x=.8*phase(p,0,.43)*Math.cos(j*2*Math.PI/5+.55));
  };
}
function animalDevelopment(g:T.Group,mammal:boolean){
  const egg=oval(g,0xe9d0a6,[-1,0,0],mammal?[.63,.85,.61]:[.78,.78,.78],.34),baby=group(g,-1,0,0);
  if(mammal){
    oval(baby,0xe3b863,[0,0,0],[.41,.34,.31]);oval(baby,0xeac475,[.24,.28,0],[.25,.24,.22]);
    cone(baby,0xca9654,[.51,.27,0],.088,.18).rotation.z=-Math.PI/2;oval(baby,0x46453d,[.36,.33,.17],[.035,.035,.026]);
    for(const z of [-.12,.12])tube(baby,0xb49158,[[0,-.24,z],[.03,-.44,z],[.15,-.45,z]],.034);
  }else{
    oval(baby,0x80aaa1,[0,0,0],[.62,.32,.27]);oval(baby,0x363d3b,[.42,.08,.18],[.047,.047,.033]);
    const tail=cone(baby,0x69928c,[-.71,0,0],.28,.48,3);tail.rotation.z=-Math.PI/2;tail.scale.x=.45;
    const fin=cone(baby,0x69928c,[-.12,.28,0],.15,.28,3);fin.scale.z=.32;
  }
  const bunny=(x:number,s:number,cut:boolean)=>{const b=group(g,x,-.18,0);b.scale.setScalar(s);
    oval(b,0xc6af9b,[0,0,0],[.68,.47,.39],cut?.37:1);oval(b,0xc6af9b,[.52,.36,0],[.32,.32,.29]);
    for(const z of [-.15,.15]){oval(b,0xbfaa99,[.49,.76,z],[.097,.33,.081]).rotation.z=.16;oval(b,0xc6af9b,[.28,-.35,z],[.24,.13,.11]);}
    oval(b,0x50453e,[.68,.42,.19],[.041,.041,.034]);oval(b,0xe1d1bc,[-.67,.12,0],[.13,.13,.13]);return b;};
  const kit=mammal?bunny(1.2,.22,false):null;if(kit)bunny(1.28,1.28,true);
  const sperm=mammal?null:group(g);if(sperm){oval(sperm,0xa293ac,[0,0,0],[.11,.07,.075]);tube(sperm,0x9b94a5,[[-.09,0,0],[-.24,.055,0],[-.43,-.055,.03]],.022);}
  const cells=Array.from({length:6},(_,i)=>oval(g,0xd99f89,[-1+.19*Math.cos(i),.18*Math.sin(i),.12*Math.cos(i*2)],[.12,.12,.12]));
  return(p:number)=>{const exit=phase(p,.7,1);baby.scale.setScalar(.16+.88*phase(p,.36,.84));baby.visible=p>.37;
    baby.position.set(-1+exit*(mammal?-.92:1.88),mammal?-.32*exit:.14*Math.sin(exit*4),.03);
    egg.material.opacity=.4-.33*exit;cells.forEach((o,i)=>o.visible=p>.1+i*.035&&p<.49);
    if(kit){kit.scale.setScalar(.18+.25*p);kit.position.set(1.22+.99*exit,-.19-.22*exit,.19);}
    if(sperm){sperm.visible=p<.23;sperm.position.set(-2.53+.89*phase(p,0,.23),.07,.16);}
  };
}
function fertilise(g:T.Group){
  oval(g,0xdfac86,[.84,0,0],[1.15,1.13,1.12],.34);const egg=oval(g,nucleus,[1.1,.07,.18],[.29,.29,.29]);
  const sperm=group(g);oval(sperm,0x877fa4,[0,0,0],[.21,.13,.15]);tube(sperm,0x727a92,[[-.13,0,0],[-.42,.1,0],[-.7,-.08,.1],[-.99,.15,.05]],.033);
  const male=oval(g,0x6875a1,[0,0,0],[.2,.2,.2]);const tail=path([[-2.42,-.54,.26],[-1.58,.29,.34],[-.73,.17,.21],[-.27,.02,.18]]);
  return(p:number)=>{tail.getPointAt(phase(p,0,.63),sperm.position);sperm.visible=p<.66;
    male.visible=p>=.63&&p<.96;male.position.set(-.23+1.27*phase(p,.63,.95),.06,.18);
    egg.material.color.setHex(p>.93?0x826286:nucleus);egg.scale.setScalar(.29+.06*phase(p,.88,1));};
}
function meiosis(g:T.Group,assort:boolean){
  const cells=Array.from({length:4},()=>{const o=group(g);oval(o,0xcaa6b8,[0,0,0],[.76,.69,.69],.24);
    return o;});const chrom=Array.from({length:8},(_,i)=>{const c=group(g);
    tube(c,(i%4<2)?0x6f84aa:0xba6f68,[[0,-.26,0],[.065,0,.03],[0,.25,0]],.065);return c;});
  return(p:number)=>{const split=phase(p,.28,.69),second=assort?0:phase(p,.64,1);
    cells.forEach((o,i)=>{o.visible=i%2===0||second>.02;o.position.set((i<2?-1:1)*1.4*split,(i%2?1:-1)*.68*second,0);o.scale.setScalar(1.2-.24*split);});
    chrom.forEach((o,i)=>{const homolog=i%4<2?-1:1,chromatid=i%2?1:-1;
      o.position.set(homolog*(.25+1.19*split)+(i<4?-.2:.23),chromatid*(.08+.65*second)+(i<4?.17:-.2),.13+chromatid*.09);
      o.rotation.z=chromatid*(.44-.42*second)+(assort&&i>=4?.75*Math.sin(Math.PI*p):0);});};
}
function uterus(g:T.Group,kind:'cycle'|'ovum'|'implant'){
  const u=group(g,0,-.05,0);const wall=oval(u,0xcc817d,[0,0,0],[.91,1.03,.5],.34);
  tube(u,0xcd8981,[[0,-.6,0],[0,-1.03,0],[.04,-1.44,.02]],.21);
  const lining=oval(u,0xb85a65,[0,.08,.06],[.68,.77,.36],.42);
  for(const d of [-1,1]){tube(u,0xd79b88,[[d*.46,.56,0],[d*1.08,.95,0],[d*1.59,.94,.04],[d*1.91,.58,.12]],.12);
    oval(u,0xd8b298,[d*1.78,.32,.08],[.34,.24,.25]);
    for(let i=0;i<4;i++)tube(u,0xca8e84,[[d*1.91,.64,.12],[d*(1.9+.035*i),.49,.08+i*.045],[d*(1.81+i*.08),.42,.11+i*.04]],.025);}
  const embryo=group(u);const blast=oval(embryo,0xf3cb78,[0,0,0],[.104,.104,.104]);
  const lobes=Array.from({length:6},(_,j)=>oval(embryo,0xe8b880,[.08*Math.cos(j),.08*Math.sin(j),.04*Math.cos(j*2)],[.064,.064,.064]));
  const tr=path([[1.8,.47,.13],[1.85,.7,.1],[1.47,.95,.04],[1,.86,.04],[.55,.57,.13],[.39,.24,.25]]);
  const tissue=Array.from({length:9},(_,i)=>oval(u,0xb35966,[(i%3-1)*.08,-.32,0],[.042,.08,.05]));
  return(p:number)=>{const shed=kind==='cycle'?phase(p,.4,1):0;lining.scale.set(.68-.11*shed,.77-.14*shed,.36-.08*shed);
    embryo.visible=kind!=='cycle';tr.getPointAt(phase(p,0,kind==='implant'?.71:1),embryo.position);
    embryo.scale.setScalar(1+(kind==='implant'?1.35*phase(p,.67,1):0));blast.visible=true;
    lobes.forEach((o,j)=>o.visible=kind==='implant'&&p>.22+j*.06);
    wall.material.opacity=.32;tissue.forEach((o,i)=>{const q=phase(p,.36+i*.042,.71+i*.033);
      o.visible=kind==='cycle'&&q>0&&q<1;o.position.y=-.32-1.37*q;o.position.z=.39;});};
}
function malePath(g:T.Group){
  oval(g,0xdba98f,[-.77,-.48,0],[.69,.85,.58],.55);
  for(let j=0;j<6;j++){const y=-.97+j*.18;tube(g,0xb67f71,[[-1.2,y,.22],[-.86,y+.095,.4],[-.54,y,.41],[-.41,y+.12,.25]],.035);}
  const pts:V[]=[[-.76,-.55,.32],[-.51,.02,.33],[-.28,.22,.19],[-.13,-.17,.19],[-.2,-.72,.2],[.07,-.93,.17],[.41,-.3,.12],[.49,.56,.06],[.95,1.24,0],[1.48,1.35,-.05]];
  tube(g,0xcf887c,pts.slice(2),.105);const move=particle(g,pts,0xf8cc64,.105);return(p:number)=>{move(p);};
}
function placenta(g:T.Group){
  oval(g,0xb75861,[-.77,.1,0],[1.29,.95,.47],.49);
  const source:V[]=[[-2.23,-.84,0],[-1.52,-.41,0],[-1.19,.05,.1],[-.82,.36,.18]];
  tube(g,0xb04f51,source,.16);
  const cord:V[]=[[-.71,.29,.31],[-.26,-.03,.47],[.35,-.43,.48],[1,-.29,.2],[1.63,.42,.05]];
  tube(g,0xe2b9ac,cord,.21);const c=path(cord);
  for(const k of [-1,1]){const v:V[]=Array.from({length:21},(_,j)=>{const n=c.getPointAt(j/20);return[n.x,n.y+.13*Math.cos(j*.57)*k,n.z+.14*Math.sin(j*.57)*k];});tube(g,k>0?0x9272a3:0xc56b65,v,.065);}
  for(let i=0;i<7;i++){const a=i*.95;tube(g,0xd49a94,[[-.51,.15,.42],[-.82+.25*Math.cos(a),.27*Math.sin(a),.41],[-.92+.57*Math.cos(a),.48*Math.sin(a),.48]],.06);}
  // Cutaway: show the nutrient tracer even when the vessel wall is in front.
  const track=path([...source,...cord]);
  const tracer=new T.Mesh(new T.SphereGeometry(.125,16,12),new T.MeshBasicMaterial({color:0xffbd26,depthTest:false,depthWrite:false}));
  tracer.renderOrder=5;g.add(tracer);
  return(p:number)=>{track.getPointAt(p,tracer.position);};
}
export const reproductionModels:Record<string,Model>={
  'topic:11.1':g=>division(g,false),'topic:11.1.1':g=>cutting(g,false),'topic:Activity 11.1':g=>cutting(g,true),
  'topic:Activity 11.2':g=>division(g,true),'topic:Activity 11.3':fungus,'topic:11.2':fertilise,
  'topic:Activity 11.4':g=>meiosis(g,true),'topic:11.2.2':g=>blossom(g,'parts'),'topic:Activity 11.5':g=>blossom(g,'whorls'),
  'topic:11.2.3':g=>blossom(g,'bee'),'topic:11.2.4':g=>blossom(g,'wind'),'topic:11.3':g=>animalDevelopment(g,false),
  'topic:11.4':g=>animalDevelopment(g,true),'topic:11.5':g=>uterus(g,'implant'),
  'topic:11.5.2':malePath,'topic:11.5.3':g=>uterus(g,'ovum'),'topic:11.5.4':g=>meiosis(g,false),
  'topic:11.5.5':fertilise,'topic:11.5.6':g=>uterus(g,'cycle'),'topic:11.5.7':placenta,
  'reproduction-life':g=>blossom(g,'guided'),
};
