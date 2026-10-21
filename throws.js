'use strict';
const CHARACTER_THROWS={
 volt:{name:'Live Wire Toss',damage:15,range:80,startup:7,recovery:26,launch:-330,velocity:210,pose:'toss'},
 ember:{name:'Backdraft Clinch',damage:17,range:78,startup:9,recovery:29,launch:-250,velocity:190,pose:'clinch'},
 cipher:{name:'Checkmate Flip',damage:15,range:84,startup:8,recovery:27,launch:-380,velocity:240,pose:'flip'},
 brick:{name:'Concrete Drop',damage:22,range:86,startup:11,recovery:36,launch:-440,velocity:120,pose:'slam'},
 jade:{name:'Ginga Sweep',damage:15,range:88,startup:8,recovery:28,launch:-210,velocity:270,pose:'sweep'},
 rook:{name:'Crosswalk Suplex',damage:20,range:82,startup:10,recovery:33,launch:-410,velocity:170,pose:'suplex'},
 haze:{name:'Quick Switch',damage:13,range:76,startup:6,recovery:25,launch:-260,velocity:300,pose:'switch'},
 goldie:{name:'Platinum Spin',damage:16,range:84,startup:9,recovery:30,launch:-350,velocity:250,pose:'spin'}
};
const moveBeforeThrows=getMove;
getMove=function(f,type){if(type!=='throw')return moveBeforeThrows(f,type);const p=CHARACTER_THROWS[f.character];return p?{...p,type:'throw',grab:true,knockdown:true,chip:0,active:3,hitstun:28,blockstun:0,height:'mid',cancelInto:[],cooldown:1.1,projectile:false,counter:false,dodge:false,rotate:false,dash:0}:undefined};
const attackBeforeThrows=attack;
attack=function(f,type){if(type==='throw'&&(mode!=='playing'||superCinema||f.y!==ground||f.crouch||f.attack||f.invulnerable>0))return false;return attackBeforeThrows(f,type)};
const hitBeforeThrows=applyCombatHit;
applyCombatHit=function(a,t,m,d){if(m.type==='throw'&&(t.y!==ground||t.stun>0||t.blockstun>0||t.knockedDown))return false;const hp=t.hp,ok=hitBeforeThrows(a,t,m,d);if(ok&&t.hp<hp&&m.type==='throw'){t.throwVelocity=d*CHARACTER_THROWS[a.character].velocity;impactLabels.push({x:a.x,y:a.y-185,text:m.name.toUpperCase(),age:0,life:.8,color:a.color})}return ok};
const captureBeforeThrows=captureCombatInput;
captureCombatInput=function(){const pressed=keys.has('g')&&!previousKeys.has('g');captureBeforeThrows();if(pressed)inputQueue=[{type:'throw',expires:combatTick+12,feelStamped:true}]};
window.addEventListener('keydown',e=>{if(mode==='playing'&&e.key.toLowerCase()==='g'&&!(e.target&&['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)))e.preventDefault()});
const rigBeforeThrows=rigPose;
rigPose=function(id,state,t){const p=rigBeforeThrows(id,state,t);if(!state.startsWith('throw:'))return p;const phase=state.split(':')[1],wind=phase==='charge',finish=phase==='recover',power=wind?t:finish?1-t:1,pose=CHARACTER_THROWS[id].pose;
 p.leftFoot=[-23,-1];p.rightFoot=[23,-1];p.leftHand=[24,-43];p.rightHand=[37,-45];p.head[0]=power*5;
 if(pose==='toss'){p.leftHand=[22,-46-power*15];p.rightHand=[38,-44-power*26]}
 if(pose==='clinch'){p.rightElbow=[32,-38];p.rightHand=[14,-51];p.leftHand=[29,-48];p.angle=power*.08}
 if(pose==='flip'){p.leftHand=[24,-48];p.rightHand=[42,-48-power*20];p.leftFoot=[-28,-1];p.head[0]=-power*4}
 if(pose==='slam'){p.leftHand=[-16,-44-power*36];p.rightHand=[25,-43-power*37];p.offset=finish?t*7:0;p.rightElbow=[32,-48]}
 if(pose==='sweep'){p.offset=power*14;p.leftHand=[32,-38];p.rightHand=[40,-34];p.rightKnee=[25,-12];p.rightFoot=[46,-3];p.head[0]=-5}
 if(pose==='suplex'){p.leftHand=[10,-44-power*30];p.rightHand=[23,-44-power*29];p.angle=-power*.25;p.head[0]=-8*power}
 if(pose==='switch'){p.leftHand=[34,-48];p.rightHand=[42,-41];p.shoulder[0]=8*power;p.leftFoot=[-29,-1];p.offset=-3*Math.sin(power*Math.PI)}
 if(pose==='spin'){p.leftHand=[-31*power,-45];p.rightHand=[39,-44];p.angle=power*.15;p.hip[0]=-5*power}
 return p};
const throwFrames=new Map();
function throwFrame(id,phase,p){const key=id+phase;if(!throwFrames.has(key))throwFrames.set(key,Array.from({length:8},(_,i)=>{const c=makeRigFrame(id,'throw:'+phase,i,8);c.complete=true;c.naturalWidth=160;c.naturalHeight=160;c.src='throw:'+key+i;return c}));return throwFrames.get(key)[Math.min(7,Math.max(0,Math.floor(p*8)))]}
const renderBeforeThrows=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){if(f.attack?.type!=='throw'||f.hp<=0||f.stun){renderBeforeThrows(g,f,scale);return}const phase=attackProgress(f.attack);let image=throwFrame(f.character,phase.phase,phase.p);if(f===player)image=recolorOutfit(image,f.character,chosenOutfit(f.character));const size=scale*(g===ctx?ARENA_FIGHTER_SCALE:1)*1.25;g.save();g.translate(f.x,f.y);g.scale((f.face||1)*.78,1);g.imageSmoothingEnabled=false;g.drawImage(image,-80*size,-144*size,160*size,160*size);g.restore()};
const buttonsBeforeThrows=updateMovesetButtons;
updateMovesetButtons=function(){buttonsBeforeThrows();const m=CHARACTER_THROWS[player.character];if(m){const b=$('#throwButton');b.textContent='THROW';b.setAttribute('aria-label',m.name+' — close-range throw, G');$('#throwGuide').textContent=m.name+' · THROW / G · Close range, ground only. Beats guard; jump to evade. Cannot grab hitstun, blockstun or wake-up protection. Whiffs leave recovery.'}};
const cpuBeforeThrows=updateCpuFighter;
updateCpuFighter=function(f,t,dt){const ready=aiWait<=dt;cpuBeforeThrows(f,t,dt);if(gameMode==='training'&&$('#dummyBehavior').value!=='cpu'||!ready||f.attack||f.isBoss)return;const seen=cpuObservations.get(f)?.[0];if(seen&&seen.y===ground&&Math.abs(seen.x-f.x)<85&&seen.block&&Math.random()<.35)attack(f,'throw')};
updateMovesetButtons();
