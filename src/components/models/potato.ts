import * as T from 'three';

export function potatoState(p:number) {
  const drop=Math.min(1,p/.13);
  const soak=Math.min(1,Math.max(0,(p-.13)/.77));
  return {drop,soak,minutes:Math.round(60*soak)};
}

export function potato(root:T.Group) {
  const specimens:T.Group[]=[];
  const outlines:T.LineLoop[]=[];
  for(const [i,x] of [-1.7,1.7].entries()){
    const glass=new T.MeshStandardMaterial({color:0x88c8d2,transparent:true,opacity:.17,depthWrite:false,side:T.DoubleSide});
    const wall=new T.Mesh(new T.CylinderGeometry(1.12,1.01,2.25,56,1,true),glass);
    wall.position.set(x,-.14,0);root.add(wall);
    for(const [r,y] of [[1.12,.99],[1.01,-1.26]]){
      const rim=new T.Mesh(new T.TorusGeometry(r,.035,8,56),new T.MeshStandardMaterial({color:0x689ba5}));
      rim.rotation.x=Math.PI/2;rim.position.set(x,y,0);root.add(rim);
    }
    const water=new T.Mesh(new T.CylinderGeometry(1.09,1.01,1.59,48),new T.MeshStandardMaterial({color:i?0x73aabf:0x88d4d8,transparent:true,opacity:.22,depthWrite:false}));
    water.position.set(x,-.45,0);root.add(water);
    const specimen=new T.Group();
    const body=new T.Mesh(new T.DodecahedronGeometry(.56,1),new T.MeshStandardMaterial({color:0xe1bf79,roughness:.91,flatShading:true}));
    body.scale.set(1.24,.79,.83);specimen.add(body);
    // The unchanged midsection stays visible through the specimen as a reference ruler.
    const reference=new T.LineLoop(new T.BufferGeometry().setFromPoints(Array.from({length:96},(_,j)=>{
      const a=2*Math.PI*j/96;return new T.Vector3(.68*Math.cos(a),0,.45*Math.sin(a));
    })),new T.LineDashedMaterial({color:0x513e54,dashSize:.072,gapSize:.045,depthTest:false,depthWrite:false}));
    reference.computeLineDistances();reference.position.set(x,-.72,0);reference.renderOrder=5;
    root.add(reference);outlines.push(reference);
    for(let j=0;j<14;j++){
      const a=j*2.4,b=Math.acos(1-2*(j+.5)/14),spot=new T.Mesh(new T.SphereGeometry(.037,8,6),new T.MeshStandardMaterial({color:0xa8824f}));
      spot.position.set(.68*Math.cos(a)*Math.sin(b),.425*Math.cos(b),.45*Math.sin(a)*Math.sin(b));specimen.add(spot);
    }
    specimen.position.x=x;root.add(specimen);specimens.push(specimen);
  }
  return (p:number)=>specimens.forEach((s,i)=>{
    const {drop,soak}=potatoState(p);
    s.position.y=1.56-2.28*drop;
    s.scale.setScalar(1+(i?-.35:.35)*soak);
    outlines[i].visible=drop===1;
  });
}
