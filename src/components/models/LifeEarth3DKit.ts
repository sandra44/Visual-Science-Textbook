import * as T from 'three';

export type Model = (root:T.Group)=>(p:number)=>void;
export type V = [number,number,number];
export const phase=(p:number,a=0,b=1)=>Math.min(1,Math.max(0,(p-a)/(b-a)));
export const vec=(v:V)=>new T.Vector3(...v);
export function group(g:T.Group,x=0,y=0,z=0){
  const o=new T.Group();o.position.set(x,y,z);g.add(o);return o;
}
export function mesh(g:T.Group,geo:T.BufferGeometry,c:number,pos:V,alpha=1){
  const o=new T.Mesh(geo,new T.MeshStandardMaterial({color:c,roughness:.68,transparent:alpha<1,opacity:alpha,depthWrite:alpha===1}));
  o.position.set(...pos);g.add(o);return o;
}
export function oval(g:T.Group,c:number,pos:V,sz:V,alpha=1){
  const o=mesh(g,new T.SphereGeometry(1,24,16),c,pos,alpha);o.scale.set(...sz);return o;
}
export function box(g:T.Group,c:number,pos:V,sz:V){
  return mesh(g,new T.BoxGeometry(...sz),c,pos);
}
export function cone(g:T.Group,c:number,pos:V,r:number,h:number,sides=9){
  return mesh(g,new T.ConeGeometry(r,h,sides),c,pos);
}
export function path(pts:V[]){return new T.CatmullRomCurve3(pts.map(vec));}
export function tube(g:T.Group,c:number,pts:V[],r:number){
  return mesh(g,new T.TubeGeometry(path(pts),Math.max(12,pts.length*6),r,7,false),c,[0,0,0]);
}
export function leaf(g:T.Group,pos:V,len:number,width:number,angle:number,c=0x639454){
  const o=group(g,...pos);o.rotation.z=angle;
  // A pointed leaf with a raised midrib and folded edges, not a textured plane.
  const sh=new T.Shape();sh.moveTo(0,0);sh.bezierCurveTo(-width,len*.2,-width,len*.67,0,len);
  sh.bezierCurveTo(width,len*.7,width,len*.35,0,0);
  const geo=new T.ExtrudeGeometry(sh,{depth:.04,bevelEnabled:false,curveSegments:9});
  const verts=geo.attributes.position;for(let i=0;i<verts.count;i++)verts.setZ(i,verts.getZ(i)+.12*Math.sin(Math.PI*verts.getY(i)/len)-.2*Math.abs(verts.getX(i)));
  geo.computeVertexNormals();mesh(o,geo,c,[0,0,0]);
  tube(o,0x879c5a,[[0,0,.045],[0,.48*len,.17],[0,len,.046]],.014);return o;
}
export function tree(g:T.Group,pos:V,s=1){
  const o=group(g,...pos);o.scale.setScalar(s);
  tube(o,0x7b5841,[[0,0,0],[0,.6,0],[-.09,1.08,0]],.09);
  for(let i=0;i<4;i++){const a=i*2.4;
    oval(o,i%2?0x4e8665:0x6b986a,[.27*Math.cos(a),1.08+.14*i,.23*Math.sin(a)],[.48,.45,.43]);}return o;
}
export function shoot(g:T.Group,pos:V,s=1){
  const o=group(g,...pos);o.scale.setScalar(s);
  tube(o,0x597847,[[0,0,0],[.04,.9,.03],[-.09,1.65,0]],.06);
  for(let i=0;i<4;i++){const l=leaf(o,[0,.37+i*.29,0],.69,.22,(i%2?1:-1)*.91);l.rotation.y=i*.53;}
  return o;
}
export function roots(g:T.Group,pos:V){
  const o=group(g,...pos);for(let i=0;i<7;i++){const a=i*2.4,x=Math.cos(a),z=Math.sin(a);
    tube(o,0xd5b481,[[0,0,0],[.18*x,-.29,.18*z],[.64*x,-.63-i*.04,.52*z]],.034);
    tube(o,0xe6c69c,[[.25*x,-.39,.24*z],[.29*x,-.58,.32*z],[.36*x,-.74,.37*z]],.017);
  }return o;
}
export function particle(g:T.Group,pts:V[],c:number,r:number){
  const o=oval(g,c,pts[0],[r,r,r]);const curve=path(pts);
  return Object.assign((p:number)=>curve.getPointAt(phase(p),o.position),{mesh:o});
}
