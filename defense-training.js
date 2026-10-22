'use strict';
let defenseDrill=null;
const DEFENSE_DRILLS={
 perfect:{name:'PERFECT BLOCK',hint:'Release guard between attacks. Tap BLOCK just before the punch lands.'},
 throws:{name:'THROW ESCAPE',hint:'Tap THROW / B / G just before the grab connects. Repeated taps have a cooldown.'},
 pressure:{name:'ESCAPE PRESSURE',hint:'BLOCK + back to evade, or block the hit then BLOCK + HEAVY to Breakaway. Meter refills each attempt.'},
 mixed:{name:'MIXED DEFENSE',hint:'Read the cue: stand block HIGH, duck + block LOW, or tap THROW to escape a grab.'}
};
function defenseDrillText(message){
 if(!defenseDrill)return;
 const s=defenseDrill;
 $('#defenseDrillStatus').textContent=message;
 $('#defenseDrillScore').textContent=s.hits+'/'+s.attempts+' successful · '+s.streak+' streak · best '+s.best;
}
function finishDefenseAttempt(pass,message){
 const s=defenseDrill;if(!s?.trial)return;
 s.attempts++;if(pass){s.hits++;s.streak++;s.best=Math.max(s.best,s.streak)}else s.streak=0;
 s.trial=null;s.wait=1.25;enemy.attack=null;
 defenseDrillText((pass?'✓ ':'TRY AGAIN · ')+message);
}
function startDefenseDrill(){
 if(gameMode!=='training'||tutorial||mode!=='playing')return;
 const kind=$('#defenseDrillSelect').value;
 if(!DEFENSE_DRILLS[kind])return;
 trainingDemo=null;trainingResetDelay=0;clearInput();
 defenseDrill={kind,hits:0,attempts:0,streak:0,best:0,wait:.8,trial:null,index:0};
 $('#dummyBehavior').value='stand';
 defenseDrillText(DEFENSE_DRILLS[kind].hint);
}
function stopDefenseDrill(){
 if(defenseDrill&&enemy.attack?.move?.defenseDrill)enemy.attack=null;
 defenseDrill=null;$('#defenseDrillStatus').textContent='Choose a drill and press START. Pause freezes the drill.';$('#defenseDrillScore').textContent='';
}
$('#startDefenseDrill').onclick=startDefenseDrill;
$('#stopDefenseDrill').onclick=stopDefenseDrill;
$('#defenseDrillSelect').onchange=()=>{if(defenseDrill)startDefenseDrill()};
const moveBeforeDefenseTraining=getMove;
getMove=function(f,type){
 const m=moveBeforeDefenseTraining(f,type),s=defenseDrill;
 if(!s||f!==enemy||!m)return m;
 const kind=s.trial?.kind||s.kind,grab=kind==='throws',low=kind==='low';
 return {...m,name:'Defense practice',defenseDrill:true,type:grab?'throw':type,grab,projectile:false,counter:false,dodge:false,armor:false,multi:0,damage:4,chip:1,startup:36,active:3,recovery:24,hitstun:12,blockstun:24,range:110,height:low?'low':'mid',knockdown:false,launch:0,dash:0,cooldown:0,box:{x:10,y:low?-40:-120,w:100,h:low?35:105}};
};
const cpuBeforeDefenseTraining=updateCpuFighter;
updateCpuFighter=function(f,t,dt){
 const s=defenseDrill;
 if(!s||gameMode!=='training'){cpuBeforeDefenseTraining(f,t,dt);return}
 f.vx=0;f.block=false;f.crouch=false;
 if(s.trial){
 s.trial.age+=dt;
 if(s.trial.age>1.1){
 const dodged=s.trial.kind==='pressure'&&s.trial.dashed&&player.hp===s.trial.hp;
 finishDefenseAttempt(dodged,dodged?'Backdash escaped the strike.':s.trial.kind==='throws'?'Throw missed or escape was mistimed.':'Late or missed. Watch the windup and try again.');
 }
 return;
 }
 s.wait-=dt;if(s.wait>0)return;
 clearInput();player.x=450;enemy.x=515;player.face=1;enemy.face=-1;
 for(const fighter of [player,enemy]){
 fighter.hp=fighter.maxHp;fighter.attack=null;fighter.stun=0;fighter.blockstun=0;fighter.invulnerable=0;fighter.knockedDown=false;fighter.y=ground;fighter.vy=0;fighter.vx=0;fighter.block=false;
 defenseState.delete(fighter);guardTiming.delete(fighter);
 }
 player.superMeter=100;updateSuperHud();updateHud();
 const kind=s.kind==='mixed'?['high','low','throws','high','throws','low'][s.index++%6]:s.kind;
 s.trial={kind,age:0,hp:player.hp,dashed:false};
 defenseDrillText(kind==='throws'?'THROW INCOMING · tap THROW near contact':kind==='low'?'LOW INCOMING · duck + block':kind==='pressure'?'STRIKE INCOMING · backdash or block, then Breakaway':'HIGH INCOMING · '+(s.kind==='perfect'?'time your block':'standing block'));
 if(!attack(f,kind==='throws'?'throw':kind==='low'?'lowKick':'punch')){s.trial=null;s.wait=.3}
};
const rewardBeforeDefenseTraining=resolveGuardReward;
resolveGuardReward=function(f,m){
 const s=defenseDrill,trial=s?.trial,perfect=rewardBeforeDefenseTraining(f,m);
 if(f===player&&m.defenseDrill&&trial&&trial.kind!=='pressure'){
 if(s.kind==='perfect'){
 const timing=guardTiming.get(f);
 finishDefenseAttempt(perfect,perfect?'Perfect timing!':timing?.age>.12?'Early — guard started too soon.':'Late — try guarding just before contact.');
 }else finishDefenseAttempt(true,perfect?'Perfect Block!':'Correct guard.');
 }
 return perfect;
};
const hitBeforeDefenseTraining=applyCombatHit;
applyCombatHit=function(a,t,m,d){
 const trial=defenseDrill?.trial,techBefore=defenseFor(t).tech,hp=t.hp;
 const ok=hitBeforeDefenseTraining(a,t,m,d);
 if(a!==enemy||t!==player||!m.defenseDrill||!trial||defenseDrill?.trial!==trial)return ok;
 if(m.type==='throw'&&techBefore>0&&t.hp===hp&&!a.attack&&defenseFor(t).lock>0)finishDefenseAttempt(true,'Throw escaped!');
 else if(t.hp<hp&&t.blockstun<=0)finishDefenseAttempt(false,'Hit landed — '+(trial.kind==='low'?'duck and guard low.':trial.kind==='throws'?'tap THROW closer to contact.':'guard before contact.'));
 return ok;
};
const dashBeforeDefenseTraining=startBackdash;
startBackdash=function(f){const ok=dashBeforeDefenseTraining(f);if(ok&&f===player&&defenseDrill?.trial)defenseDrill.trial.dashed=true;return ok};
const breakBeforeDefenseTraining=guardBreakaway;
guardBreakaway=function(f,t){const ok=breakBeforeDefenseTraining(f,t);if(ok&&f===player&&defenseDrill?.trial?.kind==='pressure')finishDefenseAttempt(true,'Breakaway escaped the pressure.');return ok};
const titleBeforeDefenseTraining=showTitleScreen;
showTitleScreen=function(){stopDefenseDrill();titleBeforeDefenseTraining()};
const selectBeforeDefenseTraining=openCharacterSelection;
openCharacterSelection=function(){stopDefenseDrill();selectBeforeDefenseTraining()};
const resetBeforeDefenseTraining=resetRound;
resetRound=function(){stopDefenseDrill();resetBeforeDefenseTraining()};
const demoBeforeDefenseTraining=$('#demoButton').onclick;
$('#demoButton').onclick=()=>{stopDefenseDrill();demoBeforeDefenseTraining()};
stopDefenseDrill();
