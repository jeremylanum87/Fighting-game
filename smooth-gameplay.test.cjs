'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';player.x=400;enemy.x=900;player.face=1;player.attack=null;player.stun=0;player.blockstun=0;player.block=false;player.crouch=false;
keys.add('d');advanceSmoothMotion(player,STEP);if(!(player.vx>0&&player.vx<260))throw Error('No acceleration ramp');for(let i=0;i<8;i++)advanceSmoothMotion(player,STEP);if(player.vx!==260)throw Error('Top walk speed changed');keys.clear();advanceSmoothMotion(player,STEP);if(!(player.vx>0&&player.vx<260))throw Error('No braking ramp');for(let i=0;i<8;i++)advanceSmoothMotion(player,STEP);if(player.vx!==0)throw Error('Release did not stop');
keys.add('d');for(let i=0;i<8;i++)advanceSmoothMotion(player,STEP);keys.clear();keys.add('a');for(let i=0;i<8;i++)advanceSmoothMotion(player,STEP);if(player.vx!==-205)throw Error('Direction reversal failed');
keys.clear();clearSmoothGameplay();player.y=ground-100;player.airControl=.55;keys.add('d');for(let i=0;i<12;i++)advanceSmoothMotion(player,STEP);if(player.vx<=260*.55||player.vx>260*.98)throw Error('Air steering not improved/bounded');
player.block=true;advanceSmoothMotion(player,STEP);if(player.vx||smoothMotion(player).velocity)throw Error('Guard slides');player.block=false;player.stun=.2;advanceSmoothMotion(player,STEP);if(player.vx)throw Error('Hitstun slides');player.stun=0;player.y=ground;keys.clear();
const frameData=JSON.stringify(MOVES),stop=hitstop;keys.add('d');for(let i=0;i<5;i++)advanceSmoothMotion(player,STEP);const combat=JSON.stringify({hp:player.hp,x:player.x,y:player.y,vx:player.vx,boxes:hurtboxes(player)});draw();if(combat!==JSON.stringify({hp:player.hp,x:player.x,y:player.y,vx:player.vx,boxes:hurtboxes(player)}))throw Error('Walk art mutated simulation');if(frameData!==JSON.stringify(MOVES)||hitstop!==stop)throw Error('Attack timing/impact pause changed');
mode='paused';const velocity=smoothMotion(player).velocity;update(.1);if(smoothMotion(player).velocity!==velocity)throw Error('Pause advanced movement');clearInput();if(smoothMotion(player).velocity)throw Error('Cancelled input leaked momentum');
console.log('PASS acceleration/braking, original top speed, reversal, improved bounded air steering, immediate guard/hitstun stop, visual purity, preserved frame data/hitstop, pause and input cleanup');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js','defeated.js','air-combos.js','showcase.js','movement-polish.js','photo-stage-details.js','release-character-polish.js','highlight-replay.js','mobile-release-polish.js','dj-upgrade.js','smooth-gameplay.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
