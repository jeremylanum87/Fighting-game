'use strict';
// Keep internal completion functions for timers/navigation; remove player skip controls.
skipFinishers=false;
safeStorageSet('block-cypher-skip-finishers-v1',false);
const skipSetting=$('#skipFinishers');
skipSetting.checked=false;skipSetting.disabled=true;skipSetting.onchange=()=>{};
const skipLabel=skipSetting.closest('label');if(skipLabel)skipLabel.hidden=true;
for(const id of ['#skipLastBar','#rivalSkipIntro','#openingContinue']){
 const button=$(id);button.hidden=true;button.disabled=true;button.onclick=()=>{};
 button.setAttribute('aria-hidden','true');button.setAttribute('tabindex','-1');
}
skipRivalIntro=function(){return false};
document.addEventListener('keydown',event=>{
 const active=roundImpact||cinematicFinisher||lastBar||fightOpening;
 if(active&&['Escape','Enter',' '].includes(event.key)){
 event.preventDefault();event.stopImmediatePropagation();
 }
},true);
