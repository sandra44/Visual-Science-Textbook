import {amber,aqua,beaker,box,clamp,cylinder,glass,group,lathe,liquid,metal,mix,move,rod,scatter,seq,sphere,type Factory,type Pt} from './Chemistry3DArt';
const sodium=0xb4a2d3,chlorine=0x80bd82, hydrogen=0xc9e3ef,oxygen=0xe28579;
const weigh=(type:'salt'|'gas'|'sealed'):Factory=>root=>{
  box(root,[2.65,.45,2.04],metal,[0,-1.22,0]);cylinder(root,1.07,1.1,.14,0xa9bcc0,[0,-.91,0]);
  box(root,[1.25,.29,.037],0xcedbac,[0,-1.2,1.03]);
  const digits=seq(4,i=>seq(7,j=>{
    const x=-.41+i*.26+(i===3?.045:0),y=-1.20,z=1.055;
    const dx=[0,.068,.068,0,-.068,-.068,0][j],dy=[.105,.053,-.053,-.105,-.053,.053,0][j];
    return box(root,j%3===0?[.112,.016,.011]:[.016,.074,.011],0x284432,[x+dx,y+dy,z]);}));
  sphere(root,.016,0x284432,[.27,-1.30,1.055]);
  const patterns=['abcdef','bc','abdeg','abcdg','bcfg','acdfg','acdefg','abc','abcdefg','abcdfg'];
  const b=type==='salt'?beaker(root,[0,-.83,0],.82,1.93):group(root,[0,-.83,0]);
  if(type==='salt')liquid(b,.79,1.24)(1);else{
    lathe(b,[[0,0],[.78,0],[.84,.1],[.25,1.36],[.25,1.99],[.29,2]],glass,[0,0,0],.23);
    lathe(b,[[0,.04],[.76,.04],[.78,.12],[.56,.63],[0,.63]],aqua,[0,0,0],.36);
    if(type==='sealed')cylinder(b,.3,.25,.19,0x977858,[0,1.98,0]);
  }
  const parts=seq(38,i=>{const pos=scatter(i,type==='salt'?.68:.45,type==='salt'?1.04:.44);
    const o=type==='salt'?box(b,[.092,.092,.092],i%2?sodium:chlorine,pos):sphere(b,type==='gas'?.065:.076,type==='gas'?glass:0xf9f7e8,pos,type==='gas'?.65:1);
    return {pos,o};});
  return p=>{
    // Example readings in tenths of a gram; retain leading zero below 100 g.
    const reading=String(Math.round(1000-(type==='gas'?14*p:0))).padStart(4,'0');
    digits.forEach((ds,i)=>ds.forEach((o,j)=>o.visible=patterns[Number(reading[i])].includes('abcdefg'[j])));
    parts.forEach(({o,pos},i)=>{if(type==='salt')move(o,[(i%5-2)*.109,.115+.10*Math.floor(i/15),(Math.floor(i/5)%3-1)*.109],pos,clamp(1.4*p-i*.01));
      else if(type==='sealed'){o.visible=p>i/50;o.position.y=mix(pos[1],.09+.04*(i%3),p);}
      else{const t=clamp((1.85*p-i*.021));o.visible=t>0&&t<1;o.position.set(pos[0]*(1-clamp(t*2))+.12*Math.sin(i+t*5),.23+t*2.75,pos[2]*(1-clamp(t*2)));}});
  };
};
const bond=(ionic:boolean):Factory=>root=>{
  const a=sphere(root,ionic?.53:.27,ionic?sodium:hydrogen,[-1.44,0,0]),b=sphere(root,ionic?.68:.27,ionic?chlorine:hydrogen,[1.44,0,0]);
  const e=sphere(root,.096,0x267eba,[-1,0,0]),f=ionic?null:sphere(root,.096,0x508c79,[1,0,0]);
  const clouds=ionic?[]:[sphere(root,.85,hydrogen,[-1,0,0],.15),sphere(root,.85,hydrogen,[1,0,0],.15)];
  const valence=ionic?seq(7,i=>sphere(root,.085,0x508c79,[0,.75*Math.sin(i*Math.PI/4+.67),.75*Math.cos(i*Math.PI/4+.67)])):[];
  return p=>{
    if(ionic){a.position.x=-1.49+.42*clamp((p-.65)*3);b.position.x=-a.position.x;valence.forEach(o=>o.position.x=b.position.x);
      e.position.x=mix(a.position.x+.57,b.position.x-.70,clamp(p*1.55));e.position.y=.23*Math.sin(Math.PI*clamp(p*1.55));}
    else{a.position.x=mix(-1.62,-.49,p);b.position.x=-a.position.x;e.position.x=mix(-1.15,.02,p);e.position.y=.135;f!.position.x=-e.position.x;f!.position.y=-.135;clouds[0].position.x=a.position.x;clouds[1].position.x=b.position.x;}
  };
};
const compareBonds:Factory=root=>{
  const a=group(root),b=group(root),first=bond(false)(a),second=bond(true)(b);
  return p=>{a.visible=p<.5;b.visible=!a.visible;first(clamp(2*p));second(clamp(2*p-1));};
};
const rearrange:Factory=root=>{
  const old:Pt[]=[[-2.6,.7,0],[-2.1,.7,0],[2.1,.7,0],[2.6,.7,0],[-.35,-.6,0],[.35,-.6,0]];
  const end:Pt[]=[[-1.81,-.36,.2],[-.99,-.36,.2],[.99,-.36,.2],[1.81,-.36,.2],[-1.4,0,0],[1.4,0,0]];
  const atoms=old.map((at,i)=>sphere(root,i<4?.235:.36,i<4?hydrogen:oxygen,at));
  const oldBonds=[[0,1],[2,3],[4,5]].map(([a,b])=>rod(root,old[a],old[b],.075,metal)),newBonds=[[0,4],[1,4],[2,5],[3,5]].map(([a,b])=>rod(root,end[a],end[b],.075,metal));
  return p=>{atoms.forEach((o,i)=>move(o,old[i],end[i],p));oldBonds.forEach(o=>o.visible=p<.03);newBonds.forEach(o=>o.visible=p>.97);};
};
const dalton:Factory=root=>{
  const pairs=seq(3,i=>{const x=(i-1)*2.18;sphere(root,.38,amber,[x,0,0]);return [-1,1].map(s=>sphere(root,.24,chlorine,[x+s*.84,-.22,.15]));});
  return p=>pairs.forEach((pair,i)=>pair.forEach((o,j)=>o.position.x=(i-1)*2.18+(j?1:-1)*mix(.89,.48,p)));
};
function conduction(solution:boolean):Factory{return root=>{
  const updates=seq(2,i=>{
    const x=i?1.64:-1.64,mobile=solution?i===0:i===1,b=beaker(root,[x,-1.46,0],1,2);
    if(solution||mobile)liquid(b,.97,1.33,solution?aqua:0xf4d4a0,.28)(1);
    for(const side of [-1,1]){cylinder(b,.09,.09,1.28,metal,[.72*side,1.51,0]);rod(b,[.72*side,2.14,0],[.72*side,2.63,0],.032,metal);rod(b,[.72*side,2.63,0],[.16*side,2.63,0],.032,metal);}
    cylinder(b,.18,.18,.14,metal,[0,2.62,0]);const lamp=sphere(b,.24,mobile?0xffc955:glass,[0,2.89,0],mobile?.89:.49);
    lamp.material.emissive.setHex(mobile?0xac7419:0x101215);
    box(b,[.25,.33,.22],0x313c4a,[-.72,2.4,0]);
    const parts=seq(27,j=>{const plus=(j%3+Math.floor(j/3)%3+Math.floor(j/9))%2,solid:Pt=[(j%3-1)*.33,.25+(Math.floor(j/3)%3)*.34,(Math.floor(j/9)-1)*.33],s=scatter(j,.72,1.02),sugar=solution&&!mobile;
      const g=group(b,mobile||sugar?s:solid);
      if(sugar){sphere(g,.07,0xb69778,[0,0,0]);sphere(g,.052,oxygen,[.081,.017,0]);sphere(g,.047,hydrogen,[-.07,-.026,.027]);}
      else sphere(g,mobile?.1:.166,plus?sodium:chlorine,[0,0,0]);return {g,s,plus,sugar};});
    return (p:number)=>parts.forEach(({g,s,plus,sugar},j)=>{if(mobile||sugar){g.position.x=s[0]*(mobile?1-.3*p:1)+(mobile?(plus?-1:1)*.2*p:0);g.position.y=s[1]+.034*Math.sin(p*7+j);} });
  });return p=>updates.forEach(f=>f(p));
};}
export const compoundModels:Record<string,Factory>={
  'Activity 9.1':weigh('salt'),'Activity 9.2':weigh('gas'),'Activity 9.3':weigh('sealed'),'9.1':rearrange,'9.3':dalton,'9.4':compareBonds,
  '9.4.1':bond(false),'9.4.2':bond(true),'9.6':conduction(false),'Activity 9.4':conduction(true),
};
