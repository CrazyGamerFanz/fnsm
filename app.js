(()=>{
const $=s=>document.querySelector(s);
const KEY='fnsm-v2';
const TYPES={
  rescue:{n:'Rescue',c:'#e8283c',k:'',tag:''},
  crime:{n:'Crime',c:'#4da3ff',k:'b',tag:'b'},
  fire:{n:'Hazard',c:'#f5a524',k:'a',tag:'a'},
  assist:{n:'Assist',c:'#3dd68c',k:'g',tag:'g'}
};
const POOL=[
 ['rescue','Stuck cat, 3rd Ave','Ginger tabby on a 4th floor fire escape. Owner is out of town and the cat is not coming down.','Harlem',120,40.8116,-73.9465],
 ['crime','Package thief, W 52nd','Guy grabbing parcels off stoops and heading for the subway. Wearing a gray hoodie.','Hell\'s Kitchen',150,40.7650,-73.9882],
 ['fire','Smoke from a deli, Canal St','Grease fire in the kitchen. Everyone is out, flames spreading to the awning.','Chinatown',200,40.7157,-73.9970],
 ['assist','Stalled bus, Queensboro Bridge','A bus is blocking two lanes. Traffic is backing up for blocks.','Midtown East',90,40.7565,-73.9590],
 ['crime','Smash and grab, Fulton St','Two masked guys hit a jewelry shop. Heading east on foot with a bag.','Financial District',180,40.7092,-74.0060],
 ['rescue','Kid on the scaffolding','A boy chased a ball up the scaffolding on Bleecker. He is scared to climb down.','West Village',140,40.7330,-74.0030],
 ['assist','Lost dog near Sheep Meadow','Golden retriever slipped his leash. Wearing a blue bandana, answers to Biscuit.','Central Park',80,40.7712,-73.9764],
 ['fire','Gas leak, 8th Ave','Strong gas smell outside a laundromat. The block needs clearing right now.','Chelsea',170,40.7440,-73.9990],
 ['crime','Graffiti crew on rooftops','Crew tagging water towers at 2am. Might be more than paint in those bags.','Williamsburg',110,40.7140,-73.9610],
 ['rescue','Window washer stranded','Platform jammed 30 floors up on a Park Ave tower. He is holding on.','Midtown',220,40.7550,-73.9740],
 ['assist','Power out on the block','Whole street dark after a transformer popped. Elderly neighbors need a hand.','Astoria',100,40.7644,-73.9235],
 ['crime','Bike thief on the High Line','Someone cutting locks on a row of bikes. Last seen near 23rd.','Chelsea',90,40.7480,-74.0048],
 ['fire','Warehouse fire, DUMBO','Abandoned warehouse fully involved. Squatters may still be inside.','Brooklyn',240,40.7033,-73.9890],
 ['rescue','Cable car stuck, Roosevelt Island','Tram stopped mid-span with kids on board. Needs a steady hand.','Roosevelt Island',260,40.7570,-73.9540]
];
const ZONES=[['Harlem',40.8116,-73.9465],['Midtown',40.7549,-73.9840],['Chelsea',40.7440,-73.9990],['Financial District',40.7092,-74.0060],['Williamsburg',40.7140,-73.9610],['Astoria',40.7644,-73.9235],['Central Park',40.7712,-73.9764]];
const HANDLES=['mj_watson','tbolt_nyc','queensKid','bodega_betty','harlem_hawk','nyc_nightowl','ned_leeds','sunset_park','dumbo_dan','kitty_cat_kim'];
const SEED_POSTS=[
 ['mj_watson','Queens','Spidey caught a runaway delivery bike on 34th. Absolute legend.','Spotted','rescue',1204,3],
 ['bodega_betty','Harlem','He fixed the stuck gate at my bodega at 5am. Free coffee for life.','Thanks','assist',860,19],
 ['nyc_nightowl','Midtown','Just saw red and blue swing past the Chrysler. Never gets old.','Spotted','crime',2310,34],
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

function fresh(){const s={v:2,handle:'',rep:0,helped:0,photos:0,byType:{rescue:0,crime:0,fire:0,assist:0},liked:[],haptics:true,pos:{...START},posts:[],reqs:[],id:100,preview:null};
 const n=Date.now();s.posts=SEED_POSTS.map((p,i)=>({id:i+1,h:p[0],loc:p[1],t:p[2],tag:p[3],ty:p[4],l:p[5],ts:n-p[6]*60000,sd:i*31+7}));
 for(let i=0;i<5;i++)spawn(s);return s}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.v===2)return s}catch(e){}return fresh()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function lvl(s){return Math.floor(s.rep/500)+1}
function ago(ts){const m=Math.max(0,Math.round((Date.now()-ts)/60000));return m<1?'just now':m<60?m+' min ago':Math.round(m/60)+' hr ago'}
function miles(a,b){const t=x=>x*Math.PI/180,dl=t(b.lat-a.lat),dg=t(b.lng-a.lng),h=Math.sin(dl/2)**2+Math.cos(t(a.lat))*Math.cos(t(b.lat))*Math.sin(dg/2)**2;return 7917.6*Math.asin(Math.sqrt(h))}
function spawn(s){
 if(s.reqs.length>=9)return false;
 const have=new Set(s.reqs.map(r=>r.k)),opts=POOL.map((_,i)=>i).filter(i=>!have.has(i));
 if(!opts.length)return false;
 const k=opts[Math.random()*opts.length|0],q=POOL[k];
 s.reqs.push({id:s.id++,k,ty:q[0],t:q[1],d:q[2],loc:q[3],rw:q[4],lat:q[5],lng:q[6],by:HANDLES[Math.random()*HANDLES.length|0],ts:Date.now()-(Math.random()*18+1)*60000,sd:k*13+s.id});
 return true;
}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2000)}
function buzz(n){try{S.haptics&&navigator.vibrate&&navigator.vibrate(n)}catch(e){}}
function ini(h){return(h||'?').slice(0,2).toUpperCase()}
function scene(ty,sd){return Scenes.render(ty,sd)}
const GLYPH={
 rescue:'<path d="M5 4l3.500 3.500h7L19 4v9a7 7 0 01-14 0z" fill="#fff"/><circle cx="9.200" cy="12" r="1.300" fill="#07080d"/><circle cx="14.800" cy="12" r="1.300" fill="#07080d"/><path d="M11 15h2l-1 1.200z" fill="#07080d"/>',
 crime:'<path d="M12 2.500l7.500 3v5.500c0 5-3.200 8.500-7.500 10.500C7.700 19.500 4.500 16 4.500 11V5.500z" fill="#fff"/><path d="M12 7.500l1.400 2.900 3.100.4-2.300 2.100.6 3.100L12 14.500 9.200 16l.6-3.100-2.300-2.100 3.100-.4z" fill="#07080d"/>',
 fire:'<path d="M12.500 2c.5 4.200 6 6.200 6 12a6.500 6.500 0 01-13 0c0-3.200 2.200-4.600 3.200-7.500 1 .8 1.600 2 2 3.200C11.500 8 12.500 5 12.500 2z" fill="#fff"/><path d="M12 21a3.200 3.200 0 01-3.200-3.200c0-2 1.800-2.800 2.400-4.600 1.600 1.200 4 2.600 4 4.800A3.200 3.200 0 0112 21z" fill="#07080d"/>',
 assist:'<path d="M5.500 3.500h13a1.500 1.500 0 011.500 1.500v12H4V5a1.500 1.500 0 011.500-1.500z" fill="#fff"/><rect x="6" y="6" width="5" height="4.500" fill="#07080d"/><rect x="13" y="6" width="5" height="4.500" fill="#07080d"/><rect x="4" y="12.500" width="16" height="1.600" fill="#07080d"/><circle cx="8" cy="19" r="2" fill="#fff"/><circle cx="16" cy="19" r="2" fill="#fff"/>'
};
function ico(ty,s=40){const c=TYPES[ty].c;return `<svg class="ico" viewBox="0 0 40 40" width="${s}" height="${s}"><circle cx="20" cy="20" r="17" fill="#07080d" stroke="${c}" stroke-width="2.500"/><circle cx="20" cy="20" r="19" fill="none" stroke="${c}" stroke-opacity=".3"/><svg x="9" y="9" width="22" height="22" viewBox="0 0 24 24">${GLYPH[ty]}</svg></svg>`}
function header(){$('#lvl').textContent='LV '+lvl(S);$('#xp').style.width=((S.rep%500)/5)+'%';const c=$('#cnt');c.textContent=S.reqs.length||'';c.style.display=S.reqs.length?'':'none'}
function nearest(){return S.reqs.slice().sort((a,b)=>miles(S.pos,a)-miles(S.pos,b))}

