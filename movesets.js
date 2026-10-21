'use strict';
// Character-specific moves override the common frame-data templates.
const CHARACTER_MOVES={
 volt:{style:'Electric Boxer',signature:'Lightning Uppercut',light:{startup:3,recovery:7,range:96,damage:6},heavy:{range:106,startup:6,damage:11},slots:{
 fireball:{name:'Spark Counter',counter:true,active:12,startup:2,recovery:22,counterDamage:13,cooldown:3},
 uppercut:{name:'Lightning Uppercut',damage:19,element:'electric',launch:-620,cooldown:5},
 spinKick:{name:'Electric Rush',dash:9,damage:5,multi:5,active:15,range:95,element:'electric',cooldown:4}}},
 ember:{style:'Counter Fighter',signature:'Explosive Fire Counter',light:{range:86,damage:8},heavy:{range:96,damage:15,startup:9},slots:{
 fireball:{name:'Fire Counter',counter:true,startup:2,active:16,recovery:27,counterDamage:22,element:'fire',cooldown:5},
 uppercut:{name:'Punishing Elbow',launch:0,range:92,dash:5,damage:15,startup:5,active:6,cooldown:3},
 spinKick:{name:'Flame Burst',projectile:true,damage:13,startup:14,active:2,recovery:24,element:'fire',cooldown:4}}},
 cipher:{style:'Technical Striker',signature:'Energy Palm Strike',light:{startup:3,damage:6,hitstun:18},heavy:{startup:6,damage:11,hitstun:25},slots:{
 fireball:{name:'Feint Step',dodge:true,dash:-6,damage:0,active:10,startup:1,recovery:10,cooldown:3},
 uppercut:{name:'Energy Palm',projectile:true,launch:0,startup:9,active:2,recovery:24,damage:17,element:'energy',cooldown:4},
 spinKick:{name:'Precision Chain',damage:5,multi:6,active:18,range:112,hitstun:19,dash:2,cooldown:4}}},
 brick:{style:'Power Wrestler',signature:'Ground-shaking Power Slam',light:{startup:6,damage:9,range:90},heavy:{startup:11,damage:17,range:105},slots:{
 fireball:{name:'Clinch Throw',grab:true,range:76,startup:6,active:4,recovery:26,damage:18,launch:-350,knockdown:true,cooldown:3},
 uppercut:{name:'Power Slam',grab:true,range:80,startup:10,active:4,recovery:36,damage:27,launch:-500,knockdown:true,element:'quake',cooldown:6},
 spinKick:{name:'Heavy Lariat',armor:true,range:118,damage:18,dash:3,active:9,cooldown:4}}},
 jade:{style:'Capoeira Fighter',signature:'Whirlwind Finisher',light:{range:110,startup:4,damage:6},heavy:{range:140,startup:7,damage:11},slots:{
 fireball:{name:'Ginga Dodge',dodge:true,dash:-7,damage:0,startup:1,active:12,recovery:8,cooldown:3},
 uppercut:{name:'Handstand Kick',range:122,damage:14,launch:-480,cooldown:3},
 spinKick:{name:'Whirlwind',range:142,damage:6,multi:6,active:24,dash:3,rotate:true,element:'wind',cooldown:6}}},
 rook:{style:'Judo Specialist',signature:'Crushing Takedown',light:{damage:8,range:82},heavy:{height:'low',damage:13,range:112},slots:{
 fireball:{name:'Redirect Throw',counter:true,startup:2,active:13,recovery:25,counterDamage:20,counterThrow:true,element:'quake',cooldown:4},
 uppercut:{name:'Crushing Takedown',grab:true,startup:8,active:5,recovery:30,range:84,damage:24,launch:-250,knockdown:true,element:'quake',cooldown:5},
 spinKick:{name:'Reaping Trip',height:'low',range:125,startup:6,active:6,damage:12,launch:0,knockdown:true,cooldown:3}}},
 haze:{style:'Speed Striker',signature:'Lightning-fast Barrage',light:{startup:2,recovery:6,damage:5,range:95},heavy:{startup:5,damage:9,range:115},slots:{
 fireball:{name:'Dash Strike',dash:13,range:94,startup:4,active:7,recovery:18,damage:11,cooldown:3},
 uppercut:{name:'Speed Barrage',launch:0,startup:4,active:25,recovery:26,multi:5,damage:4,range:115,dash:1.5,element:'speed',cooldown:6},
 spinKick:{name:'Quick Step',dodge:true,dash:9,startup:1,active:10,recovery:12,damage:0,cooldown:3}}},
 goldie:{style:'Breakdance Brawler',signature:'Golden Windmill',light:{startup:4,damage:7,hitstun:18},heavy:{height:'low',range:135,damage:12},slots:{
 fireball:{name:'Floor Sweep',height:'low',range:138,startup:7,active:6,recovery:19,damage:12,knockdown:true,cooldown:3},
 uppercut:{name:'Rhythm Combo',launch:0,startup:5,active:18,multi:6,damage:5,range:115,dash:2,cooldown:4},
 spinKick:{name:'Golden Windmill',height:'low',range:148,damage:6,multi:6,active:24,rotate:true,dash:2,element:'gold',cooldown:6}}}
};
function getMove(f,type){const profile=CHARACTER_MOVES[f.character];if(!profile)return MOVES[type];const override=type==='punch'?profile.light:type==='kick'?profile.heavy:profile.slots[type];return {...MOVES[type],...(override||{}),type,projectile:false,...(override||{})}}
function configureMoveset(f){f.moveCooldowns={};f.throwVelocity=0;f.knockedDown=false;}
function moveLabel(type){return CHARACTER_MOVES[player.character]?.slots[type]?.name||type}
function updateMovesetButtons(){for(const [key,type] of [['u','fireball'],['i','uppercut'],['o','spinKick']]){const button=document.querySelector(`[data-key="${key}"]`);if(!button)continue;const left=player.moveCooldowns?.[type]||0;button.textContent=moveLabel(type)+(left>0?` ${left.toFixed(1)}s`:'');button.setAttribute('aria-label',moveLabel(type)+(left>0?`, ready in ${left.toFixed(1)} seconds`:''))}const guide=document.querySelector('#fighterMoveGuide');if(guide){const p=CHARACTER_MOVES[player.character];guide.textContent=p?`${p.style} · U: ${p.slots.fireball.name} · I: ${p.slots.uppercut.name} · O: ${p.slots.spinKick.name}`:''}}
const drawBeforeMovesets=draw;
draw=function(){drawBeforeMovesets();for(const f of [player,enemy]){if(!f.attack)continue;const m=f.attack.move||getMove(f,f.attack.type);if(f.attack.frame<m.startup||f.attack.frame>=m.startup+m.active)continue;ctx.save();ctx.translate(f.x,f.y-65);ctx.strokeStyle=m.element==='fire'?'#ff753d':m.element==='electric'?'#b2edff':f.color;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=16;ctx.lineWidth=4;if(m.counter){ctx.beginPath();ctx.arc(0,0,56,-1.5,1.5);ctx.stroke()}else if(m.rotate){ctx.beginPath();ctx.ellipse(0,30,84,29,f.animTime*10,0,Math.PI*2);ctx.stroke()}else if(m.element==='electric'){ctx.beginPath();ctx.moveTo(0,-35);ctx.lineTo(15,-65);ctx.lineTo(0,-65);ctx.lineTo(20,-100);ctx.stroke()}else if(m.grab||m.knockdown){ctx.beginPath();ctx.ellipse(0,64,90,14,0,0,Math.PI*2);ctx.stroke()}else if(m.multi){for(let i=0;i<3;i++){ctx.globalAlpha=.7-i*.2;ctx.beginPath();ctx.moveTo(f.face*(25+i*15),-25+i*20);ctx.lineTo(f.face*(80+i*15),-25+i*20);ctx.stroke()}}ctx.restore()}updateMovesetButtons()};
const drawBodyBeforeMovesets=drawFighter;drawFighter=function(f){const m=f.attack?.move;if(m?.rotate&&f.attack.frame>=m.startup&&f.attack.frame<m.startup+m.active){ctx.save();ctx.translate(f.x,f.y-55);ctx.rotate(f.face*(f.attack.frame-m.startup)*.32);ctx.translate(-f.x,-(f.y-55));drawBodyBeforeMovesets(f);ctx.restore()}else drawBodyBeforeMovesets(f)};
