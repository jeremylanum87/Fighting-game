'use strict';
// Keep the archetypes distinct while removing repeatable normal-attack knockdown loops.
FIGHTER_ARCHETYPES.brick.health=120;
FIGHTER_ARCHETYPES.haze.health=84;
FIGHTER_ARCHETYPES.rook.low.knockdown=false;
CHARACTER_MOVES.rook.heavy.knockdown=false;
SUPER_MOVES.brick.damage=36;
for(const m of Object.values(SUPER_MOVES))m.chip=m.multi?1:3;

// CPU tactics see delayed world observations, never the player's current input.
const CPU_REACTION_SECONDS={easy:.26,normal:.19,hard:.14};
const cpuObservations=new WeakMap();
function observeForCpu(f,target){
 const frames=Math.ceil(CPU_REACTION_SECONDS[effectiveDifficulty()]*60*FIGHT_PACE),snapshot={...target,attack:target.attack?{...target.attack}:null};
 let history=cpuObservations.get(f);if(!history){history=[];for(let i=0;i<frames;i++)history.push({...snapshot,attack:null});cpuObservations.set(f,history)}
 history.push(snapshot);while(history.length>frames+1)history.shift();return history[0];
}
const cpuBeforeTuning=updateCpuFighter;updateCpuFighter=function(f,target,dt){if(gameMode==='training'&&$('#dummyBehavior').value!=='cpu'){cpuBeforeTuning(f,target,dt);return}cpuBeforeTuning(f,observeForCpu(f,target),dt)};

let effectsMode='auto',autoEffectsLow=false,performanceSamples=0,performanceElapsed=0,performanceLast=null;
const savedEffectsMode=safeStorageGet('block-cypher-effects-v1');if(['auto','full','low'].includes(savedEffectsMode))effectsMode=savedEffectsMode;
function reducedMotionPreference(){return typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches}
function applyEffectsMode(){strongEffects=effectsMode==='full'||(effectsMode==='auto'&&!autoEffectsLow&&!reducedMotionPreference());if(!strongEffects){shakeTime=0;detailGhosts=[]}syncEffectsButton();$('#effectsMode').value=effectsMode;$('#effectsPerformance').textContent=effectsMode==='auto'?`Automatic effects: ${strongEffects?'full detail':'lighter detail'}. Adjusts to frame rate.`:effectsMode==='low'?'Lighter effects selected.':'Full effects selected.';}
syncEffectsButton=function(){const b=$('#effectsToggle');b.textContent=effectsMode==='auto'?(strongEffects?'FX AUTO':'FX AUTO LOW'):effectsMode==='full'?'FX FULL':'FX LOW';b.setAttribute('aria-label',`Effects ${effectsMode}${effectsMode==='auto'?(strongEffects?', full detail':', lighter detail'):''}. Tap to change.`);b.setAttribute('aria-pressed',String(strongEffects))};
function setEffectsMode(value){if(!['auto','full','low'].includes(value))return;effectsMode=value;performanceSamples=0;performanceElapsed=0;performanceLast=null;safeStorageSet('block-cypher-effects-v1',value);applyEffectsMode()}
$('#effectsToggle').onclick=()=>setEffectsMode(({auto:'full',full:'low',low:'auto'})[effectsMode]);$('#effectsMode').onchange=()=>setEffectsMode($('#effectsMode').value);
function sampleFightPerformance(timestamp){
 const active=mode==='playing'&&!document.hidden&&!superCinema;
 if(effectsMode!=='auto'||!active){performanceLast=null;performanceElapsed=0;performanceSamples=0;return}
 if(performanceLast===null){performanceLast=timestamp;return}const elapsed=timestamp-performanceLast;performanceLast=timestamp;if(elapsed<=0||elapsed>250){performanceElapsed=0;performanceSamples=0;return}
 performanceElapsed+=elapsed;performanceSamples++;const windowMs=autoEffectsLow?6000:1600;
 if(performanceElapsed>=windowMs){const average=performanceElapsed/performanceSamples,previous=autoEffectsLow;if(!autoEffectsLow&&average>22)autoEffectsLow=true;else if(autoEffectsLow&&average<18.5)autoEffectsLow=false;performanceElapsed=0;performanceSamples=0;if(previous!==autoEffectsLow)applyEffectsMode()}
}
const frameBeforeTuning=frame;frame=function(timestamp){sampleFightPerformance(timestamp);frameBeforeTuning(timestamp)};

function hideRematch(){$('#rematchButton').hidden=true;$('#overlay').classList.remove('has-rematch')}
const showBeforeTuning=show;show=function(tag,title,sub,label){showBeforeTuning(tag,title,sub,label);const available=mode==='finished'&&gameMode==='quick';$('#rematchButton').hidden=!available;if(available)$('#overlay').classList.add('has-rematch');else $('#overlay').classList.remove('has-rematch');if(available){$('#start').innerHTML='CHANGE FIGHTER <span>↗</span>';$('#rematchButton').focus()}};
$('#rematchButton').onclick=()=>{if(mode!=='finished'||gameMode!=='quick')return;hideRematch();round=1;wins=[0,0];resetRound();if(fightOpening)openingPhase('round')};
const titleBeforeTuning=showTitleScreen;showTitleScreen=function(){hideRematch();titleBeforeTuning()};
const selectBeforeTuning=openCharacterSelection;openCharacterSelection=function(){hideRematch();selectBeforeTuning()};
const resetBeforeTuning=resetRound;resetRound=function(){hideRematch();resetBeforeTuning()};
applyEffectsMode();hideRematch();updateSelectPresentation();
