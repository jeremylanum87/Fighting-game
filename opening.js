'use strict';
// Intro time follows the fixed simulation clock; combat stays locked until FIGHT ends.
let fightOpening=null;
function openingPhase(phase){
 fightOpening.phase=phase;fightOpening.time=0;
 $('#fightOpening').hidden=phase!=='versus';$('#roundOpening').hidden=phase==='versus';
 if(phase==='versus'){$('#openingContinue').focus();return}
 mode='countdown';clearInput();$('#overlay').classList.add('hidden');
 const label=phase==='stage'?STAGES[selectedStage]:phase==='round'?`ROUND ${round}`:'FIGHT!';
 $('#roundOpening').dataset.phase=phase;$('#roundOpeningText').textContent=label;
 $('#roundOpeningSub').textContent=phase==='stage'?'THE BLOCK IS WATCHING':phase==='round'?'MAKE YOUR NAME.':'TAKE THE CIRCLE.';
 if(phase==='round')tone(330);if(phase==='fight')tone(660);
}
function startFightOpening(versus=true){
 clearInput();fightOpening={phase:'',time:0};
 $('#fightOpening').classList.toggle('opening-low-motion',!strongEffects);
 $('#roundOpening').classList.toggle('opening-low-motion',!strongEffects);
 if(versus){
 mode='intro';$('#overlay').classList.add('hidden');
 $('#openingStage').textContent=`${gameMode==='arcade'?`ARCADE ${arcadeIndex+1} / 8`:'QUICK MATCH'} / ${STAGES[selectedStage]}`;
 const pair=RIVAL_PAIRS[player.character+':'+enemy.character];
 for(const [side,f,line] of [['Player',player,pair||RIVAL_LINES[player.character].intro],['Enemy',enemy,enemy.isBoss?'The main event is earned. Show me you belong here.':RIVAL_LINES[enemy.character].intro]]){
 $('#opening'+side+'Name').textContent=fighterName(f);$('#opening'+side+'Line').textContent='“'+line+'”';
 $('#opening'+side+'Art').style.setProperty('--opening-color',fighterRoster[f.character].color);
 const image=$('#opening'+side+'Portrait');image.src=`assets/arcade/${f.character}-portrait.png`;image.alt='';
 }
 openingPhase('versus');
 }else openingPhase('round');
}
const rivalBeforeOpening=beginRivalIntro;beginRivalIntro=function(){rivalBeforeOpening();startFightOpening()};
const resetBeforeOpening=resetRound;resetRound=function(){resetBeforeOpening();if(gameMode!=='training'&&round>1)startFightOpening(false)};
function dismissFightOpening(){fightOpening=null;$('#fightOpening').hidden=true;$('#roundOpening').hidden=true}
$('#openingContinue').onclick=()=>{if(mode==='intro'&&fightOpening)openingPhase('stage')};
const startBeforeOpening=$('#start').onclick;$('#start').onclick=()=>{if(mode==='intro'&&fightOpening){openingPhase('stage');return}startBeforeOpening()};
window.addEventListener('keydown',event=>{if(mode==='intro'&&fightOpening&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openingPhase('stage')}});
const updateBeforeOpening=update;update=function(dt){
 if(fightOpening){
 if(mode!=='intro'&&mode!=='countdown'){dismissFightOpening();updateBeforeOpening(dt);return}
 if(document.hidden)return;
 clearInput();fightOpening.time+=dt;
 const phase=fightOpening.phase,duration={versus:fightOpening.versusDuration||5,stage:fightOpening.stageDuration||1.15,round:1.05,fight:.65}[phase];
 if(fightOpening.time>=duration){
 if(phase==='versus')openingPhase('stage');else if(phase==='stage')openingPhase('round');else if(phase==='round')openingPhase('fight');
 else{dismissFightOpening();clearInput();mode='playing';$('#pause').textContent='PAUSE / P'}
 }
 return;
 }
 updateBeforeOpening(dt);
};
// Navigation can interrupt an opening without leaving a fixed overlay on screen.
const titleBeforeOpening=showTitleScreen;showTitleScreen=function(){dismissFightOpening();titleBeforeOpening()};
const selectBeforeOpening=openCharacterSelection;openCharacterSelection=function(){dismissFightOpening();selectBeforeOpening()};
