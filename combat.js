'use strict';
// Adapted Neon Fist move data and combat concepts (MIT). See NEON-FIST-LICENSE.txt.
const STEP=1/60,INPUT_WINDOW=10;
let combatTick=0,hitstop=0,projectiles=[],previousKeys=new Set(),inputQueue=[],directionHistory=[],comboText='',comboTime=0;
const MOVES={
 punch:{startup:4,active:3,recovery:9,damage:7,chip:1,hitstun:15,blockstun:9,range:100,height:'mid',cancelInto:['kick','fireball','uppercut','spinKick']},
 kick:{startup:8,active:4,recovery:16,damage:13,chip:2,hitstun:22,blockstun:12,range:132,height:'mid',cancelInto:['fireball','uppercut','spinKick']},
 lowKick:{startup:6,active:3,recovery:13,damage:9,chip:1,hitstun:18,blockstun:10,range:120,height:'low',cancelInto:['fireball','uppercut','spinKick']},
 jumpKick:{startup:5,active:8,recovery:6,damage:11,chip:2,hitstun:20,blockstun:11,range:125,height:'overhead',cancelInto:[]},
 fireball:{startup:11,active:2,recovery:26,damage:12,chip:2,hitstun:20,blockstun:12,range:0,height:'mid',cancelInto:[]},
 uppercut:{startup:3,active:12,recovery:30,damage:16,chip:3,hitstun:34,blockstun:14,range:90,height:'mid',cancelInto:[]},
 spinKick:{startup:7,active:14,recovery:22,damage:14,chip:3,hitstun:26,blockstun:13,range:132,height:'mid',cancelInto:[]}
};
function initCombatFighter(f){Object.assign(f,{crouch:false,blockstun:0,combo:0,comboTimer:0,invulnerable:0,moveCooldowns:{},throwVelocity:0,knockedDown:false});}
const originalResetRound=resetRound;
resetRound=function(){originalResetRound();for(const f of [player,enemy])initCombatFighter(f);projectiles=[];hitstop=0;combatTick=0;previousKeys=new Set();inputQueue=[];directionHistory=[];comboText='';comboTime=0;updateCombatHud()};
for(const f of [player,enemy])initCombatFighter(f);
attack=function(f,type){
 const m=getMove(f,type);if(!m||f.hp<=0||f.stun>0||f.blockstun>0)return false;
 const cancel=f.attack&&f.attack.connected&&(f.attack.move||getMove(f,f.attack.type)).cancelInto.includes(type);
 if(f.attack&&!cancel)return false;if((f.moveCooldowns?.[type]||0)>0)return false;
 if(!cancel&&(f.cooldown>0||(f.block&&!m.counter)))return false;
 if(['fireball','uppercut','spinKick','lowKick'].includes(type)&&f.y<ground)return false;
 if((m.projectile||(type==='fireball'&&!f.character))&&projectiles.some(p=>p.owner===f))return false;
 f.attack={type,t:0,frame:0,hit:false,connected:false,spawned:false,move:m,lastHit:-999,counterUsed:false};f.cooldown=0;f.block=false;f.vx=0;
 if(m.cooldown)f.moveCooldowns[type]=m.cooldown;if(m.dodge)f.invulnerable=m.startup+m.active;else if(type==='uppercut'&&!m.grab&&!m.projectile&&m.launch!==0)f.invulnerable=6;
 tone(type==='fireball'?340:160);return true;
};
function matchesMotion(seq,window){let step=seq.length-1,gap=0;for(let i=directionHistory.length-1,n=0;i>=0&&n<window;i--,n++){const d=directionHistory[i];if(d===seq[step]){step--;gap=0;if(step<0)return true}else if(n>0&&d!==seq[step+1]&&++gap>4)return false}return false}
function captureCombatInput(){
 const h=(keys.has('d')?1:0)-(keys.has('a')?1:0),relative=h*player.face;directionHistory.push(keys.has('s')?(relative<0?1:relative>0?3:2):relative<0?4:relative>0?6:5);if(directionHistory.length>64)directionHistory.shift();
 for(const key of ['j','k','u','i','o','w'])if(keys.has(key)&&!previousKeys.has(key)){let type=key==='j'?'punch':key==='k'?(player.y<ground?'jumpKick':keys.has('s')?'lowKick':'kick'):key==='u'?'fireball':key==='i'?'uppercut':key==='o'?'spinKick':'jump';
 if(key==='j'){if(matchesMotion([6,2,3],16))type='uppercut';else if(matchesMotion([2,3,6],14))type='fireball'}
 if(key==='k'&&matchesMotion([2,1,4],14))type='spinKick';inputQueue.push({type,expires:combatTick+(typeof COMBO_ROUTES!=='undefined'?14:INPUT_WINDOW)})}
 previousKeys=new Set(keys);inputQueue=inputQueue.filter(q=>q.expires>=combatTick);
}
function applyCombatHit(attacker,target,m,dir){
 if(target.hp<=0||target.invulnerable>0)return false;
 const counter=target.attack,cm=counter?.move;
 if(!m.counterReply&&!m.grab&&cm?.counter&&!counter.counterUsed&&counter.frame>=cm.startup&&counter.frame<cm.startup+cm.active&&counterCanReach(target,attacker)){counter.counterUsed=true;counter.connected=true;const retaliation={...MOVES.kick,damage:cm.counterDamage,grab:cm.counterThrow,launch:cm.counterThrow?-350:0,knockdown:!!cm.counterThrow,counterReply:true};target.stun=0;applyCombatHit(target,attacker,retaliation,-dir);comboText=`${fighterName(target)} · ${cm.name.toUpperCase()}`;comboTime=1.2;return true}
 const blocked=!m.grab&&target.block&&target.y===ground&&(m.height==='low'?target.crouch:m.height==='overhead'?!target.crouch:true);
 if(blocked){target.hp=Math.max(0,target.hp-m.chip);target.blockstun=m.blockstun;target.combo=0;if(typeof onComboHit==='function')onComboHit(attacker,target,m,m.chip,true);tone(230)}
 else{const chain=target.stun>0&&target.comboOwner===attacker?attacker.combo+1:1;attacker.combo=chain;target.comboOwner=attacker;attacker.comboTimer=1.2;const scale=[1,1,.9,.8,.7,.6,.5,.45,.4,.35,.3][Math.min(chain-1,10)];const dealt=Math.min(target.hp,Math.max(1,Math.round(m.damage*scale*(attacker.power||1))));target.hp=Math.max(0,target.hp-dealt);if(typeof onComboHit==='function')onComboHit(attacker,target,m,dealt,false);target.hitDuration=m.hitstun/60;target.stun=target.hitDuration;if(!(target.attack?.move?.armor&&target.attack.frame<(target.attack.move.startup+target.attack.move.active))){target.attack=null}else target.stun=0;target.block=false;if(m.launch!==undefined&&m.launch)target.vy=m.launch;else if(m===MOVES.uppercut)target.vy=-500;if(m.grab){target.vy=m.launch||-300;target.throwVelocity=dir*240;target.x=Math.max(50,Math.min(1050,attacker.x+dir*60))}if(m.knockdown){target.knockedDown=true;target.hitDuration=.65;target.stun=.65;}comboText=chain>1?`${fighterName(attacker)} · ${chain} HIT COMBO`:'CLEAN HIT';comboTime=1.2;tone(70)}
 target.x=Math.max(50,Math.min(1050,target.x+dir*(blocked?9:(m.damage>10?24:12)*(attacker.combo>1?.55:1))));hitstop=blocked?3:5;
 for(let i=0;i<12;i++)particles.push({x:target.x-dir*12,y:target.y-65,vx:(Math.random()-.5)*350,vy:(Math.random()-.7)*300,t:.3,color:blocked?'#a9bfff':attacker.color});return true;
}
stepFighter=function(f,other,dt){
 for(const key of Object.keys(f.moveCooldowns||{}))f.moveCooldowns[key]=Math.max(0,f.moveCooldowns[key]-dt);f.cooldown=Math.max(0,f.cooldown-dt);f.stun=Math.max(0,f.stun-dt);f.blockstun=Math.max(0,f.blockstun-1);f.invulnerable=Math.max(0,f.invulnerable-1);f.comboTimer=Math.max(0,f.comboTimer-dt);if(!f.comboTimer)f.combo=0;
 if(!f.attack)f.face=other.x>=f.x?1:-1;
 if(f.stun>0||f.blockstun>0)f.vx=0;
 f.x=Math.max(50,Math.min(1050,f.x+f.vx*dt*(f.moveSpeed||1)));f.vy+=1250*dt;f.y=Math.min(ground,f.y+f.vy*dt);if(f.y===ground){f.vy=0;f.throwVelocity=0;if(f.stun<=0)f.knockedDown=false}else if(f.throwVelocity)f.x=Math.max(50,Math.min(1050,f.x+f.throwVelocity*dt));
 if(!f.attack)return;const a=f.attack,m=a.move||getMove(f,a.type);a.frame++;a.t=a.frame/60;
 if(a.type==='uppercut'&&!m.grab&&!m.projectile&&m.launch!==0&&a.frame===m.startup)f.vy=-530;
 if(a.frame>=m.startup&&a.frame<m.startup+m.active){const drive=m.dash!==undefined?m.dash:a.type==='spinKick'?6:0;f.x=Math.max(50,Math.min(1050,f.x+f.face*drive));}
 if(a.frame>=m.startup&&a.frame<m.startup+m.active){
  if((m.projectile||(a.type==='fireball'&&!f.character))&&!a.spawned){a.spawned=true;projectiles.push({owner:f,x:f.x+f.face*48,y:f.y-70,dir:f.face,life:2,move:m})}
  if((!a.hit||(m.multi&&a.frame-a.lastHit>=m.multi))&&!m.counter&&!m.dodge&&!m.projectile&&!(a.type==='fireball'&&!f.character)&&meleeConnects(f,other)){
   a.connected=applyCombatHit(f,other,m,f.face);a.hit=a.connected;if(a.connected)a.lastHit=a.frame;
  }
 }
 if(a.frame>=m.startup+m.active+m.recovery)f.attack=null;
};
function updateCombatHud(){const el=document.querySelector('#combatStatus');if(el)el.textContent=comboTime>0?comboText:'SLASH → HEAVY → SPECIAL · BUFFER YOUR NEXT MOVE'}
update=function(dt){
 if(mode!=='playing')return;combatTick++;captureCombatInput();if(hitstop>0){hitstop--;return}
 remaining=Math.max(0,remaining-dt);comboTime=Math.max(0,comboTime-dt);
 player.crouch=keys.has('s')&&player.y===ground&&!player.attack;
 player.block=(keys.has('l')||player.blockstun>0)&&!player.attack&&!player.stun;
 for(let i=inputQueue.length-1;i>=0;i--){const q=inputQueue[i];let used=false;if(q.type==='jump'){if(player.y===ground&&!player.stun&&!player.blockstun&&!player.attack&&!player.block){player.vy=-(player.jumpStrength||580);used=true}}else used=attack(player,q.type);if(used){inputQueue=[];break}}
 const h=(keys.has('d')?1:0)-(keys.has('a')?1:0);player.vx=player.stun||player.blockstun||player.block||player.attack||player.crouch?0:h*(h===player.face?260:205)*(player.y<ground?(player.airControl||.55):1);
 if(typeof updateCpuFighter==='function'){updateCpuFighter(enemy,player,dt)}else{
 const dist=Math.abs(player.x-enemy.x);aiWait-=dt;enemy.crouch=player.attack?.type==='lowKick'&&dist<140;enemy.block=!enemy.attack&&!enemy.stun&&(enemy.blockstun>0||(dist<150&&!!player.attack&&aiWait>.15));
 enemy.vx=enemy.stun||enemy.blockstun||enemy.block||enemy.attack?0:dist>(enemy.preferredRange||108)+12?enemy.face*180:dist<(enemy.preferredRange||80)-16?-enemy.face*110:0;
 if(aiWait<=0){const profile=CHARACTER_MOVES[enemy.character];if(profile){const active=!!player.attack;if(dist<85&&['brick','rook'].includes(enemy.character))attack(enemy,'uppercut');else if(active&&['ember','rook','volt'].includes(enemy.character)&&dist<145)attack(enemy,'fireball');else if(enemy.attack?.connected)attack(enemy,enemy.attack.type==='punch'?'kick':'spinKick');else if(dist<150)attack(enemy,Math.random()<.45?'punch':Math.random()<.5?'kick':'spinKick');else if(profile.slots.fireball.projectile||profile.slots.fireball.dash>0)attack(enemy,'fireball');else if(profile.slots.uppercut.projectile)attack(enemy,'uppercut');aiWait=.2+Math.random()*.4;}else{if(dist<140)attack(enemy,enemy.attack?.connected?'kick':Math.random()<.5?'punch':Math.random()<.5?'lowKick':'spinKick');else if(dist>220&&Math.random()<.5)attack(enemy,'fireball');if(dist>160&&Math.random()<.15&&enemy.y===ground&&!enemy.attack)enemy.vy=-(enemy.jumpStrength||560);aiWait=.25+Math.random()*.5}}
 }
 stepFighter(player,enemy,dt);stepFighter(enemy,player,dt);
 if(boxesOverlap(pushbox(player),pushbox(enemy))){const mid=(player.x+enemy.x)/2,dir=player.x<enemy.x?-1:1,half=(pushbox(player).w+pushbox(enemy).w)/4,left=Math.max(50,Math.min(1050-half*2,mid-half));player.x=dir<0?left:left+half*2;enemy.x=dir<0?left+half*2:left}
 for(const p of projectiles){const previousX=p.x;p.x+=p.dir*440*dt;p.life-=dt;const target=p.owner===player?enemy:player;if(projectileConnects(p,target,previousX)){if(applyCombatHit(p.owner,target,p.move||MOVES.fireball,p.dir))p.life=0}}
 projectiles=projectiles.filter(p=>p.life>0&&p.x>0&&p.x<1100);
 particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.t-=dt});particles=particles.filter(p=>p.t>0);updateHud();updateCombatHud();if(player.hp<=0||enemy.hp<=0||remaining<=0){projectiles=[];endRound()}
};
const originalClearInput=clearInput;clearInput=function(){originalClearInput();previousKeys=new Set();inputQueue=[];directionHistory=[]};
const originalDraw=draw;draw=function(){originalDraw();for(const p of projectiles){ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.dir,1);ctx.shadowColor=p.owner.color;ctx.shadowBlur=24;ctx.fillStyle=p.owner.color;ctx.beginPath();ctx.ellipse(0,0,22,15,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(5,-2,11,7,0,0,Math.PI*2);ctx.fill();ctx.restore()}};
animationState=function(f){return f.hp<=0?'death':f.stun>0?'take-hit':f.attack?(['kick','lowKick','jumpKick','spinKick'].includes(f.attack.type)?'attack2':'attack1'):f.block?'guard':f.y<ground?(f.vy<0?'jump':'fall'):Math.abs(f.vx)>0?'run':'idle'};
const originalDrawFighter=drawFighter;drawFighter=function(f){if(f.crouch){ctx.save();ctx.translate(0,f.y*.28);ctx.scale(1,.72);originalDrawFighter(f);ctx.restore()}else originalDrawFighter(f)};
spriteFrame=function(f,sprite){if(f.attack&&f.animState.startsWith('attack')){const m=f.attack.move||getMove(f,f.attack.type),a=f.attack.frame;const ratio=a<m.startup?.25*a/m.startup:a<m.startup+m.active?.25+.4*(a-m.startup)/m.active:.65+.35*(a-m.startup-m.active)/m.recovery;return Math.min(sprite.frames-1,Math.floor(ratio*sprite.frames))}if(f.animState==='guard')return 0;if(f.animState==='take-hit')return Math.min(sprite.frames-1,Math.floor((1-f.stun/Math.max(.01,f.hitDuration))*sprite.frames));const n=Math.floor(f.animTime*(f.animState==='run'?12:f.animState==='death'?9:8));return ['death','jump','fall'].includes(f.animState)?Math.min(sprite.frames-1,n):n%sprite.frames};
