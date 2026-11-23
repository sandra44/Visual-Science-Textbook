import { Ball, Label, blue, clamp, gold, green, ink, mix, times, type SceneProps } from './ChemistryArt';

const proton='#f09a86', neutron='#94b8ce', tau=Math.PI*2;
function Nucleus({x,y=97,z,n,r=10,flat,p=1}:{x:number;y?:number;z:number;n:number;r?:number;flat:boolean;p?:number}){
  // Fill a close-packed hexagonal grid from its centre; interleave both species.
  const sites=Array.from({length:81},(_,i)=>{const row=Math.floor(i/9)-4,col=i%9-4;return [(col+Math.abs(row%2)*.5)*1.9*r,row*r*1.7];}).sort((a,b)=>a[0]**2+a[1]**2-b[0]**2-b[1]**2);
  return <g>{times(z+n,i=>{const isP=Math.floor((i+1)*z/(z+n))>Math.floor(i*z/(z+n)),[dx,dy]=sites[i];return <Ball key={i} x={x+dx*(1.2-.2*p)} y={y+dy*(1.2-.2*p)} r={r} color={isP?proton:neutron} label={isP?'+':'0'} flat={flat}/>;})}</g>;
}
function NuclearCounts({number,p,flat}:SceneProps){
  const isobars=number==='8.9.2',pair=isobars||number==='8.9.1'||number==='8.9', mass=number==='8.6';
  if(pair)return <g>{[0,1].map(i=>{const z=isobars?(i?20:18):6,n=isobars?40-z:i?(number==='8.9'?7:8):6,x=128+224*i;
    return <g key={i}><Label x={x} y={22}>{isobars?(i?'Calcium':'Argon'):'Carbon'}-{z+n}</Label><Nucleus x={x} z={z} n={n} r={isobars?7.5:11} flat={flat} p={p}/><Label x={x} y={161}>{z} protons · {n} neutrons</Label></g>;
  })}<Label>{isobars?'Same mass number, different atomic numbers':'Different neutron counts, same element'}</Label></g>;
  const n=mass?7:6;
  return <g><Nucleus x={176} y={101} z={6} n={n} r={17} p={p} flat={flat}/><Label x={355} y={74} color="#913f32">6 protons (+)</Label><Label x={355} y={105}>{n} neutrons (0)</Label><Label x={355} y={142} size={22}>{mass?'6 + 7 = 13':number==='8.5'?'Z = 6':'¹²C'}</Label><Label>{mass?'Carbon-13 · mass number counts all nucleons':number==='8.5'?'Six protons identify carbon':'The nucleus holds almost all the atomic mass'}</Label></g>;
}
function Electron({x,y}:{x:number;y:number}){return <circle cx={x} cy={y} r="4.5" fill={blue} stroke="#173e57"/>;}
function Shell({number,p,flat}:SceneProps){
  const neon=number==='8.7', oxygen=number==='8.8',x=220,y=101;
  const radii=[34,70], high=p>=.36&&p<.7;
  return <g>{radii.map(r=><circle key={r} cx={x} cy={y} r={r} stroke="#8ea7b6" strokeWidth="1.6"/>)}<Ball x={x} y={y} r={17} color={proton} label={neon?'Ne':oxygen?'O':'H'} flat={flat}/>
    {neon||oxygen?<>{times(neon?Math.floor(10*p+.00001):8,i=>{const r=i<2?34:70,a=i<2?Math.PI*i:tau*(i-2)/8;return <Electron key={i} x={x+r*Math.cos(a)} y={y+r*Math.sin(a)}/>;})}
      {oxygen&&[6,7].map(i=>{const a=tau*i/8,xx=x+Math.cos(a)*(122-30*p),yy=y+Math.sin(a)*(100-12*p);return <g key={i}><Ball x={xx} y={yy} r={11} label="H" color="#d4eced" flat={flat}/><circle cx={xx-Math.cos(a)*15} cy={yy-Math.sin(a)*15} r="3" fill={green}/></g>;})}</>:<><Electron x={x+(high?70:34)*Math.cos(tau*p)} y={y+(high?70:34)*Math.sin(tau*p)}/><g transform={`translate(${p<.36?70+275*p:245+260*clamp((p-.7)/.3)} 101)`} opacity={high?0:1}><path d="M-16 0q4-14 8 0t8 0t8 0t8 0" stroke="#d79218" strokeWidth="3"/></g></>}
    <Label x={366} y={92}>{neon?`${Math.min(2,Math.floor(10*p))} in K`:oxygen?'6 outer electrons':high?'Excited state':'Lower energy'}</Label>
    <Label x={366} y={115}>{neon?`${Math.max(0,Math.floor(10*p)-2)} in L`:oxygen?'2 bonding sites':p<.36?'Photon arriving':high?'Energy absorbed':'Photon emitted'}</Label>
    <Label>{neon?'Neon · 2 electrons in K, 8 in L':oxygen?'Two H atoms can each share a pair with oxygen':'Hydrogen · only discrete shell energies are allowed'}</Label></g>;
}
function Models({number,p,flat}:SceneProps){
  const single=number==='8.2.1',stage=single?0:Math.min(2,Math.floor(p*3)),x=210,y=100;
  return <g>{stage===0?<><Ball x={x} y={y} r={75} color="#f3c2b6" flat={flat}/>{times(6,i=>{const a=i*tau/6+p*.24;return <g key={i}><Label x={x+47*Math.cos(a)} y={y+47*Math.sin(a)+4} color="#af554c">+</Label><Ball x={x+34*Math.cos(a+.48)} y={y+34*Math.sin(a+.48)} r={8} color="#89bbd8" label="−" flat={flat}/></g>;})}</>:<><circle cx={x} cy={y} r={75} stroke={stage===1?'#cbd8dd':'#7a99ac'} strokeDasharray={stage===1?'3 5':undefined}/>{stage===2&&<circle cx={x} cy={y} r={36} stroke="#7a99ac"/>}<Ball x={x} y={y} r={10} color={proton} label="+" flat={flat}/>{times(6,i=>{const r=stage===2?(i<2?36:75):34+i*7,a=(i<2&&stage===2?i*Math.PI:stage===2?(i-2)*tau/4:i*tau/6)+p;return <Electron key={i} x={x+r*Math.cos(a)} y={y+r*Math.sin(a)}/>;})}</>}
    <Label x={367} y={86}>{['Thomson','Rutherford','Bohr'][stage]}</Label><Label x={367} y={110} size={12}>{['Diffuse positive charge','Compact positive nucleus','Discrete energy levels'][stage]}</Label><Label>{stage===0?'Embedded electrons balance the positive charge':stage===1?'Most of the atom is empty space':'Electrons occupy particular energy levels'}</Label></g>;
}
export default function Atoms(props:SceneProps){
  const {number,p,flat}=props;
  switch(number){
    case '8.1':return <g><path d="M56 128l15-58 58-29 50 46-14 61-61 13Z" fill="#a8cddb" stroke={ink}/><path d="M71 70l54 27 54-10M125 97l-21 64" stroke="#6090a1"/><circle cx="147" cy="105" r="13" stroke={ink}/><path d="M157 96l120-53M157 114l120 52" stroke="#809ba8" strokeDasharray="4 4"/><circle cx="328" cy="103" r="71" fill="#eaf5f4" stroke={ink}/>{times(37,i=>{const a=i*2.39996,r=9.5*Math.sqrt(i);return <Ball key={i} x={328+(r+1.4*Math.sin(p*8+i))*Math.cos(a)} y={103+r*Math.sin(a)} r={6+p} color="#94bfcd" flat={flat}/>;})}<Label>Crystal sample and inferred particle model · not to scale</Label></g>;
    case '8.2':case '8.2.1':return <Models {...props}/>;
    case '8.2.2':return <g><path d="M223 47l13-10v129l-13 10Z" fill={gold} stroke="#947342"/><Label y={25}>Thin gold foil</Label>{times(9,i=>{const y=55+i*12,endX=i===4?119:435,endY=i===4?32:i===6?165:y+(i%3-1)*2,t=clamp((p-.5)*2),x=p<.5?mix(38,230,p*2):mix(230,endX,t),yy=mix(y,endY,t);return <g key={i}><path d={`M38 ${y}H${Math.min(230,p<.5?x:230)}${p>=.5?`L${x} ${yy}`:''}`} stroke={i===4?'#bf6c30':'#87a7b5'} strokeWidth="1.7"/><Ball x={x} y={yy} r={3.7} flat={flat} color={gold}/></g>;})}<Label>Most tracks continue straight; a rare track turns back</Label></g>;
    case '8.2.3':case '8.7':case '8.8':return <Shell {...props}/>;
    case '8.3':case '8.5':case '8.6':case '8.9':case '8.9.1':case '8.9.2':return <NuclearCounts {...props}/>;
    case '8.3.1':{const hit=clamp((p-.5)*2);return <g><path d="M199 56l15-11h65v85l-16 14h-64Z" fill="#efdaa6" stroke="#9d8962"/><path d="M199 56h64v88m0-88 16-11" stroke="#b39c6e"/><Label x={239} y={170}>Paraffin</Label><path d={`M42 98H${mix(42,216,clamp(p*2))}`} stroke={blue} strokeDasharray="5 4"/><Ball x={mix(42,216,clamp(p*2))} y={98+hit*17} r={9} color={neutron} label="0" flat={flat}/><Ball x={mix(232,399,hit)} y={98-30*hit} r={9} color={proton} label="+" flat={flat}/><Label x={98} y={70}>Neutron</Label><Label x={370} y={115}>Recoil proton</Label><Label>Neutral radiation displaces hydrogen nuclei</Label></g>;}
    case '8.4':return <g><rect x="50" y="45" width="138" height="112" fill="#c1dacc" stroke="#66907c"/><Label x={74} y={70}>27</Label><Label x={119} y={119} size={45}>Co</Label><Label x={119} y={148}>Cobalt</Label><g opacity={.25+.75*p}><path d="M308 93h49m-49 7h49m-49 7h49" stroke={ink} strokeWidth="2"/><Ball x={296} y={100} r={22} color="#98a3ad" label="C" flat={flat}/><Ball x={365} y={100} r={22} color={proton} label="O" flat={flat}/><Label x={330} y={149}>CO · carbon monoxide</Label></g><Label>Co is one element; CO contains two element symbols</Label></g>;
    default:throw new Error(`Unknown atomic scene: ${number}`);
  }
}
