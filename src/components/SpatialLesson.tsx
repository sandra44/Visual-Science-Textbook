import { useState, type ReactNode } from 'react';
import { CellInterior, LeafSprig, Mitochondrion, NucleusCutaway } from './SpecimenArt';

type Point = [number, number, number];
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const purple = '#7c3aed', green = '#059669', blue = '#0284c7', gold = '#d97706';

// Orthographic camera. World coordinates use y down; z points toward the viewer.
export function SpatialLesson({ id, p, title, flat=false }: { id: string; p: number; title: string; flat?:boolean }) {
  const [yaw, setYaw] = useState(20);
  const theta = flat ? 0 : yaw * Math.PI / 180, tilt = flat ? 0 : .27;
  const items: { depth: number; node: ReactNode }[] = [];
  const labels: ReactNode[] = [];
  function project([x,y,z]: Point) {
    const u=x-220, v=y-112, d=z*Math.cos(theta)-u*Math.sin(theta);
    return [220+.89*(u*Math.cos(theta)+z*Math.sin(theta)), 110+.89*(v*Math.cos(tilt)+d*Math.sin(tilt)), d*Math.cos(tilt)-v*Math.sin(tilt)];
  }
  function rod(a:Point,b:Point,color='#78716c',w=3) {
    const [x,y,d]=project(a),[xx,yy,dd]=project(b);
    items.push({depth:(d+dd)/2,node:<line x1={x} y1={y} x2={xx} y2={yy} stroke={color} strokeWidth={w} strokeLinecap="round"/>});
  }
  function bead(a:Point,r:number,color:string,ry=r) {
    const [x,y,depth]=project(a);
    items.push({depth,node:<g><ellipse cx={x} cy={y} rx={r} ry={ry} fill={color}/><ellipse cx={x} cy={y} rx={r} ry={ry} fill="url(#lesson-light)"/></g>});
  }
  function face(points:Point[],color:string) {
    const pts=points.map(project);
    items.push({depth:pts.reduce((s,a)=>s+a[2],0)/pts.length,node:<polygon points={pts.map(a=>a.slice(0,2).join(',')).join(' ')} fill={color} stroke="#64748b" strokeWidth=".8"/>});
  }
  function box(x:number,y:number,z:number,w:number,h:number,d:number,color:string) {
    const a:Point=[x,y,z],b:Point=[x+w,y,z],c:Point=[x+w,y+h,z],e:Point=[x,y+h,z];
    const front=(v:Point):Point=>[v[0],v[1],v[2]+d];
    face([a,b,front(b),front(a)],color);face([a,e,front(e),front(a)],color);face([b,c,front(c),front(b)],color);face([front(a),front(b),front(c),front(e)],color);
  }
  function text(a:Point,t:string) {const [x,y]=project(a);labels.push(<text x={x} y={y} textAnchor="middle" fontSize="12" fill="#292524" stroke="#fafaf9" strokeWidth="3" paintOrder="stroke">{t}</text>);}
  function illustration(a:Point,node:ReactNode,layer?:number){
    const [x,y,d]=project(a);
    items.push({depth:layer??d,node:<g transform={`matrix(${.89*Math.cos(theta)} ${-.89*Math.sin(theta)*Math.sin(tilt)} 0 ${.89*Math.cos(tilt)} ${x} ${y})`}>{node}</g>});
  }
  function ring(cx:number,cy:number,rx:number,ry:number,z:number,color:string, dz=0) {
    const at=(i:number):Point=>{const a=i*Math.PI/24;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a),z+dz*Math.sin(a)];};
    for(let i=0;i<48;i++)rod(at(i),at(i+1),color,2);
  }
  function ramp(x:number,w:number,h:number,q:number) {
    face([[x,160-h,18],[x+w,160,18],[x,160,18]],'#be956d');
    face([[x,160-h,-18],[x+w,160,-18],[x+w,160,18],[x,160-h,18]],'#ddd6fe');
    if(id==='work-energy'){
      const y=153-h*(1-q);
      box(x+w*q-7,y-8,14,14,14,10,'#b58b5f');
      rod([x+w*q-6,y-7,25],[x+w*q+6,y+4,25],'#775638',2);
    }else bead([x+w*q,152-h*(1-q),20],8,'#458993');
  }
  switch(id) {
    case 'cell-structure': {
      illustration([0,0,-14],<CellInterior/>,-500);
      illustration([136,106,9],<NucleusCutaway/>,0);
      illustration([266,112,14],<g fill="#6998ad" stroke="#416e86" strokeWidth="1.6"><path d="M-14 0Q-18-10-11-14Q-4-18 0-13Q9-16 14-6L12 0Q2 5-14 0Z"/><path d="M-14 5Q-9 1 0 5T13 3Q13 15-1 14T-14 5Z"/></g>,2);
      const q=clamp(p*3-1);
      for(let i=0;i<1+Math.floor(clamp(p*3)*7);i++) bead([129+114*q+i*3.3,105+3*Math.sin(i+p*18),27],3.2,'#f59e0b');
      for(let i=0;i<Math.floor(clamp(p*3-2)*11);i++)bead([277+i*5,110-8*Math.sin(i*.6+p*8),18+i],4,green);
      text([134,157,5],'Nucleus');text([269,146,14],'Ribosome');text([212,20,-14],'Animal cell · cutaway');text([309,59,-14],'Mitochondrion');break;
    }
    case 'cell-explorer': {
      const split=clamp((p-.5)*4),pinch=clamp((p-.75)*5);
      for(const side of [-1,1]){
        const cx=220+side*pinch*73,rx=144-pinch*78;
        illustration([cx,108,-8],<g><ellipse rx={rx} ry="66" fill="#f9e2d6" stroke="#b5787c" strokeWidth="3"/><g transform={`translate(${side*rx*.53} 26) scale(.47)`}><Mitochondrion/></g></g>,-500);
        if(split>0 && pinch<.9) for(const y of [86,124])rod([220+side*117,108,0],[220+side*(5+split*68),y,4],'#c7abb4',1);
        ring(220+side*pinch*73,108,144-pinch*78,67,0,'#ca8a04');ring(220+side*pinch*73,108,144-pinch*78,18,0,'#fde68a',42);
        for(let i=0;i<2;i++){const x=220+(i?26:-26)*(1-clamp((p-.25)*4))+side*(3+split*68), y=86+i*38;
          rod([x+side*6,y-12,i*8],[x,y,i*8+4],i?blue:purple,4);rod([x,y,i*8+4],[x+side*6,y+12,i*8],i?blue:purple,4);}
        if(pinch>.1)ring(cx,106,29,41,10,'#a48fa8');
      }text([220,205,0],pinch>.85?'Two daughter cells':'Chromosomes inside the cell');break;
    }
    case 'cell-size':
      for(let i=0;i<4;i++){box(60+80*i,80,-12,80,56,24,'#b5c892');illustration([60+80*i,80,14],<g><path d="M3 4Q39 1 76 5L75 51Q43 56 4 51Z" fill="#eceac9" stroke="#84986c"/><path d="M13 11Q41 7 68 11L67 43Q40 49 19 44Z" fill="#f6f5dc"/></g>);bead([70+80*i,106,16],5,'#8a739c');}
      rod([60,64,20],[380,64,20]);text([220,48,20],'Field width: 200 µm');rod([60,145,18],[60+320*clamp(p*3-1),145,18],purple);
      if(p>=2/3)text([220,183,10],'Four cells · about 50 µm each');break;
    case 'pendulum-projectile': {
      const a=-1.05*Math.cos(clamp(p*3)*Math.PI/2),f=clamp((p-1/3)*1.65);
      const pos:Point=[175+94*Math.sin(a)+150*f,22+94*Math.cos(a)+68*f*f,0];
      box(60,192,-38,300,5,76,'#d6d3d1');rod([175,22,-25],[175,22,12]);if(p<1/3)rod([175,22,0],pos);else for(let i=0;i<18;i++){const q=f*i/18;bead([175+150*q,116+68*q*q,0],1.4,gold);}
      rod([82,190,-26],[82,22,-26],'#526570',6);rod([82,22,-26],[175,22,-26],'#526570',5);box(62,185,-36,41,6,22,'#687883');
      bead(pos,8,'#768997');text([176,12,0],'Pivot');break;
    }
    case 'motion-graphs': {
      rod([48,38,0],[392,38,0]);box(43+335*p*p,24,-8,16,13,16,purple);
      for(const dx of [2,15])for(const z of [-9,10])bead([43+335*p*p+dx,36,z],3.6,'#334155');
      rod([48,178,0],[392,178,0]);rod([48,178,0],[48,65,0]);for(let i=0;i<30;i++){const q=p*i/30,r=p*(i+1)/30;rod([48+344*q,178-104*q*q,0],[48+344*r,178-104*r*r,0],purple);}
      text([94,80,0],'Position (m)');text([220,205,0],'Time (s)');break;
    }
    case 'forces-newton': {
      const q=clamp((p-1/3)*1.5),x=122+165*q*q;box(32,150,-40,365,4,80,'#e7e5e4');box(x-22,104,-20,44,45,40,'#fde68a');
      for(const y of [109,123,143])rod([x-20,y,21],[x+20,y,21],'#bc8f5f',1.5);rod([x-18,143,22],[x+18,110,22],'#956f4a',4);
      for(const dir of [-1,1]){const end=x+dir*(55+(dir===1?45*clamp(q*5):0)),c=dir===1?purple:'#be123c';rod([x+dir*22,122,22],[end,122,22],c);rod([end-dir*7,116,22],[end,122,22],c);rod([end-dir*7,128,22],[end,122,22],c);text([end,96,20],dir===1?'Push':'Friction');}break;
    }
    case 'scientific-inquiry':
    case 'work-energy':
      for(let i=0;i<2;i++){const inquiry=id==='scientific-inquiry',w=inquiry?(i?146:73):(i?92:178),h=inquiry?w*.55:85,x=30+208*i,q=inquiry?clamp((p-i*.35)/(i?.47:.33))**2:1-clamp((p-.08)/.82);ramp(x,w,h,q);text([x+w/2,189,0],inquiry?(i?'Longer path':'Shorter path'):(i?'Steeper ramp':'Gentler ramp'));}break;
    case 'bohr-atom':
      for(let i=0;i<2;i++)ring(220,108,42+40*i,37+34*i,0,'#94a3b8',17+17*i);
      for(let i=0;i<12;i++){const a=i*2.4, r=4+Math.sqrt(i)*3;bead([220+r*Math.cos(a),108+r*Math.sin(a),6*Math.sin(a*2)],6,i%2?'#ba5359':'#8b99aa');}
      for(let i=0;i<6;i++){const q=clamp((p-.22-i*.10)*8),inner=i<2,r=inner?42:82,a=i*Math.PI/(inner?1:2)+p*.8;if(q)bead([392+(220+r*Math.cos(a)-392)*q,36+(72+(inner?37:71)*Math.sin(a))*q,(inner?17:34)*Math.sin(a)*q],6,blue);}
      text([220,209,0],'Carbon-12 · shell model, not to scale');break;
    case 'sound-waves':
      box(3,70,-12,15,57,24,'#505d69');illustration([17+2*Math.sin(p*20),99,13],<path d="M-2-12L10-24V24L-2 12Z" fill="#7a8c97" stroke="#35414b"/>);
      for(let i=0;i<24;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++)bead([35+16*i+9*Math.sin(i*.55-p*20),77+j*19,(k-1)*20],3,i===11? '#be123c':blue);
      text([220,172,0],'Compression bands travel right →');break;
    case 'tissues-joints': {
      const a=.2+1.88*clamp((p-.13)/.77);
      illustration([220,166,-9],<g transform={`rotate(${-a*180/Math.PI})`}><path d="M-8 7Q-16-12 4-14Q31-21 62-13L111-8L123-13Q137-15 146-8L154-3Q154 1 147 0L137-2L150 5Q151 9 145 8L126 4Q120 11 105 6Q48 8 6 15Z" fill="#eed1ba" stroke="#c29980"/></g>,-150);
      illustration([145,53,-12],<path d="M-12 7Q-22-15-6-19Q13-25 28 5L83 100Q98 130 70 128Q52 113 42 83Z" fill="#eed1ba" stroke="#c29980"/>,-151);
      rod([144,52,0],[220,166,0],'#bcae91',13);rod([220,166,0],[220+132*Math.cos(a),166-132*Math.sin(a),0],'#bcae91',13);
      const dx=220+36*Math.cos(a)-148,dy=166-36*Math.sin(a)-57,len=Math.hypot(dx,dy);
      illustration([148,57,12],<g transform={`rotate(${Math.atan2(dy,dx)*180/Math.PI}) scale(${len/100} 1)`}><path d="M0 0Q12 0 24-5Q48-23 73-7Q86-1 100 0Q86 1 73 5Q46 13 24 4Z" fill="#c57570" stroke="#a25d55"/></g>,160);text([134,94,10],'Biceps');text([220,196,0],'Elbow');break;
    }
    case 'mixtures-lab':
      illustration([212,0,-12],<g fill="none" stroke="#81a0ad" strokeWidth="2"><path d="M-74 82L-70 185Q-69 201-56 202H58Q71 201 72 186L75 82L82 77"/><path d="M-69 182Q-17 178 70 182V193Q68 199 58 199H-56Q-66 198-69 191Z" fill="#cfeaf5"/>{[105,123,141,159].map(y=><path key={y} d={`M54 ${y}h13`}/>)}</g>,-150);
      box(158,15,-4,108,176,3,'#fff7dc');face([[159,176-148*p,1],[265,176-148*p,1],[265,190,1],[159,190,1]],'#bae6fd');
      for(let i=0;i<3;i++)bead([212,167-(32+i*42)*p,3],14,[gold,'#e11d48',purple][i],5);text([328,179-148*p,1],'Solvent front');break;
    case 'reproduction-life': {
      illustration([220,184,-28],<g stroke="#bd778b" fill="#efb6bf"><path d="M0-4Q-88-24-129-109Q-157-165-124-157Q-65-151-24-63Z"/><path d="M-8-8Q-37-106-12-160Q4-194 24-164Q52-117 16-37Z"/><path d="M8-5Q52-113 128-144Q160-152 145-116Q105-39 8-5Z"/><path d="M-61-29Q-30-20 0-4Q38-18 67-29Q39 0 3 6L0 30H-6V6Q-40 0-61-29Z" fill="#7ea57b" stroke="#54774f"/></g>,-400);
      const q=clamp(p*3),tube=clamp(p*3-1),travel=clamp(p*3-2);rod([118,164,-4],[118,72,-4],green,8);bead([118,66,-4],11,gold);rod([260,53,0],[260,147,0],'#86efac',16);bead([260,155,0],28,'#86efac');bead([260,155,22],8,'#fff');
      rod([260,53,12],[260,53+102*tube,12],purple);bead([118+142*q,62-9*q-30*Math.sin(q*Math.PI),-4+16*q],6,gold);if(travel)bead([260,53+102*travel,16],4,purple);
      text([118,190,0],'Anther');text([310,52,0],'Stigma');text([313,165,0],'Ovule');break;
    }
    case 'biodiversity-tree':
      illustration([33,117,5],<g transform="scale(1.35)"><LeafSprig/></g>);
      for(let i=0;i<3;i++){const z=i*14,x=72+i*24,w=296-i*48,y=36+i*60;box(x,y,z,w,32,9,clamp((p-i*.32)*4)>.1?['#bbf7d0','#99f6e4','#ddd6fe'][i]:'#e7e5e4');text([220,y+21,z+11],['Plants: fern · pine · mango','Flowering plants: mango','Mangifera indica'][i]);}bead([55+46*p,50+123*p,22*p],6,green);break;
    case 'earth-system': {
      illustration([305,122,-48],<g><path d="M-132 20L-81-47L-58-24L-24-74L18-19L40-42L89 10Z" fill="#92aaa6"/><path d="M-43-47L-24-74L-7-51L-20-56L-25-51L-29-57Z" fill="#f2f5ef"/></g>,-200);
      face([[25,170,-45],[320,120,-45],[320,120,45],[25,170,45]],'#bbf7d0');box(25,167,-45,120,4,90,'#7dd3fc');bead([64,45,-22],17,'#facc15');for(let i=0;i<4;i++)bead([175+i*38,59,-8+i*4],23,'#dbeafe');
      const pts:Point[]=[[90,165,24],[180,63,-8],[300,63,4],[313,123,8],[90,165,24]],n=Math.min(3,Math.floor(p*4)),q=p*4-n,a=pts[n],b=pts[n+1];bead([a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q,a[2]+(b[2]-a[2])*q],7,blue);text([110,198,20],'Sea');text([317,170,16],'Land');break;
    }
    default: throw new Error(`Missing 3D lesson: ${id}`);
  }
  return <div className="lesson-scene my-3 rounded-xl bg-stone-50">
    <svg viewBox="0 0 440 224" className="w-full max-h-[40vh]" role="img" aria-label={`${title} · ${flat?'2D':'3D'}`}>
      <defs><radialGradient id="lesson-light" cx="34%" cy="25%" r="76%"><stop stopColor="white" stopOpacity=".48"/><stop offset=".5" stopColor="white" stopOpacity="0"/><stop offset="1" stopColor="#18181b" stopOpacity=".32"/></radialGradient></defs>
      {items.sort((a,b)=>a.depth-b.depth).map((item,i)=><g key={i}>{item.node}</g>)}{labels.map((l,i)=><g key={i}>{l}</g>)}
    </svg>
    {!flat && <label className="flex items-center justify-center gap-2 pb-2 text-xs">Rotate view <input type="range" min="-55" max="55" value={yaw} onChange={e=>setYaw(+e.target.value)}/></label>}
  </div>;
}
