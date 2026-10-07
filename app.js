(()=>{
const $=s=>document.querySelector(s);
const AKEY='fnsm-accounts',SKEY='fnsm-session',LEGACY='fnsm-v2';
let acct=null;
const stateKey=u=>'fnsm-v2:'+u;
const TYPES={
  rescue:{n:'Rescue',c:'#e8283c',k:'',tag:''},
  crime:{n:'Crime',c:'#4da3ff',k:'b',tag:'b'},
  fire:{n:'Hazard',c:'#f5a524',k:'a',tag:'a'},
  assist:{n:'Assist',c:'#3dd68c',k:'g',tag:'g'},
  other:{n:'Other',c:'#b86bff',k:'p',tag:'p'}
};
const POOL=[
 ['rescue','Stuck cat, 3rd Ave','Ginger tabby on a 4th floor fire escape. Owner is out of town and the cat is not coming down.','Harlem',120,40.8116,-73.9465,0],
 ['crime','Package thief, W 52nd','Guy grabbing parcels off stoops and heading for the subway. Wearing a gray hoodie.','Hell\'s Kitchen',150,40.7650,-73.9882,1,'package'],
 ['fire','Smoke from a deli, Canal St','Grease fire in the kitchen. Everyone is out, flames spreading to the awning.','Chinatown',200,40.7157,-73.9970,2],
 ['assist','Stalled bus, Queensboro Bridge','A bus is blocking two lanes. Traffic is backing up for blocks.','Midtown East',90,40.7565,-73.9590,1],
 ['crime','Smash and grab, Fulton St','Two masked guys hit a jewelry shop. Heading east on foot with a bag.','Financial District',180,40.7092,-74.0060,2,'jewel'],
 ['rescue','Kid on the scaffolding','A boy chased a ball up the scaffolding on Bleecker. He is scared to climb down.','West Village',140,40.7330,-74.0030,2],
 ['assist','Lost dog near Sheep Meadow','Golden retriever slipped his leash. Wearing a blue bandana, answers to Biscuit.','Central Park',80,40.7712,-73.9764,0],
 ['fire','Gas leak, 8th Ave','Strong gas smell outside a laundromat. The block needs clearing right now.','Chelsea',170,40.7440,-73.9990,3],
 ['crime','Graffiti crew on rooftops','Crew tagging a rooftop wall at 2am. Might be more than paint in those bags.','Williamsburg',110,40.7140,-73.9610,0,'graffiti'],
 ['rescue','Window washer stranded','Platform jammed 30 floors up on a Park Ave tower. He is holding on.','Midtown',220,40.7550,-73.9740,3],
 ['assist','Power out on the block','Whole street dark after a transformer popped. Elderly neighbors need a hand.','Astoria',100,40.7644,-73.9235,1],
 ['crime','Bike thief on the High Line','Someone cutting locks on a row of bikes. Last seen near 23rd.','Chelsea',90,40.7480,-74.0048,0,'bike'],
 ['fire','Warehouse fire, DUMBO','Abandoned warehouse fully involved. Squatters may still be inside.','Brooklyn',240,40.7033,-73.9890,3],
 ['rescue','Cable car stuck, Roosevelt Island','Tram stopped mid-span with kids on board. Needs a steady hand.','Roosevelt Island',260,40.7570,-73.9540,2],
 ['crime','Mugging in the alley, Delancey St','Man cornered a guy with a knife and demanded his wallet. Screams heard.','Lower East Side',160,40.7186,-73.9877,2,'mugging'],
 ['crime','Armed bank robbery, Wall St','Two masked robbers with duffel bags, hostages inside. Getaway car idling outside.','Financial District',300,40.7069,-74.0113,3,'bank'],
 ['crime','High-speed chase, FDR Drive','Stolen sports car doing 90 with police behind it. Heading north.','Gramercy',280,40.7365,-73.9745,3,'chase']
];
const THREAT=[
 {n:'Low',c:'#3dd68c',m:1,d:'Minor. Nobody in immediate danger.'},
 {n:'Medium',c:'#f5a524',m:1.25,d:'Property at risk. Someone could get hurt.'},
 {n:'High',c:'#ff7a2a',m:1.5,d:'People in danger. Act fast.'},
 {n:'Critical',c:'#e8283c',m:2,d:'Life-threatening. Armed or spreading.'}
];
const CRIMES=[['mugging','Mugging'],['bank','Robbery'],['chase','Chase'],['jewel','Smash and grab'],['package','Package theft'],['bike','Bike theft'],['graffiti','Vandalism']];
const BASE={rescue:120,crime:120,fire:160,assist:80,other:100};
const reward=(b,th)=>Math.round(b*THREAT[th].m/10)*10;
const ZONES=[['Harlem',40.8116,-73.9465],['Midtown',40.7549,-73.9840],['Chelsea',40.7440,-73.9990],['Financial District',40.7092,-74.0060],['Williamsburg',40.7140,-73.9610],['Astoria',40.7644,-73.9235],['Central Park',40.7712,-73.9764]];
const HANDLES=['mj_watson','tbolt_nyc','queensKid','bodega_betty','harlem_hawk','nyc_nightowl','ned_leeds','sunset_park','dumbo_dan','kitty_cat_kim'];
const SEED_POSTS=[
 ['mj_watson','Queens','Spidey caught a runaway delivery bike on 34th. Absolute legend.','Spotted','rescue',1204,3],
 ['bodega_betty','Harlem','He fixed the stuck gate at my bodega at 5am. Free coffee for life.','Thanks','assist',860,19],
 ['nyc_nightowl','Midtown','Just saw red and blue swing past the Chrysler. Never gets old.','Spotted','crime',2310,34,'chase'],
 ['ned_leeds','Queens','Guy in the red suit talking to a pigeon on my fire escape. Guy in the chair?','Spotted','rescue',402,61],
 ['dumbo_dan','Brooklyn','Fire trucks everywhere under the bridge. Somehow the web guy was already there.','Spotted','fire',1580,95]
];
const BADGES=[
 ['First swing','Complete 1 request',s=>s.helped>=1],
 ['Cat savior','Complete 3 rescues',s=>s.byType.rescue>=3],
 ['Crime stopper','Complete 3 crimes',s=>s.byType.crime>=3],
 ['Hazard handler','Complete 2 hazards',s=>s.byType.fire>=2],
 ['Good neighbor','Complete 3 assists',s=>s.byType.assist>=3],
 ['Paparazzi','Take 5 photos',s=>s.photos>=5],
 ['Neighborhood hero','Reach level 5',s=>lvl(s)>=5]
];
const THANKS=['You are a lifesaver. Thank you!','Never doubted you for a second.','Best neighbor in New York.','The whole block is cheering.','Spider-Man to the rescue, again.'];
const START={lat:40.7580,lng:-73.9855};
let S=load();
let tab='feed',filter='all',sel=null,busy=false,hide=new Set(),showZones=true,showRadar=true,deferred=null;
let map,mk,mapWrap,layers={},playerMk,routePts=null,routeLine=null;

function fresh(){const s={v:2,alerts:true,lastSeen:0,handle:'',rep:0,helped:0,photos:0,byType:{rescue:0,crime:0,fire:0,assist:0},liked:[],haptics:true,pos:{...START},track:false,off:null,posts:[],reqs:[],id:100,preview:null};
 const n=Date.now();s.posts=SEED_POSTS.map((p,i)=>({id:i+1,h:p[0],loc:p[1],t:p[2],tag:p[3],ty:p[4],l:p[5],ts:n-p[6]*60000,sd:i*31+7,sub:p[7]}));
 for(let i=0;i<5;i++)spawn(s);return s}
function parseState(raw){const s=JSON.parse(raw);if(s&&s.v===2){s.reqs.forEach(r=>{if(r.th==null){const q=POOL[r.k];r.th=q?q[7]:1;r.sub=r.sub||(q&&q[8])}});s.posts.forEach(p=>{if(p.ty==='crime'&&!p.sub)p.sub=CRIMES[p.sd%CRIMES.length][0]});return s}return null}
function load(){try{const u=localStorage.getItem(SKEY),us=getUsers();if(u&&us[u]){acct=u;const raw=localStorage.getItem(stateKey(u));const s=raw&&parseState(raw)||fresh();s.handle=us[u].name;return s}}catch(e){}return fresh()}
function save(){if(!acct)return;try{localStorage.setItem(stateKey(acct),JSON.stringify(S))}catch(e){}}
function lvl(s){return Math.floor(s.rep/500)+1}
function ago(ts){const m=Math.max(0,Math.round((Date.now()-ts)/60000));return m<1?'just now':m<60?m+' min ago':Math.round(m/60)+' hr ago'}
function miles(a,b){const t=x=>x*Math.PI/180,dl=t(b.lat-a.lat),dg=t(b.lng-a.lng),h=Math.sin(dl/2)**2+Math.cos(t(a.lat))*Math.cos(t(b.lat))*Math.sin(dg/2)**2;return 7917.6*Math.asin(Math.sqrt(h))}
function spawn(s){
 if(s.reqs.length>=9)return false;
 const have=new Set(s.reqs.map(r=>r.k)),opts=POOL.map((_,i)=>i).filter(i=>!have.has(i));
 if(!opts.length)return false;
 const k=opts[Math.random()*opts.length|0],q=POOL[k];
 const nr={id:s.id++,k,ty:q[0],t:q[1],d:q[2],loc:s.off?'Your area':q[3],rw:reward(q[4],q[7]),th:q[7],sub:q[8],lat:q[5]+(s.off?s.off.lat:0),lng:q[6]+(s.off?s.off.lng:0),by:HANDLES[Math.random()*HANDLES.length|0],ts:Date.now()-(Math.random()*18+1)*60000,sd:k*13+s.id};s.reqs.push(nr);
 return nr;
}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2000)}
function buzz(n){try{S.haptics&&navigator.vibrate&&navigator.vibrate(n)}catch(e){}}
function ini(h){return(h||'?').slice(0,2).toUpperCase()}
function scene(ty,sd,sub){return Scenes.render(ty,sd,sub)}
const GLYPH={
 rescue:'<path d="M5 4l3.500 3.500h7L19 4v9a7 7 0 01-14 0z" fill="#fff"/><circle cx="9.200" cy="12" r="1.300" fill="#07080d"/><circle cx="14.800" cy="12" r="1.300" fill="#07080d"/><path d="M11 15h2l-1 1.200z" fill="#07080d"/>',
 crime:'<path d="M12 2.500l7.500 3v5.500c0 5-3.200 8.500-7.500 10.500C7.700 19.500 4.500 16 4.500 11V5.500z" fill="#fff"/><path d="M12 7.500l1.400 2.900 3.100.4-2.300 2.100.6 3.100L12 14.500 9.200 16l.6-3.100-2.300-2.100 3.100-.4z" fill="#07080d"/>',
 fire:'<path d="M12.500 2c.5 4.200 6 6.200 6 12a6.500 6.500 0 01-13 0c0-3.200 2.200-4.600 3.200-7.500 1 .8 1.600 2 2 3.200C11.500 8 12.500 5 12.500 2z" fill="#fff"/><path d="M12 21a3.200 3.200 0 01-3.200-3.200c0-2 1.800-2.800 2.400-4.600 1.600 1.200 4 2.600 4 4.800A3.200 3.200 0 0112 21z" fill="#07080d"/>',
other:'<path d="M12 2L22.500 20.500H1.500Z" fill="#fff"/><rect x="11" y="8.500" width="2" height="6.500" fill="#07080d"/><circle cx="12" cy="17.700" r="1.250" fill="#07080d"/>',
 assist:'<path d="M5.500 3.500h13a1.500 1.500 0 011.500 1.500v12H4V5a1.500 1.500 0 011.500-1.500z" fill="#fff"/><rect x="6" y="6" width="5" height="4.500" fill="#07080d"/><rect x="13" y="6" width="5" height="4.500" fill="#07080d"/><rect x="4" y="12.500" width="16" height="1.600" fill="#07080d"/><circle cx="8" cy="19" r="2" fill="#fff"/><circle cx="16" cy="19" r="2" fill="#fff"/>'
};
const BLUE='#2b7bff';
function badge(ty,cx,cy,r){const c=TYPES[ty].c,k=r*2*.78,o=r*2*.11;return `<circle cx="${cx}" cy="${cy}" r="${r+1.600}" fill="#07080d"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><svg x="${cx-k/2}" y="${cy-k/2}" width="${k}" height="${k}" viewBox="0 0 24 24">${GLYPH[ty]}</svg>`}
function bars(th,x,y,c){let o='';for(let i=0;i<4;i++){const h=4+i*2.4;o+=`<rect x="${x+i*3.6}" y="${y-h}" width="2.600" height="${h}" fill="${i<=th?c:'#3a4158'}"/>`}return o}
function core(){return `<circle cx="32" cy="36" r="24.500" fill="none" stroke="#6fd3ff" stroke-opacity=".3"/><circle cx="32" cy="36" r="21.500" fill="#0a1030" stroke="#6fd3ff" stroke-width="2.600"/><circle cx="32" cy="36" r="17.500" fill="none" stroke="#6fd3ff" stroke-opacity=".28"/><svg x="19" y="23" width="26" height="26" viewBox="0 0 40 40" style="color:#e6f8ff"><use href="#spider"/></svg>`}
function ico(ty,s=44){return `<svg class="ico" viewBox="0 0 72 72" width="${s}" height="${s}">${core()}${badge(ty,52,53,8.500)}</svg>`}
function thTag(th){const T=THREAT[th==null?1:th];return `<span class="th" style="--c:${T.c}"><i>${[0,1,2,3].map(i=>`<b class="${i<=th?'on':''}" style="height:${4+i*2}px"></b>`).join('')}</i>${T.n}</span>`}
function header(){$('#lvl').textContent='LV '+lvl(S);$('#xp').style.width=((S.rep%500)/5)+'%';const c=$('#cnt');c.textContent=S.reqs.length||'';c.style.display=S.reqs.length?'':'none'}
function nearest(){return S.reqs.slice().sort((a,b)=>miles(S.pos,a)-miles(S.pos,b))}

