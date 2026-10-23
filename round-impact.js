'use strict';
let roundImpact=null,roundImpactCandidate=null;
function finishRoundImpact(){
 roundImpact=null;roundImpactCandidate=null;
 $('#skipLastBar').textContent='SKIP FINISHER / ESC';
 $('#skipLastBar').hidden=!(cinematicFinisher||lastBar);
 if(typeof story!=='undefined'&&['won','lost'].includes(story?.phase)&&!cinematicFinisher)$('#storyPanel').hidden=false;
}
const hitBeforeRoundImpact=applyCombatHit;
applyCombatHit=function(a,t,m,d){
 const hp=t.hp,active=mode==='playing',pose={...a,attack:a.attack?{...a.attack,move:{...a.attack.move}}:null};
 const ok=hitBeforeRoundImpact(a,t,m,d),damage=hp-t.hp;
 if(ok&&damage>0){
 const blocked=t.blockstun>0&&damage<=Math.max(0,m.chip||0);
 if(!blocked)t.hitFlash=Math.max(t.hitFlash||0,strongEffects?.4:.24);
 if(active&&hp>0&&t.hp<=0&&(gameMode!=='training'||typeof story!=='undefined'&&story)){
 roundImpactCandidate={winner:a,target:t,dir:d,attackerPose:pose,targetPose:{...t,attack:null,stun:1,block:false,celebrating:false,knockedDown:false}};
 }
 }
 return ok;
};
const endBeforeRoundImpact=endRound;
endRound=function(){
 const active=mode==='playing';endBeforeRoundImpact();
 const candidate=roundImpactCandidate;roundImpactCandidate=null;
 if(!active||!candidate||!['roundover','finished','paused'].includes(mode))return;
 roundImpact={...candidate,age:0,life:strongEffects?1.5:.7};knockoutMoment=null;shakeTime=0;
 $('#highlightsPanel').hidden=true;
 if(typeof story!=='undefined'&&['won','lost'].includes(story?.phase))$('#storyPanel').hidden=true;
 clearInput();$('#skipLastBar').textContent='SKIP SLOW MOTION / ESC';$('#skipLastBar').hidden=false;
};
const updateBeforeRoundImpact=update;
update=function(dt){
 if(!roundImpact){updateBeforeRoundImpact(dt);return}
 if(document.hidden||$('#controlSettings').hidden===false)return;
 if(typeof pollPhysicalController==='function')pollPhysicalController(dt);
 if(!roundImpact)return;
 roundImpact.age+=dt;
 if(roundImpact.age>=roundImpact.life)finishRoundImpact();
};
const animateBeforeRoundImpact=animateFighter;
animateFighter=function(f,dt){animateBeforeRoundImpact(f,roundImpact?dt*.2:dt)};
const revealBeforeRoundImpact=revealResult;
revealResult=function(dt){if(!roundImpact)revealBeforeRoundImpact(dt)};
const highlightsBeforeRoundImpact=renderHighlights;
renderHighlights=function(){
 if(roundImpact){$('#highlightsPanel').hidden=true;if(roundVictory)roundVictory.pendingHighlights=true;return}
 highlightsBeforeRoundImpact();
};
const poseBeforeRoundImpact=detailedArtPose;
detailedArtPose=function(f){
 const impact=roundImpact;
 if(!impact||f!==impact.winner&&f!==impact.target)return poseBeforeRoundImpact(f);
 const t=impact.age*.2;
 if(f===impact.winner){
 const snapshot={...impact.attackerPose,celebrating:false};
 if(snapshot.attack)snapshot.attack={...snapshot.attack,frame:snapshot.attack.frame+t*60};
 return poseBeforeRoundImpact(snapshot);
 }
 const p=poseBeforeRoundImpact(impact.targetPose),ease=Math.min(1,impact.age/impact.life);
 p.x+=impact.dir*ease*(strongEffects?16:4);
 p.angle+=impact.dir*(f.face||1)*ease*(strongEffects?.2:.03);p.kind='slow-ko';return p;
};
const skipBeforeRoundImpact=$('#skipLastBar').onclick;
$('#skipLastBar').onclick=()=>{if(roundImpact)finishRoundImpact();else skipBeforeRoundImpact()};
window.addEventListener('keydown',e=>{if(roundImpact&&['Escape','Enter',' '].includes(e.key)){e.preventDefault();finishRoundImpact()}});
function clearRoundImpact(){roundImpact=null;roundImpactCandidate=null;$('#skipLastBar').textContent='SKIP FINISHER / ESC'}
const resetBeforeRoundImpact=resetRound;
resetRound=function(){clearRoundImpact();resetBeforeRoundImpact()};
const titleBeforeRoundImpact=showTitleScreen;
showTitleScreen=function(){clearRoundImpact();titleBeforeRoundImpact()};
const selectBeforeRoundImpact=openCharacterSelection;
openCharacterSelection=function(){clearRoundImpact();selectBeforeRoundImpact()};

const drawBeforeRoundImpact=draw;
draw=function(){
 if(!roundImpact){drawBeforeRoundImpact();return}
 // Reveal the slowed hit poses before existing finishers begin their own clocks.
 const cinematic=cinematicFinisher,highlight=lastBar,celebrations=[player.celebrating,enemy.celebrating];
 cinematicFinisher=null;lastBar=null;player.celebrating=enemy.celebrating=false;
 try{drawBeforeRoundImpact()}finally{cinematicFinisher=cinematic;lastBar=highlight;player.celebrating=celebrations[0];enemy.celebrating=celebrations[1]}
};
