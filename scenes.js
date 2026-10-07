const Scenes=(()=>{
let uid=0;
const rng=seed=>{let s=(seed>>>0)||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}};
const R=n=>Math.round(n*10)/10;
const WC=['#f5d77a','#ffe0a6','#ffd18a','#a9d6ff'];

function defs(id,top,mid,bot,glowX,glowY,glowC){
 return `<defs><linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".6" stop-color="${mid}"/><stop offset="1" stop-color="${bot}"/></linearGradient>
 <radialGradient id="gl${id}" cx="${glowX}" cy="${glowY}" r=".6"><stop offset="0" stop-color="${glowC}" stop-opacity=".55"/><stop offset="1" stop-color="${glowC}" stop-opacity="0"/></radialGradient>
 <linearGradient id="fg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06080e" stop-opacity="0"/><stop offset="1" stop-color="#06080e" stop-opacity=".85"/></linearGradient>
 <filter id="bl${id}"><feGaussianBlur stdDeviation="3"/></filter></defs>
 <rect width="400" height="240" fill="url(#sk${id})"/><rect width="400" height="240" fill="url(#gl${id})"/>`;
}
function stars(r,n,maxY){let o='';for(let i=0;i<n;i++)o+=`<circle cx="${R(r()*400)}" cy="${R(r()*maxY)}" r="${R(r()*.9+.3)}" fill="#fff" opacity="${R(r()*.6+.3)}"/>`;return o}
function skyline(r,base,minH,maxH,fill,winP,x0=-10,x1=410,antenna=true){
 let o='',x=x0;
 while(x<x1){
  const w=18+r()*28,h=minH+r()*(maxH-minH),y=base-h;
  o+=`<rect x="${R(x)}" y="${R(y)}" width="${R(w)}" height="${R(h)}" fill="${fill}"/>`;
  if(winP>0){
   for(let wy=y+6;wy<base-6;wy+=9)for(let wx=x+4;wx<x+w-5;wx+=7)
    if(r()<winP)o+=`<rect x="${R(wx)}" y="${R(wy)}" width="3.2" height="4.4" fill="${WC[r()*WC.length|0]}" opacity="${R(.5+r()*.5)}"/>`;
  }
  if(antenna&&r()<.18&&h>minH+20)o+=`<path d="M${R(x+w/2)} ${R(y)}V${R(y-14-r()*14)}" stroke="${fill}" stroke-width="1.5"/><circle cx="${R(x+w/2)}" cy="${R(y-16)}" r="1.4" fill="#e8283c"/>`;
  if(r()<.12)o+=`<rect x="${R(x+w*.25)}" y="${R(y-9)}" width="${R(w*.5)}" height="9" fill="${fill}"/><path d="M${R(x+w*.3)} ${R(y-9)}L${R(x+w*.5)} ${R(y-16)}L${R(x+w*.7)} ${R(y-9)}" fill="${fill}"/>`;
  x+=w+r()*3;
 }
 return o;
}
function spidey(x,y,s,anchorX,anchorY,rot=0){
 return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
 <path d="M6 -14L${anchorX} ${anchorY}" stroke="#e9eef9" stroke-width="${R(.9/s)}" opacity=".85"/>
 <path d="M-4 6L-14 18L-8 26M2 6L10 16L22 12" stroke="#1d4cb0" stroke-width="5" stroke-linecap="round" fill="none"/>
 <path d="M-6 -12L8 -14L9 4L-2 8L-8 4Z" fill="#d6202f"/>
 <path d="M-1 -12V8M-5 -4H7" stroke="#101420" stroke-width=".8" opacity=".6"/>
 <path d="M-6 -10L-18 -2L-12 6M6 -13L8 -22" stroke="#d6202f" stroke-width="4.5" stroke-linecap="round" fill="none"/>
 <circle cx="1" cy="-17" r="5.5" fill="#d6202f"/><path d="M-2 -19L1 -17.5L-0.5 -15.5ZM4 -19L1.4 -17.4L3 -15.4Z" fill="#fff"/>
 <path d="M-4.5 -17H6.5" stroke="#101420" stroke-width=".5" opacity=".5"/></g>`;
}
function flame(x,y,w,h,c){return `<path d="M${x} ${y}C${R(x-w)} ${R(y-h*.3)} ${R(x-w*.55)} ${R(y-h*.7)} ${x} ${R(y-h)}C${R(x+w*.1)} ${R(y-h*.6)} ${R(x+w*.95)} ${R(y-h*.5)} ${R(x+w*.6)} ${R(y-h*.12)}C${R(x+w*.5)} ${y} ${R(x+w*.2)} ${y} ${x} ${y}Z" fill="${c}"/>`}
function cat(x,y,s){
 return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 -4C-30 -6 -34 -22 -26 -30" stroke="#d9893b" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-8" rx="17" ry="10" fill="#d9893b"/>
 <path d="M-8 -17L-6 -9M0 -18L1 -10M7 -17L8 -9" stroke="#a85e1d" stroke-width="2" stroke-linecap="round"/>
 <path d="M-10 0V6M-3 0V6M8 0V6M14 -1V6" stroke="#d9893b" stroke-width="4" stroke-linecap="round"/>
 <circle cx="17" cy="-16" r="8.5" fill="#d9893b"/><path d="M10.500 -22L11 -31L16 -23ZM23.500 -22L23 -31L18 -23Z" fill="#d9893b"/><path d="M12 -23L12 -28L15 -24Z" fill="#f2a6a6"/>
 <ellipse cx="14.200" cy="-17" rx="2.300" ry="3" fill="#ffe65c"/><ellipse cx="20.800" cy="-17" rx="2.300" ry="3" fill="#ffe65c"/><ellipse cx="14.400" cy="-17" rx=".8" ry="2.400" fill="#1a1205"/><ellipse cx="20.600" cy="-17" rx=".8" ry="2.400" fill="#1a1205"/>
 <path d="M16.500 -12.500L17.500 -12.500L17 -11.500Z" fill="#f2a6a6"/><path d="M8 -14L1 -13M8 -12L1 -10M26 -14L33 -13M26 -12L33 -10" stroke="#ffe9c9" stroke-width=".5" opacity=".7"/></g>`;
}
function car(x,y,w,body,lights){
 return `<g transform="translate(${x} ${y})"><path d="M0 0H${w}L${w-4} -9L${w*.78} -15H${w*.3}L${w*.12} -9Z" fill="${body}"/><rect x="${w*.32}" y="-13" width="${w*.18}" height="5" fill="#0a0d15" opacity=".8"/><rect x="${w*.54}" y="-13" width="${w*.18}" height="5" fill="#0a0d15" opacity=".8"/><circle cx="${w*.2}" cy="1" r="3.5" fill="#05070b"/><circle cx="${w*.8}" cy="1" r="3.5" fill="#05070b"/>${lights}</g>`;
}

function rescue(seed){
 const id=++uid,r=rng(seed);
 let o=defs(id,'#0a1030','#1a2250','#3a2a50','.78','.22','#8fb6ff');
 o+=stars(r,45,90);
 o+=`<circle cx="312" cy="52" r="26" fill="#eef2ff"/><circle cx="304" cy="46" r="5" fill="#cfd6ee"/><circle cx="320" cy="60" r="7" fill="#cfd6ee"/><circle cx="318" cy="44" r="3" fill="#cfd6ee"/>`;
 o+=skyline(r,170,40,110,'#10152b',.35)+skyline(r,190,30,80,'#0b0f20',.25);
 o+=`<path d="M0 30Q100 52 200 34T400 40" stroke="#0a0d18" stroke-width="1.2" fill="none"/>`;
 let bricks='';for(let by=0;by<240;by+=7)for(let bx=(by/7%2)*9;bx<250;bx+=18)bricks+=`<rect x="${bx}" y="${by}" width="17" height="6" fill="${r()<.5?'#6a2f2a':'#5a2824'}"/>`;
 o+=`<g><rect x="0" y="0" width="250" height="240" fill="#4e211f"/>${bricks}<rect x="0" y="0" width="250" height="240" fill="url(#fg${id})"/></g>`;
 for(let i=0;i<3;i++)for(let j=0;j<2;j++){
  const wx=20+j*100,wy=18+i*66,lit=r()<.6;
  o+=`<rect x="${wx-3}" y="${wy-3}" width="46" height="50" fill="#2b1311"/><rect x="${wx}" y="${wy}" width="40" height="44" fill="${lit?'#f5c76a':'#10162c'}"/>${lit?`<rect x="${wx}" y="${wy}" width="40" height="44" fill="#ffe7a8" opacity=".35"/><path d="M${wx+4} ${wy+4}V${wy+30}Q${wx+10} ${wy+34} ${wx+20} ${wy+30}V${wy+4}Z" fill="#c43a3a" opacity=".55"/>`:''}<path d="M${wx+20} ${wy}V${wy+44}M${wx} ${wy+22}H${wx+40}" stroke="#2b1311" stroke-width="2.5"/>`;
 }
 const py=134;
 o+=`<rect x="44" y="${py}" width="220" height="5" fill="#1a1d28"/><rect x="44" y="${py+5}" width="220" height="3" fill="#0a0c14"/>`;
 for(let x=48;x<=262;x+=10)o+=`<path d="M${x} ${py}V${py-24}" stroke="#1a1d28" stroke-width="2"/>`;
 o+=`<path d="M44 ${py-24}H264" stroke="#1a1d28" stroke-width="3"/><path d="M44 ${py-12}H264" stroke="#1a1d28" stroke-width="1.5"/>`;
 o+=`<path d="M60 ${py+8}L96 ${py+40}M80 ${py+8}L116 ${py+40}" stroke="#1a1d28" stroke-width="3"/>`;
 for(let k=0;k<6;k++)o+=`<path d="M${64+k*8} ${py+10+k*5}H${84+k*8}" stroke="#1a1d28" stroke-width="2.5"/>`;
 o+=`<rect x="96" y="${py+36}" width="64" height="5" fill="#1a1d28"/><path d="M110 ${py+41}V${py+90}M148 ${py+41}V${py+90}" stroke="#1a1d28" stroke-width="2"/>`;
 for(let k=0;k<8;k++)o+=`<path d="M110 ${py+48+k*9}H148" stroke="#1a1d28" stroke-width="2"/>`;
 o+=`<ellipse cx="190" cy="${py-1}" rx="30" ry="5" fill="#d9893b" opacity=".15"/>`+cat(200,py,1.55);
 o+=`<circle cx="226" cy="${py-34}" r="17" fill="url(#gl${id})" opacity=".6"/><rect x="0" y="212" width="400" height="28" fill="#06080e"/>`;
 o+=spidey(318,142,1.35,372,28,-18);
 o+=`<rect width="400" height="240" fill="#03040a" opacity=".18"/>`;
 return o;
}
function jewel(seed){
 const id=++uid,r=rng(seed);
 let o=defs(id,'#0b0f22','#16203d','#2a2236','.3','.9','#4da3ff');
 o+=stars(r,30,70);
 o+=skyline(r,150,50,130,'#0d1226',.3)+skyline(r,170,40,90,'#090c1a',.22);
 o+=`<rect x="0" y="160" width="400" height="80" fill="#0b0d14"/><rect x="0" y="206" width="400" height="34" fill="#101420"/>`;
 o+=`<path d="M0 224H400" stroke="#2c3350" stroke-width="2" stroke-dasharray="22 16"/>`;
 o+=`<rect x="150" y="76" width="200" height="86" fill="#1b2036"/><rect x="146" y="68" width="208" height="10" fill="#c43a3a"/>`;
 for(let i=0;i<14;i++)o+=`<path d="M${150+i*14.8} 78L${148+i*14.8} 90H${162+i*14.8}Z" fill="${i%2?'#e9d9c3':'#a02a2a'}"/>`;
 o+=`<rect x="162" y="96" width="92" height="60" fill="#05070d"/><rect x="162" y="96" width="92" height="60" fill="#ffd78a" opacity=".16"/>`;
 o+=`<path d="M190 96L206 124L196 140L214 156M232 96L222 118L240 138M206 124L238 126L254 112" stroke="#dff1ff" stroke-width="1.3" fill="none" opacity=".85"/><path d="M162 156H254" stroke="#dff1ff" stroke-width="1" opacity=".5"/>`;
 o+=`<g fill="#ffd1c4" opacity=".9"><path d="M226 150l6 -4 5 4zM214 152l4 -3 3 3z"/></g>`;
 o+=`<rect x="272" y="96" width="40" height="60" fill="#10162c"/><rect x="280" y="104" width="24" height="52" fill="#07090f"/><rect x="262" y="88" width="62" height="12" rx="2" fill="#0a0d18" stroke="#4da3ff" stroke-width="1.5"/>`;
 o+=`<text x="293" y="97" font-size="8" fill="#4da3ff" text-anchor="middle" font-family="sans-serif" letter-spacing="1.5">JEWELS</text>`;
 o+=`<circle cx="46" cy="196" r="70" fill="#e8283c" opacity=".16" filter="url(#bl${id})"/><circle cx="106" cy="196" r="64" fill="#4da3ff" opacity=".16" filter="url(#bl${id})"/>`;
 o+=car(18,208,88,'#e9edf6',`<rect x="26" y="-23" width="12" height="7" fill="#e8283c"/><rect x="42" y="-23" width="12" height="7" fill="#4da3ff"/><rect x="70" y="-7" width="10" height="4" fill="#ffe9a8"/><path d="M0 -4H88" stroke="#10162c" stroke-width="5"/>`);
 o+=`<g transform="translate(114 80)"><rect x="-1.5" y="0" width="3" height="126" fill="#1b2036"/><path d="M0 0H24" stroke="#1b2036" stroke-width="3"/><ellipse cx="24" cy="3" rx="7" ry="3" fill="#ffe9a8"/><path d="M17 4L-10 126H62Z" fill="#ffe9a8" opacity=".09"/></g>`;
 o+=`<ellipse cx="206" cy="212" rx="120" ry="5" fill="#ffe9a8" opacity=".05"/><path d="M150 214H340" stroke="#4da3ff" stroke-width="1" opacity=".18"/><path d="M190 222H320" stroke="#e8283c" stroke-width="1" opacity=".18"/>`;
 o+=`<g transform="translate(292 190)"><circle cx="8" cy="-24" r="6" fill="#0a0c14"/><path d="M4 -19L14 -18L18 -4L10 -1L12 12L4 12L2 -2L-4 4L-9 0L-2 -12Z" fill="#0a0c14"/><path d="M-4 4L-14 6L-8 20L2 16" fill="#0a0c14"/><path d="M12 -2L24 -4" stroke="#0a0c14" stroke-width="3"/><path d="M22 -4Q36 -6 34 8Q32 16 22 12Z" fill="#a8742f"/><path d="M26 -2Q30 2 29 8" stroke="#6a4619" stroke-width="1.5" fill="none"/><path d="M-12 -4H-30M-14 4H-34M-12 12H-26" stroke="#aab6d6" stroke-width="1.2" opacity=".5"/></g>`;
 o+=spidey(322,34,1.2,376,-20,-12)+`<rect width="400" height="240" fill="url(#fg${id})" opacity=".5"/>`;
 return o;
}

function person(x,y,s,col,pose,extra=''){
 const L={stand:['M-3 -14L-4 0','M3 -14L4 0','M-3 -29L-8 -16','M3 -29L8 -16'],
  up:['M-3 -14L-4 0','M3 -14L4 0','M-3 -29L-10 -42','M3 -29L10 -42'],
  run:['M-2 -14L-11 -3L-14 0','M2 -14L9 -6L8 0','M-3 -29L-12 -20','M3 -29L11 -34'],
  grab:['M-3 -14L-6 0','M3 -14L7 0','M-3 -29L-8 -16','M3 -29L16 -30'],
  crouch:['M-3 -10L-9 0','M3 -10L9 0','M-3 -22L-9 -12','M3 -22L14 -14']}[pose]||[];
 return `<g transform="translate(${x} ${y}) scale(${s})"><g stroke="${col}" stroke-width="4.600" stroke-linecap="round" fill="none">${L.map(d=>`<path d="${d}"/>`).join('')}</g><path d="M0 -31V-14" stroke="${col}" stroke-width="9" stroke-linecap="round"/><circle cx="0" cy="-37" r="5.500" fill="${col}"/>${extra}</g>`;
}
function bike(x,y,s,col){return `<g transform="translate(${x} ${y}) scale(${s})" stroke="${col}" stroke-width="1.800" fill="none"><circle cx="-14" cy="0" r="10"/><circle cx="14" cy="0" r="10"/><path d="M-14 0L-4 -14L8 -14L14 0M-4 -14L2 0L-14 0M8 -14L6 -20M2 -22H10M-6 -16H-2"/></g>`}
function night(id,r,top,mid,bot,gx,gy,gc){return defs(id,top,mid,bot,gx,gy,gc)+stars(r,26,70)+skyline(r,150,50,120,'#0d1226',.25)}

function mugging(seed){
 const id=++uid,r=rng(seed);
 let o=defs(id,'#080b18','#121a34','#1a2038','.5','.1','#4da3ff');
 o+=`<path d="M120 40H280V200H120Z" fill="#161b30"/>`;
 let br='';for(let by=40;by<200;by+=8)for(let bx=120+(by/8%2)*8;bx<280;bx+=16)br+=`<rect x="${bx}" y="${by}" width="15" height="7" fill="${r()<.5?'#3a2230':'#33202c'}"/>`;
 o+=br+`<path d="M0 0L120 40V200L0 240Z" fill="#2b1a24"/><path d="M400 0L280 40V200L400 240Z" fill="#241722"/>`;
 for(let i=0;i<9;i++){const y=14+i*22;o+=`<path d="M0 ${y}L120 ${40+i*16.5}" stroke="#1a0f16" stroke-width="2.500"/><path d="M400 ${y}L280 ${40+i*16.5}" stroke="#160c14" stroke-width="2.500"/>`}
 o+=`<path d="M120 200L0 240H400L280 200Z" fill="#0c0f1a"/><ellipse cx="170" cy="222" rx="38" ry="6" fill="#1d2a52" opacity=".7"/><ellipse cx="170" cy="222" rx="22" ry="3" fill="#4da3ff" opacity=".18"/>`;
 o+=`<rect x="130" y="64" width="38" height="28" fill="#0a0d18"/><rect x="132" y="66" width="34" height="24" fill="#f5c76a" opacity=".5"/><path d="M149 66V90M132 78H166" stroke="#0a0d18" stroke-width="2"/>`;
 o+=`<path d="M236 70V196M232 100H262M232 130H262M232 160H262M262 100V160" stroke="#0a0d18" stroke-width="3" fill="none"/>`;
 o+=`<rect x="238" y="168" width="34" height="30" fill="#2d6a4f"/><rect x="236" y="164" width="38" height="6" fill="#1f4a37"/><path d="M244 172V196M255 172V196M266 172V196" stroke="#1f4a37" stroke-width="1.5"/>`;
 o+=`<g transform="translate(200 40)"><path d="M0 0V16" stroke="#0a0d18" stroke-width="2"/><path d="M-9 20L0 14L9 20Z" fill="#0a0d18"/><ellipse cx="0" cy="22" rx="5" ry="3" fill="#ffe9a8"/><path d="M-5 24L-62 164H62L5 24Z" fill="#ffe9a8" opacity=".1"/></g>`;
 o+=person(176,200,1.55,'#2c3550','up',`<path d="M-4 -26L5 -26L4 -12L-5 -12Z" fill="#8a2a3a" opacity=".9"/>`);
 o+=`<g transform="translate(150 196) rotate(-12)"><rect x="0" y="0" width="14" height="10" fill="#6a3f1e"/><path d="M3 0V-3H11V0" stroke="#6a3f1e" fill="none" stroke-width="1.5"/></g>`;
 o+=person(222,200,1.6,'#0a0c14','grab',`<path d="M16 -30L24 -36" stroke="#cfe3ff" stroke-width="2.200"/><circle cx="24.500" cy="-36.500" r="2" fill="#fff"/><path d="M-6 -40L0 -45L6 -40" fill="#0a0c14"/>`);
 o+=`<circle cx="226" cy="168" r="2.600" fill="#fff" opacity=".9"/><path d="M226 160V176M218 168H234" stroke="#fff" stroke-width=".8" opacity=".7"/>`;
 o+=spidey(282,64,1.25,330,-20,-14);
 return o;
}
function bank(seed){
 const id=++uid,r=rng(seed);
 let o=night(id,r,'#0a0e20','#1a2040','#2a2438','.5','.8','#e8283c');
 o+=`<rect x="0" y="176" width="400" height="64" fill="#0e1018"/><rect x="0" y="176" width="400" height="6" fill="#2a2f44"/><path d="M0 224H400" stroke="#2c3350" stroke-width="2" stroke-dasharray="22 16"/>`;
 o+=`<path d="M60 74L200 38L340 74Z" fill="#c9c4b8"/><rect x="60" y="74" width="280" height="10" fill="#b2ad9f"/><rect x="70" y="84" width="260" height="92" fill="#d7d2c5"/>`;
 for(let i=0;i<6;i++)o+=`<rect x="${78+i*46}" y="84" width="12" height="92" fill="#e9e5d9"/><rect x="${78+i*46}" y="84" width="3" height="92" fill="#fff" opacity=".4"/><rect x="${74+i*46}" y="82" width="20" height="5" fill="#c4bfb0"/>`;
 o+=`<rect x="150" y="48" width="100" height="18" fill="#2a3a5c"/><text x="200" y="62" font-size="13" font-weight="700" fill="#e9d9a3" text-anchor="middle" font-family="Georgia,serif" letter-spacing="4">BANK</text>`;
 o+=`<rect x="172" y="112" width="56" height="64" fill="#1a1f33"/><path d="M200 112V176" stroke="#c9a94a" stroke-width="2"/><rect x="172" y="112" width="56" height="64" fill="#ffd78a" opacity=".16"/>`;
 o+=`<circle cx="200" cy="30" r="5" fill="#e8283c"/><circle cx="200" cy="30" r="18" fill="#e8283c" opacity=".3" filter="url(#bl${id})"/>`;
 o+=`<rect x="0" y="176" width="400" height="64" fill="url(#fg${id})" opacity=".4"/>`;
 o+=car(250,214,104,'#1a1e2e',`<rect x="2" y="-8" width="7" height="4" fill="#ff3b4a"/><circle cx="6" cy="-6" r="10" fill="#ff3b4a" opacity=".25"/><path d="M28 -15L36 -26H78L88 -15" fill="#1a1e2e"/><rect x="40" y="-24" width="12" height="9" fill="#0a0d15"/><path d="M60 -15V0" stroke="#05070b" stroke-width="2"/>`);
 o+=person(120,208,1.65,'#0a0c14','run',`<path d="M-6 -43H6V-34H-6Z" fill="#0a0c14"/><rect x="-5" y="-40" width="10" height="3" fill="#aab6d6"/><path d="M7 -33Q22 -30 20 -16Q16 -12 8 -16Z" fill="#4a6b3a"/><text x="14" y="-21" font-size="8" fill="#e9e5d9" font-family="sans-serif">$</text>`);
 o+=person(168,214,1.5,'#14161f','run',`<rect x="-5" y="-42" width="10" height="8" fill="#14161f"/><path d="M-5 -36H5" stroke="#aab6d6" stroke-width="2"/><path d="M10 -32Q26 -28 22 -14Q16 -11 9 -16Z" fill="#4a6b3a"/><text x="15" y="-19" font-size="8" fill="#e9e5d9" font-family="sans-serif">$</text>`);
 for(let i=0;i<7;i++)o+=`<rect x="${R(90+r()*100)}" y="${R(196+r()*18)}" width="8" height="4" fill="#9fd29a" opacity=".85" transform="rotate(${R(r()*80-40)} 100 200)"/>`;
 o+=spidey(60,52,1.3,120,-30,-10);
 return o;
}
function chase(seed){
 const id=++uid,r=rng(seed);
 let o=defs(id,'#070a18','#13193a','#26203a','.5','.45','#4da3ff');
 o+=stars(r,26,60);
 o+=`<path d="M0 240L180 112H220L400 240Z" fill="#0d0f19"/><path d="M0 240L180 112" stroke="#2c3350" stroke-width="2"/><path d="M400 240L220 112" stroke="#2c3350" stroke-width="2"/>`;
 for(let i=0;i<6;i++){const t=i/6,y=116+t*t*124,w=1+t*t*8,h=3+t*t*18;o+=`<rect x="${200-w/2}" y="${R(y)}" width="${R(w)}" height="${R(h)}" fill="#ffd28a" opacity=".7"/>`}
 for(const sd of [-1,1]){for(let i=0;i<6;i++){const t=i/6,x=sd<0?-20+t*150:420-t*150,top=20+t*70,bt=112+t*60;
   o+=`<rect x="${sd<0?x-60+t*10:x}" y="${R(top)}" width="${R(60-t*20)}" height="${R(bt-top+40)}" fill="${i%2?'#111631':'#0d1228'}"/>`;
   for(let k=0;k<5;k++)o+=`<rect x="${R((sd<0?x-52+t*10:x+8)+k*9)}" y="${R(top+10+k*14+t*4)}" width="4" height="5" fill="#f5d77a" opacity=".6"/>`}}
 o+=`<rect x="170" y="118" width="60" height="6" fill="#4da3ff" opacity=".4" filter="url(#bl${id})"/>`;
 o+=`<g transform="translate(200 150)"><path d="M-70 40L-15 6M70 40L15 6M-90 18L-20 0M90 18L20 0" stroke="#fff" stroke-width="1.200" opacity=".25"/></g>`;
 o+=`<g transform="translate(200 188)"><ellipse cx="0" cy="26" rx="62" ry="8" fill="#000" opacity=".5"/><path d="M-58 22L-52 -2L-34 -16H34L52 -2L58 22Z" fill="#c4202c"/><path d="M-36 -14L-30 -26H30L36 -14Z" fill="#0a0d18"/><path d="M-30 -24H30" stroke="#6a748e" stroke-width="1"/><rect x="-56" y="2" width="24" height="9" fill="#ff3b4a"/><rect x="32" y="2" width="24" height="9" fill="#ff3b4a"/><rect x="-56" y="2" width="24" height="9" fill="#fff" opacity=".35"/><circle cx="-44" cy="6" r="22" fill="#ff3b4a" opacity=".25" filter="url(#bl${id})"/><circle cx="44" cy="6" r="22" fill="#ff3b4a" opacity=".25" filter="url(#bl${id})"/><rect x="-22" y="8" width="44" height="10" fill="#e9edf6"/><text x="0" y="16.500" font-size="7" font-weight="700" fill="#222" text-anchor="middle" font-family="monospace">FLEE-77</text><rect x="-50" y="18" width="16" height="8" fill="#05070b"/><rect x="34" y="18" width="16" height="8" fill="#05070b"/></g>`;
 o+=`<g transform="translate(200 148) scale(.5)"><ellipse cx="0" cy="26" rx="62" ry="8" fill="#000" opacity=".4"/><path d="M-58 22L-52 -2L-34 -16H34L52 -2L58 22Z" fill="#e9edf6"/><path d="M-36 -14L-30 -26H30L36 -14Z" fill="#0a0d18"/><rect x="-26" y="-34" width="22" height="9" fill="#e8283c"/><rect x="4" y="-34" width="22" height="9" fill="#4da3ff"/><circle cx="-15" cy="-30" r="30" fill="#e8283c" opacity=".35" filter="url(#bl${id})"/><circle cx="15" cy="-30" r="30" fill="#4da3ff" opacity=".35" filter="url(#bl${id})"/></g>`;
 for(let i=0;i<10;i++)o+=`<path d="M${R(30+r()*340)} ${R(130+r()*100)}l${R(r()*30-15)} ${R(26+r()*30)}" stroke="#fff" stroke-width="1" opacity=".18"/>`;
 o+=spidey(330,64,1.25,380,-20,-14);
 return o;
}
function graffiti(seed){
 const id=++uid,r=rng(seed);
 let o=defs(id,'#0a0e24','#1c2250','#3a2a54','.2','.2','#8fb6ff');
 o+=stars(r,36,70)+`<circle cx="340" cy="46" r="20" fill="#eef2ff" opacity=".9"/>`;
 o+=skyline(r,150,30,90,'#10152b',.35)+`<rect x="0" y="150" width="400" height="90" fill="#0d1020"/>`;
 o+=`<rect x="40" y="92" width="320" height="110" fill="#2b2f46"/><rect x="40" y="92" width="320" height="6" fill="#3b4060"/>`;
 let cb='';for(let by=98;by<202;by+=9)for(let bx=40+(by/9%2)*10;bx<360;bx+=20)cb+=`<rect x="${bx}" y="${by}" width="19" height="8" fill="${r()<.5?'#2f3350':'#292d46'}"/>`;
 o+=cb;
 o+=`<g stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M96 168L108 112L128 164L148 112L158 170" stroke="#12b8a6" stroke-width="12"/><path d="M96 168L108 112L128 164L148 112L158 170" stroke="#9ff5e6" stroke-width="3"/><path d="M182 114L212 168M212 114L182 168" stroke="#e8283c" stroke-width="12"/><path d="M182 114L212 168M212 114L182 168" stroke="#ffb0b8" stroke-width="3"/><path d="M240 168V114L270 168V114" stroke="#f5a524" stroke-width="12"/><path d="M240 168V114L270 168V114" stroke="#ffe6a8" stroke-width="3"/><path d="M296 120Q330 100 322 140Q314 170 296 150" stroke="#b86bff" stroke-width="10"/></g>`;
 o+=`<path d="M112 172V190M164 176V196M200 172V188M254 172V194M318 156V182" stroke="#12b8a6" stroke-width="2.500" opacity=".8"/><circle cx="200" cy="190" r="2" fill="#e8283c"/>`;
 o+=`<rect x="30" y="36" width="34" height="46" fill="#161a30"/><rect x="26" y="30" width="42" height="8" fill="#161a30"/><path d="M36 82V98M58 82V98" stroke="#161a30" stroke-width="3"/>`;
 o+=`<rect x="0" y="202" width="400" height="38" fill="#0a0c16"/>`;
 for(const [x,c] of [[70,'#e8283c'],[88,'#12b8a6'],[300,'#f5a524']])o+=`<g transform="translate(${x} 212)"><rect x="0" y="0" width="10" height="18" rx="2" fill="${c}"/><rect x="2" y="-4" width="6" height="5" fill="#cfd6ea"/></g>`;
 o+=person(236,204,1.7,'#10131f','grab',`<path d="M-6 -41L0 -48L6 -41L5 -36H-5Z" fill="#10131f"/><path d="M16 -30L30 -34" stroke="#cfd6ea" stroke-width="2"/><path d="M32 -34L58 -36" stroke="#e8283c" stroke-width="3" opacity=".6" stroke-dasharray="1 3"/><circle cx="31" cy="-34" r="3" fill="#cfd6ea"/>`);
 o+=person(130,206,1.55,'#161a2c','stand',`<path d="M-6 -41L0 -48L6 -41L5 -36H-5Z" fill="#161a2c"/><path d="M8 -16L18 -28" stroke="#161a2c" stroke-width="4.600" stroke-linecap="round"/><circle cx="20" cy="-30" r="3" fill="#cfd6ea"/>`);
 o+=spidey(318,36,1.2,370,-24,-12);
 return o;
}
function pkg(seed){
 const id=++uid,r=rng(seed);
 let o=night(id,r,'#0a0e20','#161c3a','#262238','.7','.4','#ffb25a');
 o+=`<rect x="0" y="190" width="400" height="50" fill="#0e1018"/><rect x="0" y="190" width="400" height="5" fill="#2a2f44"/>`;
 for(const [x0,c] of [[-20,'#5a3128'],[150,'#4a2a30'],[320,'#563528']]){
  o+=`<rect x="${x0}" y="40" width="150" height="152" fill="${c}"/><rect x="${x0-4}" y="34" width="158" height="10" fill="#2a1a1e"/>`;
  for(let k=0;k<3;k++)for(let j=0;j<2;j++){const wx=x0+12+j*70,wy=54+k*42,lit=r()<.55;o+=`<path d="M${wx} ${wy+30}V${wy+10}Q${wx+16} ${wy-6} ${wx+32} ${wy+10}V${wy+30}Z" fill="${lit?'#f5c76a':'#0e1226'}"/><path d="M${wx} ${wy+30}H${wx+32}" stroke="#2a1a1e" stroke-width="3"/>`}
 }
 o+=`<rect x="190" y="130" width="46" height="62" fill="#1a0f12"/><path d="M190 130Q213 106 236 130Z" fill="#2a1a1e"/><rect x="194" y="134" width="38" height="58" fill="#6a2f2a"/><circle cx="226" cy="164" r="2" fill="#ffd28a"/><circle cx="213" cy="118" r="4" fill="#4da3ff"/><circle cx="213" cy="118" r="14" fill="#4da3ff" opacity=".2" filter="url(#bl${id})"/>`;
 o+=`<path d="M170 192L190 172H236L256 192Z" fill="#6a5a50"/><path d="M162 196L190 176" stroke="#8a7a70" stroke-width="2"/>`;
 for(let i=0;i<4;i++)o+=`<path d="M${150+i*7} ${190-i*4}H${196+i*2}" stroke="#7a6a60" stroke-width="3"/>`;
 o+=`<path d="M206 126L120 190H300Z" fill="#ffe9a8" opacity=".07"/>`;
 for(const [x,y,w,h] of [[196,166,22,16],[222,170,18,12],[204,152,16,14]])o+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#b8884a"/><path d="M${x} ${y+h*.4}H${x+w}M${x+w/2} ${y}V${y+h}" stroke="#e2c28a" stroke-width="1.500"/>`;
 o+=person(300,214,1.65,'#0a0c14','run',`<path d="M-6 -41L0 -48L6 -41L5 -36H-5Z" fill="#0a0c14"/><rect x="6" y="-34" width="18" height="14" fill="#b8884a"/><path d="M6 -27H24M15 -34V-20" stroke="#e2c28a" stroke-width="1.500"/><rect x="8" y="-48" width="14" height="12" fill="#a87c40"/>`);
 o+=`<path d="M262 200H240M268 208H250" stroke="#aab6d6" stroke-width="1.200" opacity=".4"/>`;
 o+=`<rect x="330" y="200" width="60" height="32" fill="#8a6a2a"/><rect x="336" y="206" width="48" height="8" fill="#2a2210" opacity=".5"/>`;
 o+=spidey(94,56,1.3,40,-20,10);
 return o;
}
function bikes(seed){
 const id=++uid,r=rng(seed);
 let o=night(id,r,'#0a0e22','#182040','#2a2a40','.5','.2','#6fd0ff');
 o+=`<rect x="0" y="184" width="400" height="56" fill="#0f121d"/><path d="M0 184H400" stroke="#2a2f44" stroke-width="3"/>`;
 for(let x=10;x<400;x+=26)o+=`<path d="M${x} 120V184" stroke="#1b2036" stroke-width="2"/>`;
 o+=`<path d="M0 120H400M0 150H400" stroke="#1b2036" stroke-width="2.500"/>`;
 for(const x of [40,200,350]){o+=`<path d="M${x} 90V184" stroke="#05070b" stroke-width="6"/><circle cx="${x}" cy="88" r="22" fill="#0a2a1a"/><circle cx="${x-14}" cy="98" r="16" fill="#0c3220"/><circle cx="${x+14}" cy="98" r="16" fill="#0c3220"/>`}
 o+=`<g transform="translate(300 34)"><path d="M0 0V150" stroke="#10131f" stroke-width="3"/><path d="M0 0H-26" stroke="#10131f" stroke-width="3"/><ellipse cx="-28" cy="3" rx="8" ry="3.500" fill="#d8f2ff"/><path d="M-34 5L-100 150H40Z" fill="#d8f2ff" opacity=".11"/></g>`;
 o+=`<path d="M60 186H210" stroke="#aab6d6" stroke-width="3"/>`;
 for(const [x,c] of [[84,'#e8283c'],[128,'#4da3ff'],[172,'#aab6d6']])o+=bike(x,168,1.15,c);
 o+=person(238,198,1.55,'#0a0c14','crouch',`<path d="M-6 -33L0 -40L6 -33L5 -28H-5Z" fill="#0a0c14"/><path d="M14 -14L26 -10M14 -10L28 -16" stroke="#cfd6ea" stroke-width="2.200"/><path d="M26 -10L40 -4" stroke="#cfd6ea" stroke-width="1.500"/>`);
 o+=`<circle cx="205" cy="176" r="1.500" fill="#ffd28a"/><circle cx="214" cy="170" r="1" fill="#ffd28a"/><circle cx="198" cy="180" r="1" fill="#ffd28a"/>`;
 o+=spidey(340,92,1.3,390,-4,-16);
 return o;
}
const CRIME={jewel,mugging,bank,chase,graffiti,package:pkg,bike:bikes};
function crime(seed,sub){return (CRIME[sub]||jewel)(seed)}

function fire(seed){
 const id=++uid,r=rng(seed);
 let o=defs(id,'#1a0c14','#3a1418','#7a2a14','.5','.7','#ff8a2a');
 o+=stars(r,16,40);
 o+=skyline(r,168,50,120,'#1a0f18',.15)+skyline(r,185,30,70,'#120a12',.1);
 let smoke='';for(let i=0;i<14;i++)smoke+=`<circle cx="${R(210+i*6+r()*14)}" cy="${R(110-i*9+r()*8)}" r="${R(14+i*3.2+r()*5)}" fill="#2a2024" opacity="${R(.55-i*.025)}"/>`;
 o+=`<g filter="url(#bl${id})">${smoke}</g>`;
 o+=`<rect x="100" y="60" width="180" height="172" fill="#2a1a22"/><rect x="92" y="52" width="196" height="10" fill="#1a1016"/>`;
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){
  const wx=112+j*42,wy=74+i*38,burn=(i+j)%3===0||(i===1&&j===2);
  o+=`<rect x="${wx}" y="${wy}" width="26" height="28" fill="${burn?'#ff9a2a':'#0d1020'}"/>`;
  if(burn)o+=`<rect x="${wx}" y="${wy}" width="26" height="28" fill="#ffd36a" opacity=".5"/>`+flame(wx+13,wy+30,19,38,'#ff6a1a')+flame(wx+13,wy+30,12,26,'#ffc23a')+flame(wx+13,wy+28,6,14,'#fff2b0');
  o+=`<rect x="${wx-2}" y="${wy+28}" width="30" height="3" fill="#120a10"/>`;
 }
 o+=`<rect x="100" y="60" width="180" height="172" fill="url(#gl${id})" opacity=".6"/>`;
 o+=flame(150,70,22,40,'#ff6a1a')+flame(240,66,26,52,'#ff6a1a')+flame(240,66,15,34,'#ffc23a')+flame(190,64,18,32,'#ffa02a');
 for(let i=0;i<26;i++)o+=`<circle cx="${R(120+r()*170)}" cy="${R(20+r()*120)}" r="${R(.6+r()*1.4)}" fill="#ffb44a" opacity="${R(.4+r()*.6)}"/>`;
 o+=`<rect x="0" y="206" width="400" height="34" fill="#0d0a10"/><rect x="0" y="206" width="400" height="34" fill="#ff7a2a" opacity=".07"/>`;
 o+=`<g transform="translate(20 168)"><rect x="0" y="0" width="118" height="40" fill="#c4202c"/><rect x="0" y="22" width="118" height="5" fill="#e9edf6"/><rect x="84" y="-14" width="34" height="16" fill="#c4202c"/><rect x="88" y="-11" width="12" height="10" fill="#0a0d15" opacity=".8"/><path d="M6 -4L90 -30L96 -26L12 0Z" fill="#aab6d6"/><path d="M20 -8V-1M34 -12V-4M48 -17V-9M62 -21V-14M76 -26V-18" stroke="#6a748e" stroke-width="1.5"/><circle cx="24" cy="42" r="9" fill="#05070b"/><circle cx="94" cy="42" r="9" fill="#05070b"/><circle cx="24" cy="42" r="3.500" fill="#4a526b"/><circle cx="94" cy="42" r="3.500" fill="#4a526b"/><rect x="40" y="-4" width="8" height="4" fill="#ff3b4a"/><rect x="52" y="-4" width="8" height="4" fill="#4da3ff"/></g>`;
 o+=`<circle cx="70" cy="160" r="50" fill="#ff3b4a" opacity=".12" filter="url(#bl${id})"/>`;
 o+=`<path d="M110 140Q150 112 192 130" stroke="#7ec8ff" stroke-width="2.500" fill="none" opacity=".75"/><path d="M110 140Q154 108 198 128" stroke="#cfeaff" stroke-width="1" fill="none" opacity=".6"/><circle cx="196" cy="129" r="9" fill="#cfeaff" opacity=".25" filter="url(#bl${id})"/>`;
 o+=spidey(334,64,1.3,388,-10,-14);
 return o;
}
function assist(seed){
 const id=++uid,r=rng(seed);
 let o=defs(id,'#2a1c48','#7a3a5a','#e8803a','.5','.82','#ffb25a');
 o+=`<circle cx="200" cy="118" r="34" fill="#ffd28a" opacity=".85"/>`;
 o+=skyline(r,138,40,100,'#2a1c3c',.12)+skyline(r,150,24,60,'#1c1230',.08);
 o+=`<rect x="0" y="148" width="400" height="92" fill="#1a1230"/><rect x="0" y="150" width="400" height="40" fill="#e8803a" opacity=".12"/>`;
 for(let i=0;i<8;i++)o+=`<path d="M${i*60-10} 160H${i*60+30}" stroke="#ffd28a" stroke-width="1.2" opacity=".25"/>`;
 o+=`<path d="M-10 120Q100 60 200 56T410 120" stroke="#120a22" stroke-width="3" fill="none"/>`;
 for(let x=0;x<=400;x+=26){const t=x/400,y=120-Math.sin(t*Math.PI)*64+Math.sin(t*Math.PI*2)*6;o+=`<path d="M${x} ${R(y)}L${x} 170" stroke="#120a22" stroke-width="1.5"/>`}
 o+=`<path d="M0 172H400" stroke="#120a22" stroke-width="5"/><rect x="0" y="172" width="400" height="68" fill="#16101f"/><path d="M0 176H400" stroke="#120a22" stroke-width="1"/>`;
 for(let x=0;x<400;x+=40)o+=`<path d="M${x} 174V240" stroke="#0e0816" stroke-width="3"/>`;
 o+=`<rect x="0" y="196" width="400" height="3" fill="#ffd28a" opacity=".5"/><path d="M0 222H400" stroke="#ffd28a" stroke-width="2" stroke-dasharray="24 18" opacity=".5"/>`;
 o+=`<g transform="translate(90 168)"><rect x="0" y="0" width="150" height="46" rx="5" fill="#2b66c4"/><rect x="0" y="26" width="150" height="6" fill="#e9edf6"/>`;
 for(let i=0;i<6;i++)o+=`<rect x="${8+i*23}" y="7" width="17" height="14" fill="#0a0d15" opacity=".85"/><rect x="${8+i*23}" y="7" width="17" height="14" fill="#ffd28a" opacity=".2"/>`;
 o+=`<rect x="0" y="4" width="6" height="18" fill="#0a0d15" opacity=".8"/><rect x="2" y="38" width="9" height="5" fill="#ffb21a"/><rect x="139" y="38" width="9" height="5" fill="#ffb21a"/><circle cx="32" cy="48" r="10" fill="#05070b"/><circle cx="116" cy="48" r="10" fill="#05070b"/><circle cx="32" cy="48" r="4" fill="#4a526b"/><circle cx="116" cy="48" r="4" fill="#4a526b"/><rect x="116" y="-8" width="26" height="8" fill="#c4202c"/></g>`;
 o+=`<circle cx="94" cy="208" r="26" fill="#ffb21a" opacity=".3" filter="url(#bl${id})"/><circle cx="236" cy="208" r="26" fill="#ffb21a" opacity=".3" filter="url(#bl${id})"/>`;
 o+=car(262,214,52,'#9aa3b8',`<rect x="44" y="-6" width="6" height="4" fill="#ff3b4a"/><circle cx="50" cy="-4" r="9" fill="#ff3b4a" opacity=".25"/>`)+car(322,216,60,'#4a5a88',`<rect x="52" y="-6" width="6" height="4" fill="#ff3b4a"/><circle cx="58" cy="-4" r="10" fill="#ff3b4a" opacity=".25"/>`);
 for(let i=0;i<3;i++)o+=`<g transform="translate(${34+i*20} ${222+i*2})"><path d="M0 0L5 -16L10 0Z" fill="#ff7a1a"/><path d="M1.800 -6H8.200" stroke="#fff" stroke-width="2"/></g>`;
 o+=spidey(224,70,1.25,300,-8,-6);
 return o;
}
function render(kind,seed,sub){
 const f={rescue,crime,fire,assist}[kind]||assist;
 return `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${kind} scene">${f(seed||1,sub)}</svg>`;
}
return {render};
})();
