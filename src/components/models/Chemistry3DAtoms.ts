import * as T from 'three';
import {amber,box,clamp,group,metal,mix,move,ring,rod,seq,sphere,type Factory,type Pt} from './Chemistry3DArt';
const proton=0xd96656,neutron=0xa2aec0,electron=0x2986be,tau=Math.PI*2;
function nucleus(root:T.Group,z:number,n:number,r:number){
  const cells:Pt[]=[];
  for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++)for(let k=-3;k<=3;k++)if((i+j+k)%2===0)cells.push([i,j,k]);
  cells.sort((a,b)=>a.reduce((s,v)=>s+v*v,0)-b.reduce((s,v)=>s+v*v,0));
  return seq(z+n,i=>{
    const isP=Math.floor((i+1)*z/(z+n))>Math.floor(i*z/(z+n));
    const pt=cells[i].map(v=>v*r*1.37) as Pt;
    return {pt,o:sphere(root,r,isP?proton:neutron,pt),isP};
  });
}
function count(z:number,n:number,other?:[number,number]):Factory{return root=>{
  const cores=(other?[[z,n],other]:[[z,n]]).map(([a,b],i)=>{
    const g=group(root,[other?(i?1.65:-1.65):0,0,0]);return nucleus(g,a,b,other?.31:.44);
  });return p=>cores.forEach(core=>core.forEach(({o,pt,isP})=>{const offset=1-p;o.position.set(pt[0]+(isP?-1:1)*offset*.53,pt[1]*(1+.5*offset),pt[2]*(1+.5*offset));}));
};}
function shells(z:number,n:number,mode:'build'|'photon'|'oxygen'):Factory{return root=>{
  const g=group(root);g.rotation.x=.88;
  nucleus(g,z,n,.145);
  const radii=[.89,1.65];radii.forEach(r=>ring(g,r,.016,0x96a9b4,[0,0,0]));
  const els=seq(z,()=>sphere(g,.115,electron,[0,0,0]));
  const visitors=mode==='oxygen'?seq(2,()=>{const h=group(g);sphere(h,.16,proton,[0,0,0]);sphere(h,.09,0x50a67b,[-.2,0,0]);return h;}):[];
  const pulse=mode==='photon'?group(root):null;
  if(pulse)seq(15,i=>rod(pulse,[(i-8)*.047,.10*Math.sin(i*.69),0],[(i-7)*.047,.10*Math.sin((i+1)*.69),0],.024,amber));
  return p=>{
    els.forEach((o,i)=>{
      const shell=mode==='photon'?(p>=.34&&p<.7?1:0):i<2?0:1,r=radii[shell],slots=z===8?8:Math.max(1,z-2),angle=(i<2?i*Math.PI:(i-2)*tau/slots)+(mode==='oxygen'?0:.9*p);
      const t=mode==='build'?clamp((p-.15-i*.66/z)*5.9):1;
      o.visible=t>0;o.position.set(mix(2.7,r*Math.cos(angle),t),mix(.62,0,t),mix(-.9,r*Math.sin(angle),t));
    });
    visitors.forEach((o,i)=>{const a=(6+i)*tau/8,r=mix(2.55,1.79,p);o.position.set(r*Math.cos(a),0,r*Math.sin(a));o.rotation.y=-a;});
    if(pulse){pulse.visible=p<.34||p>.7;pulse.position.x=p<.34?mix(-3.1,-.1,p/.34):mix(.3,3.1,(p-.7)/.3);}
  };
};}
export const carbon=shells(6,6,'build');
const thomson=(compare:boolean):Factory=>root=>{
  const diffuse=group(root);sphere(diffuse,1.43,proton,[0,0,0],.29);
  seq(6,i=>{const a=i*2.4,y=(i-2.5)*.33,r=Math.sqrt(1-y*y);sphere(diffuse,.135,electron,[r*Math.cos(a),y,r*Math.sin(a)]);});
  const central=group(root);nucleus(central,6,6,.135);
  const e=seq(6,()=>sphere(central,.12,electron,[0,0,0]));const orbits=group(central);orbits.rotation.x=.85;[.78,1.58].forEach(r=>ring(orbits,r,.018,metal,[0,0,0]));
  return p=>{diffuse.visible=!compare||p<1/3;central.visible=!diffuse.visible;diffuse.rotation.y=p*.58;
    const bohr=p>=2/3;orbits.visible=bohr;e.forEach((o,i)=>{const a=(i<2?i*Math.PI:(i-2)*Math.PI/2)+p,r=bohr?(i<2?.78:1.58):.9+i*.14;
      o.position.set(r*Math.cos(a),-r*Math.sin(a)*Math.sin(.85),r*Math.sin(a)*Math.cos(.85));});};
};
const foil:Factory=root=>{
  box(root,[.045,2.35,1.7],0xe6bb5a,[0,0,0]);const tracks=seq(11,i=>{
    const y=(i-5)*.18,z=(i%3-1)*.32,a:Pt=[-3.3,y,z],b:Pt=[0,y,z],c:Pt=i===5?[-2.4,1.45,1.1]:[3.22,y+(i===7?.79:.025*(i%3)),z];
    rod(root,a,b,.014,amber,.45);rod(root,b,c,.014,amber,.45);return {a,b,c,o:sphere(root,.076,0xf59134,a)};
  });return p=>tracks.forEach(({a,b,c,o})=>p<.5?move(o,a,b,2*p):move(o,b,c,2*p-1));
};
const paraffin:Factory=root=>{
  box(root,[.97,1.51,1.3],0xe6cfa6,[0,0,0]);const a=sphere(root,.146,neutron,[-2.7,0,.38]),b=sphere(root,.146,proton,[.32,0,.38]);
  return p=>{a.position.x=mix(-2.7,.03,clamp(p*2));a.position.y=-.34*clamp(2*p-1);b.position.x=mix(.32,2.8,clamp(2*p-1));b.position.y=.64*clamp(2*p-1);};
};
const crystal:Factory=root=>{
  const chunk=box(root,[1.21,1.27,1.16],0x8abaca,[-1.7,0,0]);chunk.rotation.set(.22,.44,-.11);
  const lattice=group(root,[1.33,0,0]);seq(64,i=>sphere(lattice,.14,i%2?0x82bdb2:0xc3afd2,[(i%4-1.5)*.36,(Math.floor(i/4)%4-1.5)*.36,(Math.floor(i/16)-1.5)*.36]));
  return p=>{lattice.scale.setScalar(.81+.56*p);};
};
export const atomModels:Record<string,Factory>={
  '8.1':crystal,'8.2':thomson(true),'8.2.1':thomson(false),'8.2.2':foil,'8.2.3':shells(1,0,'photon'),'8.3':count(6,6),'8.3.1':paraffin,
  '8.5':count(6,6),'8.7':shells(10,10,'build'),'8.7.1':carbon,'8.8':shells(8,8,'oxygen'),'8.9':count(6,6,[6,7]),'8.9.1':count(6,6,[6,8]),'8.9.2':count(18,22,[20,20]),
};