/* ---------- views ---------- */
function feedView(){
 const fl=[['all','All'],['rescue','Rescue'],['crime','Crime'],['fire','Hazard'],['assist','Assist'],['other','Other']];
 const posts=S.posts.filter(p=>filter==='all'||p.ty===filter);
 return `<button class="btn ghost" id="feedrep" style="margin-bottom:12px">+ Report an incident</button><div class="chips">${fl.map(f=>`<button class="chip ${filter===f[0]?'on':''}" data-f="${f[0]}">${f[1]}</button>`).join('')}</div>`+
 (posts.map(p=>{const T=TYPES[p.ty],on=S.liked.includes(p.id);
  return `<div class="card ${T.k}"><div class="who"><div class="av">${ini(p.h)}</div><div><div class="hn">@${p.h}</div><div class="mu">${p.loc} · ${ago(p.ts)}</div></div></div>
  <div class="shot">${scene(p.ty,p.sd,p.sub)}</div><div class="txt">${p.t}</div>
  <div class="row sp"><span class="tag ${T.tag}">${p.tag}</span><button class="like ${on?'on':''}" data-l="${p.id}"><svg><use href="#i-heart"/></svg>${p.l+(on?1:0)}</button></div></div>`}).join('')||'<div class="empty">No posts in this category yet.</div>');
}
function byPriority(){return S.reqs.slice().sort((a,b)=>(b.th==null?1:b.th)-(a.th==null?1:a.th)||miles(S.pos,a)-miles(S.pos,b))}
function listHTML(){
 const list=byPriority();let last=-1,out=`<h2>Priority<span>${list.length} active · by threat</span></h2>`;
 if(!list.length)return out+'<div class="empty">All quiet in the city. New calls come in every few minutes.</div>';
 list.forEach(r=>{const T=TYPES[r.ty],th=r.th==null?1:r.th;
  if(th!==last){last=th;out+=`<div class="grp" style="--c:${THREAT[th].c}">${THREAT[th].n} threat · ${list.filter(x=>(x.th==null?1:x.th)===th).length}</div>`}
  out+=`<div class="card item ${T.k}" data-r="${r.id}">${ico(r.ty)}<div style="flex:1;min-width:0"><div class="hn">${r.t}</div><div class="mu">${r.loc} · ${miles(S.pos,r).toFixed(1)} mi · ${ago(r.ts)}</div></div><span class="col">${thTag(r.th)}<span class="tag ${T.tag}">+${r.rw}</span></span></div>`});
 return out;
}
function newPreview(){const ty=Object.keys(TYPES)[Math.random()*4|0];return {ty,sd:Math.random()*9999|0,sub:ty==='crime'?CRIMES[Math.random()*CRIMES.length|0][0]:undefined}}
function camView(){
 if(!S.preview)S.preview=newPreview();
 return `<h2>Photo mode<span id="pcnt">${S.photos} taken</span></h2>
 <div class="vf"><div id="pv">${scene(S.preview.ty,S.preview.sd,S.preview.sub)}</div>
 <div class="c c1"></div><div class="c c2"></div><div class="c c3"></div><div class="c c4"></div><div class="hud">${TYPES[S.preview.ty].n} · frame the shot</div></div>
 <div class="row" style="justify-content:center;gap:28px"><button class="chip" id="newscene">New scene</button><button class="shut" id="shut" aria-label="Take photo"></button><span style="width:90px"></span></div>
 <div class="mu" style="text-align:center;margin-top:12px">+10 rep per photo. Photos post to the feed.</div>`;
}
function installBlock(){
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent),sa=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 if(sa)return '<div class="mu" style="margin:6px 2px 12px">Installed. Progress is saved on this device.</div>';
 if(deferred)return '<button class="btn" id="install" style="margin-bottom:10px">Install app</button>';
 return `<div class="card"><div class="hn">Install on your phone</div><div class="mu" style="margin-top:4px;line-height:1.5">${ios?'Tap the Share button in Safari, then Add to Home Screen.':'Open the browser menu, then choose Install app or Add to Home screen.'}</div></div>`;
}
function accountCard(){const u=getUsers()[acct]||{};return `<div class="card"><div class="mu" style="margin-bottom:6px">Account</div><div class="hn">@${S.handle}</div><div class="mu">${u.email||''}</div><div class="row" style="gap:8px;margin-top:12px"><button class="chip" id="logout">Log out</button><button class="chip" id="delacct" style="color:#ff8a96;border-color:#5a1a24">Delete account</button></div></div>`}
function meView(){
 const l=lvl(S);
 return `<div class="row" style="gap:14px;margin-bottom:14px"><div class="av" style="width:60px;height:60px;font-size:20px;background:#2a0f15;color:#ff8a96">${ini(S.handle)}</div><div><div class="hn" style="font-size:20px">@${S.handle}</div><div class="mu">Neighborhood hero · Level ${l}</div></div></div>
 <div class="stats"><div class="stat"><b>${S.helped}</b><span>Helped</span></div><div class="stat"><b>${S.photos}</b><span>Photos</span></div><div class="stat"><b>${S.rep}</b><span>Rep</span></div></div>
 <div class="card"><div class="row sp"><span class="hn">Next level</span><span class="mu">${S.rep%500} / 500</span></div><div class="pb" style="margin-top:8px"><i style="width:${(S.rep%500)/5}%"></i></div></div>
 <h2>Badges</h2><div class="card g">${BADGES.map(b=>{const ok=b[2](S);return `<div class="badge ${ok?'':'lock'}"><div class="hex" style="background:${ok?'var(--red)':'#2a3148'}"><svg><use href="#spider"/></svg></div><div><div class="hn">${b[0]}</div><div class="mu">${b[1]}</div></div></div>`}).join('')}</div>
 <h2>Settings</h2>
 ${installBlock()}
 ${accountCard()}
 ${trackCard()}
 ${alertCard()}
 <div class="card"><div class="row sp"><span class="hn">Vibration</span><button class="chip ${S.haptics?'on':''}" id="hap">${S.haptics?'On':'Off'}</button></div></div>
 <button class="btn ghost" id="reset" style="margin-top:8px">Reset progress</button>`;
}
function render(anim){
 header();const v=$('#view');
 if(tab==='map'){v.innerHTML='<div id="mapslot"></div><div id="maplist"></div>';mountMap();$('#maplist').innerHTML=listHTML()}
 else v.innerHTML=({feed:feedView,cam:camView,me:meView})[tab]();
 if(anim){v.classList.remove('vin');void v.offsetWidth;v.classList.add('vin')}
 save();
}
function setTab(t){tab=t;document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));$('#view').scrollTop=0;render(true)}

