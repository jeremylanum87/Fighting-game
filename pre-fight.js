'use strict';
const PRE_FIGHT_POSES={
 volt:'GLOVE CHECK / SALUTE',
 ember:'SHOULDER ROLL',
 cipher:'READ THE OPPONENT',
 brick:'POWER FLEX',
 jade:'GINGA STEP',
 rook:'RESPECTFUL BOW',
 haze:'QUICK FOOT SHUFFLE',
 goldie:'CAP TIP / CROWD SALUTE'
};
const poseBeforePreFight=detailedArtPose;
detailedArtPose=function(f){
 const pose=poseBeforePreFight(f);
 if(mode!=='countdown'||fightOpening?.phase!=='stage'||(f!==player&&f!==enemy)||f.hp<=0)return pose;
 const time=fightOpening.time,settle=time>1.25,p=Math.min(1,time/1.25),wave=strongEffects?Math.sin(p*Math.PI*2):0;
 pose.image=f.isBoss?motionArt.promoter:arcadeSprites[f.character];pose.kind='pre-fight';
 pose.x=f.x;pose.y=f.y;pose.angle=0;pose.sx=pose.sy=1;pose.col=settle?1:ART_VICTORIES[f.character]?.frame||0;
 if(settle)return pose;
 if(f.character==='volt'){pose.col=time<.45?3:6;pose.y-=Math.abs(wave)*4}
 if(f.character==='ember'){pose.col=4;pose.angle=wave*.04;pose.sy+=Math.abs(wave)*.02}
 if(f.character==='cipher'){pose.col=3;pose.angle=strongEffects?-.035*Math.sin(p*Math.PI):0}
 if(f.character==='brick'){pose.col=6;pose.sx+=Math.abs(wave)*.035;pose.y-=Math.abs(wave)*3}
 if(f.character==='jade'){pose.col=6;pose.x+=wave*7;pose.angle=wave*.1;pose.y-=Math.abs(wave)*4}
 if(f.character==='rook'){pose.col=4;pose.angle=strongEffects?Math.sin(p*Math.PI)*.15:0}
 if(f.character==='haze'){pose.image=motionArt.haze;pose.col=time<.42?1:time<.84?2:3;pose.x+=wave*8;pose.y-=Math.abs(wave)*3}
 if(f.character==='goldie'){pose.col=time<.5?0:6;pose.angle=wave*.035}
 return pose;
};
const phaseBeforePreFight=openingPhase;
openingPhase=function(phase){
 phaseBeforePreFight(phase);
 if(phase==='stage'){
 fightOpening.stageDuration=1.65;
 $('#roundOpeningSub').textContent=(PRE_FIGHT_POSES[player.character]||'READY')+' / '+(enemy.isBoss?'THE MAIN EVENT':PRE_FIGHT_POSES[enemy.character]||'READY');
 }
};
