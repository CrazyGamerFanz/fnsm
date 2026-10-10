const Aud=(()=>{
 const K='fnsm-audio';
 let st={music:true,sfx:true,vol:.7};
 try{Object.assign(st,JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){}
 let ctx=null,master,musicG,sfxG,nbuf,timer=null,nextT=0,stepI=0,keep=null,lastBlip=0,playing=false,track=null,kind='bundled';
 const BUNDLED='Greater Together (feat. Ben Billions)';
 const api={onchange:null};
 const saveSt=()=>{try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}};
 const mtof=m=>440*Math.pow(2,(m-69)/12);

 function ensure(){
  if(ctx)return ctx;
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
  ctx=new C();
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=5;
  master=ctx.createGain();master.gain.value=st.vol;master.connect(comp);comp.connect(ctx.destination);
  musicG=ctx.createGain();musicG.gain.value=st.music?.55:0;musicG.connect(master);
  sfxG=ctx.createGain();sfxG.gain.value=st.sfx?1:0;sfxG.connect(master);
  nbuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const d=nbuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  return ctx;
 }
 function keepAlive(){
  if(keep)return;
  try{
   const n=2205,b=new ArrayBuffer(44+n*2),v=new DataView(b),w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
   w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,22050,true);v.setUint32(28,44100,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
   keep=new Audio(URL.createObjectURL(new Blob([b],{type:'audio/wav'})));keep.loop=true;keep.volume=.01;keep.play().catch(()=>{});
  }catch(e){}
 }
 function voice(dest,o){
  const t=o.t,dur=o.dur,osc=ctx.createOscillator(),g=ctx.createGain();
  osc.type=o.type||'sine';osc.frequency.setValueAtTime(o.f0,t);if(o.f1)osc.frequency.exponentialRampToValueAtTime(o.f1,t+dur);
  if(o.det)osc.detune.value=o.det;
  const a=o.a==null?.005:o.a,pk=o.g==null?.2:o.g;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(pk,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  let out=osc;
  if(o.lp){const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(o.lp,t);if(o.lp1)f.frequency.exponentialRampToValueAtTime(o.lp1,t+dur);osc.connect(f);out=f}
  out.connect(g);g.connect(dest);osc.start(t);osc.stop(t+dur+.05);
 }
 function nz(dest,o){
  const t=o.t,dur=o.dur,s=ctx.createBufferSource();s.buffer=nbuf;s.loop=true;
  const f=ctx.createBiquadFilter();f.type=o.type||'bandpass';f.Q.value=o.q||1;f.frequency.setValueAtTime(o.f0,t);if(o.f1)f.frequency.exponentialRampToValueAtTime(o.f1,t+dur);
  const g=ctx.createGain(),a=o.a==null?.004:o.a;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.g==null?.2:o.g,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(f);f.connect(g);g.connect(dest);s.start(t,Math.random()*.5);s.stop(t+dur+.05);
 }
 function duck(sec){if(!ctx||!st.music)return;const t=ctx.currentTime;musicG.gain.cancelScheduledValues(t);musicG.gain.setTargetAtTime(.2,t,.05);musicG.gain.setTargetAtTime(.55,t+sec,.4)}

 /* ---------- music: original synthesized score ---------- */
 const BPM=92,STEP=60/BPM/2;
 const CH=[[50,[50,53,57]],[46,[46,50,53]],[53,[53,57,60]],[48,[48,52,55]],[50,[50,53,57]],[46,[46,50,53]],[48,[48,52,55]],[45,[45,49,52]]];
 const MEL={1:[[0,69,2],[2,72,1],[3,74,1],[4,77,3]],3:[[0,76,2],[2,74,1],[3,72,1],[4,69,3]],5:[[0,69,2],[2,72,1],[3,74,1],[4,77,2],[6,81,2]],7:[[0,80,2],[2,81,2],[4,76,2],[6,72,2]]};
 function kick(t){voice(musicG,{type:'sine',f0:150,f1:42,t,dur:.18,g:.7,a:.002})}
 function snare(t){nz(musicG,{t,dur:.14,f0:2200,q:.7,g:.16});voice(musicG,{type:'triangle',f0:200,f1:120,t,dur:.1,g:.18})}
 function hat(t,g){nz(musicG,{t,dur:.045,type:'highpass',f0:7500,g})}
 function bass(t,m,d){voice(musicG,{type:'sawtooth',f0:mtof(m),t,dur:d,g:.22,lp:420,a:.004})}
 function pluck(t,m,g){voice(musicG,{type:'triangle',f0:mtof(m),t,dur:STEP*1.6,g,lp:2600,lp1:700})}
 function pad(t,notes,d){notes.forEach(m=>{[-7,7].forEach(c=>voice(musicG,{type:'sawtooth',f0:mtof(m),det:c,t,dur:d,g:.035,a:.5,lp:850}))})}
 function lead(t,m,d){voice(musicG,{type:'sawtooth',f0:mtof(m),t,dur:d,g:.07,lp:2400,a:.02});voice(musicG,{type:'square',f0:mtof(m),det:4,t,dur:d,g:.03,lp:1800,a:.02})}
 function schedStep(i,t){
  const bar=Math.floor(i/8)%8,s=i%8,ch=CH[bar];
  if(s===0)pad(t,ch[1],STEP*8.4);
  if(s===0||s===4||(s===6&&bar%2))kick(t);
  if(s===2||s===6)snare(t);
  hat(t,s%2?.05:.03);
  if([0,2,3,4,6,7].includes(s))bass(t,ch[0]-12+((s===3||s===7)?12:0),STEP*.9);
  pluck(t,ch[1][[0,1,2,1,0,1,2,2][s]]+12,.05);
  const m=MEL[bar];if(m)m.forEach(n=>{if(n[0]===s)lead(t,n[1],STEP*n[2]*.95)});
 }
 function pump(){
  if(!ctx||!st.music){timer=null;return}
  while(nextT<ctx.currentTime+.18){schedStep(stepI,nextT);nextT+=STEP;stepI++}
  timer=setTimeout(pump,45);
 }
 function startSynth(){if(!ensure()||timer)return;nextT=ctx.currentTime+.1;stepI=0;pump()}
 function stopSynth(){if(timer){clearTimeout(timer);timer=null}}
 function idb(){return new Promise((res,rej)=>{const r=indexedDB.open('fnsm-audio',1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
 async function idbGet(){try{const db=await idb();return await new Promise(res=>{const q=db.transaction('f').objectStore('f').get('custom');q.onsuccess=()=>res(q.result||null);q.onerror=()=>res(null)})}catch(e){return null}}
 async function idbPut(v){const db=await idb();return new Promise((res,rej)=>{const t=db.transaction('f','readwrite');t.objectStore('f').put(v,'custom');t.oncomplete=res;t.onerror=()=>rej(t.error)})}
 async function idbDel(){try{const db=await idb();return await new Promise(res=>{const t=db.transaction('f','readwrite');t.objectStore('f').delete('custom');t.oncomplete=res;t.onerror=res})}catch(e){}}
 async function useTrack(){
  if(!ensure())return;
  let url='music/bg.mp3',k='bundled';
  const c=await idbGet();if(c&&c.blob){url=URL.createObjectURL(c.blob);k='custom'}
  if(!playing)return;
  if(!track){
   track=new Audio();track.loop=true;track.preload='auto';
   try{ctx.createMediaElementSource(track).connect(musicG)}catch(e){}
   track.addEventListener('error',()=>{if(!playing)return;if(k==='custom'||kind==='custom'){kind='bundled'}else{kind='synth';stopTrack();startSynth()}api.onchange&&api.onchange()});
  }
  if(track.dataset.u!==url){track.dataset.u=url;track.src=url}
  kind=k;
  try{await track.play()}catch(e){if(track.error){kind='synth';startSynth()}}
  api.onchange&&api.onchange();
 }
 function stopTrack(){if(track){try{track.pause()}catch(e){}}}
 function startMusic(){
  if(!ensure()||playing)return;
  playing=true;
  if(ctx.state==='suspended')ctx.resume();
  musicG.gain.cancelScheduledValues(ctx.currentTime);musicG.gain.setValueAtTime(.0001,ctx.currentTime);musicG.gain.linearRampToValueAtTime(.55,ctx.currentTime+2.5);
  useTrack();
 }
 function stopMusic(){
  playing=false;stopSynth();
  if(ctx){const t=ctx.currentTime;musicG.gain.cancelScheduledValues(t);musicG.gain.setTargetAtTime(.0001,t,.15);setTimeout(()=>{if(!playing)stopTrack()},500)}
  else stopTrack();
 }

 /* ---------- sound effects ---------- */
 const S={
  tap(t){voice(sfxG,{type:'sine',f0:1300,f1:900,t,dur:.045,g:.1})},
  tick(t){voice(sfxG,{type:'sine',f0:2000,t,dur:.02,g:.05})},
  nav(t){nz(sfxG,{t,dur:.12,f0:700,f1:2600,q:2,g:.12});voice(sfxG,{type:'sine',f0:1000,f1:1500,t,dur:.07,g:.07})},
  swipe(t){nz(sfxG,{t,dur:.28,f0:500,f1:2200,q:1.5,g:.1,a:.05})},
  sheet(t){nz(sfxG,{t,dur:.3,f0:300,f1:1800,q:1.2,g:.11,a:.08})},
  like(t){voice(sfxG,{type:'sine',f0:520,f1:980,t,dur:.12,g:.16});voice(sfxG,{type:'sine',f0:1040,f1:1560,t:t+.07,dur:.1,g:.1})},
  blip(t){voice(sfxG,{type:'sine',f0:880,t,dur:.07,g:.08});voice(sfxG,{type:'sine',f0:1320,t:t+.08,dur:.09,g:.07})},
  post(t){[523,659,784].forEach((f,i)=>voice(sfxG,{type:'triangle',f0:f,t:t+i*.07,dur:.2,g:.13}))},
  chime(t){[523,659,784,1047].forEach((f,i)=>voice(sfxG,{type:'sine',f0:f,t:t+i*.09,dur:.5,g:.12}))},
  error(t){voice(sfxG,{type:'square',f0:150,t,dur:.12,g:.1,lp:600});voice(sfxG,{type:'square',f0:120,t:t+.14,dur:.16,g:.1,lp:600})},
  shutter(t){nz(sfxG,{t,dur:.03,type:'highpass',f0:1500,g:.3});nz(sfxG,{t:t+.07,dur:.05,type:'highpass',f0:900,g:.25});voice(sfxG,{type:'square',f0:2000,f1:600,t,dur:.04,g:.05})},
  land(t){voice(sfxG,{type:'sine',f0:130,f1:38,t,dur:.28,g:.5});nz(sfxG,{t,dur:.14,type:'lowpass',f0:700,g:.3})},
  thwip(t){nz(sfxG,{t,dur:.16,f0:4200,f1:700,q:7,g:.35,a:.003});voice(sfxG,{type:'sine',f0:1500,f1:260,t,dur:.13,g:.14});nz(sfxG,{t:t+.1,dur:.05,type:'highpass',f0:5000,g:.1})}
 };
 api.play=name=>{
  if(!st.sfx)return;if(!ensure())return;if(ctx.state==='suspended')return;
  const f=S[name];if(!f)return;
  if(name==='blip'){const n=performance.now();if(n-lastBlip<600)return;lastBlip=n}
  f(ctx.currentTime+.005);
 };
 api.toggle=on=>{if(!st.sfx||!ensure()||ctx.state==='suspended')return;const t=ctx.currentTime+.005;[on?660:880,on?990:520].forEach((f,i)=>voice(sfxG,{type:'sine',f0:f,t:t+i*.07,dur:.12,g:.13}))};
 api.swing=ms=>{
  if(!st.sfx||!ensure()||ctx.state==='suspended')return;
  const t=ctx.currentTime+.005,d=ms/1000;S.thwip(t);
  const s=ctx.createBufferSource();s.buffer=nbuf;s.loop=true;
  const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=2.5;f.frequency.setValueAtTime(450,t+.2);f.frequency.exponentialRampToValueAtTime(1700,t+d*.45);f.frequency.exponentialRampToValueAtTime(600,t+d);
  const g=ctx.createGain();g.gain.setValueAtTime(.0001,t+.15);g.gain.exponentialRampToValueAtTime(.22,t+d*.4);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(f);f.connect(g);g.connect(sfxG);s.start(t+.15,0);s.stop(t+d+.05);
  voice(sfxG,{type:'sine',f0:160,f1:340,t:t+.15,dur:d*.45,g:.05});voice(sfxG,{type:'sine',f0:340,f1:140,t:t+.15+d*.45,dur:d*.5,g:.05});
 };
 api.win=up=>{
  if(!st.sfx||!ensure()||ctx.state==='suspended')return;
  duck(up?3:2);const t=ctx.currentTime+.02,n=up?[293.7,370,440,587.3,740,880]:[293.7,370,440,587.3];
  n.forEach((f,i)=>{voice(sfxG,{type:'sawtooth',f0:f,t:t+i*.1,dur:up?.5:.45,g:.09,lp:2600,lp1:900});voice(sfxG,{type:'triangle',f0:f*2,t:t+i*.1,dur:.4,g:.06})});
  const e=t+n.length*.1;[293.7,370,440,587.3].forEach(f=>voice(sfxG,{type:'sawtooth',f0:f,t:e,dur:up?1.4:1,g:.08,lp:2200,lp1:700,a:.01}));
  voice(sfxG,{type:'sine',f0:110,f1:70,t:e,dur:.5,g:.3});
 };
 api.alert=th=>{
  if(!st.sfx||!ensure()||ctx.state==='suspended')return;
  duck(th===3?2.2:1.2);const t=ctx.currentTime+.005;
  if(th===3){
   for(let i=0;i<2;i++){const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type='sawtooth';f.type='lowpass';f.frequency.value=2200;const s=t+i*1.1;
    o.frequency.setValueAtTime(620,s);o.frequency.linearRampToValueAtTime(1020,s+.5);o.frequency.linearRampToValueAtTime(620,s+1);
    g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(.16,s+.05);g.gain.setValueAtTime(.16,s+.95);g.gain.exponentialRampToValueAtTime(.0001,s+1.05);
    o.connect(f);f.connect(g);g.connect(sfxG);o.start(s);o.stop(s+1.1)}
  }else{[0,.32,.64].forEach((d,i)=>voice(sfxG,{type:'square',f0:i%2?660:880,t:t+d,dur:.22,g:.1,lp:3000}))}
 };
 api.ui=el=>{
  if(!el)return;const id=el.id;
  if(el.closest&&el.closest('#nav'))return api.play('nav');
  if(el.dataset&&el.dataset.l)return api.play('like');
  if(['go','trk','alsw','hap','aumus','ausfx','snd','shut'].includes(id))return;
  api.play('tap');
 };

 /* ---------- controls ---------- */
 api.get=()=>({...st});
 api.unlock=()=>{
  if(!ensure())return;
  if(ctx.state==='suspended')ctx.resume();
  keepAlive();
  if(st.music){if(!playing)startMusic();else if(track&&track.paused&&kind!=='synth'&&!document.hidden)track.play().catch(()=>{})}
 };
 api.setMusic=on=>{st.music=!!on;saveSt();if(on){api.unlock();if(ctx&&musicG)startMusic()}else stopMusic();api.onchange&&api.onchange()};
 api.trackName=()=>st.customName||(kind==='synth'?'Built-in score':BUNDLED);
 api.hasCustom=()=>!!st.customName;
 api.setCustom=async f=>{await idbPut({blob:f,name:f.name});st.customName=f.name.replace(/\.[^.]+$/,'');saveSt();if(playing){stopTrack();if(track)track.dataset.u='';stopSynth();await useTrack()}api.onchange&&api.onchange()};
 api.clearCustom=async()=>{await idbDel();delete st.customName;saveSt();if(playing){stopTrack();if(track)track.dataset.u='';stopSynth();await useTrack()}api.onchange&&api.onchange()};
 api.setSfx=on=>{st.sfx=!!on;saveSt();if(ctx)sfxG.gain.value=on?1:0;api.onchange&&api.onchange()};
 api.setVol=v=>{st.vol=Math.max(0,Math.min(1,v));saveSt();if(ctx)master.gain.setTargetAtTime(st.vol,ctx.currentTime,.05)};
 api.tryAuto=async()=>{
  if(!st.music)return true;
  if(!ensure())return true;
  try{await Promise.race([ctx.resume(),new Promise(r=>setTimeout(r,400))])}catch(e){}
  if(ctx.state!=='running')return false;
  startMusic();
  await new Promise(r=>setTimeout(r,500));
  if(kind==='synth')return true;
  return !!(track&&!track.paused);
 };
 api.toggleAll=()=>{const anyOn=st.music||st.sfx;if(anyOn){api.setSfx(false);api.setMusic(false)}else{api.setSfx(true);api.setMusic(true)}};
 api.anyOn=()=>st.music||st.sfx;
 document.addEventListener('visibilitychange',()=>{
  if(!ctx)return;
  if(document.hidden){ctx.suspend&&ctx.suspend();if(track)try{track.pause()}catch(e){}}else if(st.music||st.sfx){ctx.resume&&ctx.resume();if(playing&&track&&kind!=='synth')track.play().catch(()=>{})}
 });
 ['pointerdown','touchend','keydown'].forEach(ev=>document.addEventListener(ev,()=>api.unlock(),{passive:true}));
 return api;
})();
