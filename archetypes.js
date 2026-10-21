'use strict';
// Original fighting-game archetypes: readable strengths and real tradeoffs.
const FIGHTER_ARCHETYPES={
 volt:{role:'INFIGHTER',health:100,walk:1.08,power:1,jump:555,air:.55,ideal:84,width:1.02,height:1.01,strength:'Fast hands, pressure and anti-air',weakness:'Short reach; must get close',low:{startup:4,range:90,damage:7},airMove:{range:95,damage:8}},
 ember:{role:'COUNTER',health:105,walk:.96,power:1,jump:540,air:.45,ideal:100,width:1.1,height:1.04,strength:'Hard punishes and fire counters',weakness:'Risky recovery when counters miss',low:{startup:7,range:105,damage:10},airMove:{startup:7,range:105,damage:12}},
 cipher:{role:'TECHNICIAN / ZONER',health:90,walk:.94,power:.98,jump:565,air:.5,ideal:210,width:.9,height:1.14,strength:'Long normals and energy-palm zoning',weakness:'Lower health; vulnerable up close',low:{range:143,startup:8,damage:8},airMove:{range:140,damage:10}},
 brick:{role:'HEAVY GRAPPLER',health:125,walk:.72,power:1.08,jump:440,air:.25,ideal:65,width:1.5,height:1.17,strength:'Highest health, huge throws and armor',weakness:'Slow travel, low jump and large body',low:{range:100,startup:10,damage:12},airMove:{startup:10,range:105,damage:15}},
 jade:{role:'AERIAL / EVASION',health:95,walk:1.12,power:.94,jump:670,air:.85,ideal:118,width:.94,height:1.02,strength:'High jumps, long kicks and evasive ginga',weakness:'Lighter damage and longer airtime',low:{range:138,startup:5,damage:8},airMove:{startup:4,range:152,damage:13}},
 rook:{role:'DEFENSIVE GRAPPLER',health:115,walk:.84,power:1.02,jump:475,air:.35,ideal:82,width:1.23,height:1.09,strength:'Durability, redirects and close takedowns',weakness:'Slow approach; limited ranged answers',low:{range:120,startup:7,damage:11,knockdown:true},airMove:{startup:8,range:98,damage:10}},
 haze:{role:'RUSHDOWN',health:80,walk:1.3,power:.9,jump:610,air:.75,ideal:88,width:.79,height:.93,strength:'Fastest movement and rapid combo pressure',weakness:'Lowest health and low single-hit damage',low:{range:96,startup:3,damage:6},airMove:{startup:3,range:112,damage:9}},
 goldie:{role:'LOW MIX-UP',health:100,walk:1.02,power:1,jump:590,air:.65,ideal:112,width:1.12,height:1.02,strength:'Low sweeps, overheads and rhythmic chains',weakness:'Readable windups; sweeps lose to jumping',low:{range:145,startup:6,damage:10},airMove:{startup:6,range:130,damage:13,height:'overhead'}}
};
Object.assign(CHARACTER_MOVES.volt.heavy,{name:'Body Hook',height:'mid',startup:5,recovery:13,range:105});
Object.assign(CHARACTER_MOVES.ember.light,{name:'Elbow Check',range:90,startup:5});Object.assign(CHARACTER_MOVES.ember.heavy,{name:'Punish Knee',range:108,recovery:22});
Object.assign(CHARACTER_MOVES.cipher.light,{name:'Long Palm',range:137,startup:6,recovery:12});Object.assign(CHARACTER_MOVES.cipher.heavy,{name:'Side Kick',range:165,startup:10,recovery:21});
Object.assign(CHARACTER_MOVES.brick.light,{name:'Club Strike',range:110,startup:7,recovery:16});Object.assign(CHARACTER_MOVES.brick.heavy,{name:'Hammer Fist',range:122,startup:13,recovery:25,damage:18});
Object.assign(CHARACTER_MOVES.jade.light,{name:'Snap Kick',range:124,startup:5});Object.assign(CHARACTER_MOVES.jade.heavy,{name:'Crescent Kick',range:153,startup:8,recovery:19});
Object.assign(CHARACTER_MOVES.rook.light,{name:'Palm Check',range:102,startup:5,recovery:12});Object.assign(CHARACTER_MOVES.rook.heavy,{name:'Ankle Reap',range:123,startup:8,knockdown:true});
Object.assign(CHARACTER_MOVES.haze.light,{name:'Quick Jab',range:91,startup:2,recovery:5,damage:4});Object.assign(CHARACTER_MOVES.haze.heavy,{name:'Dash Straight',range:118,startup:5,recovery:12,damage:9});
Object.assign(CHARACTER_MOVES.goldie.light,{name:'Rhythm Backhand',range:110,startup:4,recovery:10});Object.assign(CHARACTER_MOVES.goldie.heavy,{name:'Floor Sweep',range:145,startup:9,recovery:21,height:'low'});
const moveBeforeArchetype=getMove;getMove=function(f,type){const m=moveBeforeArchetype(f,type),p=FIGHTER_ARCHETYPES[f.character];if(!m||!p)return m;return type==='lowKick'?{...m,...p.low}:type==='jumpKick'?{...m,...p.airMove}:m};
function applyArchetype(f){const a=FIGHTER_ARCHETYPES[f.character];if(!a)return;f.maxHp=a.health;f.hp=a.health;f.moveSpeed=a.walk;f.power=a.power;f.jumpStrength=a.jump;f.airControl=a.air;f.preferredRange=a.ideal;}
function normalAttackPose(id,state,t,p){const attack=state==='attack1'||state==='attack2';if(state==='run'){
 if(id==='brick'){p.head[0]=1;p.leftFoot[0]*=.65;p.rightFoot[0]*=.65;p.leftHand=[-24,-38];p.rightHand=[28,-39];p.offset=Math.abs(Math.sin(t*6.28))*3}
 if(id==='volt'){p.leftHand=[-5,-58];p.rightHand=[20,-61];p.leftFoot[0]*=.65;p.rightFoot[0]*=.65}
 if(id==='cipher'){p.rightHand=[30,-50];p.leftHand=[-6,-51];p.leftFoot[0]*=.6;p.rightFoot[0]*=.6}
 if(id==='rook'){p.leftHand=[-14,-43];p.rightHand=[27,-43];p.leftFoot[0]*=.55;p.rightFoot[0]*=.55}
 if(id==='jade'){p.shoulder[0]=Math.sin(t*6.28)*6;p.leftHand=[-23,-43];p.rightHand=[27,-43]}
 if(id==='haze'){p.head[0]=13;p.shoulder[0]=10;p.leftHand=[-25,-33];p.rightHand=[-12,-37]}
 if(id==='goldie'){p.shoulder[0]=-4;p.head[0]=-6;p.leftHand=[-26,-48];p.rightHand=[24,-43]}}
 if(!attack)return p;const heavy=state==='attack2',s=Math.sin(Math.PI*t);
 if(id==='volt'){p.rightKnee=[12,-16];p.rightFoot=[18,-1];p.rightHand=heavy?[30,-35]:[47,-52];p.rightElbow=heavy?[35,-47]:[27,-51];p.leftHand=[-3,-59];p.shoulder[0]=heavy?7:4}
 if(id==='ember'){if(heavy){p.rightKnee=[28,-33];p.rightFoot=[18,-20];p.leftHand=[-1,-61];p.rightHand=[25,-59]}else{p.rightElbow=[37,-47];p.rightHand=[15,-62];p.head[0]=6}}
 if(id==='cipher'){p.rightHand=heavy?[16,-53]:[53,-48];if(heavy){p.rightKnee=[30,-30];p.rightFoot=[59,-34]}else p.rightElbow=[30,-46];p.leftHand=[-4,-53]}
 if(id==='brick'){p.leftHand=[-18,-35];p.rightKnee=[13,-15];p.rightFoot=[20,-1];p.rightHand=heavy?[42,-29]:[45,-48];p.rightElbow=heavy?[30,-60]:[25,-45];p.head[0]=7;p.shoulder[0]=7}
 if(id==='jade'){p.leftHand=[-22,-50];p.rightHand=[16,-59];p.rightKnee=[30,-34];p.rightFoot=heavy?[55,-53]:[45,-32];p.head[0]=-6;p.hip[0]=-4}
 if(id==='rook'){p.leftHand=[-12,-44];if(heavy){p.rightKnee=[25,-12];p.rightFoot=[48,-3];p.head[0]=-8}else{p.rightHand=[43,-43];p.rightElbow=[25,-40]}}
 if(id==='haze'){p.rightKnee=[10,-15];p.rightFoot=[18,-1];p.head[0]=9;p.shoulder[0]=8;p.rightHand=heavy?[51,-49]:[44,-53];p.leftHand=[-5,-56];p.leftFoot=[-25,-1]}
 if(id==='goldie'){if(heavy){p.offset=22;p.rightKnee=[26,-10];p.rightFoot=[51,-3];p.leftHand=[-22,-29];p.head[0]=-10}else{p.rightHand=[43,-52];p.rightElbow=[23,-57];p.leftHand=[-23,-48];p.angle=-.1}}
 // Windup and recovery return smoothly to guard instead of snapping at the edges.
 if(t<.2||t>.8){const blend=t<.2?t/.2:(1-t)/.2;p.rightHand=[mix(22,p.rightHand[0],blend),mix(-53,p.rightHand[1],blend)]}
 return p;
}