/* ---------- map ---------- */
const seenPins=new Set();let pinN=0;
function hexIcon(r,near,isNew){const T=THREAT[r.th==null?1:r.th],d=miles(S.pos,r);return L.divIcon({className:'mk',iconSize:[72,92],iconAnchor:[32,36],html:`<div class="mkp${isNew?' pin-in':''}" style="--c:${T.c};${isNew?'animation-delay:'+(pinN++%8)*70+'ms':''}"><svg viewBox="0 0 72 72" width="72" height="72">${(near||r.th===3)?`<circle class="pr" cx="32" cy="36" r="23" fill="none" stroke="${T.c}" stroke-width="2.500"/>`:''}${core()}${badge(r.ty,52,53,8.500)}${bars(r.th==null?1:r.th,50,21,T.c)}</svg><div class="dist">${d.toFixed(1)} MI</div></div>`})}
function playerIcon(){return L.divIcon({className:'mk mk-me',iconSize:[40,40],iconAnchor:[20,20],html:'<div class="me"><i></i><svg viewBox="0 0 40 40" width="40" height="40"><polygon points="20,3 34,33 20,26 6,33" fill="#fff" stroke="#6fd3ff" stroke-width="2.200" stroke-linejoin="round"/><polygon points="20,13 26,27 20,23 14,27" fill="#ff3fa4"/></svg></div>'})}
function buildMapWrap(){
 mapWrap=document.createElement('div');mapWrap.id='mapwrap';
 mapWrap.innerHTML='<div id="map" style="position:absolute;inset:0"></div><div class="hudL" id="hudL"></div><div class="hudR"><button id="bz" title="Zones">ZONES</button><button id="br" title="Radar">RADAR</button><button id="btk" title="Track my location">TRACK</button><button id="bc" title="Recenter">CENTER</button><button id="brp" class="rp">+ REPORT</button></div><div class="hudB" id="hudB"></div>';
 mapWrap.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.h){hide.has(b.dataset.h)?hide.delete(b.dataset.h):hide.add(b.dataset.h);refreshMap()}
  else if(b.id==='bz'){showZones=!showZones;refreshMap()}
  else if(b.id==='br'){showRadar=!showRadar;refreshMap()}
  else if(b.id==='brp'){openReport()}
  else if(b.id==='btk'){toggleTrack()}
  else if(b.id==='bc'){map.flyTo([S.pos.lat,S.pos.lng],13,{duration:.8})}
 });
 map=L.map(mapWrap.querySelector('#map'),{zoomControl:false,attributionControl:true,minZoom:10,maxZoom:18,zoomSnap:.5}).setView([S.pos.lat,S.pos.lng],12);
 L.control.attribution({prefix:false}).addTo(map);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
 layers={zones:L.layerGroup().addTo(map),radar:L.layerGroup().addTo(map),route:L.layerGroup().addTo(map),req:L.layerGroup().addTo(map)};
 playerMk=L.marker([S.pos.lat,S.pos.lng],{icon:playerIcon(),zIndexOffset:1000,interactive:false}).addTo(map);
 map.on('click',()=>{if(!busy)closeSheet()});
}
function mountMap(){
 if(!mapWrap)buildMapWrap();
 $('#mapslot').appendChild(mapWrap);
 setTimeout(()=>{map.invalidateSize();refreshMap()},30);
}
function refreshMap(){
 if(!map)return;
 layers.req.clearLayers();layers.zones.clearLayers();layers.radar.clearLayers();
 playerMk.setLatLng([S.pos.lat,S.pos.lng]);
 const nid=(nearest()[0]||{}).id;
 S.reqs.forEach(r=>{if(hide.has(r.ty))return;
  const isNew=!seenPins.has(r.id);seenPins.add(r.id);const m=L.marker([r.lat,r.lng],{icon:hexIcon(r,r.id===nid,isNew)}).addTo(layers.req);
  m.on('click',e=>{L.DomEvent.stopPropagation(e);if(!busy)openSheet(r.id)});
 });
 if(showZones)zs().forEach(z=>{
  const rs=S.reqs.filter(r=>Math.hypot(r.lat-z[1],r.lng-z[2])<.022),n=rs.length,mx=n?Math.max(...rs.map(r=>r.th==null?1:r.th)):-1,c=n?THREAT[mx].c:'#3dd68c';
  L.circle([z[1],z[2]],{radius:1100,color:'#ff3fa4',weight:1.6,opacity:.8,fillColor:n?c:'#8a5bff',fillOpacity:n?.10+mx*.03:.06,interactive:false}).addTo(layers.zones)
   .bindTooltip(z[0]+' · '+(n?THREAT[mx].n:'Calm'),{permanent:true,direction:'center',className:'zt',interactive:false});
 });
 if(showRadar){
  [[.5,804.7],[1,1609.3],[2,3218.7]].forEach(([mi,m])=>{
   L.circle([S.pos.lat,S.pos.lng],{radius:m,color:'#fff',weight:1,opacity:.28,dashArray:'4 6',fill:false,interactive:false}).addTo(layers.radar)
    .bindTooltip(mi+' mi',{permanent:true,direction:'top',className:'zt r',offset:[0,-2],interactive:false});
  });
  S.reqs.forEach(r=>{if(hide.has(r.ty))return;L.polyline([[S.pos.lat,S.pos.lng],[r.lat,r.lng]],{color:TYPES[r.ty].c,weight:1,opacity:.35,dashArray:'2 6',interactive:false}).addTo(layers.radar)});
 }
 $('#hudL').innerHTML=Object.keys(TYPES).map(k=>`<button data-h="${k}" class="${hide.has(k)?'off':''}" style="--c:${TYPES[k].c}"><i></i>${S.reqs.filter(r=>r.ty===k).length}</button>`).join('');
 $('#bz').classList.toggle('on',showZones);$('#br').classList.toggle('on',showRadar);
 $('#hudB').textContent=S.reqs.length+' active'+(tstate==='on'?' · GPS ±'+Math.round(gps.acc)+' m':tstate==='locating'?' · locating…':'');
 $('#btk').classList.toggle('on',tstate==='on'||tstate==='locating');$('#btk').textContent=tstate==='on'?'TRACKING':tstate==='locating'?'LOCATING…':'TRACK';
}
function arc(a,b){
 const mx=(a.lat+b.lat)/2,my=(a.lng+b.lng)/2,dx=b.lat-a.lat,dy=b.lng-a.lng,cx=mx-dy*.28,cy=my+dx*.28,pts=[];
 for(let i=0;i<=48;i++){const t=i/48,u=1-t;pts.push([u*u*a.lat+2*u*t*cx+t*t*b.lat,u*u*a.lng+2*u*t*cy+t*t*b.lng])}
 return pts;
}
function drawRoute(r){
 layers.route.clearLayers();routePts=arc(S.pos,r);
 L.polyline(routePts,{color:'#e8283c',weight:5,opacity:.25,interactive:false}).addTo(layers.route);
 L.polyline(routePts,{color:'#fff',weight:2,opacity:.95,dashArray:'6 8',interactive:false}).addTo(layers.route);
 map.fitBounds(L.latLngBounds(routePts),{paddingTopLeft:[40,60],paddingBottomRight:[40,50],maxZoom:14.5,animate:true});
}
function clearRoute(){if(layers.route)layers.route.clearLayers();routePts=null}

