'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
for(const a of Object.keys(fighterRoster))for(const b of Object.keys(fighterRoster)){
 const exchange=rivalExchange({character:a},{character:b});
 if(exchange.lines.length!==2||exchange.lines.some(line=>!line||line.includes('undefined')))throw Error('Missing rival exchange');
 if(a!==b){const reverse=rivalExchange({character:b},{character:a});if(exchange.lines[0]!==reverse.lines[1])throw Error('Reversed speaker order')}
}
showTitleScreen();startMode('quick');selectCharacter('volt');$('#opponentSelect').value='ember';$('#confirmFighter').onclick();$('#stageFightStart').onclick();
const introHP=[player.hp,enemy.hp],introTime=remaining;
if(fightOpening.versusDuration!==3.8||!$('#openingPlayerLine').textContent.includes('pace'))throw Error('Specific intro');
const beforeArt=JSON.stringify({hp:player.hp,x:player.x,meter:meter(player),wins,remaining});
paintRivalFaceoffs();if(JSON.stringify({hp:player.hp,x:player.x,meter:meter(player),wins,remaining})!==beforeArt)throw Error('Art changed combat');
document.hidden=true;const hiddenTime=fightOpening.time;update(STEP);if(fightOpening.time!==hiddenTime)throw Error('Hidden intro advanced');document.hidden=false;
if(!skipRivalIntro()||fightOpening.phase!=='fight')throw Error('Intro skip');
update(.7);if(mode!=='playing'||player.hp!==introHP[0]||enemy.hp!==introHP[1]||remaining!==introTime||keys.size)throw Error('Skip damaged or unlocked early');
wins=[1,0];enemy.hp=0;mode='playing';gameMode='quick';endRound();
if(mode!=='finished'||rivalLastMatch.winner!=='volt')throw Error('Winner not recorded');
player.hp=enemy.hp=100;startFightOpening(true);
if(fightOpening.versusDuration!==3.2||!$('#openingPlayerLine').textContent.includes('Sharper hands')||!$('#openingEnemyLine').textContent.includes('rushed once'))throw Error('Rematch reaction');
startFightOpening(false);if(fightOpening.phase!=='round')throw Error('Repeated intro between rounds');
showTitleScreen();if(fightOpening||skipRivalIntro())throw Error('Intro navigation cleanup');
const oldResult=rivalLastMatch;gameMode='training';mode='playing';endRound();if(rivalLastMatch!==oldResult)throw Error('Training changed rivalry');
if(!rivalExchange({character:'volt'},{character:'brick',isCrewBoss:true}).lines[1].includes('mills'))throw Error('Crew boss intro');
if(!rivalExchange({character:'volt'},{character:'brick',isBoss:true}).lines[1].includes('flyer'))throw Error('Final boss intro');
showTitleScreen();console.log('PASS 56 directed rival pairings, boss exchanges, rematch winner/loser reactions, isolated art, hidden freeze, skip countdown and navigation');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
