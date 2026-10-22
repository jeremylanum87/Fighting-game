'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
function setupDefenseTest(){
 resetRound();mode='playing';superCinema=null;hitstop=0;keys.clear();previousKeys=new Set();inputQueue=[];
 Object.assign(player,{x:450,y:ground,face:1,hp:100,attack:null,stun:0,blockstun:0,invulnerable:0,superMeter:0,vx:0});
 Object.assign(enemy,{x:550,y:ground,face:-1,hp:100,attack:null,stun:0,blockstun:0,invulnerable:0,vx:0});
}
setupDefenseTest();
keys.add('l');keys.add('a');captureCombatInput();
if(defenseFor(player).dash<=0||inputQueue.length)throw Error('Backdash chord');
const beforeDashX=player.x;stepFighter(player,enemy,STEP);
if(player.x>=beforeDashX||player.invulnerable<=0||attack(player,'punch'))throw Error('Backdash movement/protection/lock');
for(let i=0;i<15;i++)stepFighter(player,enemy,STEP);
if(player.invulnerable>0||defenseFor(player).lock>0||startBackdash(player))throw Error('Backdash recovery/cooldown');
for(let i=0;i<35;i++)stepFighter(player,enemy,STEP);
if(!startBackdash(player))throw Error('Backdash cooldown never recovered');
setupDefenseTest();player.blockstun=12;player.superMeter=49;
if(guardBreakaway(player,enemy)||meter(player)!==49)throw Error('Breakaway free meter');
player.superMeter=70;enemy.attack={type:'punch',move:getMove(enemy,'punch'),frame:2};
projectiles=[{owner:enemy,x:500},{owner:enemy,x:900},{owner:player,x:480}];
keys.add('l');keys.add('k');captureCombatInput();
if(meter(player)!==20||player.blockstun||enemy.attack||enemy.x!==615||projectiles.length!==2||inputQueue.length)throw Error('Breakaway effects/cost/chord');
if(guardBreakaway(player,enemy)||attack(player,'punch'))throw Error('Breakaway repeat/recovery');
setupDefenseTest();player.superMeter=100;
if(guardBreakaway(player,enemy)||meter(player)!==100)throw Error('Breakaway outside blockstun');
setupDefenseTest();keys.add('g');captureCombatInput();
const hp=player.hp,throwMove=getMove(enemy,'throw');
enemy.attack={type:'throw',move:throwMove,frame:throwMove.startup};
if(applyCombatHit(enemy,player,throwMove,-1)||player.hp!==hp||enemy.attack||!defenseFor(player).lock)throw Error('Throw escape');
if(meter(player)!==0)throw Error('Throw escape rewarded damage meter');
setupDefenseTest();keys.add('g');captureCombatInput();
for(let i=0;i<12;i++)stepFighter(player,enemy,STEP);
if(!applyCombatHit(enemy,player,getMove(enemy,'throw'),-1)||player.hp>=100)throw Error('Late tech escaped');
setupDefenseTest();player.stun=.3;defenseFor(player).tech=.15;
applyCombatHit(enemy,player,{...MOVES.punch,grab:true},-1);
if(player.hp>=100)throw Error('Command grab incorrectly escaped');
setupDefenseTest();startBackdash(player);const frozen=JSON.stringify(defenseFor(player));mode='paused';update(STEP);if(JSON.stringify(defenseFor(player))!==frozen)throw Error('Paused defense advanced');
resetRound();if(defenseState.has(player)||defenseState.has(enemy))throw Error('Defense reset leaked');
setupDefenseTest();player.block=true;observeGuardTiming(player,STEP);applyCombatHit(enemy,player,MOVES.punch,-1);
if(player.hp!==100||meter(player)!==15)throw Error('Defense broke Perfect Block');
console.log('PASS defense chords, dash protection/recovery/cooldown, paid breakaway/projectiles, throw tech timing, command grabs, pause/reset and Perfect Block integration');
}
`;
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+
"\nvm.runInContext(fs.readFileSync(__dirname+'/perfect-block.js','utf8'),env);"+
"\nvm.runInContext(fs.readFileSync(__dirname+'/defense.js','utf8'),env);"+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