/* ---------- sheet / swing / result ---------- */
function openSheet(id){
 const r=S.reqs.find(x=>x.id==id);if(!r)return;sel=r;const T=TYPES[r.ty],d=miles(S.pos,r);
 if(tab==='map'&&map){$('#view').scrollTop=0;drawRoute(r)}
 const sh=$('#sheet');sh.classList.remove('hide');$('#scrim').classList.add('on');sh.classList.remove('swap');void sh.offsetWidth;sh.classList.add('swap');
 sh.innerHTML=`<div class="row sp"><span class="row" style="gap:8px"><span class="tag ${T.tag}">${T.n}${r.sub?' · '+(CRIMES.find(x=>x[0]===r.sub)||[0,''])[1]:''}</span>${thTag(r.th)}</span><button class="like" id="cls">Close</button></div>
 <div class="shot" style="height:120px">${scene(r.ty,r.sd,r.sub)}</div><div class="hn" style="font-size:18px">${r.t}</div><div class="mu">${r.mine?'Reported by you':'@'+r.by} · ${r.loc} · ${ago(r.ts)}</div>
 <div class="txt" style="margin:6px 0">${r.d}</div><div class="row sp mu" style="margin-bottom:10px"><span>${d.toFixed(1)} mi · about ${Math.max(6,Math.round(d*14))} sec swing</span><span style="color:#fff">+${r.rw} rep</span></div>
 <div id="act"><button class="btn" id="go">Swing to location</button></div>`;
}
function shut(){$('#sheet').classList.add('hide');$('#scrim').classList.remove('on')}
function closeSheet(){if(busy)return;shut();sel=null;clearRoute()}
function swing(){
 const r=sel;if(!r||busy)return;busy=true;buzz(30);if(mapWrap)mapWrap.classList.add('swinging');
 if(!tab||tab!=='map')setTab('map');
 if(!routePts)drawRoute(r);
 $('#act').innerHTML='<div class="mu" style="letter-spacing:.2em;text-transform:uppercase">Swinging…</div><div class="pb"><i id="pg"></i></div>';
 const pts=routePts,dur=2600,t0=performance.now();
 (function step(now){
  const p=Math.max(0,Math.min(1,(now-t0)/dur)),i=Math.max(0,Math.min(pts.length-1,Math.floor(p*(pts.length-1)))),e=$('#pg');
  if(e)e.style.width=(p*100)+'%';
  playerMk.setLatLng(pts[i]);map.panTo(pts[i],{animate:false});
  if(p<1)requestAnimationFrame(step);else finish(r);
 })(t0);
}
function finish(r){
 const before=lvl(S);
 S.rep+=r.rw;S.helped++;S.byType[r.ty]=(S.byType[r.ty]||0)+1;if(tstate!=='on')S.pos={lat:r.lat,lng:r.lng};
 S.reqs=S.reqs.filter(x=>x.id!==r.id);
 const quote=THANKS[Math.random()*THANKS.length|0];
 S.posts.unshift({id:Date.now(),h:r.by,loc:r.loc,t:'Spider-Man handled it: '+r.t+'. '+quote,tag:'Resolved',ty:r.ty,sub:r.sub,l:Math.random()*900+100|0,ts:Date.now(),sd:r.sd});
 if(S.reqs.length<4)spawn(S);
 busy=false;if(mapWrap)mapWrap.classList.remove('swinging');shut();sel=null;clearRoute();save();buzz([60,40,60]);
 const up=lvl(S)>before;
 const m=$('#modal');m.classList.remove('hide');
 m.innerHTML=`<div class="mc"><img src="logo.svg" alt="" width="84" height="84"><div class="kick">${up?'Level up':'Mission complete'}</div><div class="big" id="bigc">${up?'LV '+lvl(S):'+0 rep'}</div>
 <div class="hn" style="font-size:16px">${r.t}</div><div style="margin:6px 0">${thTag(r.th)}</div><div class="mu" style="margin:4px 0 12px">${r.mine?'You':'@'+r.by}: "${quote}"</div>
 <div class="pb"><i id="mbar" style="width:0"></i></div><div class="mu" style="margin-bottom:16px">${S.rep%500} / 500 to next level${up?'':' · +'+r.rw+' rep'}</div><button class="btn" id="cont">Continue patrol</button></div>`;
 header();if(map)refreshMap();
 requestAnimationFrame(()=>requestAnimationFrame(()=>{const b=$('#mbar');if(b)b.style.width=((S.rep%500)/5)+'%';if(!up)countUp($('#bigc'),r.rw)}));
}
function countUp(el,to){if(!el)return;const t0=performance.now(),d=800;(function f(n){const p=Math.min(1,(n-t0)/d),e=1-Math.pow(1-p,3);el.textContent='+'+Math.round(to*e)+' rep';if(p<1)requestAnimationFrame(f)})(t0)}
function closeModal(){$('#modal').classList.add('hide');render()}

