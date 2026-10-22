'use strict';
// All game states share the original detailed atlases, baseline and body proportions.
const ART_SIGNATURE_POSES={volt:[3,5,4],ember:[3,4,7],cipher:[3,4,7],brick:[5,6,7],jade:[3,6,7],rook:[5,4,7],haze:[3,4,7],goldie:[3,6,7]};
const ART_VICTORIES={volt:{frame:6,kind:'salute'},ember:{frame:4,kind:'shoulders'},cipher:{frame:4,kind:'composed'},brick:{frame:6,kind:'power'},jade:{frame:6,kind:'dance'},rook:{frame:4,kind:'bow'},haze:{frame:3,kind:'shuffle'},goldie:{frame:0,kind:'swagger'}};
function detailedArtPose(f){
 const motion=motionArt[f.isBoss?'promoter':f.character],base=f.isBoss?motion:arcadeSprites[f.character],time=f.animTime||0;
 let image=motion,col=0,dx=0,dy=0,angle=0,sx=1,sy=1;
 const victim=throwSequences.find(e=>e.t===f),actor=throwSequences.find(e=>e.a===f);
 if(victim){const p=throwSequencePose(victim);return {image:base,col:7,x:p.x,y:p.y,angle:p.angle,sx:1,sy:1,kind:'throw-victim'}}
 const a=f.attack;
 if(actor&&a?.type==='throw'){
 const p=throwSequencePose(actor),phase=p.phase;col=phase==='charge'?3:phase==='strike'?5:7;
 const style=CHARACTER_THROWS[f.character].pose;angle=(style==='suplex'?-.18:style==='sweep'?.1:style==='spin'?.13:0)*Math.sin(p.p*Math.PI);dy=phase==='strike'?-Math.sin(p.p*Math.PI)*4:0;
 return {image:motion,col,x:f.x,y:f.y+dy,angle,sx,sy,kind:'throw'};
 }
 if(f.celebrating&&f.hp>0&&!f.isBoss){const v=ART_VICTORIES[f.character],age=victoryAges.get(f)||0,settle=Math.min(1,age/.35),wave=Math.sin(age*4);image=base;col=age<.14?0:v.frame;
 if(v.kind==='salute')dy=-Math.sin(Math.min(1,age/.5)*Math.PI)*5;
 if(v.kind==='shoulders'){sy=1+wave*.012;angle=wave*.012}
 if(v.kind==='composed'){angle=-.025*settle;dy=-Math.sin(age*2)*1.2}
 if(v.kind==='power'){sx=1+Math.abs(wave)*.025;dy=-Math.abs(wave)*2}
 if(v.kind==='dance'){angle=strongEffects?wave*.14:wave*.025;dy=-Math.abs(wave)*4}
 if(v.kind==='bow'){angle=Math.sin(Math.min(1,age/1.1)*Math.PI)*.16;sy=1-Math.sin(Math.min(1,age/1.1)*Math.PI)*.06}
 if(v.kind==='shuffle'){dx=wave*5;dy=-Math.abs(wave)*3;angle=wave*.025}
 if(v.kind==='swagger'){dx=wave*3;angle=wave*.04;sy=1+wave*.012}
 sy*=1+Math.sin(age*2.5)*.004;return {image,col,x:f.x+dx,y:f.y+dy,angle,sx,sy,kind:'victory'};
 }
 if(f.hp<=0||f.stun>0){
 image=base;col=7;const r=reactions.get(f);
 // Visual displacement only: combat position, hurtboxes and stun stay unchanged.
 if(r&&!f.knockedDown&&f.hp>0){
 const p=Math.min(1,r.age/r.life),kick=Math.pow(1-p,2),heavy=r.kind==='heavy',amount=strongEffects?1:.35;
 dx=r.dir*(heavy?16:9)*kick*amount;
 angle=r.dir*(f.face||1)*(heavy?.22:.13)*kick*amount;
 sx=1-(heavy?.12:.07)*kick*amount;sy=1+(heavy?.06:.035)*kick*amount;
 }
 return {image,col,x:f.x+dx,y:f.y,angle,sx,sy,kind:'hurt'};
 }
 if(a){const m=a.move||getMove(f,a.type),phase=attackProgress(a),p=Math.max(0,Math.min(1,phase.p));
 if(a.type==='throw'){col=phase.phase==='charge'?3:phase.phase==='strike'?5:7}
 else if(a.type==='signature'){const frames=ART_SIGNATURE_POSES[f.character];col=frames[phase.phase==='charge'?0:phase.phase==='strike'?1:2]}
 else if(['punch','kick'].includes(a.type)||f.isBoss){const heavy=a.type!=='punch';col=phase.phase==='charge'?(p<.18?0:heavy?5:3):phase.phase==='strike'?(heavy?6:4):p<.72?7:0}
 else {image=base;col=m.counter?1:m.dodge?2:m.rotate?6:m.projectile?3:a.type==='uppercut'?5:4;if(phase.phase==='charge')col=p<.25?0:2;if(phase.phase==='recover'&&p>.65)col=0;if(m.rotate&&phase.phase==='strike'&&strongEffects)angle=Math.sin(p*Math.PI*2)*.15}
 const energy=Math.sin(p*Math.PI);dx=phase.phase==='charge'?-3*p:phase.phase==='strike'?5*energy:3*(1-p);sy=phase.phase==='charge'?1-.02*energy:1;angle+=(phase.phase==='charge'?-.015:phase.phase==='strike'?.025:.015*(1-p));
 return {image,col,x:f.x+dx*f.face,y:f.y,angle:angle*f.face,sx,sy,kind:a.type};
 }
 if(f.block||f.crouch){image=base;col=f.crouch?2:1;sy=f.crouch?.85:1;return {image,col,x:f.x,y:f.y,angle,sx,sy,kind:'guard'}}
 if(f.y<ground){image=base;col=5;angle=f.vy<0?-.025:.025;return {image,col,x:f.x,y:f.y,angle,sx,sy,kind:'air'}}
 if(f.tauntTime>0||(mode==='countdown'&&fightOpening?.phase==='stage')){image=base;col=ART_VICTORIES[f.character]?.frame||0;dy=-Math.abs(Math.sin(personalityClock*3))*2;return {image,col,x:f.x,y:f.y+dy,angle,sx,sy,kind:'entrance'}}
 const walk=Math.abs(f.vx)>0;col=walk?[1,0,2,0][Math.floor(time*(f.character==='haze'?14:10))%4]:0;dy=-Math.abs(Math.sin(time*(walk?10:3)))*(walk?2:1);sy=1+Math.sin(time*3)*.006;
 return {image,col,x:f.x,y:f.y+dy,angle,sx,sy,kind:walk?'walk':'idle'};
}
const renderBeforeUnifiedArt=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){if(!fighterRoster[f.character])return;const pose=detailedArtPose(f);let image=pose.image;if(!image?.complete||image.naturalWidth<1280){renderBeforeUnifiedArt(g,f,scale);return}
 const own=!f.isBoss&&(f===player||f!==enemy&&f.character===chosenCharacter||g!==ctx&&f.character===pendingCharacter);if(own)image=recolorOutfit(image,f.character,chosenOutfit(f.character));
 const b=BODY_STYLES[f.character],size=scale*(g===ctx?ARENA_FIGHTER_SCALE:1)*.7*b.height;let x=pose.x,y=pose.y;const history=flowState.get(f);
 if(history&&mode==='playing'&&!superCinema&&!hitstop&&!['throw','throw-victim'].includes(pose.kind)){const alpha=Math.min(1,(flowAccumulator+simulationAccumulator*FIGHT_PACE)/STEP);if(Math.abs(f.x-history.x)<24)x+=(history.x-f.x)*(1-alpha);if(Math.abs(f.y-history.y)<30)y+=(history.y-f.y)*(1-alpha)}
 g.save();g.translate(x,y);g.scale((f.face||1)*.78*Math.sqrt(b.width)*pose.sx,pose.sy);if(pose.angle){g.translate(0,-50*size);g.rotate(pose.angle);g.translate(0,50*size)}g.imageSmoothingEnabled=false;if(f.hitFlash>0){
 const guard=f.blockstun>0,flash=Math.min(1,f.hitFlash/.09);
 // A colored silhouette edge identifies the victim without flashing the screen.
 g.shadowColor=guard?'#65eaff':'#ff684f';g.shadowBlur=strongEffects?12:4;
 if(strongEffects)g.filter='brightness('+(1+flash*.85)+') saturate(1.35)';
 }g.drawImage(image,pose.col*160,0,160,160,-80*size,-144*size,160*size,160*size);g.restore();
 if(g===ctx)drawVictimImpact(g,f);
};


