// Original cutaway illustrations; coordinates are local to each specimen.
export function Mitochondrion() {
  return <g strokeLinejoin="round"><path d="M-25 2C-26-10-11-15 0-10C10-4 16-11 23-5C34 8 12 17-1 11C-11 6-22 14-25 2Z" fill="#fbad82" stroke="#97492a" strokeWidth="1.8"/>
    <path d="M-20 1Q-17-8-13-6L-12 4Q-9 8-8-3T-2 1Q0 11 3 3T9 2Q10 9 13 5L17-1Q21-5 22 1" fill="none" stroke="#a3482c" strokeWidth="2"/></g>;
}

export function CellInterior() {
  return <g><defs>
    <radialGradient id="cytoplasm" cx=".34" cy=".32" r=".85"><stop stopColor="#fff7df"/><stop offset=".66" stopColor="#f7ddd1"/><stop offset="1" stopColor="#cb9596"/></radialGradient>
    <pattern id="cytosol-grain" width="19" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".8" fill="#a46a69"/><circle cx="14" cy="10" r=".6" fill="#a46a69"/></pattern>
    </defs>
    <path id="section-outline" d="M56 116C48 85 73 57 109 51C143 44 147 31 181 34C220 38 231 23 269 34C295 44 309 43 339 57C372 73 397 101 384 130C372 161 339 161 311 178C280 197 250 181 216 190C179 202 152 182 124 181C84 179 62 151 56 116Z" fill="url(#cytoplasm)" stroke="#965d68" strokeWidth="5"/>
    <use href="#section-outline" fill="none" stroke="#fff1da" strokeWidth="1" transform="translate(3 1.5) scale(.985)"/>
    <path d="M66 110Q74 46 170 44Q310 16 377 99Q401 155 284 182Q97 207 66 110Z" fill="url(#cytosol-grain)" opacity=".5"/>
    <g transform="translate(296 72) rotate(12)"><Mitochondrion/></g>
    <g transform="translate(190 158) rotate(-18) scale(.85)"><Mitochondrion/></g>
    {[0,1,2,3].map(i=><path key={i} d={`M211 ${51+i*5}q12 10 26 6t19 -5`} stroke="#b77851" strokeWidth="3" fill="none"/>)}
    {[0,1,2].map(i=><g key={i} transform={`translate(${-i*4} ${i*6})`}><path d="M94 91Q80 111 96 127T131 141" stroke="#a88daa" strokeWidth="3" fill="none"/><path d="M94 91Q80 111 96 127T131 141" stroke="#675675" strokeWidth="2" strokeDasharray="1 5" fill="none"/></g>)}</g>;
}

export function NucleusCutaway(){
  return <g><path d="M36 -7C36-24 18-33-2-32C-27-34-40-17-37 4C-38 27-15 36 5 32C23 32 36 19 37 6" fill="#dbcee6" stroke="#7c608b" strokeWidth="3"/>
    <path d="M32 -7C28-30 2-34-18-23M-29 15Q-8 41 22 22" fill="none" stroke="#a58bb2" strokeWidth="2"/>
    <path d="M-25-7c5-13 11 10 16-3s11-9 15-1s11-6 16-2M-20 14q9 8 16-1t15-2" fill="none" stroke="#846a99" strokeWidth="2"/>
    <ellipse cx="-10" cy="-16" rx="8" ry="6" fill="#896694"/><path d="M34-7l6 1m-6 12l6-1" stroke="#6d4d7c" strokeWidth="3"/></g>;
}

export function LeafSprig(){
  return <g fill="#66a266" stroke="#396940" strokeWidth="1.3"><path d="M0 25Q6 3 19-23" fill="none" strokeWidth="2"/>
    <path d="M7 6Q-9 7-14-9Q1-10 7 6Zm4-10Q22-19 33-13Q24-1 11-4Zm5-10Q8-25 14-34Q23-28 16-14Z"/>
    <path d="M5 5L-9-6M13-5l15-7" fill="none"/><path d="M7 4q7 4 5 11" fill="none"/><path d="M13 13c9-3 13 5 10 12s-11 13-17 8c-6-7-1-18 7-20Z" fill="#ebb85a"/></g>;
}
