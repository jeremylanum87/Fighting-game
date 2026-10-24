'use strict';
// Spectator-only expert policy. Uses legal attacks, normal meter and observed state.
let showcaseBrains=new WeakMap(),showcaseWait=0,showcaseBout=1,showcaseActing=false;
function showcaseBrain(f){if(!showcaseBrains.has(f))showcaseBrains.set(f,{clock:0,decision:0,history:[],turn:0});return showcaseBrains.get(f)}
function showcaseAttack(f,type){showcaseActing=true;try{return attack(f,type)}finally{showcaseActing=false}}
const attackBeforeShowcase=attack;
attack=function(f,type){if(gameMode==='showcase'&&!showcaseActing)return false;return attackBeforeShowcase(f,type)};
function expertShowcase(f,target,dt){
 const s=showcaseBrain(f);s.clock+=dt;s.decision-=dt;
 s.history.push({x:target.x,y:target.y,attack:target.attack?{frame:target.attack.frame,move:{...target.attack.move},type:target.attack.type}:null,block:target.block,stun:target.stun});if(s.history.length>6)s.history.shift();const seen=s.history[0],dist=Math.abs(seen.x-f.x),grounded=f.y===ground;
 f.face=target.x>=f.x?1:-1;f.vx=s.walk||0;f.crouch=false;
 if(f.hp<=0||f.stun>0||airState(f).escape>0){f.vx=0;return;}
 const threat=seen.attack&&dist<250,active=threat&&seen.attack.frame<seen.attack.move.startup+seen.attack.move.active;
 f.block=grounded&&!f.attack&&(f.blockstun>0||!!active&&seen.attack.move.grab!==true);f.crouch=f.block&&seen.attack?.move?.height==='low';
 if(f.blockstun>0){if(meter(f)>=50&&f.hp<f.maxHp*.4)guardBreakaway(f,target);return}
 if(defenseFor(f).lock>0)return;
 // Confirmed launches open the same chase window for both sides.
 if(airState(f).chase>0&&target.stun>0){f.attack=null;f.cooldown=0;f.block=false;f.y=Math.min(f.y,ground-3);f.vy=-680;airState(f).chase=0;return}
 if(f.attack){f.vx=0;if(!f.attack.connected||f.attack.blocked)return;
 if(f.y<ground){const n=airState(target).hits;showcaseAttack(f,n>=3?'spinKick':n%2?'jumpKick':'punch')}
 else if(meter(f)>=100)showcaseAttack(f,'super');else if(f.attack.type==='punch')showcaseAttack(f,'lowKick');else showcaseAttack(f,'uppercut');return}
 if(s.decision>0)return;s.decision=.09;s.turn++;s.walk=0;f.vx=0;
 if(threat&&seen.attack.move.type==='throw'&&dist<155){const d=defenseFor(f);if(d.techCooldown<=0){d.tech=.15;d.techCooldown=.6}f.block=false}
 if(f.block){f.vx=0;if(s.turn%7===0)startBackdash(f);return}
 if(!grounded){if(dist<230&&Math.abs(f.y-seen.y)<150)showcaseAttack(f,airState(target).hits>=3?'spinKick':s.turn%2?'punch':'jumpKick');return}
 const bullet=projectiles.find(p=>p.owner!==f&&Math.abs(p.x-f.x)<230&&p.dir*(f.x-p.x)>0);
 if(bullet){if(s.turn%3===0){f.vy=-(f.jumpStrength||580);f.vx=f.face*220}else f.block=true;return}
 if(meter(f)>=100&&(SUPER_MOVES[f.character].projectile?dist>180:dist<220)&&showcaseAttack(f,'super'))return;
 if(seen.y<ground-25&&dist<190){showcaseAttack(f,'uppercut');return}
 if(dist<130&&seen.block&&s.turn%3!==0){showcaseAttack(f,'throw');return}
 const recovering=seen.attack&&seen.attack.frame>=seen.attack.move.startup+seen.attack.move.active;
 if(dist<195){showcaseAttack(f,recovering||s.turn%4===0?'lowKick':s.turn%5===0?'throw':s.turn%3===0?'kick':'punch');return}
 const ideal=['cipher','ember'].includes(f.character)?230:150;
 f.vx=f.face*(dist>ideal?260:120);s.walk=f.vx;
 if(dist>280&&s.turn%4===0){const move=getMove(f,'fireball');if(move.projectile||move.dash)showcaseAttack(f,'fireball')}
 if(dist>230&&s.turn%17===0){f.vy=-(f.jumpStrength||580);f.vx=f.face*240}
}
const cpuBeforeShowcase=updateCpuFighter;
updateCpuFighter=function(f,t,dt){if(gameMode==='showcase')expertShowcase(f,t,dt);else cpuBeforeShowcase(f,t,dt)};
const captureBeforeShowcase=captureCombatInput;
captureCombatInput=function(){if(gameMode!=='showcase')return captureBeforeShowcase();inputQueue=[];previousKeys=new Set(keys)};
const stepBeforeShowcase=stepFighter;
stepFighter=function(f,t,dt){if(gameMode==='showcase'&&mode==='playing'&&f===player)expertShowcase(f,t,dt);
 // The previous aerial module has an enemy-only follow-up: route it through the policy gate.
 const prior=showcaseActing;if(gameMode==='showcase')showcaseActing=true;try{stepBeforeShowcase(f,t,dt)}finally{showcaseActing=prior}};
