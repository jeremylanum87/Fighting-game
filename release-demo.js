'use strict';
let releaseDemoActive=false,releaseDemoChoice='volt',releaseDemoPrevious=null;
function chooseReleaseFighter(id){
 if(!['volt','ember'].includes(id))return false;
 releaseDemoChoice=id;
 for(const fighter of ['volt','ember'])$('#release-'+fighter).setAttribute('aria-pressed',String(id===fighter));
 $('#releaseDemoDescription').textContent=id==='volt'?'VOLT · Boxing fundamentals, fast hands and electric pressure.':'EMBER · Patient defense, sharp counters and flame-powered attacks.';
 return true;
}
function openReleaseDemo(){
 if(mode!=='title')return;
 clearInput();$('#releaseDemoPanel').hidden=false;chooseReleaseFighter(releaseDemoChoice);$('#release-'+releaseDemoChoice).focus();
}
function closeReleaseDemo(){$('#releaseDemoPanel').hidden=true;$('#titleReleaseDemo').focus()}
function leaveReleaseDemo(){
 releaseDemoActive=false;document.body.classList.remove('release-demo-active');
 if(releaseDemoPrevious){
 const p=releaseDemoPrevious;
 chosenCharacter=p.character;pendingCharacter=p.pending;chosenOpponent=p.opponent;selectedStage=p.stage;difficulty=p.difficulty;pendingGameMode=p.mode;
 releaseDemoPrevious=null;
 }
}
function launchReleaseDemo(){
 if(mode!=='title')return;
 const pick=releaseDemoChoice;
 const previous={character:chosenCharacter,pending:pendingCharacter,opponent:chosenOpponent,stage:selectedStage,difficulty,mode:pendingGameMode};
 $('#releaseDemoPanel').hidden=true;
 startMode('quick');
 releaseDemoPrevious=previous;releaseDemoActive=true;document.body.classList.add('release-demo-active');
 selectCharacter(pick);$('#opponentSelect').value=pick==='volt'?'ember':'volt';
 $('#difficultySelect').value=$('#releaseDemoDifficulty').value==='easy'?'easy':'normal';
 $('#stageSelect').value='cleveland';
 $('#confirmFighter').onclick();$('#stageFightStart').onclick();
}
$('#titleReleaseDemo').onclick=openReleaseDemo;
$('#releaseDemoBack').onclick=closeReleaseDemo;
$('#releaseDemoStart').onclick=launchReleaseDemo;
$('#release-volt').onclick=()=>chooseReleaseFighter('volt');
$('#release-ember').onclick=()=>chooseReleaseFighter('ember');
$('#releaseArenaMix').onclick=()=>{
 mixPrefs.music=.38;mixPrefs.effects=.82;mixPrefs.announcer=true;syncMix();
 $('#releaseMixStatus').textContent='Arena mix applied. Music 38% · effects 82% · DJ on. Your mute setting stays in effect.';
};
const hudBeforeRelease=updateHud;
updateHud=function(){
 hudBeforeRelease();
 for(const [side,f,score] of [['p',player,wins[0]],['e',enemy,wins[1]]]){
 const n=Math.max(0,Math.min(100,Math.round(f.hp/(f.maxHp||100)*100))),bar=$('#'+side+'Health');
 // CSS draws delayed damage behind the immediate health fill.
 $('#'+side+'HealthTrail').style.width=n+'%';
 bar.setAttribute('role','progressbar');bar.setAttribute('aria-label',fighterName(f)+' health');
 bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');bar.setAttribute('aria-valuenow',String(n));
 $('#'+side+'RoundPips').textContent=(score>=1?'●':'○')+' '+(score>=2?'●':'○');
 $('#'+side+'RoundPips').setAttribute('aria-label',fighterName(f)+' rounds won: '+score+' of 2');
 }
 $('#releaseMatchBadge').hidden=!releaseDemoActive;
};
const statusBeforeRelease=updateCombatHud;
updateCombatHud=function(){statusBeforeRelease();if(gameMode!=='training'&&comboTime<=0)$('#combatStatus').textContent=''};
function drawReadableAttackCues(){
 if(mode!=='playing'||superCinema)return;
 for(const f of [player,enemy]){
 const a=f.attack,m=a?.move;if(!m||a.frame>=m.startup||!['low','overhead'].includes(m.height))continue;
 const text=m.height==='low'?'LOW · DUCK + BLOCK':'HIGH · STAND BLOCK',x=Math.max(120,Math.min(980,f.x)),y=Math.max(130,f.y-205);
 ctx.save();ctx.font='bold 12px sans-serif';ctx.textAlign='center';
 ctx.fillStyle='#0b1828ee';ctx.fillRect(x-99,y-15,198,25);
 ctx.strokeStyle=m.height==='low'?'#74e8e4':'#dab4ff';ctx.lineWidth=1;ctx.strokeRect(x-99,y-15,198,25);
 ctx.fillStyle='#f4f1e6';ctx.fillText(text,x,y+2);ctx.restore();
 }
}
const drawBeforeRelease=draw;
draw=function(){
 drawBeforeRelease();ctx.save();ctx.setTransform(canvas.width/1100,0,0,canvas.height/520,0,0);
 try{drawReadableAttackCues()}finally{ctx.restore()}
};
const titleBeforeRelease=showTitleScreen;
showTitleScreen=function(){$('#releaseDemoPanel').hidden=true;leaveReleaseDemo();titleBeforeRelease()};
const selectionBeforeRelease=openCharacterSelection;
openCharacterSelection=function(){$('#releaseDemoPanel').hidden=true;leaveReleaseDemo();selectionBeforeRelease()};
document.addEventListener('keydown',e=>{
 if($('#releaseDemoPanel').hidden)return;
 if(e.key==='Escape'){e.preventDefault();closeReleaseDemo()}
 if(e.key==='Tab'&&typeof $('#releaseDemoPanel').querySelectorAll==='function'){
 const fields=[...$('#releaseDemoPanel').querySelectorAll('button,select')].filter(el=>!el.disabled),first=fields[0],last=fields[fields.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
});
chooseReleaseFighter('volt');$('#releaseDemoPanel').hidden=true;updateHud();
