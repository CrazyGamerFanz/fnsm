const C='fnsm-v14',T='fnsm-tiles',A=['./','index.html','style.css?v=14','app.js?v=14','audio.js?v=14','scenes.js?v=14','manifest.json','icon.svg','logo.svg','icon-180.png','icon-192.png','icon-512.png','lib/leaflet.js','lib/leaflet.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==T).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.hostname.endsWith('openstreetmap.org')){
  e.respondWith(caches.open(T).then(async c=>{const m=await c.match(e.request);if(m)return m;try{const r=await fetch(e.request);c.put(e.request,r.clone());return r}catch(x){return new Response('',{status:504})}}));return}
 if(e.request.method!=='GET')return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))));
});

self.addEventListener('notificationclick',e=>{
 e.notification.close();const id=e.notification.data&&e.notification.data.id;
 e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
  for(const c of cs){if('focus' in c){c.postMessage({type:'open',id});return c.focus()}}
  return clients.openWindow('./index.html?open='+encodeURIComponent(id));
 }));
});
