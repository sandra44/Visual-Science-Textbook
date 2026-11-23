import * as T from 'three';
import {connect,group,lathe,oval,ring,rod,series,span,tube,type Factory,type Point} from './Cells3DShapes';
import {shoot} from './Cells3DPlant';

const ivory='#ebd6aa',cartilage='#92b8ad',muscle='#bd7163',sinew='#d0b888';
function bone(g:T.Group,length:number,r:number){
  return lathe(g,[0,0,0],[[0,0],[r*.95,0],[r*1.35,.07*length],[r*.9,.16*length],[r*.66,.58*length],[r*.82,.79*length],[r*1.28,.92*length],[r, length],[0,length]],ivory);
}
function arm(g:T.Group,mode:'muscle'|'bone'|'ligament'|'nerve'='muscle'){
  const arm=group(g,-.46,-.94,0);bone(arm,2.24,.17);
  oval(arm,[0,2.22,0],[.28,.26,.26],ivory);
  oval(arm,[0,.04,0],[.27,.21,.28],cartilage);
  const fore=group(arm);
  for(const s of [-1,1]){const shaft=group(fore,0,s*.065,s*.095);shaft.rotation.z=-Math.PI/2+s*.035;bone(shaft,2.04,.115);}
  const strand=(c:string)=>lathe(arm,[0,0,0],[[0,-.5],[.06,-.38],[.21,-.14],[.225,.12],[.09,.38],[0,.5]],c);
  const biceps=strand(muscle),triceps=strand('#cc8d78'),distal=rod(arm,[0,0,0],[0,1,0],.057,sinew);
  const ligament=rod(arm,[0,0,0],[0,1,0],.105,cartilage);
  for(const o of [biceps,triceps,distal])o.visible=mode==='muscle'||mode==='nerve';ligament.visible=mode==='ligament';
  const impulse=oval(arm,[0,0,0],[.09,.09,.09],'#f1c14b');
  const nerv:Point[]=[[-.51,2.32,.27],[-.16,2.09,.35],[.11,1.61,.32],[.21,1.3,.23]];
  const nerve=tube(arm,nerv,.038,'#bb9e54');impulse.visible=nerve.visible=mode==='nerve';
  const path=new T.CatmullRomCurve3(nerv.map(a=>new T.Vector3(...a)));
  return (a:number,p=0)=>{fore.rotation.z=a;const co=Math.cos(a),si=Math.sin(a),end:Point=[.57*co,.57*si,.16],low:Point=[.26+.18*co,.48+.45*si,.14];
    connect(biceps,[.09,2.22,.13],low);connect(distal,low,end);
    biceps.scale.x=biceps.scale.z=1+.29*si;
    connect(triceps,[-.1,2.13,-.1],[-.18*co,-.18*si,-.07]);triceps.scale.x=1.08-.24*si;
    connect(ligament,[-.035,.27,.22],[.26*co,.26*si,.25]);if(impulse.visible)impulse.position.copy(path.getPoint(span(p,0,.42)));
  };
}
function shoulder(g:T.Group){
  const blade=lathe(g,[-.54,.33,-.18],[[0,-.9],[.11,-.7],[.58,.34],[.44,.54],[0,.6]],ivory);blade.scale.z=.35;blade.rotation.z=-.22;
  const rim=ring(g,[-.12,.64,-.03],.245,.078,cartilage);rim.rotation.y=1.13;
  const head=group(g,.05,.66,.05);oval(head,[0,0,0],[.31,.32,.32],ivory);
  const shaft=group(head,-.01,-.02,0);shaft.rotation.z=Math.PI;bone(shaft,1.87,.17);
  return (p:number)=>{head.rotation.z=.18+1.15*p;head.rotation.x=-.68*Math.sin(p*Math.PI);};
}
function skull(g:T.Group,seam=false){
  const cranium=oval(g,[0,.25,-.06],[.74,.78,.68],ivory);
  oval(g,[0,-.26,.23],[.53,.4,.4],ivory);
  for(const s of [-1,1]){
    oval(g,[s*.26,-.075,.537],[.18,.18,.105],'#756e5e');
    const orbit=ring(g,[s*.26,-.075,.58],.174,.048,ivory);orbit.scale.y=.88;
  }
  oval(g,[0,-.26,.616],[.088,.135,.07],'#806f5b');
  tube(g,[[-.44,-.19,.21],[-.46,-.43,.32],[-.28,-.66,.47],[0,-.74,.51],[.29,-.64,.46],[.46,-.42,.32],[.43,-.21,.22]],.105,ivory);
  for(let i=0;i<7;i++)oval(g,[(i-3)*.075,-.492+.014*Math.abs(i-3),.55-.011*(i-3)**2],[.04,.07,.045],'#f4e8c9');
  if(seam){tube(g,series<Point>(38,i=>{const a=-1.4+2.8*i/37,phi=.58+.055*(i%2);return [.744*Math.sin(a)*Math.cos(phi),.25+.785*Math.sin(phi),-.06+.685*Math.cos(a)*Math.cos(phi)];}),.022,'#9f8660');}
  return cranium;
}
function pivot(g:T.Group){
  const axis=group(g,0,-.87,0);
  oval(axis,[0,0,0],[.47,.21,.38],ivory);rod(axis,[0,.02,.1],[0,.58,.1],.13,ivory,.09);
  const atlas=group(axis,0,.33,.1),r=ring(atlas,[0,0,0],.37,.115,ivory);r.rotation.x=Math.PI/2;r.scale.y=.85;
  const head=group(atlas,0,.75,-.08);skull(head);return (p:number)=>atlas.rotation.y=-.7+1.4*p;
}
const skeleton:Factory=g=>{
  const head=group(g,0,1.03,0);head.scale.setScalar(.72);const cranium=skull(head);cranium.material.transparent=true;cranium.material.depthWrite=false;
  const brain=oval(head,[0,.29,-.07],[.62,.64,.56],'#d29ca6');brain.material.transparent=true;
  for(let i=0;i<17;i++)oval(g,[0,.59-.13*i,-.19+.08*Math.cos(i*.37)],[.18,.105,.14],ivory);
  tube(g,[[0,.61,-.14],[0,.05,-.06],[0,-.63,-.2],[0,-1.51,-.12]],.05,'#c6a14d');
  for(let i=0;i<9;i++)for(const s of [-1,1]){const w=.56+.38*Math.sin(i*.35),y=.28-i*.14;tube(g,[[s*.12,y,-.22],[s*w*.73,y+.05,-.39],[s*w,y-.06,.02],[s*w*.83,y-.25,.44],[s*.14,y-.32,.53]],.048,ivory);}
  oval(g,[0,-.47,.55],[.105,.56,.065],ivory);
  const organs=[-1,1].map(s=>oval(g,[s*.41,-.42,.09],[.34,.66,.31],'#c88d92',.7));
  const heart=oval(g,[.08,-.56,.23],[.22,.26,.22],'#a56767');
  return p=>{cranium.material.opacity=.32+.5*span(p,.41,.83);brain.material.opacity=.9-.4*p;organs.forEach(o=>o.material.opacity=.24+.58*span(p,.4,.87));heart.scale.setScalar(.225-.02*Math.sin(p*22));};
};
function flex(g:T.Group,mode:Parameters<typeof arm>[1]='muscle',reverse=false){const a=arm(g,mode);return(p:number)=>a(-.28+1.56*(reverse?Math.sin(Math.PI*p):span(p,mode==='nerve'?.35:.13,.91)),p);}
export const jointModels:Record<string,Factory>={
  'tissues-joints':g=>flex(g),'topic:3.3':g=>flex(g,'nerve'),'topic:3.4':g=>flex(g),'topic:3.4.1':g=>flex(g,'muscle',true),
  'topic:3.3.2':g=>{const a=arm(g,'ligament');return p=>a(1.05-1.16*span(p,0,.83));},
  'topic:3.1':g=>{const stem=group(g,-1.55,0,0),a=flex(group(g,1.04,0,0));const plant=shoot(stem);return p=>{plant(0);a(p);};},
  'topic:3.5.1':g=>shoulder(g),'topic:3.5.3':g=>pivot(g),'topic:3.5.4':g=>{skull(g,true);g.scale.setScalar(1.73);return p=>{g.rotation.y=-.45+.73*p;};},'topic:3.6':skeleton,
  'topic:3.5':g=>{const elbow=group(g,-2,0,0),neck=group(g,.12,0,0),socket=group(g,2.27,0,0);elbow.scale.setScalar(.66);const a=arm(elbow,'bone'),b=pivot(neck),c=shoulder(socket);return p=>{a(-.35+.97*p);b(p);c(p);};},
  'topic:Activity 3.5':g=>{const neck=group(g,0,.79,0),elbow=group(g,-.88,-.68,0),socket=group(g,.93,-.07,0);neck.scale.setScalar(.69);elbow.scale.setScalar(.75);socket.scale.setScalar(.86);oval(g,[0,-.19,-.18],[.88,.99,.39],'#9aafae',.44);const a=arm(elbow,'bone'),b=pivot(neck),c=shoulder(socket);return p=>{a(2.7-.85*span(p,0,.4));b(span(p,.25,.69));c(span(p,.53,1));};},
};
