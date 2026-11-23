import { Arm, many, Note, Onion, phase, type SceneProps } from './CellsArt';
const green='#56835b', leaf='#9fc184';
function Shoot({x,p}:{x:number;p:number}) {
  const y=74-36*p;
  return <g><path d={`M${x-8} 178V${y+14}q1 -18 8 -23q9 8 8 23v${164-y}Z`} fill="#aacb8c" stroke={green} strokeWidth="2"/>
    {[0,1,2].map(i=><g key={i} transform={`translate(${x} ${y+26+i*27}) scale(${i%2?-1:1} 1)`}><path d="M0 4q-24 -42 -57 -45q10 41 57 45Z" fill={leaf} stroke={green} strokeWidth="2"/><path d="m-49 -35 43 34" stroke={green}/></g>)}
    <path d={`M${x-5} ${y+7}q0 -10 5 -14q6 6 5 14Z`} fill="#c67d56"/></g>;
}
export default function Plant({p,number,flat}:SceneProps){
  switch(number){
    case '3.1':return <g><Shoot x={127} p={0}/>{many(3,i=><path key={i} d={`M${123+i*4} 177v-73`} stroke="#71945c" strokeWidth="2"/>)}<Arm x={316} y={156} angle={19-68*p} scale={.92}/><Note x={122} y={202}>Stem · thick supporting walls</Note><Note x={349} y={202}>Limb · muscles move bones</Note></g>;
    case '3.2':return <g><Shoot x={126} p={p}/><path d={`M135 ${72-36*p}L248 42m-113 ${44-36*p} 113 77`} fill="none" stroke="#a3ac8d" strokeDasharray="4 4"/>
      <path d="M249 177V94q0 -58 48 -68q50 12 50 68v83Z" fill="#e0eac5" stroke={green} strokeWidth="2"/>{many(6,i=><g key={i}><path d={`M${254+i*17} 177V${52+Math.abs(i-2.5)*11}`} stroke="#85a576"/><path d={`M253 ${72+i*9+(i*i*p)}h88`} stroke="#85a576"/></g>)}<Note x={299} y={20}>Apical meristem</Note><Note x={300} y={201}>Cells elongate below tip</Note></g>;
    case 'Activity 3.1':return <g>{[103,359].map((x,i)=><g key={x}><path d={`M${x-56} 91l7 92h98l7 -92`} fill="#e5f0ed" stroke="#779ca6" strokeWidth="2"/><path d={`M${x-53} 109q53 6 106 0`} fill="none" stroke="#8bb9c5"/><Onion x={x} y={69} length={i?63:65+41*p} cut={!!i}/></g>)}<path d="M54 136h98m155 0h100" stroke="#8b9184" strokeDasharray="3 4"/><Note x={106} y={205}>Intact root grows past mark</Note><Note x={359} y={205}>Cut root · tip removed</Note></g>;
    case '3.2.2':{
      const rx=71+38*p,ry=flat?rx*.66:rx*.53;
      return <g>{!flat&&<path d={`M${225-rx} 99v25a${rx} ${ry} 0 0 0 ${rx*2} 0V99Z`} fill="#986851" stroke="#79563a" strokeWidth="2"/>}
        <ellipse cx="225" cy="99" rx={rx} ry={ry} fill="#b98458" stroke="#79563a" strokeWidth="3"/><ellipse cx="225" cy="99" rx={rx-7} ry={ry-4} fill="#edc790" stroke="#63935c" strokeWidth="4"/>
        {many(5,i=><ellipse key={i} cx="225" cy="99" rx={11+i*12} ry={(11+i*12)*ry/rx} fill="none" stroke="#ae7f53" strokeWidth="1.6"/>)}{many(3,i=><ellipse key={i} cx="225" cy="99" rx={66+i*10} ry={(66+i*10)*ry/rx} opacity={phase(p,.15+i*.25,.42+i*.25)} fill="none" stroke="#b38e5d" strokeWidth="1.5"/>)}
        <path d={`M${225+rx-8} 94l36 -36h38`} stroke={green} fill="none"/><Note x={375} y={47}>Cambium ring</Note><Note x={221} y={200}>New wood widens the stem</Note></g>;
    }
    case '3.2.3':return <g><path d="M45 159q196 -12 388 0v28H45Z" fill="#d3b899"/>{many(13,i=>{const x=80+i*25,dx=21*Math.sin(3.2+i),h=37+45*p+15*Math.sin(i*2);return <g key={i}><path d={`M${x} 161q${dx} -21 ${dx-8} ${-h}l10 -2q${3-dx} 36 0 ${h+2}Z`} fill={i%2?leaf:'#78a870'} stroke={green}/><path d={`M${x} 159l2 -10`} stroke="#d7ad56" strokeWidth="6"/><path d={`M${x} 162l-6 15m6 -15 8 18`} stroke="#9d815a"/></g>;})}
      <path d="M68 121h334" stroke="#a9755a" strokeDasharray="4 5"/><Note x={371} y={105}>Original cut</Note><Note x={236} y={207}>New growth from the blade base</Note></g>;
    case '3.2.4':return <g>{many(3,i=><g key={i}><rect x="191" y={24+i*57} width="66" height="57" rx={7*(1-p)} fill="#d9e8cc" stroke="#88a574" strokeWidth="2"/><ellipse cx="222" cy={53+i*57} rx="9" ry="6" fill="#9582a2" opacity={1-phase(p,0,.65)}/><path d={`M194 ${80+i*57}h60`} stroke="#d9e8cc" strokeWidth="7" opacity={p}/></g>)}
      {many(8,i=><path key={i} d={`M191 ${33+i*21}q29 17 65 0`} stroke="#a57a4f" strokeWidth={1+5*p} opacity={p} fill="none"/>)}{many(5,i=><path key={i} d={`M${204+i%2*28} ${179-((i*30+84*phase(p,.55,1))%142)}v-12m-4 5 4 -5 4 5`} stroke="#458fab" strokeWidth="2.5" opacity={phase(p,.5,.85)} fill="none"/>)}
      <Note x={104} y={95}>{p<.55?'Living daughter cells':'Open vessel lumen'}</Note><Note x={356} y={113}>Thickening walls</Note><Note x={231} y={209}>{p<.5?'Developing xylem':'Water rises through xylem'}</Note></g>;
    default:throw new Error(`Unknown plant tissue scene: ${number}`);
  }
}
