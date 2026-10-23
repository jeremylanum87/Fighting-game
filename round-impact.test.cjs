'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
function impactSetup(){showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';player.x=450;enemy.x=520;player.stun=player.blockstun=enemy.invulnerable=0;enemy.block=false;skipFinishers=false;}
impactSetup();applyCombatHit(player,enemy,{...MOVES.punch},1);
if(enemy.hitFlash<.39)throw Error('Damage glow not strengthened');
impactSetup();enemy.hp=1;applyCombatHit(player,enemy,{...MOVES.punch},1);endRound();
if(!roundImpact||mode!=='roundover')throw Error('First round slow KO missing');
const firstState=JSON.stringify({hp:player.hp,ehp:enemy.hp,wins,remaining,meter:meter(player)}),gateAge=roundVictory.age;
update(.3);draw();if(!roundImpact||roundVictory.age!==gateAge||JSON.stringify({hp:player.hp,ehp:enemy.hp,wins,remaining,meter:meter(player)})!==firstState)throw Error('Slow KO changed combat/victory order');
if(detailedArtPose(enemy).kind!=='slow-ko')throw Error('Slow recoil pose missing');
const age=roundImpact.age;document.hidden=true;update(.2);if(roundImpact.age!==age)throw Error('Hidden slow KO advanced');document.hidden=false;
update(1.3);if(roundImpact||roundVictory.age!==gateAge)throw Error('Slow KO did not finish before victory');
impactSetup();wins=[1,0];enemy.hp=1;applyCombatHit(player,enemy,{...MOVES.kick},1);endRound();
if(!roundImpact||!cinematicFinisher)throw Error('Final KO pipeline missing');
const finAge=cinematicFinisher.age;update(.4);draw();if(cinematicFinisher.age!==finAge)throw Error('Finisher ran during slow KO');
renderHighlights();if(!$('#highlightsPanel').hidden)throw Error('Early highlights');
$('#skipLastBar').onclick();if(roundImpact||!cinematicFinisher)throw Error('Skip should end only slow impact');
showTitleScreen();if(roundImpact||roundImpactCandidate)throw Error('Navigation leaked slow KO');
impactSetup();skipFinishers=true;enemy.hp=40;remaining=0;endRound();if(roundImpact)throw Error('Timeout treated as finishing hit');
impactSetup();strongEffects=false;enemy.hp=1;applyCombatHit(player,enemy,MOVES.punch,1);endRound();if(roundImpact.life!==.7)throw Error('Low FX duration');
showTitleScreen();strongEffects=true;
console.log('PASS hit glow, every-round slow KO, isolated health/meter/rewards, frozen next presentation, hidden pause, skip, timeout exclusion and Low FX');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
