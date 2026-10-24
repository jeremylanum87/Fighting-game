'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';
if(new Set(Object.values(SPECIAL_IDENTITIES).map(p=>p.motif)).size!==8)throw Error('Fighter motifs not unique');
for(const id of Object.keys(SPECIAL_IDENTITIES))for(const type of ['fireball','uppercut','spinKick','signature','super']){
 player.character=id;configureMoveset(player);player.hp=100;player.y=ground;player.x=350;player.face=1;player.attack=null;player.stun=0;player.blockstun=0;player.block=false;player.crouch=false;player.knockedDown=false;player.invulnerable=0;player.cooldown=0;player.moveCooldowns={};player.superMeter=100;superCinema=null;projectiles=[];mode='playing';if(!attack(player,type))throw Error('Cannot start '+id+' '+type);superCinema=null;
 const a=player.attack,before=JSON.stringify({move:a.move,hp:player.hp,x:player.x,y:player.y,boxes:attackHitboxes(player)});for(const frame of [0,a.move.startup,a.move.startup+a.move.active]){a.frame=frame;const p=detailedArtPose(player);if(p.kind!=='signature-special'||p.col<0||p.col>7)throw Error('Phased pose missing '+id+' '+type);draw();specialMotif(ctx,id,300,280,60,.5,1,.8,ground)}a.frame=0;
 if(JSON.stringify({move:a.move,hp:player.hp,x:player.x,y:player.y,boxes:attackHitboxes(player)})!==before)throw Error('Art changed move or geometry');
}
clearSignaturePolish();player.character='volt';player.attack=null;player.cooldown=0;player.moveCooldowns={};player.y=ground;player.stun=0;player.block=false;mode='playing';attack(player,'uppercut');const a=player.attack;a.frame=a.move.startup-1;stepFighter(player,enemy,STEP);if(signatureSpecialBursts.length!==1)throw Error('Release cue missing');stepFighter(player,enemy,STEP);if(signatureSpecialBursts.length!==1)throw Error('Repeated release cue');
for(let i=0;i<30;i++)addSignatureBurst(player,300,200);if(signatureSpecialBursts.length!==12)throw Error('Unbounded effects');mode='paused';const age=signatureSpecialBursts[0].age;update(.1);if(signatureSpecialBursts[0].age!==age)throw Error('Paused effects advanced');
mode='playing';hitstop=3;update(STEP);if(signatureSpecialBursts[0].age!==age)throw Error('Hitstop advanced effects');hitstop=0;document.hidden=true;update(STEP);if(signatureSpecialBursts[0].age!==age)throw Error('Hidden effects advanced');document.hidden=false;mode='roundover';hitstop=5;update(STEP);if(signatureSpecialBursts[0].age<=age)throw Error('Post-round effects stuck on stale hitstop');hitstop=0;
strongEffects=false;for(const id of Object.keys(SPECIAL_IDENTITIES))specialMotif(ctx,id,300,280,60,.5,1,.8,ground);resetRound();if(signatureSpecialBursts.length)throw Error('Reset leaked effects');
console.log('PASS eight unique motifs, 40 specials across three phases, render purity/frame-data preservation, one release cue, bounded effects, pause/hitstop/hidden freeze, low effects and reset');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js','defeated.js','air-combos.js','showcase.js','movement-polish.js','photo-stage-details.js','release-character-polish.js','highlight-replay.js','mobile-release-polish.js','dj-upgrade.js','smooth-gameplay.js','signature-special-polish.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
