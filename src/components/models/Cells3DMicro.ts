import * as T from 'three';
import {box,group,oval,ring,rod,series,span,tube,type Factory,type Point} from './Cells3DShapes';

const nucleus='#9876b6', membrane='#77baac', ribosome='#69a6bc', message='#ed9d36', protein='#369b66';
function peel(g:T.Group,x:number,y:number,z:number,w=1.28){
  const c=group(g,x,y,z);
  const wall=box(c,[0,0,0],[w,.48,.64],'#afba70',.4);
  box(c,[0,0,0],[w-.09,.4,.55],'#dfd99b',.34);
  oval(c,[w*.3,.06,.1],[.11,.1,.12],nucleus);return wall;
}
const scope:Factory=g=>{
  const body=group(g,-1.65,-.15,0),frame='#54898e',steel='#435865';
  box(body,[0,-1.36,0],[2.45,.28,1.65],frame);
  tube(body,[[.1,-1.22,-.35],[.79,-.73,-.35],[.98,.4,-.28],[.3,1.05,-.15]],.17,frame);
  box(body,[-.2,-.43,.05],[1.65,.12,1.14],steel);box(body,[-.22,-.34,.08],[1.24,.04,.58],'#b6d8dc',.54);peel(body,-.22,-.29,.08,.16).parent!.scale.setScalar(.25);
  rod(body,[-.23,.16,.05],[.37,1.6,-.19],.16,steel);rod(body,[.29,1.49,-.16],[.43,1.84,-.24],.2,'#243c47');
  oval(body,[.7,.66,.03],[.27,.27,.13],steel);
  const image=group(g,1.66,.02,.1);image.rotation.x=.45;
  const imageCells=group(image,0,0,0);
  for(let i=0;i<9;i++)peel(imageCells,(i%3-1)*.78,0,(Math.floor(i/3)-1)*.53,.78);
  return p=>{imageCells.scale.setScalar(.67+.72*p);};
};
const size:Factory=g=>{
  const slab=group(g,0,0,0);slab.rotation.x=.42;
  box(slab,[0,-.32,0],[6.1,.12,1.94],'#b1d9d8',.42);
  const cells=series(4,i=>peel(slab,(i-1.5)*1.28,0,0));
  rod(slab,[-2.56,.07,.78],[2.56,.07,.78],.035,'#4c7083');
  for(let i=0;i<=4;i++)rod(slab,[-2.56+i*1.28,.05,.65],[-2.56+i*1.28,.05,.92],.026,'#4c7083');
  const pointer=oval(slab,[-2.56,.15,.78],[.09,.09,.09],message);
  return p=>{const count=4*span(p,1/3,2/3);pointer.position.x=-2.56+count*1.28;cells.forEach((c,i)=>c.material.color.set(i<count?'#63a46b':'#afba70'));};
};
function cytoplasm(g:T.Group){
  oval(g,[0,0,0],[3.31,1.49,1.39],membrane,.13);
  for(let i=0;i<4;i++){
    const x=-2.15+i*1.25,y=-.59+.14*(i%2),z=-.35;
    const m=oval(g,[x,y,z],[.31,.15,.2],'#da9a76');m.rotation.z=i*.7;
    tube(g,[[x-.2,y,z+.14],[x-.09,y+.08,z+.15],[x,y-.03,z+.17],[x+.1,y+.07,z+.14]],.025,'#b46d56');
  }
}
const structure:Factory=g=>{
  cytoplasm(g);
  oval(g,[-1.35,.16,.03],[.96,.87,.81],nucleus,.25);
  const dna=(shift:number)=>series<Point>(28,i=>[-2+i*.041,.2+.18*Math.sin(i*.34+shift),.06+.18*Math.cos(i*.34+shift)]);
  tube(g,dna(0),.052,'#8254ae');tube(g,dna(Math.PI),.052,'#8254ae');
  ring(g,[-.52,.13,.19],.16,.04,'#9774a3').rotation.y=1.2;
  const rna=group(g,-1.24,.13,.2);
  const beads=series(9,i=>oval(rna,[i*.07,.04*Math.sin(i*.84),.04*Math.cos(i*.84)],[.065,.065,.065],message));
  oval(g,[1.02,.01,.23],[.35,.23,.29],ribosome);oval(g,[1.05,.34,.22],[.28,.17,.23],'#85c6ce');
  const chain=series(12,i=>oval(g,[1.22+i*.115,.3+.16*Math.sin(i*.51),.28+.15*Math.cos(i*.51)],[.09,.09,.09],protein));
  return p=>{rna.position.x=-1.24+1.98*span(p,1/3,2/3);beads.forEach((b,i)=>b.visible=i<=8*span(p,0,1/3));chain.forEach((c,i)=>c.visible=(i+1)<=12*span(p,2/3,1));};
};
const division:Factory=g=>{
  const shells=[-1,1].map(()=>oval(g,[0,0,0],[1,1,1],'#bfaa79',.17));
  const nuclei=[-1,1].map(()=>oval(g,[0,0,0],[.61,.78,.58],nucleus,.27));
  const chromosomes=series(4,i=>{const side=i%2?1:-1;return tube(g,[[side*.14,-.26,.08],[0,0,0],[side*.14,.26,-.08]],.072,i<2?'#8661a8':'#368ea7');});
  return p=>{
    const align=span(p,.25,.5),split=span(p,.5,.75),pinch=span(p,.75,1);
    shells.forEach((m,i)=>{m.position.x=(i?1:-1)*(2.43-1.08)*pinch;m.scale.set(2.43-1.35*pinch,1.32-.16*pinch,1.12-.17*pinch);m.visible=i===0||pinch>0;});
    nuclei.forEach((n,i)=>{n.position.x=(i?1:-1)*1.32;n.scale.set(.6*pinch,.86*pinch,.58*pinch);n.visible=pinch>.01;});
    chromosomes.forEach((c,i)=>{const side=i%2?1:-1;c.visible=side<0||p>.035;c.scale.setScalar(side<0?1:span(p,0,.24));c.position.set((i<2?-.55:.55)*(1-align)+side*(.08+1.24*split),i<2?.34:-.34,0);});
  };
};
const slides:Factory=g=>{
  const racks=[-1.62,1.62].map(x=>{const a=group(g,x,0,0);box(a,[0,-.2,0],[2.87,.1,2.15],'#99cdce',.41);return a;});
  for(let i=0;i<9;i++){const c=group(racks[0],(i%3-1)*.78,0,(Math.floor(i/3)-1)*.51);c.scale.set(.62,.58,.77);peel(c,0,0,0);}
  for(let i=0;i<5;i++){const a=i*2.4,x=.8*Math.cos(a),z=.6*Math.sin(a);oval(racks[1],[x,-.01,z],[.46,.1,.35],'#d4a1bf',.7);oval(racks[1],[x+.09,.065,z],[.11,.065,.1],nucleus);}
  return p=>{racks[0].rotation.x=.25+.32*(1-p);racks[1].rotation.x=.25+.32*p;};
};
const plans:Factory=g=>{
  oval(g,[-2.32,0,0],[1.02,.47,.48],'#aacfa2',.42);
  tube(g,series<Point>(25,i=>[-2.89+i*.052,Math.sin(i*.71)*.14,.1+.12*Math.cos(i*.71)]),.036,nucleus);
  tube(g,[[-3.28,0,0],[-3.56,.18,-.13],[-3.76,-.08,0],[-4.03,.04,.1]],.035,'#84a682');
  oval(g,[0,0,0],[.97,.76,.72],membrane,.3);oval(g,[0,.04,.07],[.33,.32,.3],nucleus);
  const plant=group(g,2.4,0,0);
  const wall=box(plant,[0,0,0],[1.6,1.45,1.25],'#83ad6e',.24);
  box(plant,[0,0,0],[1.49,1.34,1.14],membrane,.13);
  oval(plant,[-.56,.34,.32],[.17,.15,.16],nucleus);oval(plant,[.08,-.04,.01],[.54,.56,.48],'#a9d8e2',.76);
  for(let i=0;i<5;i++)oval(plant,[.62*Math.cos(i*1.55),.44*Math.sin(i*1.55),-.46],[.17,.08,.12],protein);
  return p=>{wall.material.opacity=.16+.3*span(p,.45,1);plant.rotation.y=-.28+.32*p;};
};
const diffusion:Factory=g=>{
  for(let i=0;i<30;i++)for(const s of [-1,1]){
    const x=(i%10-4.5)*.43,z=(Math.floor(i/10)-1)*.46;
    oval(g,[x,s*.39,z],[.2,.18,.2],'#d8a967');
    for(const d of [-1,1])tube(g,[[x+d*.065,s*.29,z],[x+d*.11,s*.16,z-.035],[x+d*.085,s*.045,z+.03]],.043,'#e7c68f');
  }
  const pair=group(g);oval(pair,[0,0,0],[.16,.16,.16],'#d66f65');oval(pair,[.19,.03,0],[.16,.16,.16],'#d66f65');
  const ion=oval(g,[1.16,1.1,.17],[.19,.19,.19],ribosome);return p=>{pair.position.set(-.52+.17*Math.sin(6*p),1.68-3.35*p,.12);ion.position.y=1.13-.42*Math.sin(Math.PI*p);};
};
const secretion:Factory=g=>{
  cytoplasm(g);oval(g,[-1.95,.1,0],[.68,.75,.68],nucleus,.75);
  for(let i=0;i<4;i++){
    const pts:Point[]=[[-1.86,-.68+i*.13,.25],[-1.29,-.32+i*.14,.53],[-1.13,.41+i*.14,.26],[-1.65,.67+i*.1,-.04]];
    tube(g,pts,.085,'#aa83af');for(let j=0;j<3;j++)oval(g,[-1.22-.04*j,-.12+i*.12+j*.1,.53],[.046,.046,.046],'#685175');
    const q=oval(g,[.48+i*.05,.05+i*.16,0],[.65-i*.05,.09,.34],'#daa16b');q.rotation.z=.12;
  }
  const v=group(g);const ves=oval(v,[0,0,0],[.27,.25,.25],membrane,.42);oval(v,[0,0,.03],[.13,.11,.1],protein);
  return p=>{v.position.set(-.96+4.4*p,.44+.23*Math.sin(p*6.28),.48-.36*p);ves.material.opacity=.42*(1-span(p,.9,1));};
};
const digestion:Factory=g=>{
  cytoplasm(g);oval(g,[-1.9,.12,0],[.7,.69,.6],nucleus,.7);oval(g,[.35,.16,0],[.9,.84,.82],'#b78caf',.25);
  const food=oval(g,[.35,.16,0],[.41,.41,.41],message);const crumbs=series(9,()=>oval(g,[0,0,0],[.08,.09,.08],message));
  for(let i=0;i<6;i++)oval(g,[.35+.64*Math.cos(i),.16+.56*Math.sin(i),-.13],[.12,.1,.14],'#935c86');
  return p=>{food.scale.setScalar(.41*(1-span(p,.12,.66)));crumbs.forEach((c,i)=>{const d=span(p,.48,1);c.visible=p>.2;c.position.set(.35+.31*Math.cos(i*2.4)+d*(1.1+i*.07),.16+(.23+d*.27)*Math.sin(i*2.4),.25*Math.cos(i));});};
};
const tissue:Factory=g=>{
  const colony=group(g);
  const cells=series(8,i=>{
    const c=group(colony);oval(c,[0,0,0],[.6,.46,.61],'#dcaaaf',.58);oval(c,[.03,.09,.15],[.17,.15,.16],nucleus);
    return {c,x:(i%4-1.5)*1.13,z:(Math.floor(i/4)-.5)*1.07};
  });
  return p=>{colony.rotation.x=.22+.19*p;cells.forEach(({c,x,z},i)=>{
    const first=span(p,.06,.33),second=span(p,.35,.67),third=span(p,.67,.97);
    c.position.set(Math.sign(x)*.57*first+(i%4-1.5-Math.sign(x)*.5)*1.13*second,0,z*third);
    c.visible=(i%2===0||second>.01)&&(i%4<2||first>.01)&&(i<4||third>.01);
  });};
};
export const microModels:Record<string,Factory>={
  'cell-size':size,'cell-structure':structure,'cell-explorer':division,'topic:2.1':scope,
  'topic:Activity 2.3':slides,'topic:Activity 2.4':plans,'topic:2.2.1':diffusion,'topic:2.3':secretion,
  'topic:2.3.1':digestion,'topic:2.4':division,'topic:2.5':tissue,
};