for(const [id,a] of Object.entries(FIGHTER_ARCHETYPES)){Object.assign(BODY_STYLES[id],{width:a.width,height:a.height})}

for(const [id,a] of Object.entries(FIGHTER_ARCHETYPES)){fighterRoster[id].speed=a.walk;fighterRoster[id].power=a.power}
Object.assign(CHARACTER_MOVES.volt.heavy,{box:{x:20,y:-99,w:62,h:44}});
Object.assign(CHARACTER_MOVES.jade.heavy,{box:{x:20,y:-144,w:110,h:72}});
Object.assign(CHARACTER_MOVES.jade.light,{box:{x:20,y:-119,w:80,h:66}});
Object.assign(CHARACTER_MOVES.haze.heavy,{box:{x:22,y:-120,w:74,h:43}});
applyCharacterChoice();poseCache.clear();

for(const card of document.querySelectorAll('[data-character]')){const p=FIGHTER_ARCHETYPES[card.dataset.character];if(p){card.querySelector('.fighter-traits').textContent=`${p.role} / HP ${p.health}`;card.querySelector('.fighter-tagline').textContent=p.strength}}
const buttonsBeforeArchetype=updateMovesetButtons;updateMovesetButtons=function(){buttonsBeforeArchetype();for(const [key,type] of [['j','punch'],['k','kick']]){const button=document.querySelector(`[data-key="${key}"]`),m=getMove(player,type);if(button&&m?.name){button.textContent=m.name;button.setAttribute('aria-label',m.name)}}};
