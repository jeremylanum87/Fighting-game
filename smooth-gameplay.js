'use strict';
// Input smoothing is measured in simulation seconds; attack frames and hitstop stay intact.
let smoothMotionStates=new WeakMap();
function smoothMotion(f){if(!smoothMotionStates.has(f))smoothMotionStates.set(f,{velocity:0,phase:0,blend:0,turning:false});return smoothMotionStates.get(f)}
function approachMotion(value,target,step){return value<target?Math.min(target,value+step):Math.max(target,value-step)}
function advanceSmoothMotion(f,dt){
 const s=smoothMotion(f),defense=defenseFor(f),locked=f.hp<=0||f.stun>0||f.blockstun>0||f.attack||f.block||f.crouch||f.knockedDown||defense.lock>0||airState(f).escape>0;
 if(locked){f.vx=0;s.velocity=0;s.turning=false;s.blend=approachMotion(s.blend,0,dt*16);return}
 if(gameMode==='training'&&f===enemy&&$('#dummyBehavior').value!=='cpu'){s.velocity=0;s.blend=0;f.vx=0;return}
 const airborne=f.y<ground;
 let target=f.vx;
 if(f===player){const h=(keys.has('d')?1:0)-(keys.has('a')?1:0),speed=h===f.face?260:205;
 target=h*speed*(airborne?Math.min(.98,Math.max(.5,(f.airControl||.55)+.2)):1)}
 if(s.velocity*target<0)s.turning=true;if(!target||s.velocity===target)s.turning=false;
 const reversing=s.turning,rate=airborne?(reversing?2600:target?1900:1100):(reversing?4200:target?2600:3400);
 s.velocity=approachMotion(s.velocity,target,rate*dt);if(Math.abs(s.velocity)<.5&&target===0)s.velocity=0;
 f.vx=s.velocity;
 const walk=f.y===ground&&Math.abs(s.velocity)>3;s.blend=approachMotion(s.blend,walk?1:0,dt*(walk?12:15));
 if(walk)s.phase+=Math.abs(s.velocity)*dt*.055;
}
const stepBeforeSmoothGameplay=stepFighter;
stepFighter=function(f,t,dt){if(mode==='playing'&&gameMode!=='showcase')advanceSmoothMotion(f,dt);stepBeforeSmoothGameplay(f,t,dt)};
const movementPoseBeforeSmoothGameplay=movementPose;
movementPose=function(f){const pose=movementPoseBeforeSmoothGameplay(f);if(pose)return pose;
 if((f!==player&&f!==enemy)||!['playing','paused'].includes(mode)||f.y!==ground||f.hp<=0||f.attack||f.stun||f.blockstun||f.block||f.crouch||f.knockedDown||f.celebrating||f.tauntTime>0||fightOpening||superCinema||roundVictory||roundImpact||cinematicFinisher||lastBar||defeatedFighters.has(f)||defenseFor(f).lock>0||throwSequences.some(e=>e.a===f||e.t===f))return null;
 const s=smoothMotion(f);return s.blend>0?{kind:'walk-link',s}:null;
};
const paintMovementBeforeSmoothGameplay=paintMovement;
paintMovement=function(g,f,scale,pose){if(pose.kind!=='walk-link')return paintMovementBeforeSmoothGameplay(g,f,scale,pose);
 let image=f.isBoss?motionArt.promoter:arcadeSprites[f.character];if(!image?.complete||image.naturalWidth<1280)return false;
 if(!f.isBoss&&f===player)image=recolorOutfit(image,f.character,chosenOutfit(f.character));image=battleDamageAtlas(image,f);
 const b=BODY_STYLES[f.character],size=scale*ARENA_FIGHTER_SCALE*.7*b.height,s=pose.s,amount=s.blend*(reducedMotionPreference()?.4:1),stride=Math.sin(s.phase)*amount,forward=s.velocity*(f.face||1)>=0?1:-1;
 g.save();g.translate(f.x,f.y);g.scale((f.face||1)*.78*Math.sqrt(b.width),1);g.imageSmoothingEnabled=false;
 // Crisp atlas pixels with articulated legs supply the connecting poses, without alpha blending.
 for(let side=0;side<2;side++){const sign=side?1:-1,hip=sign*11*size;g.save();g.translate(hip,-43*size);g.rotate(stride*sign*.11*forward);g.translate(stride*sign*2*size,-Math.max(0,stride*sign)*2*size);g.drawImage(image,side*80,100,80,60,(-80+side*80)*size-hip,-size,80*size,60*size);g.restore()}
 const bob=Math.cos(s.phase*2)*amount*1.1;g.translate(forward*amount*1.5,-bob);g.drawImage(image,0,0,160,104,-80*size,-144*size,160*size,104*size);g.restore();return true;
};
function clearSmoothGameplay(){smoothMotionStates=new WeakMap()}
const resetBeforeSmoothGameplay=resetRound;resetRound=function(){resetBeforeSmoothGameplay();clearSmoothGameplay()};
const clearBeforeSmoothGameplay=clearInput;clearInput=function(){clearBeforeSmoothGameplay();clearSmoothGameplay()};
const titleBeforeSmoothGameplay=showTitleScreen;showTitleScreen=function(){clearSmoothGameplay();titleBeforeSmoothGameplay()};
