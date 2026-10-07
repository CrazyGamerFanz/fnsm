const C='fnsm-v7',T='fnsm-tiles',A=['./','index.html','style.css','app.js','scenes.js','manifest.json','icon.svg','logo.svg','icon-180.png','icon-192.png','icon-512.png','lib/leaflet.js','lib/leaflet.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==T).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.hostname.endsWith('openstreetmap.org')){
  e.respondWith(caches.open(T).then(async c=>{const m=await c.match(e.request);if(m)return m;try{const r=await fetch(e.request);c.put(e.request,r.clone());return r}catch(x){return new Response('',{status:504})}}));return}
 if(e.request.method!=='GET')return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))));
});
