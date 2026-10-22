'use strict';
const SUPER_MOVES={
 volt:{name:'BLACKOUT RUSH',pose:'uppercut',element:'electric',startup:10,active:19,recovery:42,damage:10,multi:6,range:135,dash:3},
 ember:{name:'AFTERBURN',pose:'spinKick',element:'fire',startup:18,active:2,recovery:48,damage:37,projectile:true,range:0},
 cipher:{name:'FINAL WORD',pose:'uppercut',element:'energy',startup:14,active:2,recovery:45,damage:35,projectile:true,range:0},
 brick:{name:'BLOCK BREAKER',pose:'spinKick',element:'quake',startup:20,active:7,recovery:48,damage:40,range:140,dash:2,knockdown:true},
 jade:{name:'CYCLONE CIRCLE',pose:'spinKick',element:'wind',startup:12,active:25,recovery:43,damage:9,multi:6,range:160,rotate:true,dash:1},
 rook:{name:'LAST CHECK',pose:'uppercut',element:'quake',startup:13,active:6,recovery:46,damage:36,range:120,knockdown:true,dash:3},
 haze:{name:'OVERTIME',pose:'uppercut',element:'speed',startup:9,active:25,recovery:44,damage:8,multi:5,range:125,dash:2},
 goldie:{name:'PLATINUM RECORD',pose:'spinKick',element:'gold',startup:15,active:25,recovery:45,damage:9,multi:6,range:160,rotate:true,dash:1}
};
let superCinema=null;
function meter(f){return Math.max(0,Math.min(100,Number.isFinite(f.superMeter)?f.superMeter:0))}
function addSuperMeter(f,amount){f.superMeter=Math.min(100,meter(f)+Math.max(0,amount))}
const moveBeforeSupers=getMove;getMove=function(f,type){if(type==='super'){const p=SUPER_MOVES[f.character];return p?{chip:2,hitstun:24,blockstun:10,height:'mid',cancelInto:[],launch:0,type:'super',isSuper:true,...p}:undefined}const m=moveBeforeSupers(f,type);if(m&&['punch','kick','lowKick'].includes(type))return {...m,cancelInto:[...(m.cancelInto||[]),'super']};return m};
const attackBeforeSupers=attack;attack=function(f,type){if(type!=='super')return attackBeforeSupers(f,type);
 if(mode!=='playing'||superCinema||meter(f)<100||f.y!==ground||f.crouch||f.block||f.invulnerable>0||f.hp<=0||f.stun>0||f.blockstun>0)return false;
 if(f.attack&&(!['punch','kick','lowKick'].includes(f.attack.type)||!f.attack.connected||f.attack.blocked))return false;
 if(!attackBeforeSupers(f,type))return false;
 f.superMeter=0;f.tauntTime=0;superCinema={fighter:f,time:.42,age:0};clearInput();
 superSound(f.character);updateSuperHud();return true;
};
function superSound(id){if(!sound)return;try{audio??=new AudioContext();const ac=audio;if(ac.state==='suspended')ac.resume().catch(()=>{});const root={volt:110,ember:82,cipher:220,brick:55,jade:164,rook:73,haze:330,goldie:146}[id],now=ac.currentTime;for(let i=0;i<3;i++){const o=ac.createOscillator(),g=ac.createGain();o.type=['brick','rook'].includes(id)?'triangle':'sine';o.frequency.setValueAtTime(root*(i+1),now);o.frequency.exponentialRampToValueAtTime(root*(i+1)*2,now+.35);o.connect(g);g.connect(typeof effectsOutput==='function'?effectsOutput(ac):ac.destination);g.gain.setValueAtTime(.05/(i+1),now);g.gain.exponentialRampToValueAtTime(.001,now+.45);o.start(now);o.stop(now+.46)}}catch{}}
const hitBeforeSupers=applyCombatHit;applyCombatHit=function(a,t,m,d){const hp=t.hp,ok=hitBeforeSupers(a,t,m,d);if(ok&&t.hp<hp&&!m.isSuper){const blocked=t.blockstun>0;if(blocked){if(typeof resolveGuardReward!=='function')addSuperMeter(t,7);}else addSuperMeter(a,Math.min(15,(hp-t.hp)*1.1));updateSuperHud()}return ok};
function updateSuperHud(){for(const [side,f] of [['Player',player],['Enemy',enemy]]){const n=meter(f),bar=$('#super'+side+'Meter');bar.style.width=n+'%';$('#super'+side).setAttribute('aria-valuenow',String(Math.floor(n)));$('#super'+side+'Label').textContent=n>=100?'SUPER READY':`SUPER ${Math.floor(n)}%`}
 const ready=meter(player)>=100;$('#superButton').disabled=!ready||mode!=='playing'||!!superCinema;$('#superButton').textContent=ready?'SUPER / R':`SUPER ${Math.floor(meter(player))}%`;$('#superButton').classList.toggle('super-ready',ready);$('#superButton').setAttribute('aria-label',SUPER_MOVES[player.character].name+(ready?', ready':', meter '+Math.floor(meter(player))+' percent'));$('#superGuide').textContent=`${SUPER_MOVES[player.character].name} · Land hits or block to charge. Tap block just before impact for a Perfect Block: no chip, +15 meter and faster recovery. At 100%, tap SUPER or press R. Blockable; long recovery. Ground use only.`;
}
$('#superButton').onclick=()=>attack(player,'super');window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='r'&&!e.repeat&&!(e.target&&['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))){if(mode==='playing'){e.preventDefault();attack(player,'super')}}});
$('#fillSuper').onclick=()=>{if(gameMode==='training'){player.superMeter=100;updateSuperHud()}};
const resetBeforeSupers=resetRound;resetRound=function(){const old=[meter(player),meter(enemy)];superCinema=null;resetBeforeSupers();player.superMeter=gameMode==='training'?100:round>1?old[0]:0;enemy.superMeter=round>1?old[1]:0;updateSuperHud()};
const clearBeforeSuperTitle=showTitleScreen;showTitleScreen=function(){superCinema=null;clearBeforeSuperTitle()};
const selectBeforeSupers=openCharacterSelection;openCharacterSelection=function(){superCinema=null;selectBeforeSupers()};
const cpuBeforeSupers=updateCpuFighter;updateCpuFighter=function(f,target,dt){const p=SUPER_MOVES[f.character];if(mode==='playing'&&!(gameMode==='training'&&$('#dummyBehavior').value!=='cpu')&&meter(f)>=100&&!superCinema&&p){const dist=Math.abs(f.x-target.x),near=p.projectile?dist>160&&dist<600:dist<p.range-15;if(near&&aiWait<=0&&(effectiveDifficulty()!=='easy'||target.attack)&&attack(f,'super'))return}cpuBeforeSupers(f,target,dt)};
const updateBeforeSupers=update;update=function(dt){if(superCinema){if(mode==='playing'&&!document.hidden){superCinema.time-=dt;superCinema.age+=dt;clearInput();if(superCinema.time<=0)superCinema=null}updateSuperHud();return}updateBeforeSupers(dt);updateSuperHud()};
const renderBeforeSupers=renderStreetFighter;renderStreetFighter=function(g,f,scale=2.1){if(f.attack?.type==='super'){const pose=SUPER_MOVES[f.character].pose;renderBeforeSupers(g,{...f,attack:{...f.attack,type:pose}},scale);return}renderBeforeSupers(g,f,scale)};
const drawBeforeSupers=draw;draw=function(){drawBeforeSupers();if(superCinema&&['playing','paused'].includes(mode)){const f=superCinema.fighter,p=SUPER_MOVES[f.character];ctx.save();ctx.fillStyle='#071419bb';ctx.fillRect(0,0,1100,520);ctx.fillStyle=f.color;ctx.globalAlpha=.15;ctx.fillRect(0,135,1100,240);ctx.globalAlpha=1;ctx.textAlign='center';ctx.fillStyle='#fff1c4';ctx.font='bold 18px monospace';ctx.fillText(fighterName(f)+' / SUPER',550,192);ctx.font='italic 900 54px Impact,sans-serif';ctx.fillStyle=f.color;ctx.fillText(p.name,550,267);ctx.restore()}
 if(!['playing','roundover','finished'].includes(mode))return;for(const f of [player,enemy]){if(f.attack?.type!=='super')continue;const a=f.attack,m=a.move;if(a.frame<m.startup||a.frame>=m.startup+m.active)continue;ctx.save();ctx.strokeStyle=f.color;ctx.lineWidth=strongEffects?5:2;ctx.globalAlpha=strongEffects?.8:.4;const t=(a.frame-m.startup)/m.active;ctx.beginPath();if(m.projectile)ctx.ellipse(f.x+f.face*45,f.y-70,30,50,0,0,Math.PI*2);else ctx.ellipse(f.x,f.y-65,50+t*75,60,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
};
for(const f of [player,enemy])f.superMeter=0;updateSuperHud();
