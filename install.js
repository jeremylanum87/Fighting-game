'use strict';
let deferredInstall=null;
function standaloneGame(){return !!(typeof window.matchMedia==='function'&&window.matchMedia('(display-mode: standalone)').matches)||!!navigator.standalone}
if(typeof navigator!=='undefined'){
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;$('#installGame').textContent='INSTALL GAME ↗'});
 window.addEventListener('appinstalled',()=>{deferredInstall=null;$('#installGame').textContent='INSTALLED ✓';$('#installGame').disabled=true;$('#installStatus').textContent='Block Cypher is installed on this device.'});
 $('#installGame').onclick=async()=>{if(deferredInstall){const prompt=deferredInstall;deferredInstall=null;await prompt.prompt();const choice=await prompt.userChoice;$('#installStatus').textContent=choice.outcome==='accepted'?'Installation requested.':'You can install later from the browser menu.'}else $('#installStatus').textContent='In Android Chrome, open ⋮ and choose Install app or Add to Home screen. Load the game once online before playing offline.'};
 if(standaloneGame()){$('#installGame').textContent='INSTALLED ✓';$('#installGame').disabled=true}
 if('serviceWorker'in navigator&&typeof location!=='undefined'&&location.protocol!=='file:'){
 navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(()=>navigator.serviceWorker.ready).then(()=>{$('#installStatus').textContent='Offline game files are ready on this device.'}).catch(()=>{$('#installStatus').textContent='Offline setup was unavailable. The game still works online.'});
 }
}
