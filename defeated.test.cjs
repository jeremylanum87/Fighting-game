'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
function defeatSetup(){showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';skipFinishers=false;}
defeatSetup();enemy.hp=0;endRound();
if(!defeatedFighters.has(enemy)||defeatedFighters.has(player))throw Error('Wrong round loser');
const stats=JSON.stringify({hp:enemy.hp,x:enemy.x,y:enemy.y,wins,remaining});
update(.4);if(detailedArtPose(enemy).kind!=='defeated')throw Error('Defeated sprite missing');draw();
if(JSON.stringify({hp:enemy.hp,x:enemy.x,y:enemy.y,wins,remaining})!==stats)throw Error('Fall changed combat state');
update(.4);const d=defeatedFighters.get(enemy);if(d.age!==d.life)throw Error('Fall did not settle');
update(1);if(!defeatedFighters.has(enemy))throw Error('Defeated pose did not persist');
resetRound();if(defeatedFighters.has(player)||defeatedFighters.has(enemy))throw Error('Defeat leaked into new round');
dismissFightOpening();mode='playing';player.hp=40;enemy.hp=80;remaining=0;endRound();
if(!defeatedFighters.has(player)||player.hp!==40)throw Error('Timeout loser did not fall cosmetically');
defeatSetup();enemy.hp=1;enemy.invulnerable=0;enemy.block=false;applyCombatHit(player,enemy,MOVES.punch,1);endRound();
const held=defeatedFighters.get(enemy);update(.5);if(held.age!==0||!roundImpact)throw Error('Fall ran before slow impact');
finishRoundImpact();update(.3);if(held.age<=0)throw Error('Fall did not start after slow hit');
document.hidden=true;const before=held.age;update(.3);if(held.age!==before)throw Error('Hidden fall advanced');document.hidden=false;
defeatSetup();wins=[1,0];enemy.hp=0;endRound();if(!cinematicFinisher||!defeatedFighters.has(enemy))throw Error('Final defeat state missing');
update(1);draw();if(detailedArtPose(enemy).kind!=='defeated')throw Error('Finisher loser standing');
showTitleScreen();if(defeatedFighters.has(enemy))throw Error('Title defeat leak');
console.log('PASS player/CPU round losses, persistent defeated poses, timeout losses, slow-hit ordering, hidden pause, finisher integration and reset/navigation');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js','defeated.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
