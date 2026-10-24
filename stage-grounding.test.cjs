'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';
const stats=JSON.stringify({hp:player.hp,x:player.x,y:player.y,wins,boxes:hurtboxes(player),moves:CHARACTER_MOVES});for(let i=0;i<5;i++)draw();if(stats!==JSON.stringify({hp:player.hp,x:player.x,y:player.y,wins,boxes:hurtboxes(player),moves:CHARACTER_MOVES}))throw Error('Grounding modified gameplay');if(stageLightingDepth||drawingGroundedFighter)throw Error('Drawing scope leaked');
if(Object.keys(STAGE_MATERIALS).length!==10||footAnchors(player).length!==2)throw Error('Stage/feet coverage');
player.y=ground-150;defeatedFighters.set(player,{age:.7,life:.7});if(groundedVisualDrop(player)!==150||player.y!==ground-150)throw Error('Airborne defeated pose not grounded visually');defeatedFighters.delete(player);roundVictory={winner:player,age:.3};mode='roundover';if(groundedVisualDrop(player)!==150)throw Error('Airborne winner not grounded');roundImpact={};if(groundedVisualDrop(player)!==0)throw Error('Slow-hit pose overridden');roundImpact=null;roundVictory=null;
mode='playing';player.y=ground-1;player.vy=300;player.attack=null;player.stun=0;player.hp=100;stepFighter(player,enemy,STEP);if(!surfacePuffs.length)throw Error('Landing contact missing');
for(let i=0;i<30;i++)surfacePuff(player);if(surfacePuffs.length!==18)throw Error('Unbounded surface effects');mode='paused';const age=surfacePuffs[0].age;update(.1);if(surfacePuffs[0].age!==age)throw Error('Paused surface effects advanced');mode='playing';document.hidden=true;update(.1);if(surfacePuffs[0].age!==age)throw Error('Hidden surface effects advanced');document.hidden=false;
for(const id of Object.keys(STAGES)){selectedStage=id;stageFloorPlane()}if(stagePlaneCache.size>2)throw Error('Unbounded floor cache');trimReleaseVisualCaches();if(stagePlaneCache.size||stageLightingCache.size||groundShadowCache.size)throw Error('Background cache cleanup');resetRound();if(surfacePuffs.length)throw Error('Reset leaked surface effects');
console.log('PASS contact rendering purity, ten stage materials, foot anchors, visual-only airborne round settlement, slow-hit priority, landing interaction, cache/effect bounds, pause/background/reset');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js','defeated.js','air-combos.js','showcase.js','movement-polish.js','photo-stage-details.js','release-character-polish.js','highlight-replay.js','mobile-release-polish.js','dj-upgrade.js','smooth-gameplay.js','signature-special-polish.js','stage-grounding.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
