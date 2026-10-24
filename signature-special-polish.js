'use strict';
// Distinct vector motifs and phased atlas poses; combat data and gameplay RNG are untouched.
const SPECIAL_IDENTITIES={
 volt:{motif:'lightning',colors:['#43ecff','#fff386','#886bff'],frames:[1,5,4]},
 ember:{motif:'flame',colors:['#ff6845','#ffe49b','#ee397c'],frames:[1,4,3]},
 cipher:{motif:'seal',colors:['#be8aff','#a0ffff','#ee71db'],frames:[2,3,4]},
 brick:{motif:'fracture',colors:['#e3a06a','#ffe1a1','#ca6958'],frames:[3,6,6]},
 jade:{motif:'crescent',colors:['#67ffd0','#d8ff7d','#6acfff'],frames:[2,5,6]},
 rook:{motif:'pressure',colors:['#8fdfff','#e4ddff','#7393ed'],frames:[1,5,4]},
 haze:{motif:'velocity',colors:['#ff79df','#9cfaff','#b496ff'],frames:[4,3,5]},
 goldie:{motif:'record',colors:['#ffdb61','#fff5c8','#f7a369'],frames:[4,3,6]}
};
let signatureSpecialBursts=[],specialActivationStates=new WeakMap();
function isSignatureSpecial(f){const a=f.attack;return !!a&&(['fireball','uppercut','spinKick','signature','super'].includes(a.type)||['launcher','rise','meteor'].includes(a.move?.airKind))}
function addSignatureBurst(f,x,y,kind='release',blocked=false){signatureSpecialBursts.push({id:f.character,x,y,face:f.face||1,kind,blocked,age:0,life:kind==='impact'?.52:.38,super:!!f.attack?.move?.isSuper});if(signatureSpecialBursts.length>12)signatureSpecialBursts.shift()}
const stepBeforeSignaturePolish=stepFighter;
stepFighter=function(f,t,dt){stepBeforeSignaturePolish(f,t,dt);if(!isSignatureSpecial(f)||f.hp<=0)return;const a=f.attack,m=a.move;let state=specialActivationStates.get(a);if(!state){state={released:false,lastImpact:-999};specialActivationStates.set(a,state)}if(!state.released&&a.frame>=m.startup){state.released=true;addSignatureBurst(f,f.x+f.face*(m.grab?40:m.projectile?75:45),f.y-(m.height==='low'?35:160))}};
const hitBeforeSignaturePolish=applyCombatHit;
applyCombatHit=function(a,t,m,d){const hp=t.hp,action=a.attack,special=isSignatureSpecial(a),ok=hitBeforeSignaturePolish(a,t,m,d);if(ok&&special&&t.hp<hp){let state=specialActivationStates.get(action);if(!state){state={released:false,lastImpact:-999};specialActivationStates.set(action,state)}if(combatTick-state.lastImpact>=4){state.lastImpact=combatTick;addSignatureBurst(a,t.x-d*12,t.y-(m.height==='low'?30:150),'impact',t.blockstun>0)}}return ok};
const poseBeforeSignaturePolish=detailedArtPose;
detailedArtPose=function(f){const pose=poseBeforeSignaturePolish(f);if(!isSignatureSpecial(f)||f.hp<=0||f.stun>0||f.knockedDown||f.isBoss||['throw-victim','round-victory','defeated'].includes(pose.kind))return pose;
 const a=f.attack,m=a.move,profile=SPECIAL_IDENTITIES[f.character];if(!profile)return pose;const phase=attackProgress(a),p=Math.max(0,Math.min(1,phase.p)),slot=a.type==='super'?(SUPER_MOVES[f.character]?.pose==='uppercut'?1:2):a.type==='signature'?0:a.type==='uppercut'?1:a.type==='spinKick'?2:0,quiet=reducedMotionPreference(),amount=quiet?.3:1;
 if(phase.phase==='charge'){pose.image=motionArt[f.character];pose.col=p<.22?0:m.rotate||m.grab?5:3;pose.x=f.x-f.face*5*p;pose.angle=-.065*p*amount;pose.sx=1-.035*p*amount;pose.sy=1-.045*Math.sin(p*Math.PI/2)*amount}
 else if(phase.phase==='strike'){const e=Math.sin(p*Math.PI);pose.image=arcadeSprites[f.character];pose.col=m.counter?1:m.dodge?2:a.type==='signature'?ART_SIGNATURE_POSES[f.character][1]:profile.frames[slot];pose.x=f.x+f.face*(profile.motif==='velocity'?10:6)*e*amount;pose.y=f.y;pose.sx=1+.035*e*amount;pose.sy=1;
 if(profile.motif==='lightning'){pose.angle=-.13*e*amount;if(a.type==='uppercut'||m.airKind==='rise')pose.y-=9*e*amount}
 if(profile.motif==='flame'){pose.angle=.11*e*amount;pose.sx+=.035*e*amount}
 if(profile.motif==='seal'){pose.angle=.05*e*amount;pose.sy=1-.025*e*amount}
 if(profile.motif==='fracture'){pose.sy=1-.1*e*amount;pose.angle=.075*e*amount}
 if(profile.motif==='crescent'){pose.angle=Math.sin(p*Math.PI*2)*.26*amount;pose.y-=5*e*amount}
 if(profile.motif==='pressure'){pose.angle=.13*e*amount;pose.sy=1-.04*e*amount}
 if(profile.motif==='velocity'){pose.image=motionArt[f.character];pose.col=a.frame%6<3?4:6;pose.angle=.13*e*amount}
 if(profile.motif==='record'){pose.angle=Math.sin(p*Math.PI*2)*.22*amount;pose.sy=1-.055*e*amount}
 }else{pose.image=motionArt[f.character];pose.col=p<.6?7:0;pose.angle=.025*(1-p)*amount;pose.x=f.x+f.face*3*(1-p);pose.sx=pose.sy=1}
 pose.kind='signature-special';return pose;
};
function specialMotif(g,id,x,y,r,phase,face=1,alpha=1,groundY=null){
 const profile=SPECIAL_IDENTITIES[id]||SPECIAL_IDENTITIES.goldie,full=strongEffects&&!reducedMotionPreference(),n=full?3:1,colors=profile.colors;
 g.save();g.translate(x,y);g.scale(face,1);g.globalAlpha*=alpha;g.globalCompositeOperation='lighter';g.lineJoin='round';g.lineCap='round';
 for(let j=0;j<n;j++){g.strokeStyle=colors[j];g.fillStyle=colors[j];g.lineWidth=full?Math.max(2,6-j*1.5):2.5;const radius=r*(1-j*.16),turn=phase*Math.PI*2;
 if(profile.motif==='lightning'){g.beginPath();for(let k=0;k<9;k++){const px=-radius+k*radius/4,py=Math.sin(k*2.2+turn+j)*radius*.25;k?g.lineTo(px,py):g.moveTo(px,py)}g.stroke();if(full){g.beginPath();g.moveTo(0,-radius*.7);g.lineTo(radius*.25,-radius*.1);g.lineTo(0,0);g.lineTo(radius*.4,radius*.55);g.stroke()}}
 else if(profile.motif==='flame'){for(let k=0;k<(full?5:2);k++){const px=(k-2)*radius*.32;g.beginPath();g.moveTo(px-radius*.2,radius*.2);g.bezierCurveTo(px-radius*.35,-radius*.1,px+radius*.2,-radius*(.5+.3*Math.sin(turn+k)),px+radius*.12,-radius*.85);g.bezierCurveTo(px+radius*.6,-radius*.25,px+radius*.4,radius*.35,px-radius*.2,radius*.2);g.stroke()}}
 else if(profile.motif==='seal'){g.save();g.rotate(turn*.3+j*.6);g.beginPath();for(let k=0;k<=6;k++){const a=k*Math.PI/3;k?g.lineTo(Math.cos(a)*radius,Math.sin(a)*radius):g.moveTo(Math.cos(a)*radius,Math.sin(a)*radius)}g.stroke();g.strokeRect(-radius*.45,-radius*.45,radius*.9,radius*.9);if(full){g.save();g.globalAlpha*=.16;g.fillRect(-radius*.35,-radius*.35,radius*.7,radius*.7);g.restore()}g.restore()}
 else if(profile.motif==='fracture'){g.save();if(groundY!==null)g.translate(0,groundY-y);g.beginPath();for(let k=0;k<9;k++){const px=-radius+k*radius/4,py=-Math.abs(Math.sin(k*2.7+j))*(8+radius*.15);k?g.lineTo(px,py):g.moveTo(px,py)}g.stroke();for(let k=0;k<(full?5:2);k++){const px=(k-2)*radius*.35,dy=-Math.sin(phase*Math.PI)*radius*(.25+k%2*.16);g.save();g.translate(px,dy);g.rotate((k-2)*.2);g.strokeRect(-7,-7,14,14);if(full){g.save();g.globalAlpha*=.35;g.fillRect(-7,-7,14,14);g.restore()}g.restore()}g.restore()}
 else if(profile.motif==='crescent'){g.save();g.rotate(turn*.6+j*1.3);g.beginPath();g.ellipse(0,0,radius,radius*.38,.25,.2,Math.PI*1.55);g.stroke();g.beginPath();g.ellipse(radius*.1,0,radius*.8,radius*.28,.25,.4,Math.PI*1.4);g.stroke();g.restore()}
 else if(profile.motif==='pressure'){g.beginPath();g.ellipse(0,0,radius*.65,radius,turn*.15,.1,Math.PI*1.9);g.stroke();for(let k=0;k<2;k++){const side=k?1:-1;g.beginPath();g.moveTo(side*radius,-radius*.4);g.lineTo(side*radius*.65,0);g.lineTo(side*radius,radius*.4);g.stroke()}}
 else if(profile.motif==='velocity'){for(let k=0;k<(full?6:2);k++){const yy=(k-2.5)*radius*.2;g.beginPath();g.moveTo(-radius*(.8+k%3*.25),yy);g.lineTo(radius*.55,yy-radius*.08);g.stroke()}g.beginPath();g.moveTo(radius*.25,-radius*.6);g.lineTo(radius*.8,0);g.lineTo(radius*.25,radius*.6);g.stroke()}
 else {g.save();g.rotate(turn+j*.4);g.beginPath();g.ellipse(0,0,radius,radius*.48,0,0,Math.PI*2);g.stroke();g.beginPath();g.ellipse(0,0,radius*.45,radius*.22,0,0,Math.PI*2);g.stroke();for(let k=0;k<(full?6:3);k++){const a=k*Math.PI/3;g.beginPath();g.moveTo(Math.cos(a)*radius*.5,Math.sin(a)*radius*.24);g.lineTo(Math.cos(a)*radius,Math.sin(a)*radius*.48);g.stroke()}g.restore()}
 }
 g.restore();
}
const renderBeforeSignaturePolish=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){const real=g===ctx&&(f===player||f===enemy),show=real&&isSignatureSpecial(f)&&f.hp>0&&!f.stun&&!superCinema,full=strongEffects&&!reducedMotionPreference();
 if(show){const a=f.attack,m=a.move,phase=attackProgress(a),p=Math.max(0,Math.min(1,phase.p)),active=phase.phase==='strike';specialMotif(g,f.character,f.x,f.y-(m.rotate||m.height==='low'?85:160),phase.phase==='charge'?26+p*40:active?90+(m.isSuper?35:0):55,p,f.face,phase.phase==='recover'?(1-p)*.35:active?.7:.3,ground);
 if(full&&active&&['haze','volt'].includes(f.character)){for(let j=2;j>0;j--){g.save();g.globalAlpha*=.11/j;renderBeforeSignaturePolish(g,{...f,x:f.x-f.face*j*24,hitFlash:0},scale);g.restore()}}}
 renderBeforeSignaturePolish(g,f,scale);
};
const projectileBeforeSignaturePolish=drawSignatureProjectile;
drawSignatureProjectile=function(g,p){projectileBeforeSignaturePolish(g,p);if(!p.move?.signature)return;specialMotif(g,p.owner.character,p.x-p.dir*14,p.y,Math.max(25,p.move.width*1.3),(p.age||0)*2%1,p.dir,strongEffects?.6:.3,p.move.kind==='quake'?ground:null)};
const updateBeforeSignaturePolish=update;
update=function(dt){const advance=['playing','roundover','finished'].includes(mode)&&!document.hidden&&!superCinema&&!(mode==='playing'&&hitstop>0)&&$('#controlSettings').hidden;updateBeforeSignaturePolish(dt);if(!advance||superCinema)return;for(const e of signatureSpecialBursts)e.age+=dt;signatureSpecialBursts=signatureSpecialBursts.filter(e=>e.age<e.life)};
const drawBeforeSignaturePolish=draw;
draw=function(){drawBeforeSignaturePolish();if(!['playing','paused','roundover','finished'].includes(mode)||superCinema)return;ctx.save();ctx.setTransform(canvas.width/1100,0,0,canvas.height/520,0,0);for(const e of signatureSpecialBursts){const p=e.age/e.life;if(e.blocked){ctx.strokeStyle='#a3efff';ctx.globalAlpha=(1-p)*.5;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(e.x,e.y,20+p*25,35+p*20,0,-1.3,1.3);ctx.stroke()}else specialMotif(ctx,e.id,e.x,e.y,(e.kind==='impact'?36:24)+p*(e.super?115:75),p,e.face,(1-p)*.85,ground)}ctx.restore()};
function clearSignaturePolish(){signatureSpecialBursts=[];specialActivationStates=new WeakMap()}
const resetBeforeSignaturePolish=resetRound;resetRound=function(){resetBeforeSignaturePolish();clearSignaturePolish()};
const titleBeforeSignaturePolish=showTitleScreen;showTitleScreen=function(){clearSignaturePolish();titleBeforeSignaturePolish()};
