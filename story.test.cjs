'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
const clean=cleanStorySave({chapter:999,complete:'yes',journal:['leader','bogus','leader']});if(clean.chapter!==2||clean.complete||clean.journal.join()!=='leader')throw Error('Story save sanitation');
showTitleScreen();chosenCharacter='jade';pendingCharacter='jade';chosenOpponent='goldie';selectedStage='subway';pendingGameMode='quick';const before=JSON.stringify({chosenCharacter,pendingCharacter,chosenOpponent,selectedStage});
storySave={chapter:0,complete:false,journal:[]};startStory();
if(!story||story.phase!=='brief'||mode!=='paused'||selectedStage!=='court')throw Error('Prologue start');
$('#storyContinue').onclick();if(mode!=='playing'||story.phase!=='fight'||attack(player,'signature'))throw Error('Dormant power');
enemy.hp=0;endRound();if(story.phase!=='won'||!storySave.journal.includes('awakening'))throw Error('First chapter unlock');
$('#storyContinue').onclick();if(story.chapter!==1||storySave.chapter!==1||selectedStage!=='corner')throw Error('Chapter checkpoint');
$('#storyContinue').onclick();
player.x=450;enemy.x=520;player.stun=player.blockstun=enemy.invulnerable=enemy.blockstun=0;enemy.block=false;
const move={...MOVES.punch,type:'signature',signature:true,damage:1};
for(let i=0;i<6;i++){enemy.stun=0;enemy.hp=95;applyCombatHit(player,enemy,move,1)}
if(story.exhausted<=0||story.strain!==65||player.stun<1||story.disrupted<=0)throw Error('Power cost/exhaustion');
if(attack(player,'signature'))throw Error('Exhausted special allowed');
const frozen=JSON.stringify({strain:story.strain,exhausted:story.exhausted});mode='paused';update(STEP);
if(JSON.stringify({strain:story.strain,exhausted:story.exhausted})!==frozen)throw Error('Paused strain advanced');
mode='playing';player.hp=0;endRound();if(story.phase!=='lost')throw Error('Retry missing');
$('#storyContinue').onclick();if(story.phase!=='brief'||player.hp<=0)throw Error('Retry reset');
$('#storyContinue').onclick();enemy.hp=0;endRound();$('#storyContinue').onclick();
if(story.chapter!==2||selectedStage!=='cleveland')throw Error('Team chapter');
$('#storyContinue').onclick();player.x=450;enemy.x=550;enemy.block=false;enemy.invulnerable=0;enemy.stun=0;const rivalHp=enemy.hp;
if(!storyRivalAssist()||storyRivalAssist())throw Error('Rival assist cooldown');hitstop=0;update(.23);
if(enemy.hp>=rivalHp||!story.assistHit)throw Error('Rival assist did no damage');
const cosmeticBefore=JSON.stringify({hp:player.hp,ehp:enemy.hp,x:player.x,remaining});drawStageBackdrop(ctx);draw();
if(JSON.stringify({hp:player.hp,ehp:enemy.hp,x:player.x,remaining})!==cosmeticBefore)throw Error('Corruption changed simulation');
enemy.hp=0;endRound();if(storySave.journal.length!==6)throw Error('Journal unlocks');
$('#storyContinue').onclick();if(story||!storySave.complete||mode!=='title'||JSON.stringify({chosenCharacter,pendingCharacter,chosenOpponent,selectedStage})!==before)throw Error('Ending/navigation restoration');
console.log('PASS three story encounters, checkpoints, powers/exhaustion, pause/retry, rival assist/cooldown, corruption isolation, journal unlocks and prior setup restoration');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
