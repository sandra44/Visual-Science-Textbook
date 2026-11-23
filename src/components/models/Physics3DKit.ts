import * as T from 'three';
export {T};
export type Model = (root:T.Group)=>(p:number)=>void;
export type P = [number,number,number];
export const teal=0x297e83, wood=0xbf8958, gold=0xe5b455, red=0xc56c51, dark=0x324450, steel=0x9aacb4, skin=0xca9171, aqua=0x48b2cc;
export const floorY=-1.44, tau=2*Math.PI, sat=(p:number)=>Math.max(0,Math.min(1,p));
export function group(root:T.Object3D,x=0,y=0,z=0){const o=new T.Group();root.add(o);o.position.set(x,y,z);return o;}
export function mesh(root:T.Object3D,g:T.BufferGeometry,c:number,x:number,y:number,z:number,opacity=1){
  const m=new T.Mesh(g,new T.MeshStandardMaterial({color:c,roughness:c===steel?.32:.62,metalness:c===steel?.55:.04,transparent:opacity<1,opacity,depthWrite:opacity===1,side:opacity<1?T.DoubleSide:T.FrontSide}));
  root.add(m);m.position.set(x,y,z);m.castShadow=opacity===1;m.receiveShadow=true;return m;
}
export const box=(r:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,c:number)=>mesh(r,new T.BoxGeometry(w,h,d),c,x,y,z);
export const cyl=(r:T.Object3D,x:number,y:number,z:number,a:number,b:number,h:number,c:number,open=false,opacity=1)=>mesh(r,new T.CylinderGeometry(a,b,h,32,1,open),c,x,y,z,opacity);
export function orb(r:T.Object3D,x:number,y:number,z:number,rx:number,ry:number,rz:number,c:number,alpha=1){const o=mesh(r,new T.SphereGeometry(1,24,16),c,x,y,z,alpha);o.scale.set(rx,ry,rz);return o;}
export function ring(r:T.Object3D,x:number,y:number,z:number,rad:number,thick:number,c:number){return mesh(r,new T.TorusGeometry(rad,thick,8,48),c,x,y,z);}
const up=new T.Vector3(0,1,0);
export function placeRod(o:T.Object3D,a:P,b:P){const [dx,dy,dz]=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];o.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);const v=new T.Vector3(dx,dy,dz);o.scale.y=Math.max(.0001,v.length());if(v.lengthSq())o.quaternion.setFromUnitVectors(up,v.normalize());}
export function rod(r:T.Object3D,a:P,b:P,t:number,c:number){const o=cyl(r,0,0,0,t,t,1,c);placeRod(o,a,b);return o;}
export function tube(r:T.Object3D,pts:P[],t:number,c:number){
  return mesh(r,new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(a=>new T.Vector3(...a))),Math.max(18,pts.length*2),t,7,false),c,0,0,0);
}
export function deck(r:T.Object3D,c=0xe1d7c5){return box(r,0,floorY-.12,0,8,.24,2.9,c);}
export function wheel(r:T.Object3D,x:number,y:number,z:number,rad=.21){const g=group(r,x,y,z);ring(g,0,0,0,rad*.85,rad*.15,dark);for(let i=0;i<4;i++){const a=i*Math.PI/4;rod(g,[-rad*.81*Math.cos(a),-rad*.81*Math.sin(a),0],[rad*.81*Math.cos(a),rad*.81*Math.sin(a),0],rad*.05,steel);}return g;}
export function cart(r:T.Object3D,x:number,y:number,z:number,c=teal){
  const g=group(r,x,y,z);box(g,0,.39,0,1.04,.33,.62,c);box(g,0,.58,0,.98,.05,.6,wood);const ws=[-.34,.34].flatMap(a=>[-.35,.35].map(b=>wheel(g,a,.20,b)));return {g,roll:(travel:number)=>ws.forEach(w=>w.rotation.z=-travel/.2)};
}
export function crate(r:T.Object3D,x:number,y:number,z:number){
  const g=group(r,x,y,z);box(g,0,.4,0,.9,.8,.7,wood);for(const side of [-1,1]){box(g,0,.13,side*.358,.9,.075,.034,0x96623f);box(g,0,.67,side*.358,.9,.075,.034,0x96623f);rod(g,[-.37,.17,side*.38],[.37,.65,side*.38],.046,0xe0ad79);}return g;
}
export function arrow(r:T.Object3D,x:number,y:number,z:number,dir:number,c:number){
  const g=group(r,x,y,z);g.rotation.z=dir;rod(g,[0,0,0],[.66,0,0],.042,c);cyl(g,.78,0,0,0,.14,.3,c).rotation.z=-Math.PI/2;return g;
}
export function cup(r:T.Object3D,x:number,y:number,z:number,s=1){
  const g=group(r,x,y,z);cyl(g,0,.28,0,.34,.23,.56,0xf5e3c2,true).material.side=T.DoubleSide;cyl(g,0,.02,0,.23,.23,.04,wood);ring(g,0,.56,0,.34,.022,wood).rotation.x=Math.PI/2;g.scale.setScalar(s);return g;
}
export function coil(r:T.Object3D,length:number,rad:number, turns:number,c:number){
  const pts:P[]=Array.from({length:turns*12+1},(_,i)=>[length*i/(turns*12),rad*Math.cos(tau*i/12),rad*Math.sin(tau*i/12)]);
  return tube(r,pts,.019,c);
}
export function balance(r:T.Object3D,x:number,y:number,z:number){
  const g=group(r,x,y,z);rod(g,[-.18,0,0],[0,0,0],.025,steel);box(g,.52,0,-.08,1.04,.35,.17,0xc4d9cc);const spring=coil(g,.53,.068,8,steel);spring.position.set(.03,0,.09);
  for(let i=0;i<10;i++)box(g,.32+i*.069,.11,.025,.016,i%3?.04:.09,.02,dark);
  const needle=box(g,.5,0,.1,.034,.23,.033,red);tube(g,[[1.04,0,0],[1.22,0,0],[1.26,.08,0],[1.21,.12,0]],.024,steel);
  return {g,read:(f:number)=>{needle.position.x=.32+.62*f;spring.scale.x=(needle.position.x-.03)/.53;}};
}
export function figure(r:T.Object3D,x:number,y:number,z:number,s=1,seated=false){
  const g=group(r,x,y,z),hip=seated?.75:1;
  orb(g,0,hip+.83,0,.19,.23,.18,skin);orb(g,-.035,hip+.96,0,.18,.13,.18,dark);orb(g,0,hip+.35,0,.21,.39,.25,teal);
  const legs=[-.12,.12].map(v=>{const leg=group(g,0,hip,v),k:P=seated?[.43,-.08,0]:[0,-.48,0],f:P=seated?[.55,-.45,0]:[.03,-.92,0];rod(leg,[0,0,0],k,.095,dark);rod(leg,k,f,.08,dark);orb(leg,f[0]+.07,f[1]-.015,0,.17,.075,.095,dark);return leg;});
  const arms=[-.24,.24].map(v=>{const arm=group(g,0,hip+.55,v);rod(arm,[0,0,0],[.12,-.27,0],.069,skin);rod(arm,[.12,-.27,0],[seated?.52:.18,seated?-.28:-.54,0],.06,skin);return arm;});
  g.scale.setScalar(s);return {g,legs,arms};
}
