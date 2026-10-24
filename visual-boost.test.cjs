'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';
const before=JSON.stringify({hp:player.hp,x:player.x,y:player.y,moves:CHARACTER_MOVES,boxes:hurtboxes(player)});for(const id of Object.keys(STAGES)){selectedStage=id;visualBoostLayer(id);draw()}if(visualBoostCache.size>2)throw Error('Unbounded boosted stages');if(before!==JSON.stringify({hp:player.hp,x:player.x,y:player.y,moves:CHARACTER_MOVES,boxes:hurtboxes(player)}))throw Error('Graphics modified gameplay');
visualBoostCache.clear();visualQualityMode='performance';drawStageBackdrop(ctx);if(visualBoostCache.size)throw Error('Performance mode generated extra detail');visualQualityMode='auto';drawStageBackdrop(ctx);if(!visualBoostCache.size)throw Error('Auto detail missing');trimReleaseVisualCaches();if(visualBoostCache.size)throw Error('Background cleanup missing');
console.log('PASS all-ten boosted material layers, bounded cache, render purity, Performance bypass, Auto detail and cleanup');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js','defeated.js','air-combos.js','showcase.js','movement-polish.js','photo-stage-details.js','release-character-polish.js','highlight-replay.js','mobile-release-polish.js','dj-upgrade.js','smooth-gameplay.js','signature-special-polish.js','stage-grounding.js','visual-boost.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
