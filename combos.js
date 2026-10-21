'use strict';
let comboActionId=0;
const COMBO_ROUTES={
 volt:{name:'LIVE WIRE',moves:['punch','punch','kick','uppercut']},
 ember:{name:'BURN NOTICE',moves:['punch','kick','uppercut']},
 cipher:{name:'WORD PERFECT',moves:['punch','kick','uppercut']},
 brick:{name:'BLOCK ROCKER',moves:['punch','fireball']},
 jade:{name:'GINGA FLOW',moves:['punch','kick','spinKick']},
 rook:{name:'CHECKMATE',moves:['punch','uppercut']},
 haze:{name:'FAST FORWARD',moves:['punch','punch','kick','uppercut']},
 goldie:{name:'GOLD RECORD',moves:['punch','kick','spinKick']}
};
function initComboState(f){f.comboDamage=0;f.comboMoves=[];f.comboLastAction=null;f.lightChain=0;f.comboOwner=null;f.comboResult=null;f.routeCompleted=false;}
for(const f of [player,enemy])initComboState(f);
function canChainLight(f,type){return type==='punch'&&f.attack?.type==='punch'&&f.attack.connected&&!f.attack.blocked&&(f.lightChain||1)<2}
const attackBeforeCombos=attack;attack=function(f,type){const light=canChainLight(f,type),previous=f.attack,priorChain=f.lightChain||0;if(light)f.attack=null;const ok=attackBeforeCombos(f,type);if(!ok){if(light)f.attack=previous;return false}if(!previous||!previous.connected)f.lightChain=type==='punch'?1:0;else f.lightChain=type==='punch'?priorChain+1:priorChain;f.attack.id=++comboActionId;f.attack.move={...f.attack.move,actionId:f.attack.id};return true};
function comboMoveName(f,type){return getMove(f,type)?.name||({punch:'Light',kick:'Heavy',uppercut:'Special 2',spinKick:'Special 3',fireball:'Special 1',lowKick:'Low',jumpKick:'Air heavy'}[type]||type)}
function onComboHit(f,target,m,damage,blocked){if(blocked){if(f.attack)f.attack.blocked=true;finishCombo(f,'BLOCKED');target.comboOwner=null;return}if(f.combo===1){f.comboDamage=0;f.comboMoves=[];f.comboLastAction=null;f.routeCompleted=false}f.comboDamage+=damage;const action=m.actionId??f.attack?.id??('counter-'+combatTick);if(action!==f.comboLastAction){f.comboMoves.push(m.type||f.attack?.type||'counter');f.comboLastAction=action}target.comboOwner=f;
 const route=COMBO_ROUTES[f.character];if(route&&!f.routeCompleted&&f.comboMoves.slice(-route.moves.length).join(',')===route.moves.join(',')){f.routeCompleted=true;comboText=route.name+'!';comboTime=1.3}
 f.comboResult={hits:f.combo,damage:f.comboDamage,moves:[...f.comboMoves],name:f.routeCompleted?route?.name:'',state:'LIVE',life:1.4};
}
function finishCombo(f,reason='COMPLETE'){if(!f.comboResult||f.comboResult.state!=='LIVE')return;f.comboResult.state=reason;f.comboResult.life=1.8;f.lightChain=0;}
const resetBeforeCombos=resetRound;resetRound=function(){resetBeforeCombos();for(const f of [player,enemy])initComboState(f);updateComboGuide()};
const updateBeforeCombos=update;update=function(dt){const wasPlaying=mode==='playing',frozen=hitstop>0;updateBeforeCombos(dt);if(!wasPlaying)return;for(const f of [player,enemy]){const opponent=f===player?enemy:player;if(f.comboResult?.state==='LIVE'&&(opponent.stun<=0||opponent.comboOwner!==f||f.stun>0||opponent.hp<=0||mode!=='playing'))finishCombo(f,f.stun>0?'INTERRUPTED':'COMPLETE');if(f.comboResult&&f.comboResult.state!=='LIVE'&&!frozen){f.comboResult.life-=dt;if(f.comboResult.life<=0)f.comboResult=null}}updateComboHud()};
function updateComboHud(){for(const [selector,f] of [['#playerCombo',player],['#enemyCombo',enemy]]){const e=document.querySelector(selector);if(!e)continue;const c=f.comboResult;e.textContent=c&&c.hits>=2?`${c.name?c.name+' · ':''}${c.hits} HITS / ${c.damage} DAMAGE${c.state==='LIVE'?'':' · '+c.state}`:'';}}
function updateComboGuide(){const e=document.querySelector('#comboGuide');if(!e)return;const route=COMBO_ROUTES[player.character];e.textContent=route?`${route.name}: ${route.moves.map(t=>comboMoveName(player,t)).join(' → ')}. Tap the next attack as the previous hit connects.`:'Land light → heavy → special. Tap attacks; do not hold.';updateComboHud()}
const applyBeforeCombos=applyCharacterChoice;applyCharacterChoice=function(){applyBeforeCombos();for(const f of [player,enemy])initComboState(f);updateComboGuide()};
updateComboGuide();
