'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';
const geom=JSON.stringify([hurtboxes(player),attackHitboxes(player),pushbox(player),BODY_STYLES]);for(let i=0;i<3;i++)draw();if(geom!==JSON.stringify([hurtboxes(player),attackHitboxes(player),pushbox(player),BODY_STYLES]))throw Error('Presentation changed geometry');
if(releaseReactionKind(MOVES.punch,enemy)!=='body'||releaseReactionKind({...MOVES.kick,launch:-500},enemy)!=='uppercut')throw Error('Reaction classification');
for(const stage of ['subway','rooftop','cleveland','corner']){selectedStage=stage;fightOpening={phase:'stage',time:.2};const pose=stageEntranceOffset(player);if(!pose||pose.alpha<=0)throw Error('Entrance missing '+stage);fightOpening.time=1.3;const settled=stageEntranceOffset(player);if(settled.x||settled.y)throw Error('Entrance did not settle')};dismissFightOpening();
for(let i=0;i<100;i++){captureReplayFrame();player.x++}if(replayFrames.length!==REPLAY_LIMIT)throw Error('Unbounded recording');const old=replayFrames[0].fighters[0].x;player.x+=100;if(replayFrames[0].fighters[0].x!==old)throw Error('Replay aliases live fighter');
mode='finished';roundImpact=null;roundVictory=null;cinematicFinisher=null;lastBar=null;renderHighlights();if(!replayPending||!$('#highlightsPanel').hidden)throw Error('Replay failed to gate highlights');if(!startHighlightReplay())throw Error('Replay failed to start');const before=JSON.stringify({hp:player.hp,x:player.x,wins,remaining});draw();if(before!==JSON.stringify({hp:player.hp,x:player.x,wins,remaining}))throw Error('Replay modified simulation');
document.hidden=true;const age=cinematicReplay.age;update(.1);if(cinematicReplay.age!==age)throw Error('Hidden replay advanced');document.hidden=false;cinematicReplay.age=cinematicReplay.life;update(0);if(cinematicReplay||$('#highlightReplay').hidden!==true)throw Error('Replay did not finish');
showTitleScreen();if(replayFrames.length||cinematicReplay)throw Error('Navigation leaked clip');
trimReleaseVisualCaches();if(highDetailStages.size||stageGraphicsCache.size||locationDetailCache.size)throw Error('Visual caches not trimmed');
console.log('PASS visual-only identity, classified reactions, stage entrances, bounded isolated replay, highlights ordering, hidden pause, navigation and cache trimming');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js','defeated.js','air-combos.js','showcase.js','movement-polish.js','photo-stage-details.js','release-character-polish.js','highlight-replay.js','mobile-release-polish.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
