import {T,type Model,arrow,balance,box,cart,crate,cup,cyl,dark,deck,figure,floorY as y,gold,group,mesh,orb,placeRod,red,ring,rod,sat,steel,tau,teal,tube,wood} from './Physics3DKit';

function ramp(id:string):Model{return r=>{
  deck(r);const inquiry=id==='scientific-inquiry',single=id==='7.6';
  const runs=(single?[1]:[0,1]).map(i=>{
    const z=single?0:i?.88:-.88,L=single?5.5:inquiry?(i?5.5:2.75):(i?2.75:5.5),h=inquiry?L*.42:1.65,x=-L/2;
    const plank=box(r,0,y+h/2,z,Math.hypot(L,h),.12,1.08,wood);plank.rotation.z=Math.atan2(h,L);box(r,L/2-.12,y+h/2-.04,z,.18,h-.08,.84,teal);
    const g=group(r,x,y+.07,z);g.rotation.z=plank.rotation.z;
    const marble=inquiry?orb(g,0,.16,0,.16,.16,.16,gold):null,load=marble?null:cart(g,0,0,0,teal);
    if(id==='Activity 7.3'){const b=balance(g,.63,.34,0);b.g.scale.setScalar(.72);b.read(i?.8:.44);}
    else if(!inquiry)arrow(g,.55,.28,0,0,red).scale.x=i?1.05:.65;
    return (p:number)=>{const q=inquiry?1-sat((p-i*.35)/(i?.47:.33))**2:sat((p-.08)/.82);g.position.set(x+L*q,y+.07+h*q,z);load?.roll(Math.hypot(L,h)*q);};});
  return p=>runs.forEach(f=>f(p));
};}
function pendulum(id:string):Model{return r=>{
  deck(r);const cut=id==='pendulum-projectile',swing=id==='7.4.3',px=cut?-1.05:0,H=1.72,L=cut?1.72:2.45;
  for(const x of [px-.82,px+.82]){rod(r,[x-.27,y,-.55],[x,H,-.45],.063,wood);rod(r,[x+.27,y,.55],[x,H,-.45],.063,wood);}rod(r,[px-.95,H,-.45],[px+.95,H,-.45],.07,wood);rod(r,[px,H,-.45],[px,H,.38],.061,steel);
  const pivot=group(r,px,H,0),rope=rod(pivot,[0,0,0],[0,-L,0],.019,dark),bob=group(r);
  if(swing){rope.position.z=-.28;rod(pivot,[0,0,.28],[0,-L,.28],.019,dark);box(bob,0,0,0,.60,.10,.78,wood);figure(bob,-.08,-.55,0,.79,true);}
  else orb(bob,0,0,0,.18,.18,.18,gold);
  if(id==='Activity 7.2')rod(r,[-2.8,H-L*Math.cos(.79),-.65],[2.8,H-L*Math.cos(.79),-.65],.018,red);
  return p=>{const a=cut?-1.05*Math.cos(sat(3*p)*Math.PI/2):.79*Math.cos(p*tau*(swing?.5:2))*(swing?1:1-.22*p),f=cut?sat((p-1/3)*1.65):0;
    pivot.rotation.z=a;rope.visible=!cut||p<1/3;bob.position.set(px+L*Math.sin(a)+3.6*f,H-L*Math.cos(a)+(y+.18-H+L)*f*f,0);};
};}
function lever(id:string):Model{return r=>{
  deck(r);const pan=id==='Activity 7.5',staple=id==='Activity 7.4',Y=pan?.73:-.59;
  if(pan){rod(r,[-2.95,y,0],[-2.95,1.7,0],.065,steel);rod(r,[-2.95,1.7,0],[0,1.7,0],.065,steel);rod(r,[0,1.7,0],[0,Y,0],.016,dark);}
  const pivot=pan?null:cyl(r,0,Y-.21,0,.15,.15,1.22,staple?gold:wood);if(pivot)pivot.rotation.x=Math.PI/2;
  if(!pan)box(r,0,Y-.41,0,6.6,.09,1.55,wood);
  const rot=group(r,0,Y,0),beam=group(rot);box(beam,0,0,0,5.65,.13,.40,gold);for(let i=0;i<=30;i++)box(beam,-2.72+i*5.44/30,.073,.12,.013,.016,i%5?.09:.22,dark);
  const stapler=group(beam,-1.96,.08,0);if(staple){box(stapler,0,.04,0,.85,.09,.26,dark);box(stapler,-.32,.15,0,.14,.22,.25,steel);box(stapler,0,.24,0,.86,.13,.28,red).rotation.z=-.11;}else if(!pan)crate(stapler,0,0,0).scale.setScalar(.78);
  const erasers=staple?Array.from({length:3},(_,i)=>box(beam,2.1,.16+.16*i,0,.51,.16,.29,0xd991ae)):[];if(!pan&&!staple)arrow(beam,2.1,1.03,0,-Math.PI/2,red);
  const pans=pan?[-1,1].map((s,i)=>{const hang=group(beam,2*s,0,0);const bin=cup(hang,0,-1.13,0,1.1);for(let j=0;j<1+i;j++)cyl(bin,0,.50+.075*j,0,.25,.25,.07,gold);for(const dx of [-.34,.34])rod(hang,[0,0,0],[dx,-.54,0],.012,dark);return hang;}):[];
  return p=>{const off=pan?0:staple?-1.30:-.3-1.05*p;rot.position.x=off;beam.position.x=-off;if(pivot)pivot.position.x=off;
    rot.rotation.z=pan?-.10*(1-p):staple?.09-.18*p:.06*Math.cos(Math.PI*p);erasers.forEach((o,i)=>o.visible=p>=i*.34);
    pans.forEach((o,i)=>{o.position.x=i?2-p:-2;o.rotation.z=-rot.rotation.z;});};
};}
function build(id:string):Model{return r=>{
  deck(r);
  if(id==='7.6.1'){
    rod(r,[-1.35,y,-.3],[-1.35,1.7,-.3],.075,steel);rod(r,[-1.35,1.7,-.3],[0,1.7,-.3],.075,steel);rod(r,[0,1.7,-.3],[0,1.05,-.3],.045,steel);
    const w=ring(r,0,1.10,0,.48,.077,wood);const spokes=group(r,0,1.10,0);for(let i=0;i<4;i++){const a=i*Math.PI/4;rod(spokes,[-.46*Math.cos(a),-.46*Math.sin(a),0],[.46*Math.cos(a),.46*Math.sin(a),0],.041,steel);}rod(r,[0,1.1,-.38],[0,1.1,.13],.068,steel);
    tube(r,Array.from({length:17},(_,i)=>[.53*Math.cos(i*Math.PI/16),1.10+.53*Math.sin(i*Math.PI/16),0]),.026,dark);
    const a=rod(r,[-.53,1.10,0],[-.53,0,0],.025,dark),b=rod(r,[.53,1.10,0],[.53,-.85,0],.025,dark),weight=crate(r,.53,-1.3,0),handle=orb(r,-.53,0,0,.12,.09,.10,red);weight.scale.setScalar(.75);
    return p=>{w.rotation.z=spokes.rotation.z=p*2.8;weight.position.y=-1.32+1.25*p;handle.position.y=.53-1.25*p;placeRod(a,[-.53,1.10,0],[-.53,handle.position.y,0]);placeRod(b,[.53,1.10,0],[.53,weight.position.y+.6,0]);};
  }
  if(id==='Activity 7.1'){
    const runs=[-1.37,1.37].map((x,i)=>{box(r,x,y+.21,0,2,.42,1.55,wood);const bed=mesh(r,new T.PlaneGeometry(1.91,1.47,32,28),0xe8bf79,x,y+.43,0);bed.rotation.x=-Math.PI/2;const pos=bed.geometry.getAttribute('position');const ball=orb(r,x,0,0,.23,.23,.23,steel);
      return (p:number)=>{const k=sat(2*p-i),fall=Math.min(1,k/.82),sink=sat((k-.82)/.18)*(.12+.12*i);ball.position.y=y+.66+(1.15+1.15*i)*(1-fall*fall)-sink;for(let j=0;j<pos.count;j++){pos.setZ(j,-sink*Math.exp(-(pos.getX(j)**2+pos.getY(j)**2)/.07));}pos.needsUpdate=true;bed.geometry.computeVertexNormals();};});return p=>runs.forEach(f=>f(p));
  }
  if(['7.4','7.4.2','7.5'].includes(id)){
    const jobs=(id==='7.5'?[-1.4,1.4]:[0]).map((x,i)=>{const fall=id==='7.4',shelf=id==='7.4.2';
      if(shelf){for(const h of [0,2.35])box(r,x+.68,y+h-.02,0,1.15,.10,.85,wood);box(r,x+1.2,y+1.15,-.33,.12,2.4,.12,wood);}
      const b=fall?orb(r,x,0,0,.23,.23,.23,gold):crate(r,x,0,0);const string=fall?null:rod(r,[x,1.85,0],[x,0,0],.024,steel);
      return (p:number)=>{b.position.y=y+(fall?.23:0)+(fall?1-p*p:id==='7.5'?Math.min(1,(i?1:2)*p):p)*(fall?2.8:2.35);if(string)placeRod(string,[x,1.85,0],[x,b.position.y+.8,0]);};});return p=>jobs.forEach(f=>f(p));
  }
  if(id==='7.3'){
    const battery=cyl(r,-2,y+.62,0,.37,.37,1.24,teal);cyl(battery,0,.69,0,.18,.18,.13,steel);box(r,1.52,y+.17,0,1.15,.34,.85,wood);cyl(r,1.52,y+.61,0,.27,.29,.57,steel);const bulb=orb(r,1.52,y+1.18,0,.49,.57,.49,0xf5db9b,.5);const filament=tube(r,[[1.37,y+.79,0],[1.43,y+1.21,0],[1.52,y+1.10,0],[1.61,y+1.22,0],[1.68,y+.79,0]],.027,gold);
    tube(r,[[-2,y+1.35,0],[-2.04,y+1.4,-.57],[-1.69,y+.13,-.9],[1.5,y+.11,-.81],[1.56,y+.45,-.12]],.038,red);
    tube(r,[[-1.73,y+.1,0],[-1.56,y+.07,.76],[1.57,y+.08,.74],[1.74,y+.43,.15]],.038,dark);
    return p=>{filament.material.emissive.setHex(0xffa422);filament.material.emissiveIntensity=.15+2*p;bulb.material.emissive.setHex(0xf3bb54);bulb.material.emissiveIntensity=.4*p;};
  }
  if(id==='7.1.1'){const person=figure(r,-2.7,y,0),bag=group(person.g,.19,1.01,.26);ring(bag,0,-.02,.02,.11,.025,wood);box(bag,0,-.27,0,.53,.44,.26,red);return p=>{person.g.position.x=-2.7+5.4*p;person.legs.forEach((o,i)=>o.rotation.z=.33*Math.sin(4*tau*p+i*Math.PI));};}
  if(id==='7.4.1'){const cs=[cart(r,-3,y,-.72),cart(r,-3,y,.72,red)];return p=>cs.forEach((c,i)=>{const d=2.75*(i+1)*p;c.g.position.x=-3+d;c.roll(d);});}
  const work=id==='7.1',brake=id==='7.1.2',c=work?null:cart(r,-2.7,y,0),g=c?.g??crate(r,-2.7,y,0),f=arrow(g,.48,.48,0,0,teal);if(work)rod(g,[.41,.41,0],[1.25,.41,0],.018,dark);
  return p=>{const d=5.4*(brake?(p<.5?2*p*p:1-2*(1-p)**2):work?p:p*p);g.position.x=-2.7+d;c?.roll(d);f.rotation.z=brake&&p>.5?Math.PI:0;f.position.x=brake&&p>.5?-.48:.48;};
};}
export const energyModels:Record<string,Model>={'pendulum-projectile':pendulum('pendulum-projectile'),'work-energy':ramp('work-energy'),'scientific-inquiry':ramp('scientific-inquiry')};
for(const id of ['7.1','7.1.1','7.1.2','7.2','7.3','7.4','7.4.1','7.4.2','Activity 7.1','7.4.3','Activity 7.2','7.5','7.6','7.6.1','Activity 7.3','7.6.3','Activity 7.4','Activity 7.5']){
  energyModels[`topic:${id}`]=['Activity 7.3','7.6'].includes(id)?ramp(id):['7.4.3','Activity 7.2'].includes(id)?pendulum(id):['7.6.3','Activity 7.4','Activity 7.5'].includes(id)?lever(id):build(id);
}
