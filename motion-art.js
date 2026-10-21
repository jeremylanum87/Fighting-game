'use strict';
// Dedicated original sprite poses: idle, two strides, light/heavy windups, strikes and recovery.
const motionArt={};for(const id of [...Object.keys(fighterRoster),'promoter']){const img=new Image();img.src=`assets/arcade-motion/${id}.png`;motionArt[id]=img}
const promoterPortrait=new Image();promoterPortrait.src='assets/arcade-motion/promoter-portrait.png';
function directorMotionFrame(f){
 const a=f.attack;if(a){if(!f.isBoss&&!['punch','kick'].includes(a.type))return null;const phase=attackProgress(a),heavy=a.type!=='punch';if(phase.phase==='charge')return phase.p<.2?0:heavy?5:3;if(phase.phase==='strike')return heavy?6:4;return phase.p<.75?7:0}
 if(f.hp<=0||f.stun>0||f.block||f.crouch||f.y<ground||f.celebrating||f.tauntTime>0)return f.isBoss?(f.hp<=0||f.stun>0||f.crouch?7:f.y<ground?5:0):null;
 return Math.abs(f.vx)>0?[1,0,2,0][Math.floor((f.animTime||0)*(f.character==='haze'?14:10))%4]:0;
}
const bodyBeforeMotionArt=renderStreetFighter;renderStreetFighter=function(g,f,scale=2.1){const id=f.isBoss?'promoter':f.character,image=motionArt[id],col=directorMotionFrame(f);if(col===null||!image?.complete||image.naturalWidth<1280){bodyBeforeMotionArt(g,f,scale);return}
 const b=BODY_STYLES[f.character],size=scale*(g===ctx?ARENA_FIGHTER_SCALE:1)*.7*b.height,s=flowState.get(f);let dx=0,dy=0;if(s&&mode==='playing'&&!superCinema&&!hitstop){const alpha=Math.min(1,(flowAccumulator+simulationAccumulator*FIGHT_PACE)/STEP);if(Math.abs(f.x-s.x)<24)dx=(s.x-f.x)*(1-alpha);if(Math.abs(f.y-s.y)<30)dy=(s.y-f.y)*(1-alpha)}
 g.save();g.translate(f.x+dx,f.y+dy);g.scale((f.face||1)*.78*Math.sqrt(b.width),1);g.imageSmoothingEnabled=false;
 if(f.hitFlash>0&&strongEffects)g.filter='brightness(1.8)';
 if(f.hp<=0){g.translate(0,-28);g.rotate(-Math.min(1,(f.animTime||0)*2)*Math.PI/3)}else if(f.crouch)g.scale(1,.78);else if(f.stun>0)g.rotate(-.06);else if(!f.attack&&f.y===ground){const walk=Math.abs(f.vx)>0;g.translate(0,-Math.abs(Math.sin((f.animTime||0)*(walk?10:3)))*(walk?2:1));g.scale(1,1+Math.sin((f.animTime||0)*3)*.006)}
 if(f.attack){const phase=attackProgress(f.attack);g.translate((phase.phase==='charge'?-2*phase.p:phase.phase==='strike'?Math.sin(phase.p*Math.PI)*3:(1-phase.p)*2),0)}
 g.drawImage(image,col*160,0,160,160,-80*size,-144*size,160*size,160*size);g.restore();
};
const portraitsBeforeMotion=updateArcadePortraits;updateArcadePortraits=function(){portraitsBeforeMotion();if(!enemy.isBoss||!promoterPortrait.complete||!promoterPortrait.naturalWidth)return;const c=$('#portraitEnemy'),g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.fillStyle='#302818';g.fillRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;g.drawImage(promoterPortrait,0,0,c.width,c.height)};
const openingBeforeBossArt=startFightOpening;startFightOpening=function(versus=true){openingBeforeBossArt(versus);if(versus&&enemy.isBoss){$('#openingEnemyPortrait').src='assets/arcade-motion/promoter-portrait.png';$('#openingEnemyArt').style.setProperty('--opening-color','#e7c675')}};
const drawBeforeBossCinematic=draw;draw=function(){drawBeforeBossCinematic();if(!superCinema?.fighter.isBoss)return;ctx.save();ctx.fillStyle='#102019';ctx.fillRect(160,205,780,85);ctx.font='italic 900 54px Impact,sans-serif';ctx.textAlign='center';ctx.fillStyle='#e7c675';ctx.fillText('FINAL CONTRACT',550,267);ctx.restore()};
