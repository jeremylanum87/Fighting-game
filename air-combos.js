'use strict';
// Ground launcher -> jump chase -> light/heavy/rise -> meteor. Shared by CPU and player.
const AIR_STYLES={volt:['SKY VOLTAGE','#55eaff',6],ember:['SOLAR FLARE','#ff925c',6],cipher:['ORBIT BREAKER','#bd9bff',7],brick:['CONCRETE COMET','#ffcb72',5],jade:['HEAVEN SPIRAL','#65ffb0',8],rook:['SKY CHECKMATE','#9ebdff',6],haze:['HYPER VELOCITY','#ff78d8',8],goldie:['PLATINUM ORBIT','#ffe86c',7]};
let airStates=new WeakMap(),airBursts=[],airBanner=null;
function airState(f){if(!airStates.has(f))airStates.set(f,{hits:0,owner:null,bounces:0,chase:0,escape:0,route:[],lastAction:null});return airStates.get(f)}
function airMove(f,kind){const style=AIR_STYLES[f.character]||AIR_STYLES.volt,light=kind==='light',slam=kind==='meteor',launch=kind==='launcher';return {...MOVES.punch,name:launch?'Skyline Launcher':slam?'Meteor Crash':light?'Air Rush':'Orbit Strike',startup:launch?9:light?3:slam?8:5,active:launch?6:light?5:7,recovery:launch?23:light?7:13,damage:launch?10:slam?16:light?5:8,chip:1,range:light?136:165,hitstun:40,blockstun:14,height:launch?'mid':'overhead',cancelInto:[],launch:launch?-680:slam?800:-210,airKind:kind,box:{x:8,y:launch?-200:-151,w:launch?130:156,h:launch?180:133},airColor:style[1]}}
const attackBeforeAir=attack;
attack=function(f,type){
 const airborne=f.y<ground-1,launcher=!airborne&&(type==='lowKick'||f===enemy&&type==='kick'&&gameMode!=='training'&&combatTick%180<40),kind=launcher?'launcher':airborne?type==='punch'?'light':['kick','jumpKick'].includes(type)?'heavy':type==='uppercut'?'rise':type==='spinKick'?'meteor':null:null;
 if(!kind)return attackBeforeAir(f,type);
 if(f.hp<=0||f.stun>0||f.blockstun>0||f.knockedDown||airState(f).escape>0)return false;
 const prior=f.attack,canCancel=prior?.connected&&!prior.blocked&&(prior.move?.airKind||launcher&&prior.type==='punch');
 if(prior&&!canCancel)return false;
 // A connected action may cancel once; repeated inputs still pass through the normal input buffer.
 if(canCancel)f.attack=null;
 const ok=attackBeforeAir(f,launcher?'kick':'punch');if(!ok){f.attack=prior;return false}
 f.attack.type=launcher?'kick':kind==='light'?'punch':'jumpKick';f.attack.move={...airMove(f,kind),actionId:f.attack.id};
 if(airborne){f.vy=Math.max(-250,Math.min(f.vy,kind==='meteor'?160:15));if(kind==='rise')f.vy=-320}
 return true;
};
function airBurst(f,kind,color){airBursts.push({x:f.x,y:f.y-100,kind,color,age:0,life:kind==='meteor'?.65:.4});if(airBursts.length>12)airBursts.shift()}
const hitBeforeAir=applyCombatHit;
applyCombatHit=function(a,t,m,d){
 const s=airState(t),wasAir=t.y<ground-1,hp=t.hp,kind=m.airKind;
 if(s.escape>0)return false;
 // Once the juggle budget is exhausted, all attack sources lose access until recovery.
 const max=(AIR_STYLES[a.character]||AIR_STYLES.volt)[2];
 const move=wasAir&&s.owner===a?{...m,damage:Math.max(2,Math.round(m.damage*Math.max(.35,1-s.hits*.09)))}:m;
 const ok=hitBeforeAir(a,t,move,d);
 if(!ok||t.hp>=hp||t.blockstun>0||t.hp<=0)return ok;
 if(kind==='launcher'||wasAir){
 if(s.owner!==a){s.hits=0;s.bounces=0;s.route=[];s.lastAction=null}
 s.owner=a;s.hits++;s.route.push(kind||'hit');
 t.knockedDown=false;t.y=Math.min(t.y,ground-3);t.stun=Math.max(t.stun,.62);t.comboOwner=a;
 if(kind==='launcher'){t.vy=-680;airState(a).chase=.65;airBanner={text:'LAUNCH!  JUMP TO CHASE',color:m.airColor,life:1.1}}
 else if(kind==='meteor'){t.vy=820;s.meteor=true;airBanner={text:'METEOR CRASH!',color:m.airColor,life:1}}
 else {t.vy=-Math.max(130,245-s.hits*13);t.y=Math.max(210,t.y);if(kind){a.y=Math.max(210,Math.min(a.y,t.y+15));a.vy=-130;a.x=Math.max(50,Math.min(1050,t.x-d*90))}}
 if(s.hits>=max){s.escape=.45;t.stun=0;t.attack=null;t.invulnerable=Math.max(t.invulnerable,28);t.vy=280;t.throwVelocity=d*210;s.meteor=false;finishCombo(a,'AIR RECOVERY');airBanner={text:'AIR BREAK / RECOVER!',color:'#d9f5ff',life:1}}
 else if(s.hits>1){airBanner={text:`${(AIR_STYLES[a.character]||AIR_STYLES.volt)[0]} / ${s.hits} AIR HITS`,color:(AIR_STYLES[a.character]||AIR_STYLES.volt)[1],life:1}}
 airBurst(t,kind||'hit',(AIR_STYLES[a.character]||AIR_STYLES.volt)[1]);
 }
 return ok;
};
const captureBeforeAir=captureCombatInput;
captureCombatInput=function(){captureBeforeAir();const s=airState(player);if(s.chase>0&&inputQueue.some(q=>q.type==='jump')&&!player.stun&&!player.blockstun){player.attack=null;player.cooldown=0;player.block=false;player.y=Math.min(player.y,ground-3);player.vy=-680;s.chase=0;inputQueue=inputQueue.filter(q=>q.type!=='jump');airBurst(player,'chase',(AIR_STYLES[player.character]||AIR_STYLES.volt)[1])}};
const stepBeforeAir=stepFighter;
stepFighter=function(f,other,dt){const s=airState(f),priorY=f.y;if(mode==='playing'){s.chase=Math.max(0,s.chase-dt);s.escape=Math.max(0,s.escape-dt);
 if(f===enemy&&s.chase>0&&!f.stun&&!f.blockstun){f.attack=null;f.y=ground-3;f.vy=-680;s.chase=0}
 if(f===enemy&&f.y<ground-10&&airState(other).owner===f&&other.stun>0&&!f.stun&&(!f.attack||f.attack.connected)){const n=airState(other).hits;attack(f,n>=4?'spinKick':n%2?'punch':'jumpKick')}
 }
 stepBeforeAir(f,other,dt);
 if(f.y===ground&&priorY<ground&&s.owner){
 if(s.meteor&&s.bounces===0&&s.escape<=0&&f.hp>0){s.bounces++;s.meteor=false;f.y=ground-3;f.vy=-460;f.stun=.6;f.knockedDown=false;airState(s.owner).chase=.4;airBurst(f,'meteor',(AIR_STYLES[s.owner.character]||AIR_STYLES.volt)[1]);airBanner={text:'GROUND BOUNCE! / ONE MORE',color:'#ffdb83',life:1}}
 else {s.owner=null;s.hits=0;s.bounces=0;s.meteor=false;s.route=[];f.comboOwner=null;if(f.hp>0){f.stun=0;f.invulnerable=Math.max(f.invulnerable,12)}}
 }
};
const updateBeforeAir=update;
update=function(dt){const active=mode==='playing'&&!document.hidden&&$('#controlSettings').hidden;const frozen=hitstop>0;updateBeforeAir(dt);if(!active||frozen)return;for(const b of airBursts)b.age+=dt;airBursts=airBursts.filter(b=>b.age<b.life);if(airBanner){airBanner.life-=dt;if(airBanner.life<=0)airBanner=null}};
const drawBeforeAir=draw;
draw=function(){drawBeforeAir();if(!['playing','paused','roundover','finished'].includes(mode))return;ctx.save();ctx.setTransform(canvas.width/1100,0,0,canvas.height/520,0,0);
 const full=strongEffects&&!reducedMotionPreference();
 for(const b of airBursts){const t=b.age/b.life;ctx.globalAlpha=(1-t)*(full?.8:.35);ctx.strokeStyle=b.color;ctx.lineWidth=full?5:2;ctx.beginPath();ctx.ellipse(b.x,b.kind==='meteor'?ground-4:b.y,25+t*105,(b.kind==='meteor'?12:25)+t*38,0,0,Math.PI*2);ctx.stroke();if(full)for(let j=0;j<10;j++){const angle=j*Math.PI/5+t;const r=30+t*100;ctx.beginPath();ctx.moveTo(b.x+Math.cos(angle)*r,b.y+Math.sin(angle)*r*.55);ctx.lineTo(b.x+Math.cos(angle)*(r+25),b.y+Math.sin(angle)*(r+25)*.55);ctx.stroke()}}
 if(full)for(const f of [player,enemy])if(f.y<ground-10&&(f.attack?.move?.airKind||airState(f).owner)){const color=(AIR_STYLES[f.character]||AIR_STYLES.volt)[1];ctx.strokeStyle=color;for(let j=1;j<5;j++){ctx.globalAlpha=.2/j;ctx.lineWidth=5-j;ctx.beginPath();ctx.moveTo(f.x-f.face*(30+j*10),f.y-70+j*7);ctx.lineTo(f.x-f.face*(90+j*17),f.y-60+j*10);ctx.stroke()}}
 if(airBanner){ctx.globalAlpha=Math.min(1,airBanner.life*3);ctx.fillStyle='#101b30da';ctx.fillRect(290,61,520,31);ctx.fillStyle=airBanner.color;ctx.textAlign='center';ctx.font='bold 17px monospace';ctx.fillText(airBanner.text,550,83)}ctx.restore()};
