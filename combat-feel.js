'use strict';
// One deliberate buffered action, retained for 12 simulation frames (~185 ms).
const captureBeforeFeel=captureCombatInput;
captureCombatInput=function(){captureBeforeFeel();for(const q of inputQueue)if(!q.feelStamped){q.expires=combatTick+12;q.feelStamped=true}if(inputQueue.length>1)inputQueue=[inputQueue[inputQueue.length-1]]};
const attackBeforeFeel=attack;
attack=function(f,type){const ok=attackBeforeFeel(f,type);if(ok&&f===player)inputQueue=[];return ok};
// A full knockdown earns a short, symmetric wake-up escape window.
const stepBeforeFeel=stepFighter;
stepFighter=function(f,other,dt){const down=f.knockedDown;stepBeforeFeel(f,other,dt);if(down&&!f.knockedDown&&f.hp>0){f.invulnerable=Math.max(f.invulnerable,10);f.comboOwner=null;other.combo=0;other.comboTimer=0}};
const reactions=new WeakMap();
const hitBeforeFeel=applyCombatHit;
applyCombatHit=function(a,t,m,d){const hp=t.hp,ok=hitBeforeFeel(a,t,m,d);if(!ok||t.hp>=hp)return ok;const blocked=t.blockstun>0;
 // At the wall, blocked pressure pushes the attacker out instead of pinning both bodies.
 if(blocked&&!m.projectile&&!m.grab&&((d>0&&t.x>=1000)||(d<0&&t.x<=100))){a.x=Math.max(50,Math.min(1050,a.x-d*24))}
 if(!blocked)reactions.set(t,{age:0,life:m.knockdown?.65:m.damage>=12?.32:.2,kind:m.knockdown?'down':m.damage>=12?'heavy':'light',dir:d});return ok};
const updateBeforeFeel=update;
update=function(dt){const on=['playing','roundover','finished'].includes(mode)&&!superCinema&&!document.hidden;updateBeforeFeel(dt);if(on&&!superCinema)for(const f of [player,enemy]){const r=reactions.get(f);if(r){r.age+=dt;if(r.age>=r.life)reactions.delete(f)}}};
const renderBeforeFeel=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){const r=reactions.get(f);if(!r||f.hp<=0||f.celebrating||f.knockedDown){renderBeforeFeel(g,f,scale);return}const p=Math.min(1,r.age/r.life),kick=Math.sin(Math.PI*p)*(1-p),heavy=r.kind==='heavy';g.save();g.translate(f.x,f.y);g.rotate((strongEffects?(heavy?.12:.05):.025)*r.dir*kick);g.scale(1+(heavy?.06:.025)*kick,1-(heavy?.06:.025)*kick);g.translate(-f.x,-f.y);renderBeforeFeel(g,f,scale);g.restore()};
const resetBeforeFeel=resetRound;resetRound=function(){resetBeforeFeel();reactions.delete(player);reactions.delete(enemy)};
function ladderDifficultyProfile(){if(gameMode!=='arcade')return null;const t=Math.max(0,Math.min(1,arcadeIndex/7)),kind=difficulty==='easy'?'easy':difficulty==='hard'?'hard':'normal',from=kind==='hard'?DIFFICULTIES.normal:DIFFICULTIES.easy,to=kind==='easy'?DIFFICULTIES.normal:DIFFICULTIES.hard,p=kind==='easy'?t:kind==='normal'?.25+.75*t:.35+.65*t;const cfg={};for(const key of Object.keys(from))cfg[key]=from[key]+(to[key]-from[key])*p;const delayFrom=kind==='hard'?.19:.26,delayTo=kind==='easy'?.19:.14;return {cfg,delay:delayFrom+(delayTo-delayFrom)*p}}
const observeBeforeFeel=observeForCpu;
observeForCpu=function(f,target){const profile=ladderDifficultyProfile();if(!profile)return observeBeforeFeel(f,target);const key=effectiveDifficulty(),old=CPU_REACTION_SECONDS[key];CPU_REACTION_SECONDS[key]=profile.delay;try{return observeBeforeFeel(f,target)}finally{CPU_REACTION_SECONDS[key]=old}};
const cpuBeforeFeel=updateCpuFighter;
updateCpuFighter=function(f,target,dt){const profile=ladderDifficultyProfile();if(!profile){cpuBeforeFeel(f,target,dt);return}const key=effectiveDifficulty(),old=DIFFICULTIES[key];DIFFICULTIES[key]=profile.cfg;try{cpuBeforeFeel(f,target,dt)}finally{DIFFICULTIES[key]=old}};
// Cancel held touches if Android interrupts a gesture or backgrounds the app.
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(mode==='playing')pause()}});
window.addEventListener('pagehide',()=>clearInput());
