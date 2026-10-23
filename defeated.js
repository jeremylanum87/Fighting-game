'use strict';
const defeatedFighters=new WeakMap();
function markDefeated(f){if(f)defeatedFighters.set(f,{age:0,life:strongEffects?.7:.35})}
const endBeforeDefeated=endRound;
endRound=function(){
 const active=mode==='playing',before=[...wins];
 endBeforeDefeated();
 if(!active)return;
 if(['roundover','finished'].includes(mode)){
 if(wins[0]>before[0])markDefeated(enemy);
 else if(wins[1]>before[1])markDefeated(player);
 else if(player.hp<=0&&enemy.hp<=0){markDefeated(player);markDefeated(enemy)}
 }
 if(typeof story!=='undefined'&&story){
 if(story.phase==='won')markDefeated(enemy);
 if(story.phase==='lost')markDefeated(player);
 }
};
const updateBeforeDefeated=update;
update=function(dt){
 const held=!!roundImpact||document.hidden||$('#controlSettings').hidden===false;
 updateBeforeDefeated(dt);
 if(!held)for(const f of [player,enemy]){
 const d=defeatedFighters.get(f);if(!d)continue;
 if(['roundover','finished','paused'].includes(mode))d.age=Math.min(d.life,d.age+dt);
 }
 if(typeof story!=='undefined'&&story&&['won','lost'].includes(story.phase)&&!cinematicFinisher&&!roundImpact){
 const d=defeatedFighters.get(story.phase==='won'?enemy:player);
 if(d)$('#storyPanel').hidden=d.age<d.life;
 }
};
const poseBeforeDefeated=detailedArtPose;
detailedArtPose=function(f){
 const p=poseBeforeDefeated(f);
 if(!defeatedFighters.has(f)||roundImpact)return p;
 p.image=f.isBoss?motionArt.promoter:arcadeSprites[f.character];p.col=7;p.kind='defeated';
 p.x=f.x;p.y=f.y;p.angle=0;p.sx=p.sy=1;return p;
};
const renderBeforeDefeated=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){
 const d=g===ctx?defeatedFighters.get(f):null;
 if(!d||roundImpact){renderBeforeDefeated(g,f,scale);return}
 const t=Math.min(1,d.age/d.life),ease=strongEffects?1-Math.pow(1-t,3):t;
 g.save();g.translate(f.x,f.y-24*ease);g.scale(1,1-.5*ease);
 g.rotate((f.face||1)*Math.PI*.5*ease);g.translate(-f.x,-f.y);
 renderBeforeDefeated(g,f,scale);g.restore();
};
function clearDefeated(){defeatedFighters.delete(player);defeatedFighters.delete(enemy)}
const resetBeforeDefeated=resetRound;
resetRound=function(){clearDefeated();resetBeforeDefeated();clearDefeated()};
const titleBeforeDefeated=showTitleScreen;
showTitleScreen=function(){clearDefeated();titleBeforeDefeated()};
const selectBeforeDefeated=openCharacterSelection;
openCharacterSelection=function(){clearDefeated();selectBeforeDefeated()};
const drawFighterBeforeDefeated=drawFighter;
drawFighter=function(f){
 const d=defeatedFighters.get(f);
 if(!d||roundImpact){drawFighterBeforeDefeated(f);return}
 const p=Math.min(1,d.age/d.life);
 ctx.save();ctx.globalAlpha=1;ctx.fillStyle='#0006';ctx.beginPath();
 ctx.ellipse(f.x+(f.face||1)*65*p,f.y+3,39+65*p,7,0,0,Math.PI*2);ctx.fill();
 renderStreetFighter(ctx,f);ctx.restore();
};