/* ---------- photo ---------- */
function shoot(){
 const f=$('#flash');f.classList.add('go');setTimeout(()=>f.classList.remove('go'),70);buzz(25);
 const caps=['Caught him mid-swing over Midtown.','Golden hour web-slinging.','Night patrol, no filter.','Right over the rooftops.','Best shot of the week.','Neighborhood watch, live.'];
 const p=S.preview;
 S.photos++;S.rep+=10;
 S.posts.unshift({id:Date.now(),h:S.handle,loc:'Manhattan',t:caps[Math.random()*caps.length|0],tag:'Photo',ty:p.ty,sub:p.sub,l:0,ts:Date.now(),sd:p.sd});
 S.preview=newPreview();
 toast('Photo posted +10 rep');header();save();
 setTimeout(()=>{if(tab==='cam')render()},120);
}

/* ---------- intro / onboarding ---------- */
let ob={step:0,handle:''};
function enterApp(){const a=$('#app');a.classList.remove('enter');void a.offsetWidth;a.classList.add('enter');setTimeout(()=>a.classList.remove('enter'),1400)}
function leaveIntro(){const el=$('#intro');if(!el)return;el.classList.add('out');setTimeout(()=>el.remove(),650);enterApp()}
function intro(){
 const el=$('#intro');
 const logo='<img class="big-logo" src="logo.svg" alt="FNSM" width="132" height="132">';
 if(acct&&S.handle){el.innerHTML=`<div class="ic">${logo}<div class="wm big2">FN<b>SM</b></div><div class="sub">Friendly Neighborhood Spider-Man</div><div class="ld"><i></i></div></div>`;setTimeout(leaveIntro,1100);return}
 const legacy=!Object.keys(getUsers()).length&&localStorage.getItem(LEGACY);
 el.innerHTML=`<div class="ob"><div class="obtrack" id="obt">
 <section class="obp on">${logo}<div class="wm big2">FN<b>SM</b></div><div class="sub">Friendly Neighborhood Spider-Man</div><p class="lead">The city calls. You answer. Get requests from New Yorkers and swing into action.</p><button class="btn" data-ob="1">Get started</button></section>
 <section class="obp auth" id="authp"><div class="kick" id="authk">Welcome back</div>
  <div class="seg2" data-m="login"><i class="ind"></i><button type="button" data-am="login" class="on">Log in</button><button type="button" data-am="signup">Sign up</button></div>
  <form id="af" novalidate>
   <div class="fld"><label id="a-idl" for="a-id">Username or email</label><input id="a-id" maxlength="40" placeholder="username or email" autocomplete="username" autocapitalize="none" spellcheck="false"></div>
   <div class="su-only"><div><div class="fld"><label for="a-email">Email</label><input id="a-email" type="email" maxlength="60" placeholder="you@example.com" autocomplete="email" autocapitalize="none"></div></div></div>
   <div class="fld"><label for="a-pw">Password</label><div class="pw"><input id="a-pw" type="password" maxlength="64" placeholder="Password" autocomplete="current-password"><button type="button" id="a-eye">Show</button></div></div>
   <div class="su-only"><div><div class="fld"><label for="a-pw2">Confirm password</label><input id="a-pw2" type="password" maxlength="64" placeholder="Repeat password" autocomplete="new-password"></div></div></div>
   <div class="err" id="a-err"></div>
   <button class="btn" id="a-go" type="submit" style="margin-top:6px">Log in</button>
  </form>
  <div class="mu note">${legacy?'Your existing progress on this device will move to your new account.':'Accounts are stored on this device.'}</div>
  <button class="lnk" data-ob="0">Back</button></section>
 <section class="obp"><div class="kick">Last steps</div><div class="radar"><i></i><i></i><i></i><svg viewBox="0 0 40 40"><use href="#spider"/></svg></div><h1>Let Spider-Man find you</h1><p class="lead">Turn on location so requests appear around you and your marker follows you on the map. It stays on your device.</p><button class="btn" id="obl">Enable location</button><button class="lnk" id="obs">Not now</button></section>
 <section class="obp"><div class="kick">Stay ahead</div><div class="sirenic"><svg viewBox="0 0 52 52"><path d="M10 38V28a16 16 0 0132 0v10M6 42h40M26 6v5M8 14l4 3M44 14l-4 3" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></div><h1>Threat alerts</h1><p class="lead">Get an alert the moment a High or Critical threat shows up near you.</p><button class="btn" id="oba">Turn on alerts</button><button class="lnk" id="obn">Not now</button></section>
 <section class="obp"><div class="kick">All done</div><div class="check"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 14-16"/></svg></div><h1>You're all set</h1><p class="lead" id="obsum"></p><button class="btn" id="start">Start patrol</button></section>
 </div><div class="dots" id="dots"><i class="on"></i><i></i><i></i><i></i><i></i></div></div>`;
}
function obGo(n){
 ob.step=n;$('#obt').style.transform='translateX('+(-n*100)+'%)';
 document.querySelectorAll('#intro .obp').forEach((p,i)=>p.classList.toggle('on',i===n));
 document.querySelectorAll('#dots i').forEach((d,i)=>d.classList.toggle('on',i<=n));
 if(n===1)setTimeout(()=>{const i=$('#a-id');if(i&&ob.step===1)i.focus({preventScroll:true})},560);
 if(n===4)$('#obsum').innerHTML='Signed in as <b>@'+S.handle+'</b><br>Location '+(tstate==='on'||tstate==='locating'?'on':'off')+' · Alerts '+(S.alerts===false?'off':'on')+'<br><span class="mu">Change these anytime in Profile.</span>';
}
async function enableAlertsThenNext(){S.alerts=true;save();await askNotif();obGo(4)}
function finishSetup(){save();buzz(30);render();leaveIntro()}

