'use strict';
const SIGNATURE_PROJECTILES={
 volt:{name:'Neon Bolt',damage:11,speed:650,startup:12,recovery:25,cooldown:2.2,life:1.25,width:26,height:12,kind:'bolt',colors:['#30eaff','#ffef40']},
 ember:{name:'Backdraft Flame',damage:15,speed:390,startup:19,recovery:30,cooldown:3,life:1.8,width:25,height:22,kind:'flame',colors:['#ff542f','#ffdd40']},
 cipher:{name:'Cipher Pulse',damage:12,speed:470,startup:15,recovery:28,cooldown:2.7,life:1.8,width:22,height:22,kind:'pulse',colors:['#c16cff','#49ffff']},
 brick:{name:'Concrete Quake',damage:16,speed:300,startup:24,recovery:35,cooldown:3.8,life:1.3,width:30,height:19,offset:24,heightRule:'low',kind:'quake',colors:['#ff9a38','#ffe49b']},
 jade:{name:'Ginga Wind Disc',damage:10,speed:520,startup:13,recovery:25,cooldown:2.4,life:1.6,width:29,height:13,kind:'wind',colors:['#42ffa8','#cfff48']},
 rook:{name:'Crosswalk Shockwave',damage:14,speed:370,startup:21,recovery:32,cooldown:3.3,life:1.6,width:26,height:20,offset:24,heightRule:'low',kind:'wave',colors:['#77d5ff','#cbb5ff']},
 haze:{name:'Afterimage Dart',damage:8,speed:800,startup:9,recovery:24,cooldown:2.1,life:.85,width:24,height:10,kind:'dart',colors:['#ff65e4','#67efff']},
 goldie:{name:'Platinum Disc',damage:12,speed:440,startup:16,recovery:28,cooldown:2.8,life:1.9,width:24,height:18,kind:'record',colors:['#ffdc42','#fff6ca']}
};
const moveBeforeSignatures=getMove;
getMove=function(f,type){if(type!=='signature')return moveBeforeSignatures(f,type);const p=SIGNATURE_PROJECTILES[f.character];return p?{...p,type:'signature',signature:true,projectileHeight:p.height,projectile:true,active:2,chip:1,hitstun:20,blockstun:12,height:p.heightRule||'mid',cancelInto:[],range:0,launch:0,grab:false,counter:false,dodge:false,dash:0}:undefined};
const attackBeforeSignatures=attack;
attack=function(f,type){if(type==='signature'&&(mode!=='playing'||superCinema||f.y!==ground||f.crouch))return false;const ok=attackBeforeSignatures(f,type);if(ok&&type==='signature')specialShow(f);return ok};
const captureBeforeSignatures=captureCombatInput;
captureCombatInput=function(){const pressed=keys.has('f')&&!previousKeys.has('f');captureBeforeSignatures();if(pressed)inputQueue=[{type:'signature',expires:combatTick+12,feelStamped:true}]};
window.addEventListener('keydown',e=>{if(mode==='playing'&&e.key.toLowerCase()==='f'&&!e.ctrlKey&&!e.metaKey&&!(e.target&&['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)))e.preventDefault()});
const projectileBoxBeforeSignatures=projectileHitbox;
projectileHitbox=function(p,previousX=p.x){if(!p.move?.signature)return projectileBoxBeforeSignatures(p,previousX);const m=p.move;return {x:Math.min(previousX,p.x)-m.width,y:p.y-m.projectileHeight/2,w:Math.abs(p.x-previousX)+m.width*2,h:m.projectileHeight}};
const buttonsBeforeSignatures=updateMovesetButtons;
updateMovesetButtons=function(){buttonsBeforeSignatures();const m=SIGNATURE_PROJECTILES[player.character];if(m){$('#projectileButton').textContent='PROJECTILE';$('#projectileButton').setAttribute('aria-label',m.name+' — F');$('#projectileGuide').textContent=m.name+' · PROJECTILE / F · '+(m.heightRule==='low'?'Ground wave: duck-block or jump.':'Block or jump to evade.')+' One projectile at a time; ground use only.'}};
const renderBeforeSignatures=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){if(f.attack?.type!=='signature'){renderBeforeSignatures(g,f,scale);return}const slot={volt:'uppercut',ember:'spinKick',cipher:'uppercut',brick:'spinKick',jade:'uppercut',rook:'uppercut',haze:'fireball',goldie:'spinKick'}[f.character],a=f.attack;renderBeforeSignatures(g,{...f,attack:{...a,type:slot,move:{...a.move,pose:slot}}},scale)};
function drawSignatureProjectile(g,p){const m=p.move,t=(p.age||0)*10;g.save();g.translate(p.x,p.y);g.scale(p.dir,1);g.lineWidth=3;g.strokeStyle=m.colors[0];g.fillStyle=m.colors[0];
 if(strongEffects){g.globalAlpha=.25;for(let j=1;j<=4;j++){g.beginPath();g.ellipse(-j*15,0,m.width,Math.max(3,m.projectileHeight*.6),0,0,Math.PI*2);g.fill()}g.globalAlpha=1}
 if(m.kind==='bolt'||m.kind==='dart'){g.beginPath();g.moveTo(-30,-10);g.lineTo(0,-6);g.lineTo(-9,-19);g.lineTo(36,0);g.lineTo(-13,16);g.lineTo(-3,5);g.lineTo(-32,10);g.closePath();g.fill()}
 else if(m.kind==='flame'){for(let j=0;j<3;j++){g.fillStyle=m.colors[j%2];g.beginPath();g.moveTo(25,0);g.quadraticCurveTo(-10,-30+j*8,-48+Math.sin(t+j)*8,-15+j*12);g.quadraticCurveTo(-20,15,25,0);g.fill()}}
 else if(m.kind==='quake'){for(let j=0;j<3;j++){g.beginPath();g.moveTo(-30+j*20,12);g.lineTo(-24+j*20,-18-(j%2)*9);g.lineTo(-10+j*20,12);g.fill()}}
 else if(m.kind==='wave'){for(let j=0;j<3;j++){g.beginPath();g.arc(-j*12,8,23-j*3,-Math.PI*.85,-Math.PI*.15);g.stroke()}}
 else{g.save();g.rotate(t*(m.kind==='wind'?1.2:.6));g.beginPath();g.ellipse(0,0,m.width,m.kind==='record'?18:m.width,0,0,Math.PI*2);g.stroke();if(m.kind==='pulse'){g.strokeStyle=m.colors[1];g.strokeRect(-14,-14,28,28)}else if(m.kind==='wind'){for(let j=0;j<3;j++){g.rotate(Math.PI*2/3);g.beginPath();g.arc(6,0,18,0,Math.PI*1.2);g.stroke()}}else{g.fillStyle='#18251e';g.beginPath();g.ellipse(0,0,19,14,0,0,Math.PI*2);g.fill();g.fillStyle=m.colors[1];g.beginPath();g.arc(0,0,6,0,Math.PI*2);g.fill()}g.restore()}
 g.fillStyle=m.colors[1];g.fillRect(-2,-2,5,5);g.restore()}
const drawBeforeSignatures=draw;
draw=function(){drawBeforeSignatures();if(!['playing','paused','roundover','finished'].includes(mode)||superCinema)return;for(const p of projectiles)if(p.move?.signature)drawSignatureProjectile(ctx,p)};
const cpuBeforeSignatures=updateCpuFighter;
updateCpuFighter=function(f,t,dt){const seen=cpuObservations.get(f)?.[0];if(!(gameMode==='training'&&$('#dummyBehavior').value!=='cpu')&&!f.isBoss&&seen&&aiWait<=dt&&Math.abs(seen.x-f.x)>300&&!f.attack&&Math.random()<.4)attack(f,'signature');cpuBeforeSignatures(f,t,dt)};
updateMovesetButtons();
