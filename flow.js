'use strict';
// Keep original frame data intact; run combat 8% faster using fixed simulation steps.
const FIGHT_PACE=1.08;
let flowAccumulator=0;
const flowState=new WeakMap();
function trackFlow(f){let s=flowState.get(f);if(!s){s={x:f.x,y:f.y,landing:0};flowState.set(f,s)}return s}
const updateBeforeFlow=update;update=function(dt){
 if(mode!=='playing'||superCinema){flowAccumulator=0;updateBeforeFlow(dt);return}
 flowAccumulator+=Math.min(dt,.1)*FIGHT_PACE;
 while(flowAccumulator+1e-9>=STEP){
 for(const f of [player,enemy]){const s=trackFlow(f);s.x=f.x;s.y=f.y;s.landing=Math.max(0,s.landing-STEP)}
 const before=remaining,oldPlayer=player,oldEnemy=enemy;
 updateBeforeFlow(STEP);
 // Preserve the existing timer's real-time pace, including its hitstop behavior.
 if(player===oldPlayer&&enemy===oldEnemy&&remaining<before&&remaining>0){remaining=Math.min(60,remaining+(before-remaining)*(1-1/FIGHT_PACE));updateHud()}
 for(const f of [player,enemy]){const s=trackFlow(f);if(s.y<ground&&f.y===ground)s.landing=.14}
 flowAccumulator=Math.max(0,flowAccumulator-STEP);
 if(mode!=='playing'||superCinema){flowAccumulator=0;break}
 }
};
const animateBeforeFlow=animateFighter;animateFighter=function(f,dt){if(superCinema&&mode==='playing')return;animateBeforeFlow(f,dt*(mode==='playing'?FIGHT_PACE:1))};
const resetBeforeFlow=resetRound;resetRound=function(){flowAccumulator=0;resetBeforeFlow();trackFlow(player);trackFlow(enemy)};
function flowPose(f){
 if(f.attack||f.hp<=0||f.stun>0||f.knockedDown||f.block||f.crouch||f.celebrating||f.tauntTime>0||mode==='countdown')return null;
 const s=flowState.get(f);if(s?.landing>0&&f.y===ground)return {kind:'land',p:1-s.landing/.14};
 if(f.y<ground)return {kind:'air',p:Math.max(0,Math.min(1,(f.vy+700)/1400))};
 return {kind:Math.abs(f.vx)>0?'walk':'idle',p:f.animTime||0};
}
function drawFlowPose(g,f,scale,pose){
 const image=arcadeSprites[f.character];if(!image?.complete||image.naturalWidth<1280)return false;
 const b=BODY_STYLES[f.character],size=scale*.7*b.height;g.save();g.translate(f.x,f.y);g.scale((f.face||1)*.78*Math.sqrt(b.width),1);g.imageSmoothingEnabled=false;
 if(strongEffects&&f.hitFlash>0)g.filter='brightness(1.8)';
 if(pose.kind==='walk'){
 const phase=pose.p*(f.character==='haze'?15:12),wave=Math.sin(phase),bob=Math.cos(phase*2)*1.2;
 g.translate(0,-bob);g.transform(1,0,f.vx*(f.face||1)>0?.025:-.025,1,0,0);
 g.drawImage(image,0,0,160,103,-80*size,-144*size,160*size,103*size);
 g.drawImage(image,0,103,80,57,(-80+wave*6)*size,-41*size,80*size,57*size);
 g.drawImage(image,80,103,80,57,-wave*6*size,-41*size,80*size,57*size);
 }else{
 let col=0,squash=1,tilt=0;
 if(pose.kind==='idle')squash=1+Math.sin(pose.p*3.5)*.012;
 if(pose.kind==='air'){col=5;squash=1+Math.sin(pose.p*Math.PI)*.035;tilt=(pose.p-.5)*.08}
 if(pose.kind==='land'){col=2;squash=1-Math.sin((1-pose.p)*Math.PI/2)*.12}
 g.scale(1+(1-squash)*.3,squash);g.rotate(tilt);g.drawImage(image,col*160,0,160,160,-80*size,-144*size,160*size,160*size);
 }
 g.restore();return true;
}
const renderBeforeFlow=renderStreetFighter;renderStreetFighter=function(g,f,scale=2.1){
 const s=flowState.get(f),inMatch=f===player||f===enemy;
 const canInterpolate=inMatch&&s&&mode==='playing'&&!superCinema&&!hitstop;
 // Large hit/throw corrections stay immediate rather than sliding through the opponent.
 const alpha=Math.min(1,(flowAccumulator+simulationAccumulator*FIGHT_PACE)/STEP);
 const dx=canInterpolate&&Math.abs(f.x-s.x)<24?(s.x-f.x)*(1-alpha):0;
 const dy=canInterpolate&&Math.abs(f.y-s.y)<30?(s.y-f.y)*(1-alpha):0;
 g.save();g.translate(dx,dy);
 const pose=flowPose(f);if(pose&&drawFlowPose(g,f,scale,pose)){g.restore();return}
 const a=f.attack;
 if(a&&f.hp>0&&!superCinema){const m=a.move,progress=attackProgress(a);let lean=0,stretch=1;
 if(progress.phase==='charge'){lean=-Math.sin(progress.p*Math.PI/2)*2;stretch=1-progress.p*.018}
 else if(progress.phase==='strike'){lean=Math.sin(progress.p*Math.PI)*3;stretch=1+Math.sin(progress.p*Math.PI)*.022}
 else lean=(1-progress.p)*2;
 g.translate(f.x,f.y);g.scale(1,stretch);g.translate(-f.x,-f.y);g.translate(lean*f.face,0);
 }
 renderBeforeFlow(g,f,scale);g.restore();
};
