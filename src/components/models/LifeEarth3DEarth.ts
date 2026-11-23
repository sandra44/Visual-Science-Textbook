import * as T from 'three';
import {box,cone,group,mesh,oval,particle,path,phase,roots,shoot,tree,tube,type Model,type V} from './LifeEarth3DKit';

const sea=0x73b9c2, soil=0xb69870, sun=0xf3c45c;
function island(g:T.Group){
  box(g,soil,[0,-1.22,0],[5.52,.48,2.52]);box(g,sea,[1.34,-.89,0],[2.8,.19,2.52]);
  const slope=box(g,0x8caa77,[-1.43,-.85,0],[2.64,.32,2.5]);slope.rotation.z=-.078;
  tree(g,[-2.19,-.61,-.61],.72);tree(g,[-1.67,-.66,-.77],.49);
}
function catchment(g:T.Group,kind:'water'|'snow'|'erosion'){
  island(g);cone(g,0x909e89,[-1.48,-.02,-.32],1.06,1.92);
  const cap=cone(g,0xf5f2e5,[-1.48,.59,-.32],.39,.72);
  const stream:V[]=[[-1.45,.51,.01],[-1.23,.08,.18],[-1.1,-.21,.38],[-.78,-.55,.53],[-.37,-.71,.58],[.07,-.8,.48],[.86,-.79,.41]];
  const brook=tube(g,0x86bfce,stream,.068);const droplets=Array.from({length:8},(_,i)=>particle(g,stream,kind==='erosion'?0x9b7651:0xa5d7dd,.059+i%2*.013));
  const cloud=group(g,-1.15,1.25,-.18);for(let i=0;i<5;i++)oval(cloud,0xe0e9ea,[(i-2)*.28,.09*Math.sin(i*2),.1*Math.cos(i)],[.39,.23,.25]);
  const rain=Array.from({length:9},(_,j)=>oval(g,0x76a9bd,[-1.8+(j%5)*.22,1,.31*Math.cos(j)],[.032,.081,.032]));
  const vapor=Array.from({length:6},(_,i)=>particle(g,[[1.22+.13*i,-.76,.22],[1.31+.09*i,.23,.12],[.85+.14*i,1.11,-.03]],0xb9d8dc,.043));
  const forest=Array.from({length:7},(_,i)=>tree(g,[-2.22+(i%4)*.38,-.58,Math.floor(i/4)*.48+.37],.43+i%3*.05));
  const grasses=Array.from({length:8},(_,i)=>cone(g,0x82a368,[.03+i*.11,-.69,-.77+.1*Math.cos(i)],.032,.22+i%3*.03));
  oval(g,sun,[2.14,1.38,-.65],[.24,.24,.24]).visible=kind==='water';
  return(p:number)=>{const w=kind==='water',snow=kind==='snow';
    const melt=snow?phase(p,.14,.83):0;cap.scale.setScalar(1-.7*melt);cap.position.y=.59+.24*melt;
    cloud.visible=w;cloud.position.x=1.26-2.55*phase(p,.32,.76);cloud.scale.setScalar(.03+.98*phase(p,.28,.64));
    rain.forEach((o,i)=>{const q=phase(p,.64+.012*i,.83+.012*i);o.visible=w&&q>0&&q<1;o.position.y=1.18-1.34*q;});
    vapor.forEach((move,i)=>{move.mesh.visible=w&&p<.42;move(phase(p,.012*i,.31+i*.014));});
    // Tracers show otherwise invisible vapour only during evaporation.
    const start=w?.76:snow?.14:.32;
    droplets.forEach((move,i)=>move(phase(p,start+.008*i,.93+.01*i)));
    brook.material.color.setHex(kind==='erosion'&&p>.56?0x998566:0x86bfce);
    grasses.forEach(o=>o.scale.y=1-.66*melt);forest.forEach((o,i)=>o.scale.setScalar((.43+i%3*.05)*(kind==='erosion'?1-.995*phase(p,.01+i*.028,.41+i*.025):1)));
  };
}
function shore(g:T.Group,kind:'heat'|'breeze'|'solar'|'albedo'|'infrared'){
  island(g);oval(g,sun,[-2.27,1.43,-.66],[.31,.31,.31]);
  if(kind==='albedo'){box(g,0xf3f5e8,[-1.75,-.56,.26],[1.36,.1,1.45]);box(g,0x6d5841,[-.41,-.63,.25],[1.06,.1,1.46]);}
  const x=kind==='albedo'?-.43:-1.08;
  const rays=[[-1.72,-.5],[x,-.57],[1.28,-.78]].flatMap(([xx,y],j)=>Array.from({length:3},(_,i)=>{
    const xx2=xx+(i-1)*.13,z=.42;const pts:V[]=[[xx2-.6,1.06,z-.24],[xx2-.29,.3,z-.12],[xx2,y,z]];
    return {j,move:particle(g,pts,sun,.046),line:tube(g,0xddb160,pts,.015)};
  }));
  const reflec=Array.from({length:4},(_,i)=>{const a=kind==='albedo'?(i<3?-1.78:-.43):x;return particle(g,[[a,-.48,.45],[a+.36,.18,.55],[a+.63,1.13,.55+i*.07]],0xf3be53,.055);});
  const radiated=particle(g,[[x,-.53,.4],[-.56,.32,.41],[.19,1.04,.24]],0xcf744b,.078);
  const gas=group(g,.19,1.04,.24);[-.19,0,.19].forEach((xx,i)=>oval(gas,i===1?0x626966:0xb26c59,[xx,0,0],[.1,.1,.1]));
  const reemit=[particle(g,[[.19,1.04,.24],[.65,.49,.25],[1.12,-.77,.25]],0xcf744b,.068),particle(g,[[.19,1.04,.24],[.59,1.38,.19],[.96,1.72,.11]],0xcf744b,.068)];
  const circulation:V[]=[[1.95,-.5,.47],[.71,-.46,.49],[-.87,-.42,.47],[-1.22,.33,.48],[-.85,.89,.38],[.32,.94,.24],[1.56,.63,.34],[1.95,-.5,.47]];
  const currents=Array.from({length:8},(_,i)=>particle(g,circulation,i<4?0xe29968:0x719fbc,.083));
  const temps=[-1.05,1.23].map(xx=>{const o=group(g,xx,-.51,.48);mesh(o,new T.CylinderGeometry(.081,.081,1.32,16),0xd5e1de,[0,.66,0],.35);
    oval(o,0xc25d49,[0,0,0],[.123,.123,.123]);return mesh(o,new T.CylinderGeometry(.043,.043,1,14),0xc86952,[0,0,0]);});
  return(p:number)=>{const breeze=kind==='breeze',heat=kind==='heat',greenhouse=kind==='infrared';
    gas.visible=greenhouse;temps.forEach((o,i)=>{o.parent!.visible=heat;const v=.25+(i?.32:.91)*p;o.scale.y=v;o.position.y=v/2;});
    rays.forEach(({j,move,line},i)=>{const visible=!breeze&&(heat?j!==0:kind==='albedo'?j!==2:j===1);line.visible=visible;move.mesh.visible=visible;move(phase(p,.015*i,.48));});
    reflec.forEach((move,i)=>{move.mesh.visible=(kind==='solar'&&i===0||kind==='albedo')&&p>.3;move(phase(p,.3,.87));});
    radiated.mesh.visible=greenhouse&&p>.23;radiated(phase(p,.23,.64));reemit.forEach(move=>{move.mesh.visible=greenhouse&&p>.61;move(phase(p,.61,1));});
    currents.forEach((move,i)=>{move.mesh.visible=breeze;move((.28+i/8+p*.66)%1);});};
}
function oceanTank(g:T.Group){
  box(g,0xaabcb8,[0,-.97,0],[4.6,.12,1.65]);const water=mesh(g,new T.BoxGeometry(4.4,1.72,1.52),sea,[0,-.03,0],.29);
  water.material.roughness=.31;const heat=box(g,0xc77a50,[-1.33,-1.11,0],[1.12,.18,1.33]);
  const loop:V[]=[[-1.46,-.68,.18],[-1.58,.13,.18],[-1.21,.61,.18],[.44,.65,.18],[1.48,.39,.18],[1.6,-.32,.18],[1.16,-.66,.18],[-.13,-.69,.18],[-1.46,-.68,.18]];
  const points=Array.from({length:13},(_,i)=>particle(g,loop,i<5?0xd08861:0x5087ae,.087));
  return(p:number)=>{points.forEach((f,i)=>f((i/13+.68*p)%1));heat.material.color.setRGB(.68+.13*p,.42,.28);};
}
function globe(g:T.Group,kind:'latitude'|'winds'|'current'){
  const world=group(g,.21,0,0),r=1.42;
  const place=(lon:number,lat:number,rad=r):V=>[rad*Math.sin(lon*Math.PI/180)*Math.cos(lat*Math.PI/180),rad*Math.sin(lat*Math.PI/180),rad*Math.cos(lon*Math.PI/180)*Math.cos(lat*Math.PI/180)];
  oval(world,0x83b7c5,[0,0,0],[r,r,r]);
  const coast=(outline:number[][])=>{const pts=outline.map(([lo,la])=>place(lo,la,r+.014));const center=pts.reduce((v,p)=>v.add(new T.Vector3(...p)),new T.Vector3()).normalize().multiplyScalar(r+.016);
    for(let i=0;i<pts.length;i++){const a=new T.Vector3(...pts[i]),b=new T.Vector3(...pts[(i+1)%pts.length]);
      const geo=new T.BufferGeometry(),verts:number[]=[];const interp=(u:number,v:number)=>center.clone().lerp(a,u).addScaledVector(b.clone().sub(center),v).normalize().multiplyScalar(r+.02);
      const N=6;for(let j=0;j<N;j++)for(let k=0;k<N-j;k++){const push=(u:number,v:number)=>verts.push(...interp(u/N,v/N).toArray());push(j,k);push(j+1,k);push(j,k+1);if(k<N-j-1){push(j+1,k);push(j+1,k+1);push(j,k+1);}}
      geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.computeVertexNormals();const patch=mesh(world,geo,0x90ae79,[0,0,0]);patch.material.side=T.DoubleSide;
    }};
  coast([[-115,56],[-80,70],[-57,49],[-75,36],[-81,23],[-96,18],[-109,29]]);
  coast([[-77,11],[-49,8],[-35,-6],[-46,-27],[-66,-54],[-78,-17]]);
  coast([[-17,16],[-9,35],[11,36],[32,30],[50,10],[33,-20],[19,-34],[11,-7],[-6,5]]);
  coast([[-10,37],[6,53],[28,66],[70,62],[91,33],[65,24],[35,37],[21,33]]);
  const markers:Array<(p:number)=>void>=[];
  if(kind==='latitude'){
    [4,62].forEach((lat,i)=>{const [x,y,z]=place(-36,lat,r+.04);
      for(let j=0;j<4;j++){const y2=y-.095+.065*j,zz=Math.sqrt(r*r-y2*y2)*.82,xx=-Math.sqrt(Math.max(0,r*r-y2*y2-zz*zz));
        const t:V[]=[[xx-1.42,y2,zz],[xx-.66,y2,zz],[xx,y2,zz]];tube(world,sun,t,.018);markers.push(particle(world,t,sun,.042));}
      oval(world,0xc99058,[x,y,z],[.105,i?.22:.105,.083]);});
  }else if(kind==='winds'){
    for(const lat of [-32,32])for(const lon of [-63,-24,15,54]){const t=[place(lon,lat,r+.04),place(lon-4,lat*.57,r+.08),place(lon-16,lat*.1,r+.065)];
      tube(world,0x548898,t,.018);markers.push(particle(world,t,0xe1ede3,.06));}
  }else {world.rotation.y=.86;const t=[place(-48,13,r+.05),place(-78,23,r+.05),place(-74,35,r+.05),place(-56,42,r+.05),place(-29,48,r+.05),place(-13,56,r+.05)];
    tube(world,0xd98746,t,.045);for(let i=0;i<4;i++)markers.push(particle(world,t,0xffcd69,.07));}
  return(p:number)=>markers.forEach((m,j)=>m(kind==='current'?(j*.15+p*.56)%1:phase(p,kind==='latitude'&&j>3?.35:0,1)));
}
function cycle(g:T.Group,kind:'water'|'carbon'|'nitrogen'|'oxygen'){
  const pod=box(g,soil,[0,-1.05,-.23],[2.5,.8,1.5]);pod.material.transparent=true;pod.material.opacity=.42;pod.material.depthWrite=false;
  shoot(g,[0,-.65,.25],1.26);roots(g,[0,-.64,.31]);const n2=kind==='nitrogen',o2=kind==='oxygen',co2=kind==='carbon';
  if(n2){for(let i=0;i<6;i++)oval(g,0xcb9382,[.29*Math.cos(i),-.92+i%2*.05,.32+.3*Math.sin(i)],[.1,.085,.08]);}
  const tr:V[]=n2?[[-1.61,1.2,.15],[-1.28,.1,.27],[-.81,-.71,.37],[-.19,-.97,.43],[0,-.62,.31],[.04,.08,.33],[.38,.67,.31]]:
    co2?[[-1.69,1.14,.37],[-.86,.78,.37],[-.46,.53,.35],[-.05,.48,.33],[0,.17,.32],[.47,.37,.37],[1.52,.95,.33]]:
    [[-.74,-1.08,.45],[-.23,-.99,.44],[.01,-.62,.32],[.01,.09,.33],[-.46,.56,.33],[-.18,.96,.35],[.87,1.2,.25],o2?[1.79,.39,.27]:[1.32,1.56,.2]];
  if(o2){oval(g,0xd8b6a6,[1.78,.33,.18],[.65,.48,.46],.37);oval(g,0xbd856a,[1.79,.33,.22],[.31,.16,.16]);}
  const atom=group(g),c=co2?0x5e655e:n2?0x7288b3:0xbf7469;oval(atom,c,[0,0,0],[.097,.097,.097]);
  const other=oval(atom,n2?c:co2?0xbf7469:0xe1d3af,[.15,.05,0],[.076,.076,.076]);
  const third=oval(atom,co2?0xbf7469:0xe1d3af,[-.14,.04,0],[.076,.076,.076]);const curve=path(tr);
  return(p:number)=>{curve.getPointAt(p,atom.position);
    other.visible=!n2&&!co2||p<.27||co2&&p>.77;third.visible=!n2&&other.visible&&(!o2||p<.48||p>.95);
    other.material.color.setHex(o2&&p>=.48&&p<.95?c:n2?c:co2?0xbf7469:0xe1d3af);};
}
export const earthModels:Record<string,Model>={
  'earth-system':g=>catchment(g,'water'),'topic:Activity 13.1':g=>catchment(g,'snow'),
  'topic:13.1':g=>shore(g,'heat'),'topic:13.1.1':g=>shore(g,'solar'),'topic:Activity 13.2':g=>shore(g,'albedo'),
  'topic:13.1.2':g=>globe(g,'latitude'),'topic:13.1.3':g=>shore(g,'infrared'),'topic:13.2':oceanTank,
  'topic:13.2.1':g=>shore(g,'breeze'),'topic:13.2.2':g=>globe(g,'winds'),'topic:13.2.3':g=>globe(g,'current'),
  'topic:13.3':g=>cycle(g,'water'),'topic:13.3.2':g=>cycle(g,'carbon'),'topic:13.3.3':g=>cycle(g,'nitrogen'),
  'topic:13.3.4':g=>cycle(g,'oxygen'),'topic:13.4':g=>catchment(g,'erosion'),
};