const syncBeforeShowcase=syncModeSelection;
syncModeSelection=function(){syncBeforeShowcase();if(pendingGameMode==='showcase'){$('#difficultySelect').value='hard';$('#difficultySelect').disabled=true;$('#modeDescription').textContent='CPU VS CPU / EXPERT SHOWCASE. Pick both fighters and a stage. Legal combos, aerial juggles, defense, throws and earned Supers. Rounds and rotating matchups continue automatically. Pause or return Home anytime. No player rewards.'}};$('#modeSelect').onchange=syncModeSelection;
$('#titleShowcase').onclick=()=>startMode('showcase');
const matchupBeforeShowcase=updateMatchup;updateMatchup=function(){matchupBeforeShowcase();if($('#modeSelect').value==='showcase')$('#matchupText').textContent='CPU 01 / '+fighterRoster[pendingCharacter].name+' VS CPU 02 / '+fighterRoster[selectionOpponent()].name};
const statusBeforeShowcase=updateSessionStatus;updateSessionStatus=function(){statusBeforeShowcase();if(gameMode==='showcase')$('#sessionStatus').textContent=`CPU VS CPU / EXPERT SHOWCASE / BOUT ${showcaseBout} / ${STAGES[selectedStage]} / AUTO NEXT · NO REWARDS`};
const resetBeforeShowcase=resetRound;resetRound=function(){showcaseBrains=new WeakMap();showcaseWait=0;resetBeforeShowcase();document.body.classList.toggle('cpu-showcase',gameMode==='showcase');if(gameMode==='showcase'){difficulty='hard';$('#playerName').textContent='CPU 01 / '+fighterName(player);$('#enemyName').textContent='CPU 02 / '+fighterName(enemy);updateSessionStatus()}};
const updateBeforeShowcase=update;
update=function(dt){updateBeforeShowcase(dt);if(gameMode!=='showcase'||document.hidden||!$('#controlSettings').hidden)return;
 if(!['roundover','finished'].includes(mode)){showcaseWait=0;return}
 if(roundImpact||cinematicFinisher||lastBar||roundVictory)return;
 $('#highlightsPanel').hidden=true;showcaseWait+=dt;if(showcaseWait<3)return;
 if(mode==='finished'){showcaseBout++;const ids=Object.keys(fighterRoster),i=ids.indexOf(chosenCharacter);chosenCharacter=ids[(i+1)%ids.length];chosenOpponent=ids[(i+4)%ids.length];const stages=Object.keys(STAGES);selectedStage=stages[(stages.indexOf(selectedStage)+1)%stages.length];round=1;wins=[0,0]}else round++;
 resetRound();
};
const titleBeforeShowcase=showTitleScreen;showTitleScreen=function(){showcaseWait=0;showcaseBout=1;document.body.classList.remove('cpu-showcase');titleBeforeShowcase()};
