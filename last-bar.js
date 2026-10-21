'use strict';
let skipFinishers=safeStorageGet('block-cypher-skip-finishers-v1')===true,lastBar=null,lastBarCandidate=null;
const LAST_BAR_TAGS={volt:'LIVE WIRE',ember:'AFTERBURN',cipher:'FINAL WORD',brick:'BLOCK BUILT',jade:'FULL CIRCLE',rook:'LAST CHECK',haze:'TOO QUICK',goldie:'PLATINUM'};
$('#skipFinishers').checked=skipFinishers;
function finishLastBar(){lastBar=null;lastBarCandidate=null;$('#skipLastBar').hidden=true;if(resultReveal)resultReveal.time=Math.min(resultReveal.time,.1)}
$('#skipFinishers').onchange=()=>{skipFinishers=$('#skipFinishers').checked;safeStorageSet('block-cypher-skip-finishers-v1',skipFinishers);if(skipFinishers&&lastBar)finishLastBar()};
$('#skipLastBar').onclick=finishLastBar;
function lastBarEligible(a,t,m){return !skipFinishers&&mode==='playing'&&gameMode!=='training'&&t.hp>0&&m.type!=='throw'&&!!(m.isSuper||m.signature||['fireball','uppercut','spinKick'].includes(m.type)||m.counterReply)}
const hitBeforeLastBar=applyCombatHit;
applyCombatHit=function(a,t,m,d){const eligible=lastBarEligible(a,t,m),hp=t.hp,pose={...a,attack:a.attack?{...a.attack,move:{...a.attack.move}}:{type:m.type||'signature',frame:(m.startup||1)+1,move:{...m}},celebrating:false,stun:0,block:false};const ok=hitBeforeLastBar(a,t,m,d);if(eligible&&ok&&hp>0&&t.hp<=0&&t.blockstun<=0)lastBarCandidate={winner:a,target:t,pose,move:m.name||'SPECIAL FINISH',id:a.character,tag:a.isCrewBoss?'IRON 216':a.isBoss?'FINAL CONTRACT':LAST_BAR_TAGS[a.character]};return ok};
const endBeforeLastBar=endRound;
endRound=function(){const wasPlaying=mode==='playing';endBeforeLastBar();if(!wasPlaying||!lastBarCandidate)return;const c=lastBarCandidate;lastBarCandidate=null;if(skipFinishers||gameMode==='training'||!['roundover','finished'].includes(mode)||c.winner.hp<=0||c.target.hp>0)return;lastBar={...c,age:0,life:1.65};knockoutMoment=null;shakeTime=0;clearInput();$('#skipLastBar').hidden=false;if(resultReveal)resultReveal.time=.1};
function lastBarCanAdvance(){return lastBar&&!document.hidden&&['roundover','finished'].includes(mode)&&$('#controlSettings').hidden!==false}
function lastBarSpeed(){return !lastBar?1:lastBar.age<.3?.22:lastBar.age<1.15?0:1}
const updateBeforeLastBar=update;
update=function(dt){if(!lastBar){updateBeforeLastBar(dt);return}if(!['roundover','finished'].includes(mode)){finishLastBar();updateBeforeLastBar(dt);return}if(!lastBarCanAdvance())return;lastBar.age+=dt;const speed=lastBarSpeed();if(speed>0)updateBeforeLastBar(dt*speed);if(lastBar&&lastBar.age>=lastBar.life)finishLastBar()};
const animateBeforeLastBar=animateFighter;
animateFighter=function(f,dt){if(lastBar&&!lastBarCanAdvance())return;const speed=lastBarSpeed();if(speed>0)animateBeforeLastBar(f,dt*speed)};
const revealBeforeLastBar=revealResult;
revealResult=function(dt){if(lastBar)return;revealBeforeLastBar(dt)};
const renderBeforeLastBar=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){if(lastBar&&f===lastBar.winner&&lastBar.age<1.15){renderBeforeLastBar(g,lastBar.pose,scale);return}renderBeforeLastBar(g,f,scale)};
const backdropBeforeLastBar=drawStageBackdrop;
drawStageBackdrop=function(g){backdropBeforeLastBar(g);if(!lastBar||g!==ctx)return;const pal=SPECIAL_COLORS[lastBar.id]||SPECIAL_COLORS.volt,fade=Math.min(1,lastBar.age/.15,(lastBar.life-lastBar.age)/.3);g.save();g.fillStyle='#11182b';g.globalAlpha=.28*fade;g.fillRect(0,0,1100,520);g.globalCompositeOperation='screen';g.fillStyle=pal[1];g.globalAlpha=.18*fade;g.fillRect(0,0,1100,520);g.restore()};
function drawLastBarMotif(g,b,x,y){const pal=SPECIAL_COLORS[b.id]||SPECIAL_COLORS.volt,t=Math.min(b.age,.3),r=65+t*110;g.save();g.translate(x,y);g.strokeStyle=pal[0];g.fillStyle=pal[1];g.lineWidth=3;
 if(b.id==='volt'){for(let j=0;j<(strongEffects?5:2);j++){g.beginPath();g.moveTo(-70+j*32,-70);g.lineTo(-87+j*32,-12);g.lineTo(-65+j*32,-20);g.lineTo(-78+j*32,60);g.stroke()}}
 else if(b.id==='ember'){for(let j=0;j<(strongEffects?6:3);j++){g.fillStyle=pal[j%3];g.beginPath();g.moveTo(-80+j*28,55);g.quadraticCurveTo(-100+j*28,-30,-60+j*28,-95);g.quadraticCurveTo(-25+j*28,10,-60+j*28,55);g.fill()}}
 else if(b.id==='goldie'){g.fillStyle='#182432';g.beginPath();g.ellipse(0,0,r,r*.7,b.age*.3,0,Math.PI*2);g.fill();g.stroke();for(let j=0;j<3;j++){g.beginPath();g.ellipse(0,0,r-j*15,(r-j*15)*.7,b.age*.3,0,Math.PI*2);g.stroke()}g.fillStyle=pal[1];g.beginPath();g.arc(0,0,14,0,Math.PI*2);g.fill()}
 else if(b.id==='brick'||b.id==='rook'){for(let j=0;j<3;j++){g.strokeStyle=pal[j%3];g.beginPath();g.ellipse(0,20+j*16,r+j*15,18+j*6,0,0,Math.PI*2);g.stroke()}}
 else if(b.id==='haze'){for(let j=0;j<(strongEffects?7:3);j++){g.strokeStyle=pal[j%3];g.beginPath();g.moveTo(-r, -65+j*20);g.lineTo(r,-80+j*20);g.stroke()}}
 else{for(let j=0;j<3;j++){g.strokeStyle=pal[j%3];g.beginPath();g.ellipse(0,0,r-j*14,b.id==='jade'?25+j*10:r-j*14,j*.4+t,0,Math.PI*1.7);g.stroke()}}
 g.restore()}
