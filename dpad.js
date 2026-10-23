'use strict';
const dpadUp=document.createElement('button');
dpadUp.id='dpadUp';dpadUp.type='button';dpadUp.dataset.key='w';dpadUp.textContent='▲';
dpadUp.setAttribute('aria-label','D-pad up: jump');
document.querySelector('.move-pad').appendChild(dpadUp);
dpadUp.addEventListener('pointerdown',e=>{
 e.preventDefault();dpadUp.setPointerCapture(e.pointerId);
 touchPointers.set(e.pointerId,{key:'w',button:dpadUp});keys.add('w');dpadUp.classList.add('pressed');
});
for(const event of ['pointerup','pointercancel','lostpointercapture'])dpadUp.addEventListener(event,e=>releaseTouch(e.pointerId));
dpadUp.addEventListener('contextmenu',e=>e.preventDefault());
for(const [key,label,arrow] of [['a','left','◀︎'],['s','down: crouch','▼'],['d','right','▶︎']]){
 const button=document.querySelector('.move-pad [data-key="'+key+'"]');
 button.textContent=arrow;button.setAttribute('aria-label','D-pad '+label);
}
if(safeStorageGet('block-cypher-dpad-default-v1')!==true){
 clearInput();controlPrefs.thumbstick=false;applyControlPrefs();syncControlFields();
 safeStorageSet('block-cypher-controls-v1',controlPrefs);safeStorageSet('block-cypher-dpad-default-v1',true);
}