/* ---------- threat alerts ---------- */
let alertQ=[],alertBusy=false,ahide=null;
function distLabel(r){return miles(S.pos,r).toFixed(1)+' mi'}
function showAlert(r){alertQ.push(r);if(!alertBusy)nextAlert()}
function nextAlert(){
 const r=alertQ.shift();if(!r){alertBusy=false;return}
 alertBusy=true;const T=THREAT[r.th],el=$('#alert');
 el.style.setProperty('--c',T.c);el.className='on'+(r.th===3?' crit':'');el.dataset.id=r.id;
 el.innerHTML=`<div class="aic">${ico(r.ty,36)}</div><div class="atx"><div class="ak">${T.n} threat · ${TYPES[r.ty].n}</div><div class="at">${r.t}</div><div class="am">${r.loc} · ${distLabel(r)} · +${r.rw} rep</div></div><div class="abt"><button id="aview">View</button><button id="aclose" aria-label="Dismiss">×</button></div>`;
 buzz(r.th===3?[120,60,120,60,240]:[100,50,100]);
 clearTimeout(ahide);ahide=setTimeout(hideAlert,7000);
}
function hideAlert(){clearTimeout(ahide);const el=$('#alert');el.classList.remove('on');setTimeout(()=>{alertBusy=false;nextAlert()},450)}
function openFromAlert(id){
 const r=S.reqs.find(x=>String(x.id)===String(id));
 if(!r){toast('That request is no longer active');return}
 closeSheet();setTab('map');setTimeout(()=>openSheet(r.id),650);
}
const notifOK=()=>('Notification' in window)&&Notification.permission==='granted';
function sysNotify(r,force){
 if(!notifOK()||S.alerts===false)return;
 if(!force&&!document.hidden)return;
 const T=THREAT[r.th],title=T.n.toUpperCase()+' THREAT · '+TYPES[r.ty].n;
 const opts={body:r.t+'\n'+r.loc+' · '+distLabel(r)+' · +'+r.rw+' rep',icon:'icon-192.png',badge:'icon-192.png',tag:'fnsm-'+r.id,renotify:true,vibrate:r.th===3?[200,100,200,100,300]:[150,80,150],requireInteraction:r.th===3,data:{id:r.id}};
 const fallback=()=>{try{new Notification(title,opts)}catch(e){}};
 if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(reg=>reg.showNotification(title,opts)).catch(fallback);else fallback();
}
function alertNew(r){if(!r||r.mine||r.th<2||S.alerts===false)return false;if(document.hidden)sysNotify(r);else showAlert(r);return true}
function alertStatus(){
 const sup='Notification' in window,perm=sup?Notification.permission:'unsupported',ios=/iPhone|iPad|iPod/i.test(navigator.userAgent),sa=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 if(S.alerts===false)return 'Off. You won\'t be told about High or Critical threats.';
 if(perm==='granted')return 'On. Banner, vibration and phone notifications for High and Critical threats while FNSM is running.';
 if(perm==='denied')return 'Banner and vibration alerts are on. Phone notifications are blocked in your browser settings.';
 if(ios&&!sa)return 'Banner and vibration alerts are on. For phone notifications on iPhone, add FNSM to your Home Screen first.';
 if(!sup)return 'Banner and vibration alerts are on. Phone notifications aren\'t supported here.';
 return 'Banner and vibration alerts are on. Tap Allow to get phone notifications too.';
}
function alertChips(){const on=S.alerts!==false,perm=('Notification' in window)?Notification.permission:'unsupported';return (on&&perm==='default'?'<button class="chip on" id="alallow">Allow notifications</button>':'')+(on?'<button class="chip" id="altest">Send test alert</button>':'')}
function alertCard(){const on=S.alerts!==false;return `<div class="card" id="alcard"><div class="row sp" style="gap:14px"><div style="flex:1;min-width:0"><div class="hn">Threat alerts</div><div class="mu" id="alst" style="margin-top:3px;line-height:1.45">${alertStatus()}</div></div><button class="sw${on?' on':''}" id="alsw" role="switch" aria-checked="${on}" aria-label="Threat alerts"><i></i></button></div><div class="row" id="alchips" style="gap:8px;margin-top:${on?12:0}px">${alertChips()}</div></div>`}
function updateAlertCard(){
 const on=S.alerts!==false,sw=$('#alsw');if(sw){sw.classList.toggle('on',on);sw.setAttribute('aria-checked',on)}
 const st=$('#alst');if(st)st.textContent=alertStatus();const ch=$('#alchips');if(ch){ch.innerHTML=alertChips();ch.style.marginTop=on?'12px':'0'}
}
async function askNotif(){
 if(!('Notification' in window))return;
 if(Notification.permission==='default'){try{await Notification.requestPermission()}catch(e){}}
 updateAlertCard();
}
async function toggleAlerts(){
 if(S.alerts===false){S.alerts=true;save();updateAlertCard();await askNotif()}
 else{S.alerts=false;save();hideAlert();updateAlertCard()}
}
function testAlert(){
 const r={id:'test'+Date.now(),ty:'crime',th:3,t:'Test alert: armed bank robbery',loc:'Wall St',rw:300,lat:S.pos.lat+.004,lng:S.pos.lng+.004,mine:0};
 showAlert(r);if(notifOK())sysNotify(r,true);
}
function catchUp(){
 if(!acct||!S.handle)return;
 const away=Date.now()-(S.lastSeen||Date.now());S.lastSeen=Date.now();
 if(away<4*60000){save();return}
 const n=Math.min(3,Math.floor(away/(8*60000))+1);let first=null,got=0;
 for(let i=0;i<n;i++){const r=spawn(S);if(r){got++;if(r.th>=2&&!first)first=r}}
 save();header();if(tab==='map'){refreshMap();const l=$('#maplist');if(l)l.innerHTML=listHTML()}
 if(got){if(first&&S.alerts!==false)showAlert(first);else toast(got+' new request'+(got>1?'s':'')+' while you were away')}
}