function clearAirCombos(){airStates=new WeakMap();airBursts=[];airBanner=null}
const resetBeforeAir=resetRound;resetRound=function(){resetBeforeAir();clearAirCombos()};
const titleBeforeAir=showTitleScreen;showTitleScreen=function(){titleBeforeAir();clearAirCombos()};
const guideBeforeAir=updateComboGuide;updateComboGuide=function(){guideBeforeAir();const e=$('#comboGuide');if(e)e.textContent+=' AIR: Down + Heavy launches → Jump chases → Light / Heavy / Special 2 chains → Special 3 meteor. One ground bounce; limited juggle hits, then automatic air recovery.'};updateComboGuide();
// Give the existing fighter sprites readable aerial silhouettes without moving hitboxes.
const renderBeforeAir=renderStreetFighter;
renderStreetFighter=function(g,f,scale){const kind=f.attack?.move?.airKind;if(g!==ctx||f.y>=ground||!kind||f.hp<=0)return renderBeforeAir(g,f,scale);g.save();g.translate(f.x,f.y-65);const progress=Math.min(1,(f.attack.frame||0)/Math.max(1,f.attack.move.startup+f.attack.move.active));g.rotate(f.face*(kind==='meteor'?.4:kind==='rise'?-.22:kind==='heavy'?-.16:.08)*Math.sin(progress*Math.PI));g.translate(-f.x,-f.y+65);renderBeforeAir(g,f,scale);g.restore()};
