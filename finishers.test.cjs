'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
skipFinishers=false;showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';
wins=[1,0];enemy.hp=0;endRound();
if(!cinematicFinisher||mode!=='finished'||lastBar)throw Error('Final KO cinematic trigger');
const combatSnapshot=JSON.stringify({hp:player.hp,ehp:enemy.hp,wins,remaining,meter:meter(player)});
update(.5);draw();
if(JSON.stringify({hp:player.hp,ehp:enemy.hp,wins,remaining,meter:meter(player)})!==combatSnapshot)throw Error('Cinematic changed combat');
const age=cinematicFinisher.age;document.hidden=true;update(.5);if(cinematicFinisher.age!==age)throw Error('Hidden finisher advanced');document.hidden=false;
globalThis.navigator=globalThis.navigator||{};
const testPad={index:0,connected:true,mapping:'standard',axes:[0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};navigator.getGamepads=()=>[testPad];
update(STEP);testPad.buttons[0]={pressed:true,value:1};update(STEP);if(cinematicFinisher)throw Error('Controller skip failed');testPad.buttons[0]={pressed:false,value:0};navigator.getGamepads=()=>[];
for(const id of Object.keys(fighterRoster)){
 finishCinematicFinisher();player.character=id;enemy.character=id==='volt'?'ember':'volt';player.hp=100;enemy.hp=0;
 beginCinematicFinisher(player,enemy);if(!cinematicFinisher.profile.title||!cinematicFinisher.line)throw Error('Missing profile');
 cinematicFinisher.age=.7;const pose=detailedArtPose(player);
 if(pose.kind!=='finisher'||!Number.isFinite(pose.x+pose.y+pose.angle))throw Error('Finisher pose');
 draw();
}
finishCinematicFinisher();resetRound();dismissFightOpening();mode='playing';wins=[0,0];enemy.hp=0;endRound();
if(cinematicFinisher)throw Error('Ordinary round triggered match finisher');
mode='playing';wins=[1,0];enemy.hp=50;player.hp=100;endRound();if(cinematicFinisher)throw Error('Timeout triggered knockout finisher');
skipFinishers=true;enemy.hp=0;if(beginCinematicFinisher(player,enemy))throw Error('Saved skip ignored');skipFinishers=false;
showTitleScreen();startStory();story.chapter=2;prepareStoryChapter();$('#storyContinue').onclick();enemy.hp=0;endRound();
if(!cinematicFinisher?.story||!$('#storyPanel').hidden)throw Error('Story disruption finish');
cinematicFinisher.age=1.7;const strainPose=detailedArtPose(player);if(strainPose.col!==7)throw Error('Story strain reaction missing');
finishCinematicFinisher();if($('#storyPanel').hidden||story.phase!=='won')throw Error('Story continuation not restored');
showTitleScreen();if(cinematicFinisher||story)throw Error('Navigation finisher leak');
console.log('PASS eight finishers, final-KO-only trigger, combat/reward isolation, hidden freeze, saved skip, story strain/continuation and navigation cleanup');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
