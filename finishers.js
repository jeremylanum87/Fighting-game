'use strict';
const FIGHTER_FINISHERS={
 volt:{title:'LIGHTS OUT',line:'Fast hands. Clean finish.',rival:'You saw the pace. Now respect it.',pose:'salute'},
 ember:{title:'FINAL EMBER',line:'Patience gets the last word.',rival:'You rushed. I waited.',pose:'shoulders'},
 cipher:{title:'CASE CLOSED',line:'Every move told me how this ends.',rival:'Same habits. Same answer.',pose:'composed'},
 brick:{title:'BLOCK STANDS',line:'Still standing. Still my block.',rival:'You brought the speed. I brought the wall.',pose:'power'},
 jade:{title:'LAST STEP',line:'That is how you close the circle.',rival:'You lost the rhythm. I kept mine.',pose:'dance'},
 rook:{title:'CHECKMATE',line:'Balance first. Victory follows.',rival:'One step out of place was enough.',pose:'bow'},
 haze:{title:'BLINK',line:'Catch the replay. You missed the finish.',rival:'Next time, watch my feet.',pose:'shuffle'},
 goldie:{title:'STANDING OVATION',line:'Give the block something to remember.',rival:'That is what an encore looks like.',pose:'swagger'}
};
let cinematicFinisher=null;
function finishCinematicFinisher(){
 const f=cinematicFinisher;if(!f)return;
 cinematicFinisher=null;$('#skipLastBar').hidden=true;
 if(f.story&&story?.phase==='won')$('#storyPanel').hidden=false;
 if(resultReveal)resultReveal.time=Math.min(resultReveal.time,.1);
}
function beginCinematicFinisher(winner,target,isStory=false){
 if(skipFinishers||!winner||winner.hp<=0||target.hp>0)return false;
 finishLastBar();
 const id=winner.character,profile=FIGHTER_FINISHERS[id]||FIGHTER_FINISHERS.brick;
 const pair=typeof RIVAL_EXCHANGES!=='undefined'&&RIVAL_EXCHANGES.some(p=>p[0]===winner.character&&p[1]===target.character||p[1]===winner.character&&p[0]===target.character);
 cinematicFinisher={winner,target,id,age:0,life:2.4,story:isStory,profile,
 title:isStory?'POWER / SILENCED':winner.isCrewBoss?'IRON 216':winner.isBoss?'FINAL CONTRACT':profile.title,
 line:isStory?'The breach goes quiet. Your hand will not stop shaking.':profile.line,
 reply:isStory?'The rival steps closer. “We do this together.”':pair?fighterName(winner)+' → '+fighterName(target)+': '+profile.rival:''};
 clearInput();knockoutMoment=null;shakeTime=0;$('#skipLastBar').hidden=false;
 if(isStory)$('#storyPanel').hidden=true;
 return true;
}
const endBeforeCinematic=endRound;
endRound=function(){
 const active=mode==='playing',storyEnd=typeof story!=='undefined'&&story?.phase==='fight'&&story.chapter===2;
 endBeforeCinematic();
 if(!active)return;
 if(storyEnd&&story?.phase==='won')beginCinematicFinisher(player,enemy,true);
 else if(mode==='finished'&&gameMode!=='training'&&(player.hp<=0||enemy.hp<=0))beginCinematicFinisher(player.hp>0?player:enemy,player.hp>0?enemy:player);
};
const updateBeforeCinematic=update;
update=function(dt){
 if(!cinematicFinisher){updateBeforeCinematic(dt);return}
 if(skipFinishers){finishCinematicFinisher();return}
 if(document.hidden||$('#controlSettings').hidden===false)return;
 if(typeof pollPhysicalController==='function')pollPhysicalController(dt);
 if(!cinematicFinisher)return;
 cinematicFinisher.age+=dt;
 if(cinematicFinisher.age>=cinematicFinisher.life)finishCinematicFinisher();
};
const revealBeforeCinematic=revealResult;
revealResult=function(dt){if(!cinematicFinisher)revealBeforeCinematic(dt)};
const poseBeforeCinematic=detailedArtPose;
detailedArtPose=function(f){
 const p=poseBeforeCinematic(f),c=cinematicFinisher;
 if(!c||f!==c.winner)return p;
 p.image=f.isBoss?motionArt.promoter:arcadeSprites[f.character];p.col=ART_VICTORIES[f.character]?.frame||6;p.kind='finisher';p.angle=0;p.sx=p.sy=1;
 const t=strongEffects?c.age:0,w=strongEffects?Math.sin(t*7):0;
 if(c.story&&c.age>1.25){p.col=7;p.angle=-.06;p.x+=strongEffects?Math.sin(t*35)*1.8:0;return p}
 if(c.profile.pose==='salute')p.y-=Math.sin(Math.min(1,t/.6)*Math.PI)*7;
 if(c.profile.pose==='shoulders'){p.sy+=w*.012;p.angle=w*.02}
 if(c.profile.pose==='composed')p.angle=-.04;
 if(c.profile.pose==='power')p.sx+=Math.abs(w)*.035;
 if(c.profile.pose==='dance'){p.angle=w*.1;p.x+=w*5}
 if(c.profile.pose==='bow')p.angle=Math.sin(Math.min(1,t/1.2)*Math.PI)*.15;
 if(c.profile.pose==='shuffle'){p.x+=w*8;p.y-=Math.abs(w)*3}
 if(c.profile.pose==='swagger'){p.angle=w*.04;p.x+=w*4}
 return p;
};
function drawCinematicFinisher(c){
 ctx.save();ctx.setTransform(canvas.width/1100,0,0,canvas.height/520,0,0);
 const fade=Math.min(1,c.age/.12,(c.life-c.age)/.22),zoom=strongEffects?1+Math.min(.12,c.age*.12):1;
 ctx.globalAlpha=Math.max(0,fade);ctx.fillStyle='#0a1220';ctx.fillRect(0,0,1100,520);
 ctx.save();ctx.translate(550,300);ctx.scale(zoom,zoom);ctx.translate(-Math.max(330,Math.min(770,c.winner.x)), -300);
 drawStageBackdrop(ctx);ctx.fillStyle='#0d142b66';ctx.fillRect(0,0,1100,520);
 if(strongEffects&&!(c.story&&c.age>1.25))drawLastBarMotif(ctx,{id:c.id,age:c.age},c.winner.x,c.winner.y-155);
 renderStreetFighter(ctx,c.target,2.1);renderStreetFighter(ctx,c.winner,2.1);
 ctx.restore();
 ctx.fillStyle='#07101eee';ctx.fillRect(0,0,1100,46);ctx.fillRect(0,415,1100,105);
 ctx.textAlign='center';ctx.fillStyle='#f3d18a';ctx.font='italic 900 31px Impact,sans-serif';ctx.fillText(c.title,550,33);
 ctx.fillStyle='#fff0d5';ctx.font='bold 19px sans-serif';ctx.fillText(c.line,550,451,1020);
 ctx.fillStyle='#b9d6e9';ctx.font='14px sans-serif';ctx.fillText(c.reply,550,479,1020);
 ctx.restore();
}
const drawBeforeCinematic=draw;
draw=function(){drawBeforeCinematic();if(cinematicFinisher)drawCinematicFinisher(cinematicFinisher)};
const skipBeforeCinematic=$('#skipLastBar').onclick;
$('#skipLastBar').onclick=()=>{if(cinematicFinisher)finishCinematicFinisher();else skipBeforeCinematic()};
window.addEventListener('keydown',e=>{if(cinematicFinisher&&['Escape','Enter',' '].includes(e.key)){e.preventDefault();finishCinematicFinisher()}});
const resetBeforeCinematic=resetRound;
resetRound=function(){finishCinematicFinisher();resetBeforeCinematic()};
const titleBeforeCinematic=showTitleScreen;
showTitleScreen=function(){finishCinematicFinisher();titleBeforeCinematic()};
const selectBeforeCinematic=openCharacterSelection;
openCharacterSelection=function(){finishCinematicFinisher();selectBeforeCinematic()};