/* ---------- views ---------- */
function feedView(){
 const fl=[['all','All'],['rescue','Rescue'],['crime','Crime'],['fire','Hazard'],['assist','Assist']];
 const posts=S.posts.filter(p=>filter==='all'||p.ty===filter);
 return `<div class="chips">${fl.map(f=>`<button class="chip ${filter===f[0]?'on':''}" data-f="${f[0]}">${f[1]}</button>`).join('')}</div>`+
 (posts.map(p=>{const T=TYPES[p.ty],on=S.liked.includes(p.id);
  return `<div class="card ${T.k}"><div class="who"><div class="av">${ini(p.h)}</div><div><div class="hn">@${p.h}</div><div class="mu">${p.loc} · ${ago(p.ts)}</div></div></div>
  <div class="shot">${scene(p.ty,p.sd)}</div><div class="txt">${p.t}</div>
  <div class="row sp"><span class="tag ${T.tag}">${p.tag}</span><button class="like ${on?'on':''}" data-l="${p.id}"><svg><use href="#i-heart"/></svg>${p.l+(on?1:0)}</button></div></div>`}).join('')||'<div class="empty">No posts in this category yet.</div>');
}
function listHTML(){
 return `<h2>Nearby<span>${S.reqs.length} active</span></h2>`+(nearest().map(r=>{const T=TYPES[r.ty];
  return `<div class="card item ${T.k}" data-r="${r.id}">${ico(r.ty)}<div style="flex:1;min-width:0"><div class="hn">${r.t}</div><div class="mu">${r.loc} · ${miles(S.pos,r).toFixed(1)} mi · ${ago(r.ts)}</div></div><span class="tag ${T.tag}">+${r.rw}</span></div>`}).join('')||'<div class="empty">All quiet in the city. New calls come in every few minutes.</div>');
}
function camView(){
 if(!S.preview)S.preview={ty:Object.keys(TYPES)[Math.random()*4|0],sd:Math.random()*9999|0};
 return `<h2>Photo mode<span id="pcnt">${S.photos} taken</span></h2>
 <div class="vf"><div id="pv">${scene(S.preview.ty,S.preview.sd)}</div>
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
function meView(){
 const l=lvl(S);
 return `<div class="row" style="gap:14px;margin-bottom:14px"><div class="av" style="width:60px;height:60px;font-size:20px;background:#2a0f15;color:#ff8a96">${ini(S.handle)}</div><div><div class="hn" style="font-size:20px">@${S.handle}</div><div class="mu">Neighborhood hero · Level ${l}</div></div></div>
 <div class="stats"><div class="stat"><b>${S.helped}</b><span>Helped</span></div><div class="stat"><b>${S.photos}</b><span>Photos</span></div><div class="stat"><b>${S.rep}</b><span>Rep</span></div></div>
 <div class="card"><div class="row sp"><span class="hn">Next level</span><span class="mu">${S.rep%500} / 500</span></div><div class="pb" style="margin-top:8px"><i style="width:${(S.rep%500)/5}%"></i></div></div>
 <h2>Badges</h2><div class="card g">${BADGES.map(b=>{const ok=b[2](S);return `<div class="badge ${ok?'':'lock'}"><div class="hex" style="background:${ok?'var(--red)':'#2a3148'}"><svg><use href="#spider"/></svg></div><div><div class="hn">${b[0]}</div><div class="mu">${b[1]}</div></div></div>`}).join('')}</div>
 <h2>Settings</h2>
 ${installBlock()}
 <div class="card"><div class="mu" style="margin-bottom:6px">Handle</div><div class="row"><input id="hin" maxlength="16" value="${S.handle}" autocomplete="off"><button class="chip on" id="hsave">Save</button></div><div class="err" id="herr"></div></div>
 <div class="card"><div class="row sp"><span class="hn">Vibration</span><button class="chip ${S.haptics?'on':''}" id="hap">${S.haptics?'On':'Off'}</button></div></div>
 <button class="btn ghost" id="reset" style="margin-top:8px">Reset progress</button>`;
}
function render(){
 header();const v=$('#view');
 if(tab==='map'){v.innerHTML='<div id="mapslot"></div><div id="maplist"></div>';mountMap();$('#maplist').innerHTML=listHTML()}
 else v.innerHTML=({feed:feedView,cam:camView,me:meView})[tab]();
 save();
}
function setTab(t){tab=t;document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));render();$('#view').scrollTop=0}

/* ---------- map ---------- */
function hexIcon(r,near){const c=TYPES[r.ty].c;return L.divIcon({className:'mk',iconSize:[48,58],iconAnchor:[24,54],html:`<div class="mkp" style="--c:${c}"><svg viewBox="0 0 48 58" width="48" height="58">${near?`<circle class="pr" cx="24" cy="24" r="22" fill="none" stroke="${c}" stroke-width="2"/>`:''}<circle cx="24" cy="24" r="22" fill="none" stroke="${c}" stroke-opacity=".3" stroke-width="1.500"/><path d="M15 38L24 54L33 38Z" fill="${c}"/><circle cx="24" cy="24" r="18" fill="#07080d" stroke="${c}" stroke-width="3"/><circle cx="24" cy="24" r="14.500" fill="none" stroke="#fff" stroke-opacity=".12"/><svg x="11" y="11" width="26" height="26" viewBox="0 0 24 24">${GLYPH[r.ty]}</svg><circle cx="24" cy="54" r="2" fill="#fff"/></svg></div>`})}
function playerIcon(){return L.divIcon({className:'mk',iconSize:[34,34],iconAnchor:[17,17],html:'<div class="me"><i></i><svg viewBox="0 0 40 40" width="34" height="34"><circle cx="20" cy="20" r="15" fill="#07080d" stroke="#fff" stroke-width="2.500"/><use href="#spider" x="9" y="9" width="22" height="22" style="color:#e8283c"/></svg></div>'})}
function buildMapWrap(){
 mapWrap=document.createElement('div');mapWrap.id='mapwrap';
 mapWrap.innerHTML='<div id="map" style="position:absolute;inset:0"></div><div class="hudL" id="hudL"></div><div class="hudR"><button id="bz" title="Zones">ZONES</button><button id="br" title="Radar">RADAR</button><button id="bc" title="Recenter">CENTER</button></div><div class="hudB" id="hudB"></div>';
 mapWrap.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.h){hide.has(b.dataset.h)?hide.delete(b.dataset.h):hide.add(b.dataset.h);refreshMap()}
  else if(b.id==='bz'){showZones=!showZones;refreshMap()}
  else if(b.id==='br'){showRadar=!showRadar;refreshMap()}
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
  const m=L.marker([r.lat,r.lng],{icon:hexIcon(r,r.id===nid)}).addTo(layers.req);
  m.on('click',e=>{L.DomEvent.stopPropagation(e);if(!busy)openSheet(r.id)});
 });
 if(showZones)ZONES.forEach(z=>{
  const n=S.reqs.filter(r=>Math.hypot(r.lat-z[1],r.lng-z[2])<.022).length,c=n>=2?'#e8283c':n===1?'#f5a524':'#3dd68c';
  L.circle([z[1],z[2]],{radius:1100,color:c,weight:1.2,opacity:.7,fillColor:c,fillOpacity:n?.14:.06,interactive:false}).addTo(layers.zones)
   .bindTooltip(z[0]+' · '+(n>=2?'High':n===1?'Elevated':'Calm'),{permanent:true,direction:'center',className:'zt',interactive:false});
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
 $('#hudB').textContent=S.reqs.length+' active · '+nearest().filter(r=>!hide.has(r.ty)).length+' shown';
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
 const sh=$('#sheet');sh.classList.remove('hide');
 sh.innerHTML=`<div class="row sp"><span class="tag ${T.tag}">${T.n}</span><button class="like" id="cls">Close</button></div>
 <div class="shot" style="height:120px">${scene(r.ty,r.sd)}</div><div class="hn" style="font-size:18px">${r.t}</div><div class="mu">@${r.by} · ${r.loc} · ${ago(r.ts)}</div>
 <div class="txt" style="margin:6px 0">${r.d}</div><div class="row sp mu" style="margin-bottom:10px"><span>${d.toFixed(1)} mi · about ${Math.max(6,Math.round(d*14))} sec swing</span><span style="color:#fff">+${r.rw} rep</span></div>
 <div id="act"><button class="btn" id="go">Swing to location</button></div>`;
}
function closeSheet(){if(busy)return;$('#sheet').classList.add('hide');sel=null;clearRoute()}
function swing(){
 const r=sel;if(!r||busy)return;busy=true;buzz(30);
 if(!tab||tab!=='map')setTab('map');
 if(!routePts)drawRoute(r);
 $('#act').innerHTML='<div class="mu" style="letter-spacing:.2em;text-transform:uppercase">Swinging…</div><div class="pb"><i id="pg"></i></div>';
 const pts=routePts,dur=2600,t0=performance.now();
 (function step(now){
  const p=Math.min(1,(now-t0)/dur),i=Math.min(pts.length-1,Math.floor(p*(pts.length-1))),e=$('#pg');
  if(e)e.style.width=(p*100)+'%';
  playerMk.setLatLng(pts[i]);map.panTo(pts[i],{animate:false});
  if(p<1)requestAnimationFrame(step);else finish(r);
 })(t0);
}
function finish(r){
 const before=lvl(S);
 S.rep+=r.rw;S.helped++;S.byType[r.ty]++;S.pos={lat:r.lat,lng:r.lng};
 S.reqs=S.reqs.filter(x=>x.id!==r.id);
 const quote=THANKS[Math.random()*THANKS.length|0];
 S.posts.unshift({id:Date.now(),h:r.by,loc:r.loc,t:'Spider-Man handled it: '+r.t+'. '+quote,tag:'Resolved',ty:r.ty,l:Math.random()*900+100|0,ts:Date.now(),sd:r.sd});
 if(S.reqs.length<4)spawn(S);
 busy=false;$('#sheet').classList.add('hide');sel=null;clearRoute();save();buzz([60,40,60]);
 const up=lvl(S)>before;
 const m=$('#modal');m.classList.remove('hide');
 m.innerHTML=`<div class="mc"><img src="logo.svg" alt="" width="84" height="84"><div class="kick">${up?'Level up':'Mission complete'}</div><div class="big">${up?'LV '+lvl(S):'+'+r.rw+' rep'}</div>
 <div class="hn" style="font-size:16px">${r.t}</div><div class="mu" style="margin:4px 0 12px">@${r.by}: "${quote}"</div>
 <div class="pb"><i style="width:${(S.rep%500)/5}%"></i></div><div class="mu" style="margin-bottom:16px">${S.rep%500} / 500 to next level${up?'':' · +'+r.rw+' rep'}</div><button class="btn" id="cont">Continue patrol</button></div>`;
 header();if(map)refreshMap();
}
function closeModal(){$('#modal').classList.add('hide');render()}

/* ---------- photo ---------- */
function shoot(){
 const f=$('#flash');f.classList.add('go');setTimeout(()=>f.classList.remove('go'),70);buzz(25);
 const caps=['Caught him mid-swing over Midtown.','Golden hour web-slinging.','Night patrol, no filter.','Right over the rooftops.','Best shot of the week.','Neighborhood watch, live.'];
 const p=S.preview;
 S.photos++;S.rep+=10;
 S.posts.unshift({id:Date.now(),h:S.handle,loc:'Manhattan',t:caps[Math.random()*caps.length|0],tag:'Photo',ty:p.ty,l:0,ts:Date.now(),sd:p.sd});
 S.preview={ty:Object.keys(TYPES)[Math.random()*4|0],sd:Math.random()*9999|0};
 toast('Photo posted +10 rep');header();save();
 setTimeout(()=>{if(tab==='cam')render()},120);
}

/* ---------- intro / onboarding ---------- */
function intro(){
 const el=$('#intro');
 const logo='<img class="big-logo" src="logo.svg" alt="FNSM" width="150" height="150">';
 if(S.handle){el.innerHTML=`<div class="ic">${logo}<div class="wm big2">FN<b>SM</b></div><div class="sub">Friendly Neighborhood Spider-Man</div></div>`;setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),500)},1100);return}
 el.innerHTML=`<div class="ic">${logo}<div class="wm big2">FN<b>SM</b></div><div class="sub">Friendly Neighborhood Spider-Man</div>
 <p class="lead">The city calls. You answer. Pick a handle, check requests from New Yorkers, and swing into action.</p>
 <input id="hn0" maxlength="16" placeholder="your_handle" autocomplete="off" autocapitalize="none"><div class="err" id="err0"></div>
 <button class="btn" id="start" style="margin-top:12px">Start patrol</button></div>`;
}
function startPatrol(){
 const v=$('#hn0').value.trim().replace(/[^a-zA-Z0-9_.]/g,''),e=$('#err0');
 if(!v){e.textContent='Enter a handle to continue.';return}
 S.handle=v;save();buzz(30);
 const el=$('#intro');el.classList.add('out');setTimeout(()=>el.remove(),500);render();
}

/* ---------- events ---------- */
document.addEventListener('click',e=>{
 const t=e.target.closest('button,[data-r]');if(!t)return;
 if(t.closest('#mapwrap'))return;
 if(t.closest('#nav')){if(!busy){closeSheet();setTab(t.dataset.t)}return}
 if(t.dataset.f){filter=t.dataset.f;return render()}
 if(t.dataset.l){const id=+t.dataset.l;S.liked=S.liked.includes(id)?S.liked.filter(x=>x!==id):[...S.liked,id];buzz(15);return render()}
 if(t.dataset.r){if(!busy)openSheet(t.dataset.r);return}
 switch(t.id){
  case'cls':return closeSheet();
  case'go':return swing();
  case'cont':return closeModal();
  case'shut':return shoot();
  case'newscene':S.preview=null;return render();
  case'start':return startPatrol();
  case'hap':S.haptics=!S.haptics;buzz(20);return render();
  case'install':if(deferred){deferred.prompt();deferred=null;render()}return;
  case'hsave':{const v=$('#hin').value.trim().replace(/[^a-zA-Z0-9_.]/g,''),er=$('#herr');if(!v){er.textContent='Handle can\'t be empty.';return}S.handle=v;toast('Handle saved');return render()}
  case'reset':if(confirm('Reset all progress? Your handle stays.')){const h=S.handle;S=fresh();S.handle=h;hide.clear();filter='all';if(map){playerMk.setLatLng([S.pos.lat,S.pos.lng]);map.setView([S.pos.lat,S.pos.lng],13)}render();toast('Progress reset')}return;
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='hn0')startPatrol()});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;if(tab==='me')render()});
window.addEventListener('appinstalled',()=>{deferred=null;toast('FNSM installed')});
setInterval(()=>{
 if(busy||!S.handle)return;
 if(spawn(S)){save();header();toast('New request nearby');if(tab==='map'){refreshMap();const l=$('#maplist');if(l)l.innerHTML=listHTML()}}
},40000);
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
intro();render();
})();