const drawBeforeLastBar=draw;
draw=function(){drawBeforeLastBar();const b=lastBar;if(!b||!['roundover','finished'].includes(mode))return;const pal=SPECIAL_COLORS[b.id]||SPECIAL_COLORS.volt,x=b.pose.x<550?790:310,fade=Math.min(1,b.age/.12,(b.life-b.age)/.25);ctx.save();ctx.globalAlpha=Math.max(0,fade);ctx.globalAlpha*=.45;drawLastBarMotif(ctx,b,b.pose.x,b.pose.y-100);ctx.globalAlpha=Math.max(0,fade);ctx.translate(x,235);ctx.rotate(strongEffects?-.055:0);ctx.fillStyle='#111c2ee8';ctx.fillRect(-205,-83,410,166);ctx.textAlign='center';ctx.font='bold 14px monospace';ctx.fillStyle=pal[2];ctx.fillText('LAST BAR / SPECIAL FINISH',0,-45);ctx.font='italic 900 52px Impact,sans-serif';ctx.strokeStyle='#10242b';ctx.lineWidth=7;ctx.strokeText(b.tag,0,15,385);ctx.fillStyle=pal[0];ctx.fillText(b.tag,0,15,385);ctx.font='bold 13px monospace';ctx.fillStyle='#fff1d7';ctx.fillText(fighterName(b.winner)+' / '+b.move.toUpperCase(),0,53,385);ctx.restore()};
const resetBeforeLastBar=resetRound;resetRound=function(){finishLastBar();resetBeforeLastBar()};
const titleBeforeLastBar=showTitleScreen;showTitleScreen=function(){finishLastBar();titleBeforeLastBar()};
const selectionBeforeLastBar=openCharacterSelection;openCharacterSelection=function(){finishLastBar();selectionBeforeLastBar()};
window.addEventListener('keydown',e=>{if(lastBar&&e.key==='Escape')finishLastBar()});
