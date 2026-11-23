import {T,type Model,type P,arrow,box,cart,dark,deck,figure,floorY as y,gold,group,mesh,orb,red,ring,rod,sat,steel,tau,teal,wheel,wood} from './Physics3DKit';

function track(id:string):Model{return root=>{
  deck(root);const home=id==='Activity 1.1',back=['4.1.2','4.1.3'].includes(id);
  if(home||back){
    for(const x of home?[-3.1,3.1]:[-3.1]){
      const school=home&&x<0,w=school?1.5:1.1;
      box(root,x,y+.45,-.75,w,.9,.8,school?0xf0d9af:wood);
      const roof=mesh(root,new T.ConeGeometry(.97,.55,4),red,x,y+1.10,-.75);roof.rotation.y=Math.PI/4;roof.scale.x=w/1.18;
      box(root,x,y+.25,-.337,.22,.5,.035,dark);for(const dx of [-.34,.34])box(root,x+dx,y+.61,-.337,.2,.2,.035,0x93c7df);
    }
  }
  if(!home){for(let i=0;i<=16;i++)box(root,-3+6*i/16,y+.009,.65,.027,.018,i%4?.11:.28,dark);
    for(const x of id==='4.1.1'?[0]:back?[3]:[-3,3]){rod(root,[x,y,-.42],[x,y+1.45,-.42],.033,steel);box(root,x+.24,y+1.24,-.42,.47,.35,.045,x>=0?red:teal);}
  }
  if(home){
    const g=group(root,-3,y,.48),wheels=[-.46,.46].map(x=>wheel(g,x,.34,0,.34));
    const edges:[P,P][]=[[[-.46,.34,0],[-.22,.8,0]],[[-.22,.8,0],[.04,.34,0]],[[.04,.34,0],[-.46,.34,0]],[[.04,.34,0],[.32,.83,0]],[[.32,.83,0],[.46,.34,0]],[[-.22,.8,0],[.32,.83,0]]];edges.forEach(([a,b])=>rod(g,a,b,.026,teal));
    box(g,-.22,.87,0,.24,.07,.17,dark);rod(g,[.31,.82,0],[.31,.99,0],.025,steel);rod(g,[.31,.99,-.15],[.31,.99,.15],.023,dark);
    const rider=figure(g,-.17,.39,0,.69,true);rider.arms.forEach(a=>a.rotation.z=.5);
    return p=>{g.position.x=-2.9+5.8*p;wheels.forEach(o=>o.rotation.z=-5.8*p/.34);rider.legs.forEach((o,i)=>o.rotation.z=.28*Math.sin(tau*4*p+i*Math.PI));};
  }
  if(back){const person=figure(root,-3,y,0);return p=>{person.g.position.x=-3+6*(1-Math.abs(2*p-1));person.g.rotation.y=p<=.5?0:Math.PI;person.legs.forEach((v,i)=>v.rotation.z=.35*Math.sin(tau*p*5+i*Math.PI));};}
  const c=cart(root,-3,y,0);return p=>{const s=6*(id==='4.1.4'?p*p:p);c.g.position.x=-3+s;c.roll(s);};
};}
function cars():Model{return root=>{
  deck(root,0x657476);for(let i=0;i<8;i++)box(root,i-3.5,y+.011,0,.48,.018,.04,0xf2e7bb);
  const cars=[-.65,.65].map((z,i)=>{const c=cart(root,-3.2,y,z,i?red:teal);box(c.g,0,.59,0,1.26,.2,.57,i?red:teal);orb(c.g,0,.69,0,.42,.26,.27,0x8eafc3);return c;});
  return p=>cars.forEach((c,i)=>{const t=10*p,T=i?10:5,s=.8*(t<=T?t*t/(2*T):t-T/2);c.g.position.x=-3.2+s;c.roll(s);});
};}
function ballPath(id:string):Model{return root=>{
  deck(root);const circular=id==='4.4.1'||id==='Activity 4.5',lift=id==='Activity 4.5';
  const ball=orb(root,0,0,0,.16,.16,.16,gold);
  if(circular){const r=1.35,cx=-.6,guide=ring(root,cx,y+.16,0,r+.20,lift?.07:.021,lift?wood:steel);guide.rotation.x=Math.PI/2;
    const tangent=arrow(root,0,0,0,0,teal),inward=arrow(root,0,0,0,0,red);inward.visible=!lift;
    return p=>{const a=Math.min(p/(lift?.65:1),1)*tau-Math.PI/2,q=lift?sat((p-.65)/.35):0;
      ball.position.set(cx+r*Math.cos(a)+2.7*q,y+.16,r*Math.sin(a));guide.position.y=y+.16+(lift?1.4*sat(q*4):0);
      tangent.position.copy(ball.position);tangent.rotation.y=-a-Math.PI/2;inward.position.copy(ball.position);inward.rotation.y=Math.PI-a;};
  }
  const vertical=id==='Activity 4.1';if(vertical){box(root,-.48,y+1.56,-.14,.12,3.12,.09,wood);for(let i=0;i<13;i++)box(root,-.40,y+i*.24,-.08,i%2?.13:.24,.023,.03,dark);}
  return p=>{ball.position.set(vertical?0:-3+6*p,y+.16+2.82*4*p*(1-p),0);};
};}
export const motionModels:Record<string,Model>={};
for(const id of ['Activity 1.1','4.1','4.1.1','4.1.2','4.1.3','4.1.4'])motionModels[`topic:${id}`]=track(id);
motionModels['topic:Activity 4.2']=cars();
for(const id of ['Activity 4.1','4.4','4.4.1','Activity 4.5'])motionModels[`topic:${id}`]=ballPath(id);
