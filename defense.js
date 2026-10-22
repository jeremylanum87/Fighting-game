'use strict';
const defenseState=new WeakMap();
function defenseFor(f){let s=defenseState.get(f);if(!s){s={dash:0,dashCooldown:0,lock:0,tech:0,techCooldown:0};defenseState.set(f,s)}return s}
function defenseCue(f,text){impactLabels.push({x:f.x,y:f.y-170,text,age:0,life:.65,color:'#86f4ff'});if(impactLabels.length>8)impactLabels.shift();impactSound(true,false,false)}
function defenseReady(f){return mode==='playing'&&!superCinema&&f.hp>0&&f.y===ground&&!f.knockedDown&&!f.stun}
function startBackdash(f){
 const s=defenseFor(f);
 if(!defenseReady(f)||f.attack||f.blockstun>0||s.lock>0||s.dashCooldown>0)return false;
 s.dash=.22;s.lock=.22;s.dashCooldown=.7;
 f.block=false;f.invulnerable=Math.max(f.invulnerable,4);
 defenseCue(f,'BACKDASH');return true;
}
function guardBreakaway(f,other){
 const s=defenseFor(f);
 if(!defenseReady(f)||f.blockstun<=0||meter(f)<50||s.lock>0)return false;
 f.superMeter=meter(f)-50;f.blockstun=0;f.block=false;f.attack=null;s.lock=.24;
 f.invulnerable=Math.max(f.invulnerable,6);
 if(Math.abs(f.x-other.x)<180&&other.hp>0){
 const d=other.x>=f.x?1:-1;
 other.x=Math.max(50,Math.min(1050,other.x+d*65));
 other.attack=null;other.stun=Math.max(other.stun,.18);other.hitDuration=Math.max(other.hitDuration||0,.18);
 }
 projectiles=projectiles.filter(p=>p.owner===f||Math.abs(p.x-f.x)>180);
 defenseCue(f,'BREAKAWAY · −50');
 if(typeof detailBurst==='function')detailBurst(f.x,f.y-90,f.character,true,true,false);
 updateSuperHud();return true;
}
const captureBeforeDefense=captureCombatInput;
captureCombatInput=function(){
 const back=player.face===1?'a':'d',dash=keys.has('l')&&keys.has(back)&&!previousKeys.has(back);
 const burst=keys.has('l')&&keys.has('k')&&!previousKeys.has('k');
 const tech=keys.has('g')&&!previousKeys.has('g');
 captureBeforeDefense();
 if(mode!=='playing'||superCinema||hitstop>0)return;
 const s=defenseFor(player);
 if(tech&&s.techCooldown<=0&&s.lock<=0&&defenseReady(player)&&player.blockstun<=0){s.tech=.15;s.techCooldown=.6}
 if(burst&&guardBreakaway(player,enemy)||dash&&startBackdash(player))inputQueue=[];
};
const attackBeforeDefense=attack;
attack=function(f,type){if(defenseFor(f).lock>0)return false;return attackBeforeDefense(f,type)};
const stepBeforeDefense=stepFighter;
stepFighter=function(f,other,dt){
 const s=defenseFor(f),dashing=s.dash>0,locked=s.lock>0;
 s.dashCooldown=Math.max(0,s.dashCooldown-dt);s.techCooldown=Math.max(0,s.techCooldown-dt);s.tech=Math.max(0,s.tech-dt);
 if(locked){f.vx=dashing&&s.dash>.1?-f.face*490:0;f.block=false;f.crouch=false}
 stepBeforeDefense(f,other,dt);
 s.dash=Math.max(0,s.dash-dt);s.lock=Math.max(0,s.lock-dt);
};
const hitBeforeDefense=applyCombatHit;
applyCombatHit=function(a,t,m,d){
 const s=defenseFor(t);
 if(m.type==='throw'&&s.tech>0&&s.lock<=0&&defenseReady(t)&&t.blockstun<=0&&t.invulnerable<=0&&(!t.attack||t.attack.type==='throw')){
 s.tech=0;t.attack=null;a.attack=null;
 t.x=Math.max(50,Math.min(1050,t.x+d*28));a.x=Math.max(50,Math.min(1050,a.x-d*28));
 t.invulnerable=Math.max(t.invulnerable,6);a.invulnerable=Math.max(a.invulnerable,6);
 s.lock=.16;defenseFor(a).lock=.16;
 defenseCue(t,'THROW ESCAPE');return false;
 }
 return hitBeforeDefense(a,t,m,d);
};
const poseBeforeDefense=detailedArtPose;
detailedArtPose=function(f){const p=poseBeforeDefense(f),s=defenseState.get(f);if(s?.dash>0&&p.kind!=='hurt'){p.col=2;p.image=f.isBoss?motionArt.promoter:arcadeSprites[f.character];p.sx*=1.08;p.sy*=.9;p.kind='backdash'}return p};
const resetBeforeDefense=resetRound;
resetRound=function(){resetBeforeDefense();defenseState.delete(player);defenseState.delete(enemy)};
