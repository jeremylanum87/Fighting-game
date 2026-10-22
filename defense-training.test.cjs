'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
function labTest(kind){
 resetRound();mode='playing';gameMode='training';superCinema=null;tutorial=null;hitstop=0;
 $('#defenseDrillSelect').value=kind;startDefenseDrill();updateCpuFighter(enemy,player,1);
 if(!defenseDrill?.trial||!enemy.attack?.move.defenseDrill)throw Error('Lab did not start '+kind);
}
labTest('perfect');player.block=true;observeGuardTiming(player,STEP);
applyCombatHit(enemy,player,enemy.attack.move,-1);
if(defenseDrill.hits!==1||defenseDrill.streak!==1||player.hp!==player.maxHp)throw Error('Perfect drill scoring');
updateCpuFighter(enemy,player,2);player.block=true;observeGuardTiming(player,STEP);observeGuardTiming(player,.2);
applyCombatHit(enemy,player,enemy.attack.move,-1);
if(defenseDrill.hits!==1||defenseDrill.attempts!==2||defenseDrill.streak!==0||!$('#defenseDrillStatus').textContent.includes('Early'))throw Error('Early guard feedback');
labTest('throws');defenseFor(player).tech=.15;
applyCombatHit(enemy,player,enemy.attack.move,-1);
if(defenseDrill.hits!==1)throw Error('Throw escape scoring');
labTest('pressure');player.block=true;observeGuardTiming(player,STEP);
applyCombatHit(enemy,player,enemy.attack.move,-1);
if(!defenseDrill.trial||!player.blockstun)throw Error('Pressure guard ended attempt');
guardBreakaway(player,enemy);
if(defenseDrill.hits!==1)throw Error('Breakaway scoring');
labTest('pressure');startBackdash(player);updateCpuFighter(enemy,player,1.2);
if(defenseDrill.hits!==1)throw Error('Dash drill scoring');
labTest('mixed');
if(defenseDrill.trial.kind!=='high')throw Error('Mixed first attack');
player.block=true;observeGuardTiming(player,STEP);applyCombatHit(enemy,player,enemy.attack.move,-1);
updateCpuFighter(enemy,player,2);
if(defenseDrill.trial.kind!=='low'||enemy.attack.move.height!=='low')throw Error('Mixed low attack');
player.block=true;player.crouch=true;observeGuardTiming(player,STEP);applyCombatHit(enemy,player,enemy.attack.move,-1);
updateCpuFighter(enemy,player,2);
if(defenseDrill.trial.kind!=='throws'||enemy.attack.type!=='throw')throw Error('Mixed throw attack');
const snapshot=JSON.stringify(defenseDrill);mode='paused';update(STEP);if(JSON.stringify(defenseDrill)!==snapshot)throw Error('Paused lab advanced');
mode='playing';stopDefenseDrill();if(getMove(enemy,'punch').defenseDrill)throw Error('Drill move leaked');
labTest('perfect');showTitleScreen();if(defenseDrill)throw Error('Title lab leak');
console.log('PASS four defense drills, early/perfect feedback, throw escapes, pressure escapes, mixed heights, streak reset, pause and cleanup');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
