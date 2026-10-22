'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['p','e']){const bar=$('#'+side+'Health');bar.attrs={};bar.setAttribute=(k,v)=>bar.attrs[k]=v;}
showTitleScreen();chosenCharacter='jade';pendingCharacter='jade';chosenOpponent='rook';selectedStage='rooftop';difficulty='hard';pendingGameMode='training';
const previousSetup=JSON.stringify({chosenCharacter,pendingCharacter,chosenOpponent,selectedStage,difficulty,pendingGameMode});
openReleaseDemo();if($('#releaseDemoPanel').hidden)throw Error('Demo chooser absent');
if(chooseReleaseFighter('brick'))throw Error('Featured roster unrestricted');
for(const id of ['volt','ember']){
 chooseReleaseFighter(id);$('#releaseDemoDifficulty').value='easy';launchReleaseDemo();
 if(player.character!==id||enemy.character==id||!['volt','ember'].includes(enemy.character)||selectedStage!=='cleveland'||gameMode!=='quick'||difficulty!=='easy'||!releaseDemoActive||['title','selecting','stage-select'].includes(mode))throw Error('Featured match route '+id);
 dismissFightOpening();mode='playing';player.hp=player.maxHp/2;wins=[1,0];updateHud();
 if($('#pHealth').attrs['aria-valuenow']!=='50'||$('#pHealthTrail').style.width!=='50%'||$('#pRoundPips').textContent!=='● ○'||$('#releaseMatchBadge').hidden)throw Error('Health or round markers');
 const untouched=JSON.stringify({hp:player.hp,x:player.x,meter:meter(player),wins,remaining});
 enemy.attack={type:'lowKick',frame:0,move:getMove(enemy,'lowKick')};drawReadableAttackCues();draw();
 if(JSON.stringify({hp:player.hp,x:player.x,meter:meter(player),wins,remaining})!==untouched)throw Error('Cue changed combat');
 enemy.attack=null;round=2;resetRound();if(!releaseDemoActive||selectedStage!=='cleveland'||player.character!==id)throw Error('Next round left showcase');
 showTitleScreen();if(releaseDemoActive||JSON.stringify({chosenCharacter,pendingCharacter,chosenOpponent,selectedStage,difficulty,pendingGameMode})!==previousSetup)throw Error('Demo setup restoration');
 openReleaseDemo();
}
closeReleaseDemo();if(!$('#releaseDemoPanel').hidden)throw Error('Close demo chooser');
const audioMute=sound;$('#releaseArenaMix').onclick();
if(sound!==audioMute||mixPrefs.music!==.38||mixPrefs.effects!==.82||!mixPrefs.announcer)throw Error('Optional arena mix');
startMode('quick');selectCharacter('goldie');if(pendingCharacter!=='goldie'||releaseDemoActive)throw Error('Full roster inaccessible');
showTitleScreen();
console.log('PASS featured Volt/Ember matches, fixed Cleveland stage, HUD health/pips, cue isolation, next round, restored settings, audio preset/mute and full roster');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
