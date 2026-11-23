import * as T from 'three';
import {amber,aqua,beaker,box,clamp,cylinder,glass,group,lathe,liquid,mesh,metal,mix,move,ring,rod,scatter,seq,sphere,type Factory,type Pt} from './Chemistry3DArt';

function samples(types:string[]):Factory{return root=>{
  const update=types.map((type,i)=>{
    const b=beaker(root,[(i-(types.length-1)/2)*2.24,-1.3,0],.91,2.42),milk=type==='milk',clear=type==='salt';
    liquid(b,.88,1.64,milk?0xd1dcd0:clear?aqua:0xd7ba8e,milk?.46:.27)(1);
    const grains=seq(clear?0:42,j=>{const xyz=scatter(j,.78,1.43);return {xyz,o:sphere(b,milk?.036:.065,milk?0x9fb7ad:0x86694d,xyz)};});
    const beam=clear?null:rod(b,[-.88,.9,0],[.88,.9,0],.034,amber,.8);
    return (p:number)=>{if(beam)beam.material.opacity=milk?.55+.22*p:.75*(1-p);grains.forEach(({xyz,o},j)=>{o.position.y=milk?xyz[1]+.027*Math.sin(p*6+j):mix(xyz[1],.12+.026*(j%3),p);});};
  });return p=>update.forEach(f=>f(p));
};}
function solute(mode:'dissolve'|'saturate'|'concentrate'|'grow'|'blue'):Factory{return root=>{
  const b=beaker(root,[0,-1.45,0],1.4,2.9),grow=mode==='grow'||mode==='blue',level=liquid(b,1.36,2.17,grow?0x48b6de:aqua);
  const grains=seq(64,i=>{
    const pos:Pt=[((i%4)-1.5)*.225,.18+Math.floor(i/16)*.225,(Math.floor(i/4)%4-1.5)*.225],dest=scatter(i,1.18,1.94);
    const o=grow?mesh(b,new T.OctahedronGeometry(.145),0x1783be,pos):box(b,[.16,.16,.16],i%2?0xaba2cb:0x83b495,pos);
    return {pos,dest,o};
  });return p=>{const h=mode==='concentrate'?1-.5*p:1;level(h);grains.forEach(({o,pos,dest},i)=>{
    const d=mode==='concentrate'?1:mode==='saturate'&&i<16?0:clamp(p*1.65-(63-i)*.009);
    move(o,pos,dest,grow?1-d:d);o.position.y*=h;
  });};
};}
const chromatography:Factory=root=>{
  const b=beaker(root,[0,-1.52,0],1.27,2.95);liquid(b,1.22,.39)(1);
  rod(b,[-1.42,3.01,0],[1.42,3.01,0],.072,0xa17d54);box(b,[1.09,2.85,.055],0xfcf2d2,[0,1.59,0]);
  const wet=box(b,[1.08,1,.067],0xc6e4de,[0,0,0]);
  const bands=seq(3,i=>{const s=sphere(b,.2,[0xe4aa29,0xe65878,0x6651a4][i],[0,.5,.044+i*.009]);s.scale.set(1.7,.39,.11);return s;});
  return p=>{wet.scale.y=.22+2.27*p;wet.position.y=.17+wet.scale.y/2;bands.forEach((o,i)=>o.position.y=.51+p*(.46+.68*i));};
};
const funnel:Factory=root=>{
  const at:Pt=[0,0,0];
  lathe(root,[[.08,-.79],[.08,-.49],[.2,-.4],[.74,.34],[.83,.64],[.79,.96],[.61,1.19],[.23,1.37],[.23,1.64]],glass,at,.23);
  cylinder(root,.26,.21,.21,0xad9173,[0,1.65,0]);rod(root,[-.27,-.6,0],[.34,-.6,0],.077,metal);
  const handle=box(root,[.08,.27,.1],amber,[.31,-.6,0]);
  rod(root,[-1.48,-1.75,-.4],[-1.48,1.34,-.4],.045,metal);rod(root,[-1.48,.41,-.4],[0,.41,-.4],.041,metal);ring(root,.79,.034,metal,[0,.4,0]);box(root,[1.1,.14,1.1],metal,[-1.48,-1.78,-.4]);
  // Nested layers shrink through the conical lower bulb. Invert cone volume to keep oil volume fixed.
  const cone=(height:number)=>.18+.74*height;
  const volume=(h:number)=>(cone(h)**3-.18**3)/(.74*3);
  const height=(v:number)=>(Math.cbrt(v*.74*3+.18**3)-.18)/.74;
  const initial=.76,oilVol=volume(1.24)-volume(initial);
  // Only the immersed cone slices change, so rebuild vertex positions rather than geometry.
  function layer(color:number){
    const m=cylinder(root,1,1,1,color,at,.54),base=m.geometry.getAttribute('position').clone(),pos=m.geometry.getAttribute('position');
    return (lo:number,hi:number)=>{for(let i=0;i<pos.count;i++){const h=base.getY(i)>0?hi:lo,r=Math.min(.78,cone(h));pos.setXYZ(i,base.getX(i)*r,h-.4,base.getZ(i)*r);}pos.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingSphere();};
  }
  const low=layer(aqua),high=layer(amber),collect=liquid(beaker(root,[0,-1.83,0],.52,.83),.49,.54),stream=cylinder(root,.024,.024,.7,aqua,[0,-1.12,0],.7);
  return p=>{const v=volume(initial)*(1-.985*p),boundary=height(v);low(0,boundary);high(boundary,height(v+oilVol));collect(p);stream.visible=p>.01&&p<.995;handle.rotation.x=p>.01&&p<.995?Math.PI/2:0;};
};
const distillation:Factory=root=>{
  const x=-1.65;
  lathe(root,[[0,-1.07],[.46,-1.04],[.7,-.75],[.77,-.42],[.66,-.02],[.21,.36],[.2,1.21]],glass,[x,0,0],.24);
  lathe(root,[[0,-1.01],[.42,-.98],[.65,-.75],[.72,-.49],[0,-.49]],aqua,[x,0,0],.64);
  cylinder(root,.79,.85,.29,metal,[x,-1.24,0]);cylinder(root,.22,.22,.16,0x997b5d,[x,1.22,0]);
  rod(root,[x,1.03,0],[2.02,-.08,0],.092,glass,.48);rod(root,[-1, .84,0],[1.59,.05,0],.245,glass,.34);
  rod(root,[-.89,.84,0],[-.89,1.13,-.3],.088,glass,.55);rod(root,[1.43,.08,0],[1.43,-.18,.32],.088,glass,.55);
  rod(root,[2.02,-.08,0],[2.02,-.36,0],.091,glass,.48);
  const b=beaker(root,[2.02,-1.47,0],.62,1.06),fill=liquid(b,.6,.73);
  const drop=sphere(root,.075,aqua,[2.02,0,0]);return p=>{fill(p);drop.visible=p>.08&&p<1;drop.position.y=-.36-(p*9%1)*(.99-.69*p);};
};
const filter:Factory=root=>{
  const b=beaker(root,[0,-1.63,0],.83,1.22),fill=liquid(b,.8,.88);
  lathe(root,[[.08,-.49],[.08,-.04],[1.02,1.16]],glass,[0,0,0],.32);
  lathe(root,[[.045,.06],[.94,1.16]],0xe3cfaa,[0,0,0],.86);
  const sand=seq(46,i=>{const a=i*2.4,r=.52*Math.sqrt((i+.5)/46);return sphere(root,.06,0xa48253,[r*Math.cos(a),.23+r*1.16,r*Math.sin(a)]);});
  const drop=sphere(root,.055,aqua,[0,0,0]);return p=>{fill(p);drop.visible=p>.01&&p<.99;drop.position.y=-.5-(p*11%1)*(.98-.8*p);sand.forEach((o,i)=>o.position.y=.24+Math.hypot(o.position.x,o.position.z)*1.16+.12*(1-p)*Math.sin(i)**2);};
};
const saltPan:Factory=root=>{
  box(root,[5.9,.24,2.9],0xb69569,[0,-.65,0]);for(const z of [-1.42,1.42])box(root,[5.96,.42,.17],0xc5a47a,[0,-.49,z]);for(const x of [-2.91,2.91])box(root,[.17,.42,2.86],0xc5a47a,[x,-.49,0]);
  const brine=box(root,[5.65,.18,2.66],aqua,[0,-.43,0]);const crystals=seq(74,i=>{const o=box(root,[.18,.16,.16],0xf4efde,[(i*37%73)/73*5.3-2.65,-.46,(i*29%71)/71*2.4-1.2]);o.rotation.y=i*.84;return o;});
  return p=>{brine.scale.y=1-.99*p;brine.position.y=-.53+.09*brine.scale.y;crystals.forEach((o,i)=>o.scale.setScalar(clamp(p*1.7-i/110)));};
};
const sublimation=(sand:boolean):Factory=>root=>{
  lathe(root,[[0,-1.21],[.76,-1.21],[1.23,-.95]],0x8c9da8,[0,0,0]);lathe(root,[[1.24,-.88],[.16,1.14],[.15,1.56]],glass,[0,0,0],.21);
  if(sand)seq(44,i=>{const [x,,z]=scatter(i,.82,0);sphere(root,.063,0xad8959,[x,-1.1,z]);});
  const parts=seq(34,i=>{const [x,,z]=scatter(i,.77,0),a=i*2.4,h=(i*29%31)/31*.86,r=.65-.53*h;
    const start:Pt=[x,-1.07,z],end:Pt=[r*Math.cos(a),.06+h,r*Math.sin(a)];
    return {start,end,o:mesh(root,new T.OctahedronGeometry(.10),0xe1ebe9,start)};
  });return p=>parts.forEach(({o,start,end},i)=>{const t=clamp(p*1.66-i*.019);move(o,start,end,t);o.scale.setScalar(t>0&&t<1?.33:1);});
};
const centrifuge:Factory=root=>{
  cylinder(root,.46,.7,.56,metal,[0,-.64,0]);const rotor=group(root);cylinder(rotor,1.85,1.85,.13,0xc6a77d,[0,-.17,0]);
  cylinder(rotor,.18,.18,.37,metal,[0,.01,0]);
  const channels=seq(2,j=>{const g=group(rotor);g.rotation.y=j*Math.PI;
    rod(g,[.49,.12,0],[1.72,.12,0],.155,glass,.3);rod(g,[.56,.12,0],[1.68,.12,0],.13,aqua,.4);
    return seq(22,i=>sphere(g,.04,0x935b43,[.57+(i*13%23)/23,.12+.05*Math.cos(i),.055*Math.sin(i)]));});
  return p=>{rotor.rotation.y=8*p;channels.forEach(ch=>ch.forEach((o,i)=>o.position.x=mix(.57+(i*13%23)/23,1.62+.021*(i%3),p)));};
};
export const mixtureModels:Record<string,Factory>={
  '5.1':samples(['salt','mud']), 'Activity 5.1':samples(['salt','mud','milk']), '5.2':solute('dissolve'), '5.2.1':solute('concentrate'), '5.2.3':solute('saturate'),
  '5.3':chromatography,'5.3.1':solute('grow'),'Activity 5.3':solute('blue'),'Activity 5.4':saltPan,'Activity 5.5':chromatography,'5.3.2':distillation,'5.3.3':chromatography,
  '5.4':filter,'5.4.1':funnel,'Activity 5.6':funnel,'5.4.2':sublimation(false),'Activity 5.7':sublimation(true),'5.4.3':samples(['mud']),'Activity 5.8':centrifuge,
  '5.4.4':samples(['milk']),'Activity 5.9':samples(['mud','milk']),'5.5':samples(['salt','milk']),
};
export {chromatography};
