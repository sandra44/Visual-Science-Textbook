import {T,type Model,type P,aqua,box,cyl,dark,deck,floorY as y,gold,group,mesh,orb,placeRod,red,ring,rod,sat,skin,steel,tau,teal,tube,wood} from './Physics3DKit';

function speaker(r:T.Object3D,x:number,h:number,z:number){
  const g=group(r,x,h,z);box(g,-.23,0,0,.46,1.36,1.02,dark);const cone=cyl(g,.08,0,0,.51,.20,.22,steel);cone.rotation.z=-Math.PI/2;
  const rim=ring(g,.21,0,0,.52,.055,dark);rim.rotation.y=Math.PI/2;orb(g,.22,0,0,.1,.14,.14,teal);return (p:number)=>{cone.position.x=.08+.06*Math.sin(tau*p*4);};
}
function ear(r:T.Object3D,x:number,h:number,z:number){
  const g=group(r,x,h,z);orb(g,0,0,0,.31,.47,.18,skin);
  tube(g,[[-.21,-.11,.12],[-.25,.12,.12],[-.10,.36,.13],[.13,.33,.14],[.22,.12,.13],[.09,-.16,.16],[0,-.33,.13]],.047,0xab7359);
  orb(g,-.06,-.06,.165,.085,.108,.026,0x855d50);return g;
}
function fork(r:T.Object3D,x:number,h:number,z:number){
  const g=group(r,x,h,z);rod(g,[0,-.81,0],[0,-.12,0],.075,steel);tube(g,[[-.22,.22,0],[-.21,0,0],[0,-.14,0],[.21,0,0],[.22,.22,0]],.072,steel);
  const prongs=[-.22,.22].map(a=>{const g2=group(g,a,.19,0);rod(g2,[0,0,0],[0,.95,0],.065,steel);return g2;});return {g,vibrate:(p:number)=>prongs.forEach((v,i)=>v.rotation.z=(i?1:-1)*.083*Math.sin(tau*p*5))};
}
function water(r:T.Object3D,x:number,z:number){
  cyl(r,x,y+.59,z,1.15,.97,1.18,0x8ca8ab,true,.27);cyl(r,x,y+.54,z,1.1,.95,1.00,aqua,false,.25);cyl(r,x,y+.04,z,.98,.98,.08,steel);
  ring(r,x,y+1.18,z,1.15,.038,steel).rotation.x=Math.PI/2;
  const rings=[0,1,2].map(()=>{const o=ring(r,x,y+1.054,z,1,.012,aqua);o.rotation.x=Math.PI/2;return o;});return (p:number)=>rings.forEach((v,i)=>{const q=(p*2+i/3)%1;v.scale.setScalar(.07+.91*q);v.visible=q<.92;});
}
function airLesson(id:string):Model{return r=>{
  const receiver=id==='10.4',mark=id==='sound-waves'||id==='10.2',drive=speaker(r,-3.2,0,0);
  const dims=[26,4,3],N=dims.reduce((a,b)=>a*b),particles=new T.InstancedMesh(new T.SphereGeometry(.046,10,8),new T.MeshStandardMaterial({color:0xffffff}),N);
  r.add(particles);const obj=new T.Object3D(),col=new T.Color();for(let i=0;i<N;i++){particles.setColorAt(i,col.setHex(mark&&Math.floor(i/12)===12?red:aqua));}
  if(mark){rod(r,[-2.7+12*.206,-.58,-.47],[-2.7+12*.206,-.58,.47],.022,red);if(id==='10.2')ear(r,3.1,0,0);}
  const membrane=receiver?cyl(r,3.10,0,0,.66,.66,.045,red):null;if(membrane){membrane.rotation.z=Math.PI/2;ring(r,3.10,0,0,.68,.052,dark).rotation.y=Math.PI/2;}
  return p=>{drive(p);for(let i=0;i<N;i++){const ix=Math.floor(i/12),j=i%12;obj.position.set(-2.7+ix*.206+.14*Math.sin(ix*.78-tau*4*p),-.36+(j%4)*.24,-.31+Math.floor(j/4)*.31);obj.updateMatrix();particles.setMatrixAt(i,obj.matrix);}particles.instanceMatrix.needsUpdate=true;if(membrane)membrane.position.x=3.10+.055*Math.sin(25*.78-tau*4*p);};
};}
function experiment(id:string):Model{return r=>{
  deck(r);
  if(id==='Activity 10.1'){
    const X=2.17,Z=.81,h=.83;for(const x of [-X,X])box(r,x,y+h/2,0,.11,h,1.7,wood);for(const z of [-Z,Z])box(r,0,y+h/2,z,4.45,h,.10,wood);box(r,0,y+.04,0,4.3,.08,1.6,0x8e6645);
    const a=rod(r,[-X,y+h,0],[0,0,0],.034,gold),b=rod(r,[0,0,0],[X,y+h,0],.034,gold);
    return p=>{const m:P=[0,y+h+.70*Math.exp(-3*p)*Math.cos(tau*p*6)*(1-p),0];placeRod(a,[-X,y+h,0],m);placeRod(b,m,[X,y+h,0]);};
  }
  if(id==='10.1.1'||id==='Activity 10.2'){
    const wet=id==='Activity 10.2',f=fork(r,wet?.08:0,wet?.68:-.1,0);if(wet)f.g.rotation.z=2.81;const waves=wet?water(r,.05,0):null;
    if(!wet)box(r,-1.53,y+.21,0,1.14,.42,.83,0x685954);return p=>{f.vibrate(p);waves?.(p);};
  }
  if(id==='Activity 10.3'){
    box(r,0,-.23,0,5.0,.22,1.46,wood);for(const x of [-2.18,2.18])for(const z of [-.56,.56])box(r,x,-.88,z,.16,1.11,.16,wood);
    const hand=group(r,-1.75,.2,0);orb(hand,0,.14,0,.28,.20,.23,skin);for(let i=0;i<4;i++)orb(hand,.14,.007,-.15+i*.1,.14,.11,.065,skin);
    rod(hand,[-.68,.61,0],[-.15,.25,0],.13,teal);const listener=ear(r,1.85,.11,0);listener.rotation.z=1;const pulse=box(r,-1.5,-.214,.738,.061,.20,.015,teal);
    return p=>{hand.position.y=.07+.3*Math.abs(Math.cos(tau*p*2));pulse.position.x=-1.6+3.45*((2*p+.75)%1);};
  }
  if(id==='Activity 10.4'){
    const waves=water(r,0,0),spoons=[-1,1].map(s=>{const g=group(r);orb(g,0,0,0,.14,.22,.065,steel);rod(g,[0,.16,0],[0,.99,0],.041,steel);orb(g,0,1,0,.076,.15,.032,steel);g.rotation.z=-s*.32;return g;});
    return p=>{const k=sat((p-.38)/.19);spoons.forEach((g,i)=>g.position.set((i?1:-1)*(.135+.13*Math.abs(Math.cos(tau*p*4))),.46-1.18*k,0));waves(p<.53?0:p);};
  }
  if(id==='10.2.1'){
    cyl(r,0,y+.16,0,1.26,1.33,.32,dark);cyl(r,0,-.23,0,1.13,1.13,1.82,0xb0dcdf,true,.14);mesh(r,new T.SphereGeometry(1.13,32,16,0,tau,0,Math.PI/2),0xb0dcdf,0,.68,0,.14);
    const f=fork(r,0,-.37,0);tube(r,[[1.15,y+.17,0],[1.65,y+.17,0],[1.9,y+.68,0],[2.35,y+.68,0]],.072,dark);cyl(r,2.55,y+.51,0,.28,.28,.97,steel);const dots=Array.from({length:32},(_,i)=>{const a=i*2.4;return orb(r,.87*Math.sin(a),-.93+1.97*(i%9)/9,.87*Math.cos(a),.038,.038,.038,aqua);});
    return p=>{f.vibrate(p);dots.forEach((o,i)=>o.visible=((i*17)%32)/32>=p);};
  }
  if(id==='Activity 10.5'){
    const turns=38,steps=turns*14,rad=.42;const pcs=[0,19,20,turns].slice(1).map((end,i)=>{const start=[0,19,20][i],pts:P[]=Array.from({length:(end-start)*14+1},(_,j)=>{const k=start*14+j,a=k*tau/14;return [-3.2+6.4*k/steps,rad*Math.sin(a),rad*Math.cos(a)];});const o=tube(r,pts,.030,i===1?red:steel);o.position.y=y+rad+.03;const geom=o.geometry,attr=geom.getAttribute('position'),base=attr.clone();return (p:number)=>{for(let j=0;j<attr.count;j++){const x=base.getX(j);attr.setX(j,x+.21*Math.exp(-((x+3.3-6.9*p)**2)/.19));}attr.needsUpdate=true;};});return p=>pcs.forEach(f=>f(p));
  }
  if(id==='Activity 10.6'){
    cyl(r,1,y+.56,0,1.0,.67,1.12,wood);const membrane=cyl(r,1,y+1.13,0,1.02,1.02,.04,0xe1d6b2);ring(r,1,y+1.11,0,1.02,.042,red).rotation.x=Math.PI/2;
    const grains=Array.from({length:17},(_,i)=>{const a=i*2.4,R=.8*Math.sqrt(i/17);return orb(r,1+R*Math.cos(a),0,R*Math.sin(a),.065,.026,.036,gold);});
    const plate=cyl(r,-1.64,-.14,0,.73,.73,.07,steel);plate.rotation.z=Math.PI/2;const beater=group(r,-2.5,.08,0);rod(beater,[-.44,.52,0],[.48,-.16,0],.046,wood);orb(beater,.48,-.16,0,.11,.11,.11,dark);
    return p=>{const s=Math.sin(tau*4*p);beater.position.x=-2.4+.20*s;plate.rotation.z=Math.PI/2+.035*s;membrane.position.y=y+1.13+.024*s;grains.forEach((o,i)=>o.position.y=membrane.position.y+.047+(.12+.12*(i%3))*Math.abs(Math.sin(tau*4*p+i*.18)));};
  }
  const pinna=ear(r,-2.4,0,0);pinna.scale.setScalar(1.7);rod(r,[-2.26,-.06,0],[-1.23,-.06,0],.20,0xd59980);const drum=cyl(r,-1.2,-.06,0,.28,.28,.07,red);drum.rotation.z=1.28;
  const bones=group(r,-1.12,.04,0);tube(bones,[[0,0,0],[.20,.27,0],[.52,-.02,.04],[.77,.15,0],[1,-.05,0]],.059,0xdabf94);
  const pts:P[]=Array.from({length:61},(_,i)=>{const a=i*.22,R=.56*(1-i/68);return [.49+R*Math.cos(a),.05+R*Math.sin(a),i*.005];});tube(r,pts,.093,0xbe7780);tube(r,[[.95,.05,0],[1.48,.18,0],[2.61,.03,.22]],.105,gold);const impulse=orb(r,.95,.08,0,.12,.12,.12,red);
  return p=>{const s=Math.sin(tau*p*4);drum.position.x=-1.2+.043*s;bones.rotation.z=.06*s;impulse.position.set(.95+1.65*p,.11+.055*Math.sin(Math.PI*p),.22*p);};
};}
function echo(id:string):Model{return r=>{
  deck(r);const bat=id==='10.8.1',hall=id==='10.7.2',one=id==='10.6.3',drive=bat?null:speaker(r,-2.98,-.05,0);
  const wings:T.Group[]=[];
  if(bat){const body=group(r,-2.8,.04,0);orb(body,0,0,0,.25,.22,.30,dark);orb(body,.18,.13,0,.17,.17,.17,dark);for(const s of [-1,1]){cyl(body,.16,.31,s*.09,0,.068,.18,dark);const wing=group(body,0,0,0);wings.push(wing);
      const sh=new T.Shape();sh.moveTo(-.17,0);sh.quadraticCurveTo(-.5,.69,-.39,1.18);sh.quadraticCurveTo(-.14,.94,.04,.92);sh.quadraticCurveTo(-.09,.65,.19,.54);sh.quadraticCurveTo(.11,.35,.24,.12);sh.closePath();const m=mesh(wing,new T.ExtrudeGeometry(sh,{depth:.043,bevelEnabled:false}),dark,0,0,0);m.rotation.x=s*Math.PI/2;}
    const moth=group(r,2.84,0,0);orb(moth,0,0,0,.13,.08,.08,wood);for(const s of [-1,1])orb(moth,0,.07,s*.16,.13,.04,.20,gold).rotation.x=-s*.35;
  }else if(hall){box(r,0,.20,-1.27,7.21,3.28,.11,wood);for(const x of [-3.6,3.6])box(r,x,.20,-.23,.10,3.28,2.17,wood);box(r,0,1.84,-.83,7.22,.13,1,wood);ear(r,2.77,-.05,0);}
  else if(one){const mic=orb(r,2.98,-.05,0,.23,.31,.23,steel);rod(r,[2.98,y,0],[2.98,-.28,0],.07,dark);for(let i=0;i<4;i++)ring(mic,0,-.37+i*.21,0,.92,.022,dark).rotation.x=Math.PI/2;}
  else{for(let row=0;row<5;row++)for(let i=0;i<4;i++)box(r,3.03,y+.24+.48*row,-.94+.61*i+(row%2)*.10,.24,.46,.58,row%2?wood:0xb9825e);}
  type Pt=[number,number,number];const A:Pt=[-2.65,0,0],B:Pt=[2.82,0,0];const paths:Pt[][]=hall?[[A,[0,1.77,-.6],B],[A,[.2,y+.03,.09],B],[A,[-2.8,.21,-1.20],B]]:[one?[A,B]:[A,B,A]];
  const signals=paths.map((pts,i)=>{const points=pts.map(pt=>new T.Vector3(...pt)),lengths=points.slice(1).map((v,j)=>v.distanceTo(points[j])),distance=lengths.reduce((a,b)=>a+b,0);const wave=ring(r,0,0,0,.27,.029,i?gold:aqua);wave.rotation.y=Math.PI/2;return (p:number)=>{let d=Math.min(distance,p*(hall?7.8:distance)),k=0;while(k<lengths.length-1&&d>lengths[k])d-=lengths[k++];wave.position.lerpVectors(points[k],points[k+1],d/lengths[k]);wave.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),points[k+1].clone().sub(points[k]).normalize());wave.material.color.setHex(!hall&&!one&&k===1?red:i?gold:aqua);};});
  return p=>{drive?.(p);signals.forEach(f=>f(p));wings.forEach((w,i)=>w.rotation.x=(i?1:-1)*.24*Math.sin(tau*p*4));};
};}
export const soundModels:Record<string,Model>={'sound-waves':airLesson('sound-waves')};
for(const id of ['10.1','10.2','10.4'])soundModels[`topic:${id}`]=airLesson(id);
for(const id of ['Activity 10.1','10.1.1','Activity 10.2','Activity 10.3','Activity 10.4','10.2.1','Activity 10.5','Activity 10.6','10.6.4'])soundModels[`topic:${id}`]=experiment(id);
for(const id of ['10.6.3','10.7','10.7.1','10.7.2','10.8.1'])soundModels[`topic:${id}`]=echo(id);
