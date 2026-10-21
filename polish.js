'use strict';
// Distinct decisions use the same legal attacks, cooldowns and frame data as the player.
const CPU_STYLES={
 volt:{range:82,pace:1.1,guard:.3,signature:'uppercut',label:'PRESSURE BOXER'},
 ember:{range:112,pace:.8,guard:.85,signature:'fireball',label:'PATIENT COUNTER'},
 cipher:{range:245,pace:.9,guard:.5,signature:'uppercut',label:'DISTANCE SPECIALIST'},
 brick:{range:55,pace:.85,guard:.35,signature:'fireball',label:'GRAB PRESSURE'},
 jade:{range:125,pace:1.15,guard:.35,signature:'spinKick',label:'AIR & ANGLES'},
 rook:{range:75,pace:.85,guard:.8,signature:'uppercut',label:'THROW & PUNISH'},
 haze:{range:96,pace:1.35,guard:.2,signature:'fireball',label:'HIT & RUN'},
 goldie:{range:120,pace:1,guard:.45,signature:'spinKick',label:'RHYTHM CHAINS'}
};
const cpuBeforePolish=updateCpuFighter;updateCpuFighter=function(f,target,dt){
 if(gameMode==='training'&&$('#dummyBehavior').value!=='cpu'){cpuBeforePolish(f,target,dt);return}
 const s=CPU_STYLES[f.character]||CPU_STYLES.volt,cfg=DIFFICULTIES[effectiveDifficulty()]||DIFFICULTIES.normal,dist=Math.abs(target.x-f.x);
 f.aiAge=(f.aiAge||0)+dt;aiWait-=dt;
 f.block=!f.attack&&!f.stun&&(f.blockstun>0||!!f.aiGuard);f.crouch=f.block&&target.attack?.move?.height==='low';
 let desired=s.range;if(f.isBoss)desired=62;
 const retreat=f.character==='haze'&&f.aiRetreat>0;f.aiRetreat=Math.max(0,(f.aiRetreat||0)-dt);
 f.vx=f.stun||f.blockstun||f.block||f.attack?0:(retreat?-1:dist>desired+16?1:dist<desired-24?-1:0)*f.face*180*cfg.move*s.pace;
 if(aiWait>0)return;
 aiWait=cfg.reaction+Math.random()*cfg.variation;
 f.aiGuard=dist<175&&!!target.attack&&Math.random()<Math.min(.95,s.guard*cfg.guard*1.6);if(f.aiGuard)return;f.block=false;
 if(f.attack?.connected&&Math.random()<cfg.combo){attack(f,f.attack.type==='punch'?'kick':s.signature);return}
 if(f.attack||f.stun||f.blockstun)return;
 const projectileThreat=projectiles.some(p=>p.owner!==f&&Math.abs(p.x-f.x)<210);
 if(f.character==='jade'&&f.y===ground&&(dist>135||projectileThreat)&&Math.random()<.65*cfg.move){f.vy=-(f.jumpStrength||560);return}
 if(projectileThreat&&effectiveDifficulty()==='hard'&&f.y===ground&&Math.random()<.6){f.vy=-(f.jumpStrength||560);return}
 if(f.character==='ember'&&target.attack&&dist<140){attack(f,'fireball');return}
 if(f.character==='rook'&&dist<100){attack(f,target.attack?'fireball':'uppercut');return}
 if(f.character==='brick'&&dist<95){attack(f,Math.random()<.6?'fireball':'uppercut');return}
 if(f.character==='cipher'){if(dist>155)attack(f,'uppercut');else attack(f,dist<95?'punch':'kick');return}
 if(f.character==='haze'&&dist<140){if(attack(f,Math.random()<.6?'punch':'fireball'))f.aiRetreat=.45;return}
 if(dist<150)attack(f,Math.random()<.5?'punch':Math.random()<.6?'kick':s.signature);
 else if(dist<330&&(f.character==='volt'||f.character==='haze'))attack(f,'fireball');
};

