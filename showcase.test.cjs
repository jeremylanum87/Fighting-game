'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
showTitleScreen();startMode('showcase');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';
if(gameMode!=='showcase'||difficulty!=='hard')throw Error('Showcase setup');
if(attack(player,'punch'))throw Error('Spectator could control fighter');
const rewardSnapshot=JSON.stringify({personalRecords,respectSave,masterySave,dailySave});dailyProgress('guard');earnRespect('counter',8);if(rewardSnapshot!==JSON.stringify({personalRecords,respectSave,masterySave,dailySave}))throw Error('Spectator rewards');
player.x=400;enemy.x=800;showcaseBrains=new WeakMap();expertShowcase(player,enemy,1/60);expertShowcase(enemy,player,1/60);if(showcaseBrain(player)===showcaseBrain(enemy))throw Error('Shared AI state');if(player.vx<=0||enemy.vx>=0)throw Error('Both CPUs must approach');
keys.add('j');captureCombatInput();keys.clear();if(inputQueue.length)throw Error('Human input buffered');
player.superMeter=0;if(showcaseAttack(player,'super'))throw Error('Free Super');
mode='paused';const clock=showcaseBrain(player).clock;update(.2);if(showcaseBrain(player).clock!==clock)throw Error('Paused CPU advanced');
showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';player.stun=0;player.blockstun=0;player.attack=null;player.cooldown=0;if(gameMode!=='quick'||!attack(player,'punch'))throw Error('Showcase leaked into player mode');
console.log('PASS expert showcase selection, spectator input lock, legal meter, independent brains, approach, pause, no rewards and normal-mode restoration');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js','defeated.js','air-combos.js','showcase.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
