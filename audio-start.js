'use strict';
// Browser autoplay policies permit audio only after the first user gesture.
let startupAudioUnlocked=false;
sound=safeStorageGet('block-cypher-audio-enabled-v1')!==false;
function syncStartupAudio(){for(const id of ['#sound','#titleSound']){$(id).textContent=sound?(startupAudioUnlocked?'AUDIO ON':'AUDIO ON / TAP TO START'):'AUDIO OFF';$(id).setAttribute('aria-pressed',String(sound))}}
function unlockStartupAudio(){if(!sound||document.hidden)return;try{initBeat();if(audio?.state==='suspended')audio.resume().catch(()=>{});if(beatAudio?.state==='suspended'&&beatAudio!==audio)beatAudio.resume().catch(()=>{});effectsOutput(audio);if(!startupAudioUnlocked){startupAudioUnlocked=true;loadImpactPack(audio)}updateBeat();syncStartupAudio()}catch{}}
const soundBeforeStartupAudio=$('#sound').onclick;
$('#sound').onclick=()=>{soundBeforeStartupAudio();safeStorageSet('block-cypher-audio-enabled-v1',sound);if(sound)unlockStartupAudio();syncStartupAudio()};
$('#titleSound').onclick=()=>$('#sound').onclick();
document.addEventListener('pointerdown',unlockStartupAudio,{capture:true,passive:true});
document.addEventListener('keydown',e=>{if(!e.ctrlKey&&!e.metaKey&&!e.altKey)unlockStartupAudio()},{capture:true});
syncStartupAudio();
