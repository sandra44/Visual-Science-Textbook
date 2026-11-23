import * as T from 'three';
import {box,group,lathe,oval,ring,rod,series,span,tube,type Factory,type Point} from './Cells3DShapes';

const rootColor='#f0dcad',green='#74a46a';
function onion(g:T.Group,x:number,cut:boolean){
  const bulb=group(g,x,.45,0);
  lathe(bulb,[0,0,0],[[0,-.44],[.38,-.4],[.64,-.16],[.72,.11],[.63,.43],[.38,.65],[.16,.89],[.095,1.16],[.07,1.23],[0,1.23]],'#d5a361');
  for(let i=0;i<11;i++){
    const a=i*.571;const pt=(r:number,y:number):Point=>[r*Math.cos(a),y,r*Math.sin(a)];
    tube(bulb,[pt(.16,-.43),pt(.55,-.25),pt(.72,.11),pt(.62,.44),pt(.21,.82),pt(.098,1.13)],.016,'#ad824d');
  }
  lathe(bulb,[0,-.42,0],[[0,0],[.31,0],[.32,-.07],[0,-.07]],'#b79b6c');
  const roots=series(10,i=>{const a=i*2.4,r=.2+.06*(i%2),unit=group(bulb,r*Math.cos(a),-.46,r*Math.sin(a));
    tube(unit,[[0,0,0],[.05*Math.cos(a),-.28,.055*Math.sin(a)],[.17*Math.cos(a),-.61,.1*Math.sin(a)],[.26*Math.cos(a),-.83-.06*(i%3),.18*Math.sin(a)]],.025+(i%2)*.008,rootColor);
    if(!cut)oval(unit,[.26*Math.cos(a),-.83-.06*(i%3),.18*Math.sin(a)],[.036,.055,.036],'#bd8d77');
    return unit;
  });
  lathe(g,[x,-1.07,0],[[0,-.83],[.83,-.83],[.94,.92],[.89,.92],[.79,-.77],[0,-.77]],'#abd3df',.21);
  lathe(g,[x,-1.07,0],[[0,-.75],[.78,-.75],[.87,.47],[0,.47]],'#9fcfda',.17);
  return (p:number)=>roots.forEach((r,i)=>r.scale.y=cut?.94:1+p*(.74+.09*(i%3)));
}
function blade(g:T.Group,pos:Point,len:number,w:number,c:string){
  const b=group(g,...pos);
  const leaf=lathe(b,[0,0,0],[[.03,0],[w*.62,len*.17],[w,len*.41],[w*.6,len*.71],[0,len]],c);
  leaf.scale.z=.21;tube(b,[[0,.07,.024],[0,len*.43,w*.21],[0,len*.9,.018]],.013,'#88b77e');return b;
}
export function shoot(g:T.Group){
  const stem=group(g,0,-1.38,0);
  rod(stem,[0,0,0],[0,2.23,0],.13,green,.085);
  const leaves=series(6,i=>{const k=group(stem,0,.4+i*.29,0);k.rotation.y=i*2.37;const b=blade(k,[0,0,0],1.09-i*.065,.24-i*.013,green);b.rotation.z=-.92;return k;});
  const tip=oval(stem,[0,2.25,0],[.13,.2,.12],'#b4c787');
  return (p:number)=>{stem.scale.y=1+.25*p;leaves.forEach((l,i)=>l.scale.setScalar(1+p*.1*i));tip.material.color.setRGB(.65+.15*p,.79,.48);};
}
const growth:Factory=g=>{const stem=group(g,-1.18,0,0);const grow=shoot(stem);
  const tip=group(g,1.42,-1.37,0);lathe(tip,[0,0,0],[[0,0],[.57,0],[.57,1.44],[.47,1.75],[.26,2.07],[0,2.19]],'#97bb79',.24);
  const cells=series(20,i=>{const k=Math.floor(i/4),a=(i%4)*Math.PI*.5;return oval(tip,[.24*Math.cos(a),.26+k*.34,.24*Math.sin(a)],[.19,.19,.18],k>2?'#d2ad72':'#9bb782');});
  return p=>{grow(p);cells.forEach((c,i)=>{const k=Math.floor(i/4);c.scale.y=.16+(4-k)*.032*p;});};
};
const girth:Factory=g=>{
  const stem=group(g,0,-.2,0);stem.rotation.x=.34;
  const bark=lathe(stem,[0,0,0],[[0,-1.1],[1.14,-1.1],[1.14,.8],[0,.8]],'#986c49');
  const wood=lathe(stem,[0,.81,0],[[0,-.015],[1.08,-.015],[1.08,0],[0,0]],'#d7b37c');
  for(let i=0;i<5;i++)ring(stem,[0,.825,0],.14+i*.178,.013,'#a67f52').rotation.x=Math.PI/2;
  const cambium=ring(stem,[0,.834,0],1.07,.035,green);cambium.rotation.x=Math.PI/2;
  const rings=series(4,i=>{const r=ring(stem,[0,.827,0],1.06+i*.15,.016,'#ad8455');r.rotation.x=Math.PI/2;return r;});
  return p=>{for(const m of [bark,wood]){m.scale.x=m.scale.z=1+.54*p;}cambium.scale.set(1+.54*p,1+.54*p,1);rings.forEach((m,i)=>m.visible=p>.1+i*.24);};
};
const grass:Factory=g=>{
  box(g,[0,-1.07,0],[4.7,.54,1.74],'#ac8b68');
  const blades=series(21,i=>{
    const x=(i%7-3)*.56,z=(Math.floor(i/7)-1)*.53;
    const b=group(g,x,-.78,z);b.rotation.z=.3*Math.sin(i*3.5);b.rotation.y=i*.77;
    const cut=lathe(b,[0,0,0],[[.06,0],[.14,.23],[.12,.54],[.091,.93],[0,.93]],i%2?green:'#98b878');cut.scale.z=.27;
    oval(b,[0,.09,0],[.13,.14,.09],'#c6ae72');return cut;
  });return p=>blades.forEach((b,i)=>b.scale.y=1+(1+.5*Math.sin(i))*p);
};
const xylem:Factory=g=>{
  const vessel=group(g);vessel.rotation.z=-.1;
  const partitions=series(3,i=>lathe(vessel,[0,-1.45+i,0],[[0,0],[.67,0],[.67,.04],[0,.04]],'#9aaf77',.66));
  lathe(vessel,[0,0,0],[[.67,-1.48],[.67,1.55],[.61,1.55],[.61,-1.48]],'#b7c999',.3);
  const spiral=tube(vessel,series<Point>(81,i=>[.63*Math.cos(i*.44),-1.45+i*.036,.63*Math.sin(i*.44)]),.071,'#ba9165');
  const drops=series(8,i=>oval(vessel,[Math.sin(i)*.32,0,Math.cos(i)*.32],[.08,.12,.08],'#64b0c5'));
  return p=>{partitions.forEach(m=>m.scale.set(1-span(p,.2,.7),1,1-span(p,.2,.7)));spiral.material.transparent=true;spiral.material.opacity=.12+.88*span(p,0,.55);drops.forEach((d,i)=>{d.visible=p>.49;d.position.y=-1.37+((i*.36+2.9*span(p,.49,1))%2.91);});};
};
export const plantModels:Record<string,Factory>={
  'topic:Activity 2.5':g=>onion(g,0,false),'topic:Activity 3.1':g=>{const a=onion(g,-1.39,false),b=onion(g,1.39,true);return p=>{a(p);b(p);};},
  'topic:3.2':growth,'topic:3.2.2':girth,'topic:3.2.3':grass,'topic:3.2.4':xylem
};
