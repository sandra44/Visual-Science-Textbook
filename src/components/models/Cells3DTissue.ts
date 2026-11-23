import {box,connect,group,lathe,oval,rod,series,span,tube,type Factory,type Point} from './Cells3DShapes';
import {jointModels} from './Cells3DJoints';

const dermis='#dfb39e',epithelium='#e6baaa',vessel='#b57373',nerve='#d7b866';
const skin=(scrape:boolean):Factory=>g=>{
  box(g,[0,-.5,0],[4.92,.73,1.62],dermis);
  const cells=series(27,i=>{const x=(i%9-4)*.54,z=(Math.floor(i/9)-1)*.53,c=group(g,x,.09,z);box(c,[0,0,0],[.53,.44,.52],epithelium);oval(c,[.04,0,.23],[.1,.125,.06],'#ba8c9c');return c;});
  const caps=tube(g,[[-2.35,-.64,.83],[-1.42,-.45,.84],[-.8,-.53,.85],[-.2,-.31,.83],[0,-.14,.73],[.21,-.28,.77],[.75,-.48,.83],[1.63,-.41,.82],[2.35,-.52,.83]],.063,vessel);
  caps.visible=scrape;
  const particles=series(scrape?22:8,()=>oval(g,[0,0,0],[.08,.065,.07],scrape?'#b77f73':'#c1a264'));
  return p=>{if(scrape){
    const damage=span(p,0,.35),clot=span(p,.39,.9);
    for(const idx of [12,13,21,22])cells[idx].scale.y=1-damage;
    particles.forEach((m,i)=>{const a=i*2.4;m.position.set(-.25+.42*Math.cos(a)*Math.sqrt(i/22),-.09+.19*clot+.035*Math.cos(i),.25+.38*Math.sin(a)*Math.sqrt(i/22));m.scale.set(.125*clot,.068*clot,.112*clot);});
  }else particles.forEach((m,i)=>m.position.set(-1.6+i*.45,1.41-span(p,0,.65)*1.02+.08*span(p,.65,1),.08+.2*Math.sin(i)));};
};
const sensory:Factory=g=>{
  box(g,[-1.93,.1,0],[1.55,.9,1.2],dermis);box(g,[-1.93,.63,0],[1.55,.22,1.2],epithelium);
  const finger=group(g,-1.97,1.37,0);oval(finger,[0,0,0],[.33,.47,.32],'#e7b496');oval(finger,[0,.1,.255],[.21,.21,.078],'#efd0ba');
  tube(g,[[-2.2,.3,.59],[-2.08,.43,.62],[-1.91,.34,.62],[-2.02,.2,.64],[-2.19,.22,.61],[-2.18,.39,.62]],.038,nerve);
  const points:Point[]=[[-2.03,.22,.63],[-1.77,-.14,.68],[-1.05,-.27,.58],[-.24,-.06,.32],[.75,-.11,.19],[1.75,.05,.1]];
  tube(g,points,.046,nerve);
  for(let i=0;i<8;i++){const x=-1.39+i*.36,y=-.15+.06*Math.sin(i);rod(g,[x,y,.6-i*.065],[x+.24,y+.015,.59-i*.065],.091,'#e3c98c');}
  lathe(g,[2.02,.02,0],[[0,-1.12],[.38,-1.12],[.39,-.51],[.34,.18],[.41,1.07],[0,1.07]],'#c6a7b8');
  const pulse=oval(g,[0,0,0],[.105,.1,.11],'#edab37');return p=>{finger.position.y=1.46-.25*span(p,0,.35);pulse.visible=p>.22;const t=span(p,.25,.96)*(points.length-1),i=Math.min(points.length-2,Math.floor(t)),f=t-i;pulse.position.set(...points[i].map((v,j)=>v+(points[i+1][j]-v)*f) as Point);};
};
const calf:Factory=g=>{
  const foot=group(g,1.15,-1.34,0);
  oval(foot,[-.88,.18,0],[1.02,.24,.32],'#ebd7ae');oval(foot,[-1.59,.28,0],[.35,.28,.36],'#e3ca9d');
  for(let i=0;i<5;i++)oval(foot,[.04,.14,(i-2)*.12],[.26-.019*i,.1,.066],'#ead3a6');
  const tibia=rod(g,[0,0,0],[0,1,0],.14,'#edd8ad',.19),belly=oval(g,[0,0,0],[.35,.8,.31],'#bb7061'),tendon=rod(g,[0,0,0],[0,1,0],.08,'#cab484');
  const upper:Point=[-.69,1.49,0];return p=>{const a=-.39*span(p,.24,1);foot.rotation.z=a;const heel:Point=[1.15-1.59*Math.cos(a)-.28*Math.sin(a),-1.34-1.59*Math.sin(a)+.28*Math.cos(a),0],lower:Point=[-.71,.07+.46*p,0];
    connect(tibia,[heel[0]+.16,heel[1]+.04,-.12],[upper[0]+.27,upper[1],-.12]);connect(belly,upper,lower);belly.scale.y*=.5;belly.scale.x=.36+.1*p;connect(tendon,lower,heel);
  };
};
const heartbeat:Factory=g=>{
  const a=group(g,-1.6,0,0);a.scale.setScalar(.88);const arm=jointModels['tissues-joints'](a);
  const h=group(g,1.6,.03,0);
  const body=lathe(h,[0,0,0],[[0,-.92],[.2,-.73],[.51,-.38],[.68,.01],[.64,.31],[.44,.54],[.14,.55],[0,.42]],'#c88477');body.rotation.z=-.24;
  tube(h,[[-.13,.41,.01],[-.15,.86,0],[.11,.99,0],[.27,.79,-.14]],.15,'#b66e65');
  tube(h,[[-.41,.31,.02],[-.51,.62,.05],[-.38,.8,.17]],.13,'#7497a5');
  tube(h,[[.11,.47,.17],[.29,.3,.4],[.17,.07,.59],[.07,-.29,.45],[.09,-.53,.29]],.035,'#a36a61');
  return p=>{arm(span(p,.08,.52));h.scale.setScalar(1-.12*Math.sin(p*4*Math.PI)**4);};
};
export const tissueModels:Record<string,Factory>={
  'topic:3.3.1':skin(false),'topic:Activity 3.2':skin(true),'topic:3.3.4':sensory,'topic:Activity 3.3':calf,'topic:3.3.3':heartbeat,
};