/* ---------- accounts (stored on this device) ---------- */
const b64e=u=>btoa(String.fromCharCode(...u)),b64d=t=>Uint8Array.from(atob(t),c=>c.charCodeAt(0));
async function hashPw(pw,salt){
 if(!(window.crypto&&crypto.subtle))throw new Error('secure');
 const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:b64d(salt),iterations:150000},k,256);
 return b64e(new Uint8Array(bits));
}
function getUsers(){try{return JSON.parse(localStorage.getItem(AKEY))||{}}catch(e){return {}}}
function putUsers(u){localStorage.setItem(AKEY,JSON.stringify(u))}
let authMode='login',fails=0,lockUntil=0,busyAuth=false;
function setAuthMode(m){
 authMode=m;const p=$('#authp');if(!p)return;
 p.classList.toggle('su',m==='signup');
 document.querySelectorAll('.seg2 button').forEach(b=>b.classList.toggle('on',b.dataset.am===m));$('.seg2').dataset.m=m;
 $('#a-idl').textContent=m==='signup'?'Username':'Username or email';$('#a-id').placeholder=m==='signup'?'web_slinger':'username or email';
 $('#a-pw').autocomplete=m==='signup'?'new-password':'current-password';
 $('#a-go').textContent=m==='signup'?'Create account':'Log in';$('#authk').textContent=m==='signup'?'Join the neighborhood':'Welcome back';$('#a-err').textContent='';
}
async function authSubmit(){
 if(busyAuth)return;
 const err=$('#a-err'),go=$('#a-go'),id=$('#a-id').value.trim(),pw=$('#a-pw').value;
 const fail=m=>{err.textContent=m;const f=$('#af');f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake');buzz(40)};
 if(Date.now()<lockUntil)return fail('Too many attempts. Try again in '+Math.ceil((lockUntil-Date.now())/1000)+' s.');
 err.textContent='';busyAuth=true;go.disabled=true;go.textContent='One moment…';
 try{
  const users=getUsers();
  if(authMode==='signup'){
   const email=$('#a-email').value.trim().toLowerCase(),pw2=$('#a-pw2').value,k=id.toLowerCase();
   if(!/^[a-zA-Z0-9_.]{3,16}$/.test(id))return fail('Username must be 3 to 16 letters, numbers, dots or underscores.');
   if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return fail('Enter a valid email address.');
   if(pw.length<8)return fail('Password must be at least 8 characters.');
   if(pw!==pw2)return fail('Passwords don\'t match.');
   if(users[k])return fail('That username is taken.');
   if(Object.values(users).some(u=>u.email===email))return fail('That email already has an account.');
   const first=!Object.keys(users).length,salt=b64e(crypto.getRandomValues(new Uint8Array(16)));
   users[k]={name:id,email,salt,hash:await hashPw(pw,salt),created:Date.now()};putUsers(users);
   let st=null;if(first){try{const raw=localStorage.getItem(LEGACY);if(raw){st=parseState(raw);localStorage.removeItem(LEGACY)}}catch(e){}}
   S=st||fresh();S.handle=id;acct=k;localStorage.setItem(SKEY,k);save();render();buzz(30);obGo(2);
  }else{
   if(!id||!pw)return fail('Enter your username and password.');
   const low=id.toLowerCase(),u=users[low]||Object.values(users).find(x=>x.email===low);
   const bad=()=>{if(++fails>=5){lockUntil=Date.now()+30000;fails=0}fail('Wrong username or password.')};
   if(!u){await hashPw(pw,b64e(new Uint8Array(16)));return bad()}
   if(await hashPw(pw,u.salt)!==u.hash)return bad();
   fails=0;acct=u.name.toLowerCase();localStorage.setItem(SKEY,acct);
   S=load();S.handle=u.name;save();render();buzz(30);leaveIntro();resumeTrack();
  }
 }catch(e){fail(e&&e.message==='secure'?'Accounts need a secure (https) connection.':'Something went wrong. Try again.')}
 finally{busyAuth=false;go.disabled=false;go.textContent=authMode==='signup'?'Create account':'Log in'}
}
function logout(){stopTrack(true);try{localStorage.removeItem(SKEY)}catch(e){}location.reload()}
function deleteAccount(){
 if(!confirm('Delete your account and all progress on this device? This can\'t be undone.'))return;
 const us=getUsers();delete us[acct];putUsers(us);try{localStorage.removeItem(stateKey(acct));localStorage.removeItem(SKEY)}catch(e){}
 stopTrack(true);location.reload();
}

/* ---------- location tracking ---------- */
let watchId=null,gps={ok:false,acc:null},gpsCircle=null,fixed=false,tstate='off',tok=0,terr='';
function relabel(){S.reqs.forEach(r=>{if(r.k>=0&&POOL[r.k])r.loc=S.off?'Your area':POOL[r.k][3]})}
function shiftReqs(dl,dg){S.reqs.forEach(r=>{r.lat+=dl;r.lng+=dg})}
const tOn=()=>tstate==='on'||tstate==='locating';
function trackHelp(){return /iPhone|iPad|iPod/i.test(navigator.userAgent)?'Location is blocked. Open Settings, then Privacy and Security, then Location Services, and allow it for Safari or FNSM. Then flip this switch again.':'Location is blocked. Tap the lock icon in the address bar, choose Permissions, allow Location, then flip this switch again.'}
function trackStatus(){return tstate==='on'?'On · accuracy ±'+Math.round(gps.acc)+' m':tstate==='locating'?'Finding you…':tstate==='denied'?trackHelp():tstate==='error'?terr:'Off. Spider-Man stays where you last swung.'}
function trackCard(){return `<div class="card" id="trkcard"><div class="row sp" style="gap:14px"><div style="flex:1;min-width:0"><div class="hn">Location tracking</div><div class="mu${tstate==='denied'||tstate==='error'?' warn':''}" id="trkst" style="margin-top:3px;line-height:1.45">${trackStatus()}</div></div><button class="sw${tOn()?' on':''}" id="trk" role="switch" aria-checked="${tOn()}" aria-label="Location tracking"><i></i></button></div></div>`}
function geoUI(){
 if(map)refreshMap();
 const sw=$('#trk');if(sw){sw.classList.toggle('on',tOn());sw.setAttribute('aria-checked',tOn())}
 const st=$('#trkst');if(st){st.textContent=trackStatus();st.classList.toggle('warn',tstate==='denied'||tstate==='error')}
}
function toggleTrack(){tOn()?stopTrack():startTrack()}
function startTrack(){
 if(!('geolocation' in navigator)){tstate='error';terr='This device doesn\'t support location.';geoUI();toast('Location isn\'t available');return}
 const my=++tok;S.track=true;tstate='locating';gps={ok:false,acc:null};fixed=false;save();geoUI();
 navigator.geolocation.getCurrentPosition(p=>{if(my!==tok)return;onFix(p);beginWatch(my)},e=>{if(my===tok)onGeoErr(e)},{enableHighAccuracy:true,timeout:20000,maximumAge:10000});
}
function beginWatch(my){
 if(watchId!=null)navigator.geolocation.clearWatch(watchId);
 watchId=navigator.geolocation.watchPosition(p=>{if(my===tok)onFix(p)},e=>{if(my!==tok)return;if(e.code===1)onGeoErr(e)},{enableHighAccuracy:true,maximumAge:4000,timeout:30000});
}
function stopTrack(quiet){
 tok++;if(watchId!=null){try{navigator.geolocation.clearWatch(watchId)}catch(e){}watchId=null}
 S.track=false;tstate='off';gps={ok:false,acc:null};if(gpsCircle){gpsCircle.remove();gpsCircle=null}
 if(playerMk){const el=playerMk.getElement(),sv=el&&el.querySelector('svg');if(sv)sv.style.transform=''}
 save();geoUI();if(!quiet)toast('Location tracking off');
}
function onFix(p){
 const c={lat:p.coords.latitude,lng:p.coords.longitude};
 gps={ok:true,acc:p.coords.accuracy,hd:p.coords.heading};tstate='on';
 const far=miles(c,START)>40;
 if(far&&!S.off){S.off={lat:c.lat-START.lat,lng:c.lng-START.lng};shiftReqs(S.off.lat,S.off.lng);relabel();fixed=false;toast('Outside New York: requests placed around you')}
 else if(!far&&S.off){shiftReqs(-S.off.lat,-S.off.lng);S.off=null;relabel();fixed=false}
 if(busy){geoUI();return}
 S.pos=c;save();
 if(map){
  playerMk.setLatLng([c.lat,c.lng]);
  if(!gpsCircle)gpsCircle=L.circle([c.lat,c.lng],{radius:p.coords.accuracy,color:'#6fd3ff',weight:1,opacity:.6,fillColor:'#6fd3ff',fillOpacity:.1,interactive:false}).addTo(map);
  else{gpsCircle.setLatLng([c.lat,c.lng]);gpsCircle.setRadius(p.coords.accuracy)}
  const el=playerMk.getElement(),sv=el&&el.querySelector('svg');if(sv)sv.style.transform=(p.coords.heading!=null&&!isNaN(p.coords.heading))?'rotate('+p.coords.heading+'deg)':'';
  if(!fixed){fixed=true;if(tab==='map'){map.setView([c.lat,c.lng],14,{animate:true})}toast('Location found')}
  const now=Date.now();if(now-(onFix.t||0)>2500||!fixed){onFix.t=now;refreshMap();const l=$('#maplist');if(l&&tab==='map')l.innerHTML=listHTML()}
 }
 geoUI();
}
function onGeoErr(e){
 if(watchId!=null){try{navigator.geolocation.clearWatch(watchId)}catch(x){}watchId=null}
 tok++;S.track=false;gps={ok:false,acc:null};
 if(e&&e.code===1){tstate='denied';toast('Location is blocked')}
 else{tstate='error';terr=e&&e.code===3?'Couldn\'t get a GPS fix in time. Try near a window or outside, then flip this switch again.':'Your location isn\'t available right now. Flip this switch to try again.';toast('Can\'t find your location')}
 save();geoUI();
}
function resumeTrack(){
 if(!S.track)return;
 const ask=navigator.permissions&&navigator.permissions.query?navigator.permissions.query({name:'geolocation'}):null;
 if(ask)ask.then(r=>{if(r.state==='granted')startTrack();else{S.track=false;save()}}).catch(()=>startTrack());else startTrack();
}

/* ---------- report an incident ---------- */
let F=null;
function zs(){return ZONES.map((z,i)=>[S.off?'Sector '+(i+1):z[0],z[1]+(S.off?S.off.lat:0),z[2]+(S.off?S.off.lng:0)])}
function nearestZone(lat,lng){if(S.off)return 'Your area';let b=null,d=1e9;ZONES.forEach(z=>{const k=Math.hypot(z[1]-lat,z[2]-lng);if(k<d){d=k;b=z[0]}});return d<.06?b:'Manhattan'}
function openReport(){
 let c=S.pos;if(tab==='map'&&map){const m=map.getCenter();c={lat:m.lat,lng:m.lng}}
 F={ty:'crime',sub:'mugging',title:'',desc:'',th:null,lat:c.lat,lng:c.lng,loc:nearestZone(c.lat,c.lng),err:''};
 if(!$('#report')){const d=document.createElement('div');d.id='report';d.className='hide';$('#app').appendChild(d);void d.offsetWidth}
 renderReport();$('#report').scrollTop=0;requestAnimationFrame(()=>$('#report').classList.remove('hide'));
}
function readReport(){const t=$('#rtitle'),d=$('#rdesc');if(t)F.title=t.value;if(d)F.desc=d.value}
function renderReport(){
 const el=$('#report');if(!el||!F)return;
 const kinds=[['rescue','Rescue'],['crime','Crime'],['fire','Hazard'],['assist','Assist'],['other','Other']];
 const base=reward(BASE[F.ty],F.th==null?0:F.th);
 el.innerHTML=`<div class="rp-in"><div class="row sp"><h2 style="margin:0">Report an incident</h2><button class="like" id="rcancel">Cancel</button></div>
 <div class="mu" style="margin:6px 0 12px">Location: ${F.loc} · map center</div>
 <div class="shot" style="height:150px">${scene(F.ty,7,F.ty==='crime'?F.sub:undefined)}</div>
 <div class="lab">What's happening</div><div class="seg wrap">${kinds.map(k=>`<button class="chip ${F.ty===k[0]?'on':''}" data-rt="${k[0]}">${k[1]}</button>`).join('')}</div>
 ${F.ty==='crime'?`<div class="lab">Type of crime</div><div class="seg wrap">${CRIMES.map(k=>`<button class="chip ${F.sub===k[0]?'on':''}" data-rs="${k[0]}">${k[1]}</button>`).join('')}</div>`:''}
 <div class="lab">${F.ty==='other'?'Describe it (required)':'Title'}</div><input id="rtitle" maxlength="48" placeholder="${F.ty==='other'?'e.g. Strange glowing device on a roof':F.ty==='crime'?(CRIMES.find(k=>k[0]===F.sub)||[0,'Incident'])[1]+' in progress':'Short description of the problem'}" value="${F.title.replace(/"/g,'&quot;')}" autocomplete="off">
 <div class="lab">Details</div><textarea id="rdesc" maxlength="160" rows="2" placeholder="Who, what, which way they went">${F.desc.replace(/</g,'&lt;')}</textarea>
 <div class="lab">Threat level</div>
 <div class="ths">${THREAT.map((T,i)=>`<button class="thb ${F.th===i?'on':''}" data-rth="${i}" style="--c:${T.c}"><span class="thi">${[0,1,2,3].map(j=>`<b class="${j<=i?'on':''}" style="height:${5+j*3}px"></b>`).join('')}</span><span class="tn">${T.n}</span><span class="td">${T.d}</span><span class="tm">x${T.m}</span></button>`).join('')}</div>
 <div class="err" id="rerr">${F.err}</div>
 <div class="row sp" style="margin:8px 0"><span class="mu">Reward when resolved</span><span class="hn">${F.th==null?'–':'+'+base+' rep'}</span></div>
 <button class="btn" id="rsubmit">Post report</button></div>`;
}
function submitReport(){
 readReport();
 if(F.ty==='other'&&!F.title.trim()){F.err='Describe what\'s happening.';renderReport();$('#report').scrollTop=9999;return}
 if(F.th==null){F.err='Select a threat level.';renderReport();$('#report').scrollTop=9999;return}
 const kindName=F.ty==='crime'?(CRIMES.find(k=>k[0]===F.sub)||[0,'Incident'])[1]:null;
 const title=F.title.trim()||(kindName?kindName+' in progress':({rescue:'Someone needs rescuing',fire:'Hazard reported',assist:'Help needed',other:'Incident reported'})[F.ty]);
 const desc=F.desc.trim()||'Reported by @'+S.handle+'.';
 const r={id:S.id++,k:-1,ty:F.ty,t:title,d:desc,loc:F.loc,rw:reward(BASE[F.ty],F.th),th:F.th,sub:F.ty==='crime'?F.sub:undefined,lat:F.lat,lng:F.lng,by:S.handle,mine:1,ts:Date.now(),sd:Math.random()*9999|0};
 S.reqs.push(r);S.rep+=15;
 S.posts.unshift({id:Date.now(),h:S.handle,loc:F.loc,t:title+'. '+desc,tag:'Threat: '+THREAT[F.th].n,ty:F.ty,sub:r.sub,l:0,ts:Date.now(),sd:r.sd});
 $('#report').classList.add('hide');F=null;buzz([40,30,40]);toast('Report posted +15 rep');
 render();if(tab==='map'&&map)refreshMap();
}

/* ---------- events ---------- */
document.addEventListener('click',e=>{
 const t=e.target.closest('button,[data-r]');if(!t)return;
 if(t.closest('#mapwrap'))return;
 if(t.closest('#nav')){if(!busy){closeSheet();setTab(t.dataset.t)}return}
 if(t.dataset.ob!=null&&t.dataset.ob!==''){return obGo(+t.dataset.ob)}
 if(t.dataset.am){return setAuthMode(t.dataset.am)}
 if(t.dataset.f){filter=t.dataset.f;return render()}
 if(t.dataset.l){const id=+t.dataset.l,was=S.liked.includes(id);S.liked=was?S.liked.filter(x=>x!==id):[...S.liked,id];buzz(15);const n=t.lastChild;if(n&&n.nodeType===3)n.nodeValue=(+n.nodeValue)+(was?-1:1);t.classList.toggle('on',!was);t.classList.remove('pop');void t.offsetWidth;if(!was)t.classList.add('pop');save();return}
 if(t.dataset.rt){readReport();F.ty=t.dataset.rt;F.err='';return renderReport()}
 if(t.dataset.rs){readReport();F.sub=t.dataset.rs;return renderReport()}
 if(t.dataset.rth){readReport();F.th=+t.dataset.rth;F.err='';return renderReport()}
 if(t.dataset.r){if(!busy)openSheet(t.dataset.r);return}
 switch(t.id){
  case'rcancel':$('#report').classList.add('hide');F=null;return;
  case'rsubmit':return submitReport();
  case'cls':return closeSheet();
  case'feedrep':return openReport();
  case'go':return swing();
  case'cont':return closeModal();
  case'shut':return shoot();
  case'newscene':S.preview=null;return render();
  case'start':return finishSetup();
  case'obl':startTrack();return obGo(3);
  case'obs':return obGo(3);
  case'trk':return toggleTrack();
  case'alsw':return toggleAlerts();
  case'alallow':return askNotif();
  case'altest':return testAlert();
  case'aview':{const id=$('#alert').dataset.id;hideAlert();return openFromAlert(id)}
  case'aclose':return hideAlert();
  case'oba':return enableAlertsThenNext();
  case'obn':return obGo(4);
  case'a-eye':{const h=$('#a-pw').type==='password';$('#a-pw').type=h?'text':'password';$('#a-pw2').type=h?'text':'password';t.textContent=h?'Hide':'Show';return}
  case'logout':return logout();
  case'delacct':return deleteAccount();
  case'hap':S.haptics=!S.haptics;buzz(20);return render();
  case'install':if(deferred){deferred.prompt();deferred=null;render()}return;
  case'reset':if(confirm('Reset all progress? Your handle stays.')){const h=S.handle;S=fresh();S.handle=h;hide.clear();filter='all';if(map){playerMk.setLatLng([S.pos.lat,S.pos.lng]);map.setView([S.pos.lat,S.pos.lng],13)}render();toast('Progress reset')}return;
 }
});
document.addEventListener('submit',e=>{if(e.target.id==='af'){e.preventDefault();authSubmit()}});
document.addEventListener('click',e=>{if(e.target.id==='scrim')closeSheet()});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;if(tab==='me')render()});
window.addEventListener('appinstalled',()=>{deferred=null;toast('FNSM installed')});
setInterval(()=>{
 if(busy||!S.handle)return;
 const r=spawn(S);
 if(r){S.lastSeen=Date.now();save();header();if(!alertNew(r)&&!document.hidden)toast('New request nearby');if(tab==='map'){refreshMap();const l=$('#maplist');if(l)l.innerHTML=listHTML()}}
 else S.lastSeen=Date.now();
},40000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){S.lastSeen=Date.now();save()}else catchUp()});
if('serviceWorker'in navigator)navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='open')openFromAlert(e.data.id)});
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
intro();render();resumeTrack();catchUp();
try{const q=new URLSearchParams(location.search).get('open');if(q)setTimeout(()=>openFromAlert(q),1800)}catch(e){}
})();