// Build extra pixel animation frames locally from the original character atlas.
const motionSheets={};
function buildMotionSheet(id){const source=arcadeSprites[id];if(!source?.complete||source.naturalWidth<1280)return null;
 const sheet=document.createElement('canvas');sheet.width=160*24;sheet.height=160;const g=sheet.getContext('2d');g.imageSmoothingEnabled=false;
 for(let i=0;i<24;i++){g.save();g.translate(i*160,0);
 if(i<8){const p=i/8*Math.PI*2,bob=Math.round(Math.cos(p*2)*1.5);g.drawImage(source,0,0,160,103,0,bob,160,103);g.drawImage(source,0,103,80,57,Math.round(Math.sin(p)*5),103,80,57);g.drawImage(source,80,103,80,57,80-Math.round(Math.sin(p)*5),103,80,57)}
 else if(i<12){const n=i-8;g.drawImage(source,160,0,160,160,0,20+n%2,160,140)}
 else if(i<16){const n=i-12;g.drawImage(source,320,0,160,160,0,30+n%2,160,125)}
 else if(i<20){const n=i-16;g.translate(80,144);g.rotate(-.09*Math.sin((n+1)*Math.PI/5));g.drawImage(source,1120,0,160,160,-80+(3-n)*2,-144,160,160)}
 else{const n=i-20;g.translate(80,120+n*5);g.rotate(-Math.min(1,(n+1)/4)*Math.PI/3);g.drawImage(source,1120,0,160,160,-80,-80,160,160)}g.restore();
 }
 motionSheets[id]=sheet;return sheet;
}
function motionFrame(f){if(f.attack)return -1;if(f.hp<=0||f.knockedDown)return 20+Math.min(3,Math.floor((f.animTime||0)*8));if(f.stun>0)return 16+Math.min(3,Math.floor((f.animTime||0)*18));if(f.y<ground)return -1;if(f.crouch)return 12+Math.floor((f.animTime||0)*5)%4;if(f.block)return 8+Math.floor((f.animTime||0)*6)%4;if(Math.abs(f.vx)>0)return Math.floor((f.animTime||0)*12)%8;return -1}
const bodyBeforePolish=renderStreetFighter;renderStreetFighter=function(g,f,scale=2.1){
 const slot=motionFrame(f),sheet=slot>=0?(motionSheets[f.character]||buildMotionSheet(f.character)):null;
 const personality=FIGHTER_PERSONALITY[f.character];
 const celebration=f.celebrating||f.tauntTime>0||(mode==='countdown'&&fightOpening?.phase==='stage');
 if(sheet&&!celebration){const b=BODY_STYLES[f.character],size=scale*.7*b.height;g.save();g.translate(f.x,f.y);g.scale((f.face||1)*.78*Math.sqrt(b.width),1);g.imageSmoothingEnabled=false;if(strongEffects&&f.hitFlash>0)g.filter='brightness(1.8)';g.drawImage(sheet,slot*160,0,160,160,-80*size,-144*size,160*size,160*size);g.restore();return}
 if(celebration&&personality&&f.hp>0){const pose={...f,attack:{type:personality.pose,frame:12,move:{...getMove(f,personality.pose),startup:0,active:30,recovery:1}},animTime:f.animTime||0};g.save();if(strongEffects)g.translate(0,-Math.abs(Math.sin((f.animTime||0)*3))*3);bodyBeforePolish(g,pose,scale);g.restore();return}
 bodyBeforePolish(g,f,scale);
};
const FIGHTER_PERSONALITY={volt:{pose:'uppercut',taunt:'Hands up. Keep pace.',victory:'CLEAN HANDS. CLEAN FINISH.'},ember:{pose:'fireball',taunt:'I can wait.',victory:'PATIENCE PAYS.'},cipher:{pose:'uppercut',taunt:'I already read that.',victory:'EVERY MOVE HAD A MEANING.'},brick:{pose:'spinKick',taunt:'Stand your ground.',victory:'THE BLOCK STANDS STRONG.'},jade:{pose:'spinKick',taunt:'Find your rhythm.',victory:'KEEP THE CIRCLE MOVING.'},rook:{pose:'fireball',taunt:'Watch your balance.',victory:'ONE OPENING. ALL I NEEDED.'},haze:{pose:'fireball',taunt:'Still catching up?',victory:'FAST HANDS. FASTER FINISH.'},goldie:{pose:'spinKick',taunt:'Give the crowd something.',victory:'THAT ONE GOES ON THE MIXTAPE.'}};
function taunt(){if(mode!=='playing'||player.attack||player.stun||player.y!==ground||player.tauntCooldown>0)return false;player.tauntTime=.85;player.tauntCooldown=6;impactLabels.push({x:player.x,y:player.y-175,text:FIGHTER_PERSONALITY[player.character].taunt,age:0,life:.85,color:player.color});return true}
$('#tauntButton').onclick=taunt;window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='t'&&!e.repeat&&!(e.target&&['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)))taunt()});
const attackBeforePolish=attack;attack=function(f,type){const ok=attackBeforePolish(f,type);if(ok)f.tauntTime=0;return ok};

// Readable guard rings and grounded shockwaves supplement the existing impact feedback.
let impactBursts=[];
const hitBeforePolish=applyCombatHit;applyCombatHit=function(a,t,m,d){const hp=t.hp,ok=hitBeforePolish(a,t,m,d);if(ok&&t.hp<hp){t.tauntTime=0;const blocked=t.blockstun>0,heavy=m.damage>=12||m.grab||m.knockdown;impactBursts.push({x:t.x,y:blocked?t.y-85:heavy?ground:t.y-85,age:0,life:blocked?.28:heavy?.42:.2,blocked,heavy,color:blocked?'#9ee9ff':a.color});if(impactBursts.length>16)impactBursts.shift();if(!blocked&&sound)tone(({volt:190,ember:120,cipher:480,brick:65,jade:270,rook:90,haze:640,goldie:350})[a.character]||160)}return ok};

function sanitizeRecords(v){const r={matches:0,wins:0,losses:0,rounds:0,bestCombo:0,bestDamage:0,arcadeClears:0,fighters:{}};if(!v||typeof v!=='object')return r;for(const k of Object.keys(r))if(k!=='fighters'&&Number.isFinite(v[k]))r[k]=Math.max(0,Math.floor(v[k]));for(const id of Object.keys(fighterRoster)){const n=v.fighters?.[id];if(Number.isFinite(n)&&n>=0)r.fighters[id]=Math.floor(n)}return r}
let personalRecords=sanitizeRecords(safeStorageGet('block-cypher-records-v1'));
function saveRecords(){safeStorageSet('block-cypher-records-v1',personalRecords)}
function renderRecords(){const r=personalRecords;$('#recordsSummary').textContent=`${r.matches} MATCHES · ${r.wins} WINS · ${r.losses} LOSSES\n${r.rounds} ROUNDS WON · ${r.arcadeClears} ARCADE CLEARS\nBEST COMBO: ${r.bestCombo} HITS / ${r.bestDamage} DAMAGE`;
 $('#fighterRecords').textContent=Object.keys(fighterRoster).map(id=>`${fighterRoster[id].name}: ${r.fighters[id]||0} wins`).join(' · ')}
$('#titleRecords').onclick=()=>{renderRecords();$('#recordsPanel').hidden=false;$('#closeRecords').focus()};$('#closeRecords').onclick=()=>{$('#recordsPanel').hidden=true;$('#titleRecords').focus()};
window.addEventListener('keydown',e=>{const panel=$('#recordsPanel');if(panel.hidden)return;if(e.key==='Escape'){panel.hidden=true;$('#titleRecords').focus()}if(e.key==='Tab'){e.preventDefault();$('#closeRecords').focus()}});
const comboBeforePolish=onComboHit;onComboHit=function(f,t,m,damage,blocked){comboBeforePolish(f,t,m,damage,blocked);if(f===player&&!blocked&&gameMode!=='training'){const hits=f.comboResult?.hits||0,total=f.comboResult?.damage||0;if(hits>personalRecords.bestCombo||total>personalRecords.bestDamage){personalRecords.bestCombo=Math.max(hits,personalRecords.bestCombo);personalRecords.bestDamage=Math.max(total,personalRecords.bestDamage);saveRecords()}}};
const endBeforePolish=endRound;endRound=function(){const valid=mode==='playing'&&gameMode!=='training',prior=[...wins];endBeforePolish();if(!valid||!['finished','roundover'].includes(mode))return;const winner=wins[0]>prior[0]?player:wins[1]>prior[1]?enemy:null;if(winner){winner.celebrating=true;if(resultReveal)resultReveal.args[2]=FIGHTER_PERSONALITY[winner.character].victory}if(wins[0]>prior[0])personalRecords.rounds++;if(mode==='finished'){personalRecords.matches++;if(wins[0]>=2){personalRecords.wins++;personalRecords.fighters[player.character]=(personalRecords.fighters[player.character]||0)+1;if(gameMode==='arcade'&&arcadeIndex===7)personalRecords.arcadeClears++}else personalRecords.losses++}saveRecords()};
const resetBeforePolish=resetRound;resetRound=function(){impactBursts=[];resetBeforePolish();for(const f of [player,enemy]){f.tauntTime=0;f.tauntCooldown=0;f.celebrating=false}};
const updateBeforePolish=update;update=function(dt){const active=mode==='playing';updateBeforePolish(dt);if(active){for(const f of [player,enemy]){f.tauntTime=Math.max(0,(f.tauntTime||0)-dt);f.tauntCooldown=Math.max(0,(f.tauntCooldown||0)-dt)}$('#tauntButton').disabled=player.tauntCooldown>0;$('#tauntButton').textContent=player.tauntCooldown>0?`TAUNT ${Math.ceil(player.tauntCooldown)}`:'TAUNT / T'}if(['playing','finished','roundover'].includes(mode)){for(const b of impactBursts)b.age+=dt;impactBursts=impactBursts.filter(b=>b.age<b.life)}};
const drawBeforePolish=draw;draw=function(){drawBeforePolish();if(!['playing','roundover','finished'].includes(mode))return;ctx.save();for(const b of impactBursts){const p=b.age/b.life;ctx.globalAlpha=(1-p)*(strongEffects?.9:.4);ctx.strokeStyle=b.color;ctx.lineWidth=b.blocked?4:3;ctx.beginPath();if(b.blocked)ctx.arc(b.x,b.y,22+p*24,0,Math.PI*2);else if(b.heavy)ctx.ellipse(b.x,b.y,20+p*(strongEffects?100:35),5+p*14,0,0,Math.PI*2);else ctx.arc(b.x,b.y,8+p*18,0,Math.PI*2);ctx.stroke()}ctx.restore()};

// A pointer-captured stick coexists with independently held attack buttons.
let stickPointer=null,stickKeys=new Set(),stickJumpLatched=false;
function releaseStick(){for(const key of stickKeys)if(![...touchPointers.values()].some(p=>p.key===key))keys.delete(key);stickKeys.clear();stickPointer=null;stickJumpLatched=false;$('#stickKnob').style.transform='translate(0px,0px)'}
function moveStick(e){if(e.pointerId!==stickPointer)return;const box=$('#thumbstick').getBoundingClientRect(),radius=box.width/2,dx=e.clientX-box.left-radius,dy=e.clientY-box.top-radius,len=Math.hypot(dx,dy),limit=radius*.6,factor=len>limit?limit/len:1,jumpHeld=stickKeys.has('w');for(const k of stickKeys)if(![...touchPointers.values()].some(p=>p.key===k))keys.delete(k);stickKeys.clear();if(mode==='playing'){if(dx<-radius*.22)stickKeys.add('a');if(dx>radius*.22)stickKeys.add('d');if(dy>-radius*.2)stickJumpLatched=false;if(dy<-radius*.55&&Math.abs(dy)>Math.abs(dx)*.9&&(!stickJumpLatched||jumpHeld)){stickKeys.add('w');stickJumpLatched=true}if(dy>radius*.4)stickKeys.add('s');for(const k of stickKeys)keys.add(k)}$('#stickKnob').style.transform=`translate(${Math.round(dx*factor)}px,${Math.round(dy*factor)}px)`}
const stick=$('#thumbstick');stick.addEventListener('pointerdown',e=>{if(stickPointer!==null||mode!=='playing')return;e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e)});stick.addEventListener('pointermove',moveStick);for(const name of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(name,e=>{if(e.pointerId===stickPointer)releaseStick()});stick.addEventListener('contextmenu',e=>e.preventDefault());
const clearBeforeStick=clearInput;clearInput=function(){releaseStick();clearBeforeStick()};

function handleTouchOrientation(){clearInput();if(mode==='playing')pause()}
window.addEventListener('orientationchange',handleTouchOrientation);
