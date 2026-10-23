'use strict';
const STORY_CHAPTERS=[
 {title:'01 / MAKE THEM REMEMBER',stage:'court',opponent:'haze',name:'THE RIVAL',hp:70,corruption:0,
 text:'You entered the tournament for recognition. Every cheer makes the next reckless move feel worth it. A rival steps into the circle. Tonight, you intend to make the neighborhood remember you.',
 win:'A strange pulse cuts through your final strike. The rival’s power fails—and pain shoots through your arm. They noticed. “Whatever that was, we could use it together.”'},
 {title:'02 / THE STREET THAT WASN’T THERE',stage:'corner',opponent:'brick',name:'REALM-TOUCHED FIGHTER',hp:95,corruption:.5,
 text:'A familiar street opens onto impossible architecture. Something has crossed the boundary. Your strikes can interrupt its supernatural techniques, but every disruption builds strain. At 100 strain you collapse briefly. Back away and recover.',
 win:'The breach contracts under your disrupted strikes. Among the debris is a warning from the missing legend: the tournament was meant to gather people who could stop this.'},
 {title:'03 / AN UNEASY ALLIANCE',stage:'cleveland',opponent:'rook',name:'BREACH WARDEN',hp:125,corruption:1,
 text:'The rival offers a temporary alliance. Their reasons remain their own. Hold the breach together: press RIVAL ASSIST / V / controller View when the enemy is close. Your partner will interrupt the attack. The city leader’s people are already searching for you.',
 win:'You force this breach shut, but the city is far from safe. The legend’s warning points toward a leader who has worn different faces for centuries. Somewhere beyond the boundary, your missing defender is still resisting.'}
];
const STORY_LORE=[
 {id:'tournament',title:'THE TOURNAMENT FLYER',text:'An ordinary neighborhood tournament on the surface. Its missing founder had another purpose: gathering fighters whose rare abilities could close a breach between realms.'},
 {id:'awakening',title:'A POWER WITH A PRICE',text:'Your strikes interrupt supernatural abilities. Repeated use causes pain and exhaustion. Recognition no longer feels worth the cost of every reckless hit.'},
 {id:'realm',title:'THE OTHER SIDE OF THE STREET',text:'The hidden realm overlaps familiar places. Architecture bends, unfamiliar figures watch from beyond the boundary, and creatures are crossing into the city. Music does not cause the breach.'},
 {id:'legend',title:'THE MISSING LEGEND',text:'The tournament’s founder discovered the approaching invasion. Their final mixtape carries clues and warnings; it is a message, not a source of supernatural power.'},
 {id:'alliance',title:'AN OFFER, NOT A PROMISE',text:'The rival recognized your ability during a match and proposed joining forces. Their ultimate goal is still unknown.'},
 {id:'leader',title:'THE SAME HANDWRITING',text:'Records separated by centuries bear the same distinctive signature under different names. The respected city leader is an outsider from the hidden realm. The takeover is almost ready.'}
];
function cleanStorySave(value){
 const v=value&&typeof value==='object'?value:{};
 return {chapter:Number.isInteger(v.chapter)?Math.max(0,Math.min(2,v.chapter)):0,complete:v.complete===true,
 journal:Array.isArray(v.journal)?[...new Set(v.journal.filter(id=>STORY_LORE.some(l=>l.id===id)))]:[]};
}
let storySave=cleanStorySave(safeStorageGet('block-cypher-story-v1')),story=null,storyClock=0;
function saveStory(){safeStorageSet('block-cypher-story-v1',storySave)}
function unlockStory(...ids){for(const id of ids)if(STORY_LORE.some(l=>l.id===id)&&!storySave.journal.includes(id))storySave.journal.push(id);saveStory()}
function storyCard(title,text,button){
 $('#storyPanel').hidden=false;$('#storyHeading').textContent=title;$('#storyText').textContent=text;$('#storyContinue').textContent=button;$('#storyContinue').focus();
}
function startStory(){
 if(mode!=='title')return;
 if(storySave.complete){storySave.chapter=0;storySave.complete=false;saveStory()}
 const previous={character:chosenCharacter,pending:pendingCharacter,opponent:chosenOpponent,stage:selectedStage,difficulty,mode:pendingGameMode};
 startMode('training');selectCharacter('volt');$('#opponentSelect').value='haze';$('#confirmFighter').onclick();$('#stageFightStart').onclick();
 dismissFightOpening();story={chapter:storySave.chapter,phase:'brief',strain:0,exhausted:0,disrupted:0,assist:0,assistAge:-1,assistHit:false,previous};
 prepareStoryChapter();
}
function prepareStoryChapter(){
 if(!story)return;
 const chapter=story.chapter;story.phase='brief';story.strain=story.exhausted=story.disrupted=story.assist=0;story.assistAge=-1;
 gameMode='training';chosenOpponent=STORY_CHAPTERS[chapter].opponent;selectedStage=STORY_CHAPTERS[chapter].stage;
 round=1;wins=[0,0];resetRound();dismissFightOpening();mode='paused';trainingDemo=null;trainingResetDelay=0;
 enemy.name=STORY_CHAPTERS[chapter].name;enemy.maxHp=enemy.hp=STORY_CHAPTERS[chapter].hp;
 player.superMeter=chapter?60:0;enemy.superMeter=0;$('#enemyName').textContent=enemy.name;$('#trainingPanel').hidden=true;
 $('#storyHud').hidden=false;updateHud();updateSuperHud();
 storyCard(STORY_CHAPTERS[chapter].title,STORY_CHAPTERS[chapter].text,'BEGIN ENCOUNTER');
}
function leaveStory(){
 if(!story)return;
 const p=story.previous;story=null;$('#storyPanel').hidden=true;$('#storyHud').hidden=true;
 chosenCharacter=p.character;pendingCharacter=p.pending;chosenOpponent=p.opponent;selectedStage=p.stage;difficulty=p.difficulty;pendingGameMode=p.mode;
}
$('#titleStory').onclick=startStory;
$('#storyContinue').onclick=()=>{
 if(!story)return;
 if(story.phase==='brief'||story.phase==='retry'){
 $('#storyPanel').hidden=true;clearInput();mode='playing';story.phase='fight';return;
 }
 if(story.phase==='lost'){prepareStoryChapter();return}
 if(story.phase==='won'){
 if(story.chapter<2){story.chapter++;storySave.chapter=story.chapter;saveStory();prepareStoryChapter()}
 else {storySave.complete=true;saveStory();showTitleScreen()}
 }
};
$('#storyExit').onclick=()=>showTitleScreen();
$('#storyAssist').onclick=()=>storyRivalAssist();
function openStoryJournal(){
 if(mode==='playing')pause();clearInput();
 $('#storyJournal').hidden=false;
 $('#storyJournalEntries').replaceChildren();
 for(const entry of STORY_LORE){
 const article=document.createElement('article'),heading=document.createElement('h3'),text=document.createElement('p'),unlocked=storySave.journal.includes(entry.id);
 heading.textContent=unlocked?entry.title:'UNDISCOVERED RECORD';text.textContent=unlocked?entry.text:'Continue the story to uncover this clue.';
 article.appendChild(heading);article.appendChild(text);$('#storyJournalEntries').appendChild(article);
 }
 $('#storyJournalCount').textContent=storySave.journal.length+' / '+STORY_LORE.length+' records discovered';
 $('#closeStoryJournal').focus();
}
$('#titleLore').onclick=openStoryJournal;$('#storyJournalButton').onclick=openStoryJournal;
$('#closeStoryJournal').onclick=()=>{$('#storyJournal').hidden=true;if(story&&mode==='paused'&&story.phase==='fight')pause()};
function storyRivalAssist(){
 if(!story||story.chapter!==2||story.phase!=='fight'||mode!=='playing'||superCinema||story.assist>0||Math.abs(player.x-enemy.x)>260||player.hp<=0)return false;
 story.assist=8;story.assistAge=0;story.assistHit=false;
 impactLabels.push({x:player.x,y:player.y-180,text:'RIVAL / COVERING YOU',age:0,life:.7,color:'#b4d9ff'});
 return true;
}
const captureBeforeStory=captureCombatInput;
captureCombatInput=function(){const pressed=keys.has('v')&&!previousKeys.has('v');captureBeforeStory();if(pressed)storyRivalAssist()};
function storyPower(type,m){return m&&(m.isSuper||m.signature||['fireball','uppercut','spinKick'].includes(type))}
const attackBeforeStory=attack;
attack=function(f,type){
 const m=getMove(f,type);
 if(story&&mode==='playing'&&story.phase==='fight'){
 if(f===player&&storyPower(type,m)&&(story.chapter===0||story.exhausted>0))return false;
 if(f===enemy&&story.disrupted>0&&storyPower(type,m))return false;
 }
 return attackBeforeStory(f,type);
};
const hitBeforeStory=applyCombatHit;
applyCombatHit=function(a,t,m,d){
 const hp=t.hp,ok=hitBeforeStory(a,t,m,d);
 if(story&&story.phase==='fight'&&a===player&&t===enemy&&ok&&t.hp<hp&&t.blockstun<=0&&story.chapter>0&&storyPower(m.type||a.attack?.type,m)){
 projectiles=projectiles.filter(p=>p.owner!==enemy);
 story.strain=Math.min(100,story.strain+(m.isSuper?35:18));story.disrupted=1.4;
 if(enemy.attack&&storyPower(enemy.attack.type,enemy.attack.move))enemy.attack=null;
 if(story.strain>=100){story.exhausted=1.4;player.attack=null;player.stun=Math.max(player.stun,1.4);player.hitDuration=1.4;story.strain=65}
 impactLabels.push({x:enemy.x,y:enemy.y-175,text:story.exhausted?'STRAIN / EXHAUSTED':'POWER DISRUPTED',age:0,life:.7,color:'#c9b4ff'});
 if(impactLabels.length>8)impactLabels.shift();
 }
 return ok;
};
const cpuBeforeStory=updateCpuFighter;
updateCpuFighter=function(f,t,dt){
 if(!story||story.phase!=='fight'){cpuBeforeStory(f,t,dt);return}
 f.block=false;f.crouch=false;
 if(f.stun||f.blockstun||f.attack){f.vx=0;return}
 const distance=Math.abs(f.x-t.x);f.vx=distance>130?f.face*140:distance<70?-f.face*80:0;
 f.storyWait=Math.max(0,(f.storyWait||.5)-dt);
 if(!f.storyWait){attack(f,distance<155?(Math.floor(storyClock*3)%3?'punch':'kick'):'signature');f.storyWait=story.chapter===0?.9:.65}
};
const endBeforeStory=endRound;
endRound=function(){
 if(!story||story.phase!=='fight'){endBeforeStory();return}
 clearInput();mode='paused';player.attack=enemy.attack=null;projectiles=[];
 if(player.hp<=0){story.phase='lost';storyCard('GET BACK UP','Your story does not end here. Retry this encounter; discovered records stay unlocked.','RETRY');return}
 story.phase='won';
 if(story.chapter===0)unlockStory('tournament','awakening');
 if(story.chapter===1)unlockStory('realm','legend');
 if(story.chapter===2)unlockStory('alliance','leader');
 storyCard('ENCOUNTER COMPLETE',STORY_CHAPTERS[story.chapter].win,story.chapter===2?'END PROLOGUE / TITLE':'NEXT CHAPTER');
};
const updateBeforeStory=update;
update=function(dt){
 const on=story&&story.phase==='fight'&&mode==='playing'&&!document.hidden&&!superCinema;
 updateBeforeStory(dt);
 if(!story)return;
 $('#trainingPanel').hidden=true;
 if(on&&mode==='playing'&&!superCinema){
 storyClock+=dt;story.exhausted=Math.max(0,story.exhausted-dt);story.disrupted=Math.max(0,story.disrupted-dt);story.assist=Math.max(0,story.assist-dt);
 if(story.exhausted===0)story.strain=Math.max(0,story.strain-dt*4);
 if(story.assistAge>=0){
 story.assistAge+=dt;
 if(story.assistAge>=.22&&!story.assistHit){
 story.assistHit=true;
 applyCombatHit(player,enemy,{...MOVES.punch,type:'rivalAssist',name:'Rival Cover Strike',damage:9,chip:0,hitstun:20},player.face);
 }
 if(story.assistAge>.6)story.assistAge=-1;
 }
 }
 $('#storyStrain').textContent=story.chapter===0?'POWER / DORMANT':story.exhausted>0?'STRAIN / EXHAUSTED':('STRAIN '+Math.round(story.strain)+' / 100'+(story.disrupted>0?' · ENEMY POWER DISRUPTED':''));
 $('#storyAssist').hidden=story.chapter!==2;$('#storyAssist').disabled=story.assist>0||mode!=='playing';
 $('#storyAssist').textContent=story.assist>0?'RIVAL ASSIST '+Math.ceil(story.assist)+'s':'RIVAL ASSIST / V / VIEW';
};
const backdropBeforeStory=drawStageBackdrop;
drawStageBackdrop=function(g){
 backdropBeforeStory(g);if(!story||!STORY_CHAPTERS[story.chapter].corruption)return;
 const strength=STORY_CHAPTERS[story.chapter].corruption,time=strongEffects?storyClock:0;
 g.save();g.fillStyle='#28143c';g.globalAlpha=.15*strength;g.fillRect(0,0,1100,430);g.globalAlpha=.8;
 for(let i=0;i<7;i++){
 const x=100+i*151,y=90+i%3*45;
 g.strokeStyle=i%2?'#b3a0f5':'#69dfda';g.lineWidth=2;
 g.beginPath();g.moveTo(x,y);g.lineTo(x-16,220);g.lineTo(x+13,275);g.lineTo(x-30,410);g.stroke();
 if(strength===1){g.fillStyle='#0b0920';g.beginPath();g.ellipse(x,230+Math.sin(time+i)*5,15,55,0,0,Math.PI*2);g.fill();g.fillStyle='#dac4ff';g.fillRect(x-7,220,4,2);g.fillRect(x+4,220,4,2)}
 }
 g.restore();
};
const drawBeforeStory=draw;
draw=function(){
 drawBeforeStory();if(!story||story.assistAge<0)return;
 ctx.save();ctx.setTransform(canvas.width/1100,0,0,canvas.height/520,0,0);
 ctx.globalAlpha=Math.min(1,(.6-story.assistAge)*3);
 const ally={...player,character:'haze',x:enemy.x-player.face*100,y:ground,face:player.face,hp:100,attack:null,stun:0,blockstun:0,hitFlash:0,tauntTime:1,celebrating:false};
 ally.attack={type:'punch',frame:Math.min(35,Math.floor(story.assistAge*60)),move:{...MOVES.punch,startup:12,active:4,recovery:20}};
 renderStreetFighter(ctx,ally,2.1);ctx.restore();
};
const titleBeforeStory=showTitleScreen;
showTitleScreen=function(){leaveStory();$('#storyJournal').hidden=true;titleBeforeStory();$('#titleStory').textContent=storySave.complete?'REPLAY STORY / THE FIRST BREACH':storySave.chapter?'CONTINUE STORY / THE FIRST BREACH':'STORY / THE FIRST BREACH'};
const selectionBeforeStory=openCharacterSelection;
openCharacterSelection=function(){leaveStory();$('#storyJournal').hidden=true;selectionBeforeStory()};
