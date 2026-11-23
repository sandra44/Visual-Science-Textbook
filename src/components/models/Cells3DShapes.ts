import * as T from 'three';

export type Factory = (root:T.Group)=>(p:number)=>void;
export type Point = [number,number,number];
export const span=(p:number,a=0,b=1)=>Math.max(0,Math.min(1,(p-a)/(b-a)));
export const series=<U>(n:number,f:(i:number)=>U)=>Array.from({length:n},(_,i)=>f(i));
export function group(parent:T.Group,x=0,y=0,z=0){
  const g=new T.Group();parent.add(g);g.position.set(x,y,z);return g;
}
export function solid(parent:T.Group,geometry:T.BufferGeometry,color:string,pos:Point,opacity=1){
  const material=new T.MeshStandardMaterial({color,roughness:.57,transparent:opacity<1,opacity,depthWrite:opacity===1,side:T.DoubleSide});
  const m=new T.Mesh(geometry,material);m.position.set(...pos);parent.add(m);return m;
}
export function oval(g:T.Group,pos:Point,scale:Point,color:string,opacity=1){
  const o=solid(g,new T.SphereGeometry(1,20,14),color,pos,opacity);o.scale.set(...scale);return o;
}
export const box=(g:T.Group,pos:Point,size:Point,c:string,opacity=1)=>solid(g,new T.BoxGeometry(...size),c,pos,opacity);
export function tube(g:T.Group,pts:Point[],r:number,c:string){
  const curve=new T.CatmullRomCurve3(pts.map(v=>new T.Vector3(...v)));
  return solid(g,new T.TubeGeometry(curve,Math.max(12,pts.length*4),r,8,false),c,[0,0,0]);
}
export function lathe(g:T.Group,pos:Point,profile:[number,number][],c:string,opacity=1){
  return solid(g,new T.LatheGeometry(profile.map(([r,y])=>new T.Vector2(r,y)),32),c,pos,opacity);
}
export function connect(obj:T.Object3D,a:Point,b:Point){
  const v=new T.Vector3(...a),d=new T.Vector3(...b).sub(v);obj.position.copy(v.addScaledVector(d,.5));obj.scale.y=d.length();obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());
}
export function rod(g:T.Group,a:Point,b:Point,r:number,c:string,top=r){
  const m=solid(g,new T.CylinderGeometry(top,r,1,16),c,[0,0,0]);connect(m,a,b);return m;
}
export function ring(g:T.Group,pos:Point,r:number,thick:number,c:string){
  return solid(g,new T.TorusGeometry(r,thick,10,40),c,pos);
}
