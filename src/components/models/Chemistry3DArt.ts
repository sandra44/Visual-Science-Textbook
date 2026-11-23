import * as T from 'three';
export type Factory=(root:T.Group)=>(p:number)=>void;
export type Pt=[number,number,number];
export const clamp=(x:number)=>Math.max(0,Math.min(1,x)), mix=(a:number,b:number,p:number)=>a+(b-a)*p;
export const seq=<V>(n:number,f:(i:number)=>V)=>Array.from({length:n},(_,i)=>f(i));
export const aqua=0x63cbd4,glass=0xa9d6e1,metal=0x6d8492,amber=0xe9ac39;
export function mesh(g:T.Group, geo:T.BufferGeometry,c:number,at:Pt,alpha=1){
  const o=new T.Mesh(geo,new T.MeshStandardMaterial({color:c,roughness:.42,metalness:c===metal?.5:.04,transparent:alpha<1,opacity:alpha,depthWrite:alpha===1,side:alpha<1?T.DoubleSide:T.FrontSide}));
  o.position.set(...at);g.add(o);return o;
}
export function group(g:T.Group,at:Pt=[0,0,0]){const child=new T.Group();child.position.set(...at);g.add(child);return child;}
export const sphere=(g:T.Group,r:number,c:number,at:Pt,alpha=1)=>mesh(g,new T.SphereGeometry(r,20,14),c,at,alpha);
export const box=(g:T.Group,size:Pt,c:number,at:Pt)=>mesh(g,new T.BoxGeometry(...size),c,at);
export function cylinder(g:T.Group,top:number,bottom:number,h:number,c:number,at:Pt,alpha=1,open=false){return mesh(g,new T.CylinderGeometry(top,bottom,h,40,1,open),c,at,alpha);}
export function rod(g:T.Group,a:Pt,b:Pt,r:number,c:number,alpha=1){
  const axis=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
  const o=cylinder(g,r,r,axis.length(),c,[mix(a[0],b[0],.5),mix(a[1],b[1],.5),mix(a[2],b[2],.5)],alpha);
  o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),axis.normalize());return o;
}
export function ring(g:T.Group,r:number,t:number,c:number,at:Pt){
  const o=mesh(g,new T.TorusGeometry(r,t,8,64),c,at);o.rotation.x=Math.PI/2;return o;
}
export function lathe(g:T.Group,profile:number[][],c:number,at:Pt,alpha=1){
  return mesh(g,new T.LatheGeometry(profile.map(([r,y])=>new T.Vector2(r,y)),48),c,at,alpha);
}
export function beaker(g:T.Group,at:Pt,r:number,h:number){
  const b=group(g,at);
  lathe(b,[[0,0],[r*.93,0],[r,.06],[r,h]],glass,[0,0,0],.18);
  ring(b,r,.027,metal,[0,h,0]);ring(b,r*.98,.024,metal,[0,.04,0]);
  seq(4,i=>rod(b,[-.14,h*(.24+i*.15),r-.006],[i%2?.05:.14,h*(.24+i*.15),r],.011,metal));
  return b;
}
export function liquid(g:T.Group,r:number,h:number,c=aqua,alpha=.33){
  const o=cylinder(g,r,r,h,c,[0,h/2+.05,0],alpha);
  return (fraction:number)=>{o.visible=fraction>.001;o.scale.y=Math.max(.001,fraction);o.position.y=.05+h*fraction/2;};
}
export function scatter(i:number,r:number,h:number):Pt {
  const a=i*2.39996,rad=r*Math.sqrt(((i*37)%97+.5)/97);
  return [rad*Math.cos(a),.12+h*((i*47)%89)/89,rad*Math.sin(a)];
}
export function move(o:T.Object3D,a:Pt,b:Pt,p:number){o.position.set(mix(a[0],b[0],p),mix(a[1],b[1],p),mix(a[2],b[2],p));}
