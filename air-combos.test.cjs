'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
function setupAir(){resetRound();mode='playing';player.x=400;enemy.x=490;player.face=1;enemy.face=-1;enemy.block=false;enemy.hp=500;enemy.maxHp=500;player.cooldown=0;}
setupAir();if(!attack(player,'lowKick')||player.attack.move.airKind!=='launcher')throw Error('Launcher input missing');
let move=player.attack.move;applyCombatHit(player,enemy,move,1);if(enemy.vy!==-680||airState(enemy).owner!==player)throw Error('Launch failed');
player.attack.connected=true;keys.add('w');previousKeys.clear();captureCombatInput();keys.clear();if(player.vy!==-680||player.y>=ground)throw Error('Chase failed');
if(!attack(player,'punch')||player.attack.move.airKind!=='light')throw Error('Air light missing');
applyCombatHit(player,enemy,player.attack.move,1);player.attack.connected=true;
if(!attack(player,'jumpKick')||player.attack.move.airKind!=='heavy')throw Error('Air cancel failed');
applyCombatHit(player,enemy,player.attack.move,1);player.attack.connected=true;
if(!attack(player,'spinKick')||player.attack.move.airKind!=='meteor')throw Error('Meteor missing');
applyCombatHit(player,enemy,player.attack.move,1);enemy.y=ground-1;enemy.vy=820;stepFighter(enemy,player,1/60);
if(airState(enemy).bounces!==1||enemy.vy!==-460)throw Error('Ground bounce failed');
let n=0;while(!airState(enemy).escape&&n++<10){enemy.invulnerable=0;applyCombatHit(player,enemy,airMove(player,'light'),1)}
if(!airState(enemy).escape||enemy.stun!==0)throw Error('Infinite juggle protection failed');
const hp=enemy.hp;applyCombatHit(player,enemy,MOVES.punch,1);if(enemy.hp!==hp)throw Error('Air recovery vulnerable');
setupAir();enemy.block=true;applyCombatHit(player,enemy,airMove(player,'launcher'),1);if(airState(enemy).owner)throw Error('Blocked launcher lifted target');
setupAir();enemy.hp=1;applyCombatHit(player,enemy,airMove(player,'launcher'),1);if(airState(enemy).owner)throw Error('KO juggle continued');
setupAir();enemy.y=ground-30;airState(enemy).owner=player;enemy.vy=500;stepFighter(enemy,player,.1);if(airState(enemy).owner)throw Error('Landing retained juggle');
airBurst(enemy,'hit','#fff');mode='paused';const age=airBursts[0].age;update(.1);if(airBursts[0].age!==age)throw Error('Paused effects advanced');
resetRound();if(airBursts.length||airBanner||airState(enemy).owner)throw Error('Reset leaked air state');
for(const id of Object.keys(AIR_STYLES)){player.character=id;player.y=ground-70;player.attack=null;player.cooldown=0;player.stun=0;player.blockstun=0;player.knockedDown=false;if(!attack(player,'uppercut')||player.attack.move.airKind!=='rise')throw Error('Air rise missing '+id)}
draw();console.log('PASS launch, chase, aerial cancels, meteor bounce, juggle escape, block/KO/landing/reset/pause rules and all eight aerial styles');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js','defeated.js','air-combos.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
