'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
function victoryTestSetup(){showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';skipFinishers=false;}
victoryTestSetup();enemy.hp=0;endRound();
if(!roundVictory||roundVictory.final||mode!=='roundover'||cinematicFinisher)throw Error('First-round victory missing');
roundVictory.age=.5;if(detailedArtPose(player).kind!=='round-victory')throw Error('Victory pose missing');
const state=JSON.stringify({hp:player.hp,ehp:enemy.hp,wins,remaining});
renderHighlights();if(!$('#highlightsPanel').hidden)throw Error('First-round highlights leaked');
revealResult(5);if(!$('#overlay').classList)throw Error('Overlay missing');
update(.5);if(!roundVictory)throw Error('Celebration ended early');
if(JSON.stringify({hp:player.hp,ehp:enemy.hp,wins,remaining})!==state)throw Error('Victory changed combat');
document.hidden=true;const age=roundVictory.age;update(.5);if(roundVictory.age!==age)throw Error('Hidden victory advanced');document.hidden=false;
update(1);if(roundVictory)throw Error('First-round pose never ended');revealResult(STEP);if(!$('#highlightsPanel').hidden)throw Error('Round highlights should stay hidden');
victoryTestSetup();wins=[1,0];enemy.hp=0;endRound();
if(!cinematicFinisher||!roundVictory?.final)throw Error('Final win stages missing');
renderHighlights();if(!$('#highlightsPanel').hidden)throw Error('Highlights before finisher');
update(3);if(cinematicFinisher||!roundVictory||roundVictory.age!==0)throw Error('Victory timer overlapped finisher');
update(1);if(!$('#highlightsPanel').hidden||!roundVictory)throw Error('Highlights before final pose');
update(1);revealResult(STEP);if(roundVictory||$('#highlightsPanel').hidden)throw Error('Highlights not shown after final pose');
const shown=victoryHighlightsShown;renderHighlights();if(!shown||!victoryHighlightsShown)throw Error('Highlight dedupe');
victoryTestSetup();skipFinishers=true;wins=[1,0];player.hp=0;endRound();
if(roundVictory.winner!==enemy||cinematicFinisher)throw Error('CPU victory or skip preference');
roundVictory.age=.5;if(detailedArtPose(enemy).kind!=='round-victory')throw Error('CPU victory animation');
showTitleScreen();if(roundVictory||victoryHighlightsShown)throw Error('Victory navigation leaked');
console.log('PASS first-round/player/CPU victory, final finisher→pose→highlights ordering, no early popup, hidden pause, combat isolation and navigation');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