// Small, deterministic marks follow the victim; no extra gameplay RNG or timers.
function drawVictimImpact(g,f){
 const r=reactions.get(f),guard=f.blockstun>0,flash=f.hitFlash||0;
 if(f.celebrating||(!flash&&(!r||guard))||throwSequences.some(e=>e.t===f))return;
 const life=guard?.16:r?.kind==='heavy'?.26:.19;
 const age=guard?Math.max(0,.07-flash):r?.age||0;
 if(age>=life)return;
 const p=Math.max(0,age/life),heavy=r?.kind==='heavy'||r?.kind==='down';
 const x=f.x-(r?.dir||-f.face)*15,y=f.y-(f.crouch?65:105);
 g.save();g.translate(x,y);g.globalAlpha=(1-p)*(strongEffects?.95:.7);
 g.strokeStyle=guard?'#72edff':'#ffe59a';g.lineWidth=guard?3:heavy?4:3;
 g.lineCap='round';
 if(guard){
 // Shield arc sits in front of the defender, facing the incoming attack.
 g.scale(f.face||1,1);g.beginPath();
 g.arc(0,0,22+(strongEffects?p*13:0),-.95,.95);g.stroke();
 g.strokeStyle='#d9fbff';g.lineWidth=2;g.beginPath();g.moveTo(12,-8);g.lineTo(18,0);g.lineTo(12,8);g.stroke();
 }else{
 const count=strongEffects?(heavy?8:6):4,spread=strongEffects?p*(heavy?25:16):0;
 for(let i=0;i<count;i++){
 const a=i*Math.PI*2/count+.22,inside=5+spread,outside=inside+(heavy?17:11)*(1-p*.5);
 g.beginPath();g.moveTo(Math.cos(a)*inside,Math.sin(a)*inside);
 g.lineTo(Math.cos(a)*outside,Math.sin(a)*outside);g.stroke();
 }
 if(heavy&&strongEffects){g.strokeStyle='#ff7955';g.lineWidth=2;g.beginPath();g.ellipse(0,0,15+p*29,9+p*18,-.35,0,Math.PI*2);g.stroke()}
 }
 g.restore();
}
