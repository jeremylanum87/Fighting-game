'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';
player.attack=null;player.stun=0;player.blockstun=0;player.block=false;player.vy=-580;const before=JSON.stringify({hp:player.hp,x:player.x,y:player.y,vy:player.vy});stepFighter(player,enemy,1/60);if(movementPose(player)?.kind!=='rise')throw Error('Rise pose missing');
player.vy=0;if(movementPose(player)?.kind!=='apex')throw Error('Apex pose missing');player.vy=300;if(movementPose(player)?.kind!=='fall')throw Error('Fall pose missing');
player.y=ground-1;player.vy=300;stepFighter(player,enemy,1/60);if(movementPose(player)?.kind!=='land')throw Error('Landing pose missing');
player.block=true;player.crouch=false;if(movementPose(player)?.kind!=='guard')throw Error('Guard pose missing');player.crouch=true;if(movementPose(player)?.kind!=='low-guard')throw Error('Low guard pose missing');player.crouch=false;player.invulnerable=0;enemy.x=player.x+100;enemy.face=-1;applyCombatHit(enemy,player,MOVES.punch,-1);if(movementVisual(player).recoil!==1)throw Error('Guard recoil missing');
const stats=JSON.stringify({hp:player.hp,x:player.x,y:player.y,vy:player.vy,stun:player.stun,blockstun:player.blockstun,meter:meter(player)});for(let i=0;i<10;i++){draw();renderStreetFighter(ctx,player)}if(stats!==JSON.stringify({hp:player.hp,x:player.x,y:player.y,vy:player.vy,stun:player.stun,blockstun:player.blockstun,meter:meter(player)}))throw Error('Rendering mutated gameplay');
mode='paused';const clock=movementVisual(player).clock;update(.1);if(movementVisual(player).clock!==clock)throw Error('Pause advanced animation');
mode='playing';player.block=false;player.blockstun=0;player.attack={type:'punch',frame:1,move:MOVES.punch};if(movementPose(player))throw Error('Attack overridden');player.attack=null;player.hp=0;if(movementPose(player))throw Error('Defeat overridden');
resetRound();if(movementVisual(player).recoil||movementVisual(player).land)throw Error('Reset state leak');
console.log('PASS rise/apex/fall/landing, high/low guard, impact recoil, render purity, pause, attack/defeat priority and reset');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js','defeated.js','air-combos.js','showcase.js','movement-polish.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
