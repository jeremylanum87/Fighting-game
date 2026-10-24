'use strict';
// Visual-only articulation: no changes to jump physics, guard rules or collision boxes.
let movementVisuals=new WeakMap();
const MOVEMENT_FLAVOR={volt:[.9,.85],ember:[.75,1],cipher:[.8,.7],brick:[.65,1.25],jade:[1.3,.8],rook:[.7,1.15],haze:[1.2,.75],goldie:[1.05,.9]};
function movementVisual(f){if(!movementVisuals.has(f))movementVisuals.set(f,{airAge:0,land:0,guard:0,recoil:0,perfect:false,clock:0});return movementVisuals.get(f)}
function movementPose(f){
 if(f!==player&&f!==enemy||f.hp<=0||f.stun>0||f.attack||f.knockedDown||f.celebrating||f.tauntTime>0||defeatedFighters.has(f)||throwSequences.some(e=>e.a===f||e.t===f)||superCinema||fightOpening||roundVictory||roundImpact||cinematicFinisher||lastBar)return null;
 if(!['playing','paused'].includes(mode))return null;
 const s=movementVisual(f);
 if(f.y<ground)return {kind:f.vy< -100?'rise':f.vy>100?'fall':'apex',s};
 if(f.block||f.blockstun>0)return {kind:f.crouch?'low-guard':'guard',s};
 if(s.land>0)return {kind:'land',s};return null;
}
const stepBeforeMovementPolish=stepFighter;
stepFighter=function(f,other,dt){const y=f.y;stepBeforeMovementPolish(f,other,dt);if(mode!=='playing')return;const s=movementVisual(f);s.clock+=dt;s.land=Math.max(0,s.land-dt);s.recoil=Math.max(0,s.recoil-dt*5);s.guard=Math.max(0,Math.min(1,s.guard+(f.block||f.blockstun>0?dt*12:-dt*14)));
 if(f.y<ground){s.airAge=y===ground?0:s.airAge+dt;s.land=0}else if(y<ground){s.land=.2;s.airAge=0}
};
const hitBeforeMovementPolish=applyCombatHit;
applyCombatHit=function(a,t,m,d){const guarding=t.block&&t.y===ground&&!m.grab,ok=hitBeforeMovementPolish(a,t,m,d);if(ok&&guarding&&t.blockstun>0&&t.hp>0){const s=movementVisual(t);s.recoil=1;s.guard=1;s.perfect=guardTiming.get(t)?.age<=.12}return ok};
function paintMovement(g,f,scale,pose){
 let image=f.isBoss?motionArt.promoter:arcadeSprites[f.character];if(!image?.complete||image.naturalWidth<1280)return false;
 if(!f.isBoss&&(f===player||f.character===chosenCharacter&&f!==enemy))image=recolorOutfit(image,f.character,chosenOutfit(f.character));image=battleDamageAtlas(image,f);
 const b=BODY_STYLES[f.character],size=scale*ARENA_FIGHTER_SCALE*.7*b.height,flavor=MOVEMENT_FLAVOR[f.character]||[1,1],s=pose.s,air=['rise','apex','fall'].includes(pose.kind),low=pose.kind==='low-guard',land=pose.kind==='land',quiet=reducedMotionPreference(),amount=quiet?.35:1;
 const landing=land?Math.sin(Math.min(1,s.land/.2)*Math.PI/2):0,entry=Math.min(1,s.airAge/.14),apex=Math.max(0,1-Math.abs(f.vy)/230),recoil=s.recoil*s.recoil;
 const col=air?5:low?2:1,squash=air?1+.035*(1-apex)*amount:1-(landing*.15+(low?.17:0))*amount;
 const lean=air?(Math.max(-1,Math.min(1,f.vy/450))*.14)*flavor[0]*amount:(.035*s.guard-.12*recoil*flavor[1])*amount;
 g.save();g.translate(f.x-(air?0:f.face*recoil*7*amount),f.y);g.scale((f.face||1)*.78*Math.sqrt(b.width),squash);
 if(f.hitFlash>0){g.shadowColor=f.blockstun>0?'#79f3ff':'#ffe1a0';g.shadowBlur=strongEffects?16:4}
 g.imageSmoothingEnabled=false;
 // Articulate the legs independently at the hips; overlap the waist seam by 3 pixels.
 const legAngles=air?[(.1+apex*.3)*flavor[0]*amount,-(.08+apex*.24)*flavor[0]*amount]:[landing*.05*amount,-landing*.05*amount];
 for(let side=0;side<2;side++){g.save();const hip=(side?10:-10)*size;g.translate(hip,-43*size);g.rotate(legAngles[side]);g.drawImage(image,col*160+side*80,100,80,60,(-80+side*80)*size-hip,-1*size,80*size,60*size);g.restore()}
 g.save();g.translate(0,-43*size);g.rotate(lean);g.translate(0,43*size);const stretch=air?(1-entry)*.035*amount:Math.sin(s.clock*3)*.006*amount;g.scale(1-stretch,1+stretch);if(!air&&!land){
 g.drawImage(image,col*160,0,160,62,-80*size,-144*size,160*size,62*size);
 g.drawImage(image,col*160,62,96,42,-80*size,-82*size,96*size,42*size);
 g.save();g.translate(15*size,-60*size);g.rotate((-.3*s.guard+recoil*.12)*amount);g.drawImage(image,col*160+90,62,70,42,-5*size,-22*size,70*size,42*size);g.restore();
 }else g.drawImage(image,col*160,0,160,104,-80*size,-144*size,160*size,104*size);g.restore();g.restore();
 if(!air&&!land&&(s.recoil>0||s.guard<1)){
 // A compact front-facing guard arc follows the hands, rather than covering the body.
 g.save();g.translate(f.x,f.y);g.scale(f.face||1,1);g.globalAlpha=Math.min(.85,s.recoil*.8+s.guard*.12);g.strokeStyle=s.perfect?'#fff3a1':'#8beaff';g.lineWidth=s.perfect?4:3;g.beginPath();g.ellipse(57,low?-105:-165,17+recoil*12,low?33:49,-.12,-1.15,1.15);g.stroke();if(strongEffects&&!quiet&&s.recoil>.35){for(let i=0;i<3;i++){g.beginPath();g.moveTo(76+i*8,-185+i*19);g.lineTo(90+i*8+recoil*10,-185+i*19);g.stroke()}}g.restore();
 }
 return true;
}
const renderBeforeMovementPolish=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){const p=g===ctx?movementPose(f):null;if(p&&paintMovement(g,f,scale,p))return;renderBeforeMovementPolish(g,f,scale)};
const drawFighterBeforeMovementPolish=drawFighter;
drawFighter=function(f){const p=movementPose(f);if(!p)return drawFighterBeforeMovementPolish(f);ctx.save();const elevation=Math.max(0,ground-f.y),radius=Math.max(19,39-elevation*.07);ctx.fillStyle=typeof drawingGroundedFighter!=='undefined'&&drawingGroundedFighter?'#0000':`rgba(0,0,0,${Math.max(.13,.38-elevation*.001)})`;ctx.beginPath();ctx.ellipse(f.x,ground+2,radius,Math.max(4,8-elevation*.016),0,0,Math.PI*2);ctx.fill();renderStreetFighter(ctx,f);ctx.restore()};
const resetBeforeMovementPolish=resetRound;resetRound=function(){resetBeforeMovementPolish();movementVisuals=new WeakMap()};
const titleBeforeMovementPolish=showTitleScreen;showTitleScreen=function(){titleBeforeMovementPolish();movementVisuals=new WeakMap()};
