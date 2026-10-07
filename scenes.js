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
function crime(seed){
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
function render(kind,seed){
 const f={rescue,crime,fire,assist}[kind]||assist;
 return `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${kind} scene">${f(seed||1)}</svg>`;
}
return {render};
})();
