import {type Model,arrow,balance,box,cart,coil,crate,cup,cyl,dark,deck,figure,floorY as y,gold,group,orb,placeRod,red,ring,rod,sat,steel,teal,wheel,wood} from './Physics3DKit';

function build(id:string):Model{return root=>{
  if(id==='Activity 6.7'){
    for(const x of [-3.7,3.7]){box(root,x,-.52,0,.15,2.65,.36,wood);ring(root,x,.70,0,.1,.027,steel);}
    rod(root,[-3.7,.7,0],[3.7,.7,0],.013,dark);const g=group(root,-2.25,.70,0),straw=cyl(g,0,0,0,.078,.078,.97,gold,true);straw.rotation.z=Math.PI/2;
    const b=group(g,0,-.13,0);orb(b,0,-.52,0,.95,.55,.55,red);orb(b,-.71,-.51,0,.39,.23,.23,red);cyl(b,-1.09,-.51,0,.07,.16,.15,red).rotation.z=-Math.PI/2;box(g,0,-.09,0,.20,.18,.23,0xd5cba1);
    const air=arrow(g,-1.2,-.59,0,Math.PI,teal);return p=>{g.position.x=-2.2+4.9*(1-(1-p)**1.7);b.scale.set(1-.66*p,1-.72*p,1-.72*p);air.position.set(-1.16*b.scale.x,-.13-.51*b.scale.y,0);air.scale.setScalar(.3+.5*Math.sin(Math.PI*p));};
  }
  if(id==='Activity 6.3'||id==='Activity 6.4'){
    const mass=id==='Activity 6.4';
    const lanes=[-1.08,1.08].map((z,i)=>{box(root,-.65,.34,z,5.3,.18,1.04,wood);for(const x of [-2.9,1.66])box(root,x,-.64,z,.13,1.82,.72,wood);
      const c=cart(root,-2.35,.43,z);if(mass&&i)box(c.g,0,.80,0,.78,.38,.55,steel);wheel(root,2.08,.53,z,.2);const load=cup(root,2.27,-.05,z,.8);
      for(let j=0;j<(mass?2:1+2*i);j++)cyl(load,0,.44+.06*j,0,.205,.205,.055,gold);
      rod(load,[-.31,.56,0],[0,.85,0],.014,dark);rod(load,[.31,.56,0],[0,.85,0],.014,dark);
      const horiz=rod(root,[-1.9,.73,z],[2.08,.73,z],.013,dark),vert=rod(root,[2.27,.54,z],[2.27,.49,z],.013,dark);
      return (p:number)=>{const d=(mass?(i?.78:1.26):(i?1.26:.78))*p*p;c.g.position.x=-2.35+d;c.roll(d);load.position.y=-.19-d;placeRod(horiz,[c.g.position.x+.48,.73,z],[2.08,.73,z]);placeRod(vert,[2.27,.54,z],[2.27,load.position.y+.68,z]);};});
    return p=>lanes.forEach(f=>f(p));
  }
  deck(root);
  if(id==='6.1'){
    const leg=group(root,-2.1,.40,0);rod(leg,[0,0,0],[.06,-.65,0],.14,0x758fa5);rod(leg,[.06,-.65,0],[.08,-1.52,0],.13,steel);orb(leg,.22,-1.59,0,.34,.14,.17,dark);
    const b=group(root,-1.06,y+.30,0);orb(b,0,0,0,.30,.30,.30,0xffebc7);for(let i=0;i<6;i++){const a=i*Math.PI/3;orb(b,.26*Math.cos(a),.26*Math.sin(a),.12,.066,.066,.045,dark);}
    return p=>{const k=sat(p/.32);leg.rotation.z=-.38+.66*k-.16*sat((p-.32)/.3);const d=4.1*sat((p-.32)/.68);b.position.x=-1.06+d;b.rotation.z=-d/.30;};
  }
  if(id==='6.1.1'){
    box(root,0,y+.1,0,2.0,.20,1.2,dark);rod(root,[-.7,y,0],[-.7,1.7,0],.06,steel);rod(root,[-.7,1.7,0],[.22,1.7,0],.06,steel);
    const g=group(root,.18,1.66,0);const scale=balance(g,0,-.22,0);scale.g.rotation.z=-Math.PI/2;scale.g.scale.setScalar(1.3);
    const rodEnd=rod(root,[.18,.18,0],[.18,-.06,0],.028,steel);const load=cyl(root,.18,-.19,0,.29,.29,.29,gold);
    return p=>{scale.read(p);load.position.y=-.34-.72*p;placeRod(rodEnd,[.18,-.17,0],[.18,load.position.y+.14,0]);load.scale.x=load.scale.z=.74+.4*p;};
  }
  if(id==='Activity 6.1'){
    const tests=[-.72,.72].map((z,i)=>{box(root,0,y+.055,z,7.1,.11,1.13,i?wood:0xb5cdce);for(let j=0;j<(i?20:4);j++)box(root,-3.4+j*(i?.34:1.7),y+.116,z,.016,.012,1.1,i?0x9e724c:steel);
      const g=group(root,-2.3,y+.12,z);for(let j=0;j<4;j++)cyl(g,0,.044+j*.085,0,.35,.35,.08,gold);box(g,0,.17,.34,.095,.35,.025,0xe4ddc0);
      const band=ring(g,.6,.12,0,.5,.025,red);band.rotation.x=Math.PI/2;
      return (p:number)=>{const limit=i?.66:.33;g.position.x=-2.3+2.8*sat((p-limit)/(1-limit));const reach=1+(i?1.5:.7)*sat(p/limit);band.scale.set(reach+.32,.63,1);band.position.x=(reach-.32)/2;};});
    return p=>tests.forEach(f=>f(p));
  }
  if(id==='Activity 6.6'){
    const a=balance(root,-1.24,0,0),b=balance(root,1.24,0,.03);b.g.rotation.y=Math.PI;
    box(root,-2.56,-.55,0,.22,1.78,.5,wood);rod(root,[-2.56,0,0],[-1.42,0,0],.035,dark);const f=arrow(root,1.47,0,0,0,teal);return p=>{a.read(p);b.read(p);f.scale.x=.3+p;};
  }
  if(id==='Activity 6.5'){
    box(root,1.72,-.10,0,2.2,.18,1.4,wood);for(const x of [.78,2.66])for(const z of [-.56,.56])box(root,x,-.81,z,.13,1.32,.13,wood);
    const g=group(root,.04,y,0);box(g,0,.68,0,.78,.14,.66,teal);box(g,-.32,1.02,0,.12,.68,.66,teal);rod(g,[0,.18,0],[0,.64,0],.075,steel);
    for(const x of [-.28,.28])for(const z of [-.29,.29]){rod(g,[0,.21,0],[x,.16,z],.04,steel);wheel(g,x,.12,z,.12);}figure(g,0,.05,0,1,true);return p=>{g.position.x=.09-2.45*p;};
  }
  if(id==='6.6'||id==='6.7'){
    const system=id==='6.7',a=cart(root,-1.1,y,0),b=cart(root,.3,y,0,red),link=system?rod(root,[0,0,0],[1,0,0],.025,dark):coil(root,.34,.1,6,steel),f=arrow(b.g,.57,.44,0,0,teal);
    const opposite=arrow(a.g,-.55,.44,0,Math.PI,red);opposite.visible=!system;
    // The dashed boundary is represented by a physical outline around the cart system.
    const frame=group(root);if(system){for(const z of [-.62,.62])for(let i=0;i<10;i++)box(frame,-1.45+i*.34,y+.04,z,.20,.035,.035,teal);for(const x of [-1.62,1.84])for(let j=0;j<4;j++)box(frame,x,y+.04,-.48+j*.31,.035,.035,.18,teal);}
    return p=>{const d=system?3.2*p*p:2*(p<.2?p*p/.4:p-.1);a.g.position.x=(system?-2.4:-.68)+(system?d:-d);b.g.position.x=(system?-.65:.68)+d;a.roll(system?d:-d);b.roll(d);frame.position.x=-1.63+d;
      if(system)placeRod(link,[a.g.position.x+.5,y+.40,0],[b.g.position.x-.5,y+.40,0]);else{link.position.set(a.g.position.x+.51,y+.41,0);link.scale.x=1+Math.min(d,.2)*2/.34;opposite.visible=f.visible=p<=.2;}};
  }
  if(id==='6.5'){const cs=[cart(root,-3,y,-.67),cart(root,-3,y,.67,red)];cs.forEach((c,i)=>arrow(c.g,.52,.42,0,0,teal).scale.x=1+i);return p=>cs.forEach((c,i)=>{const d=2.15*(i+1)*p*p;c.g.position.x=-3+d;c.roll(d);});}
  if(id==='6.4'){const c=cart(root,-3,y,0);return p=>{c.g.position.x=-3+6*p;c.roll(6*p);};}
  const guided=id==='forces-newton',g=crate(root,-2.5,y,0);
  const opposing=arrow(g,-.45,.12,.08,Math.PI,red);const pull=id==='Activity 6.2'?balance(g,.66,.38,0):null;
  const push=guided?arrow(g,.46,.48,0,0,teal):null;
  return p=>{const k=guided?sat((p-1/3)*1.5):p;g.position.x=-2.4+(guided?4.45*k*k:pull?3.9*p:5.35*(1-(1-p)**2));
    if(push)push.scale.x=.48+.94*sat(k*5);opposing.scale.x=guided?.48:1;pull?.read(.5);};
};}
export const forceModels:Record<string,Model>={'forces-newton':build('forces-newton')};
for(const id of ['6.1','6.1.1','6.3','6.4','6.5','6.6','6.7',...Array.from({length:7},(_,i)=>`Activity 6.${i+1}`)])forceModels[`topic:${id}`]=build(id);
