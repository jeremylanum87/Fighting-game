'use strict';
// Visual identity and reactions never alter BODY_STYLES or collision geometry.
const FIGHTER_PRESENTATION={volt:{sx:1.02,sy:1,lean:.025,bob:1.1},ember:{sx:1.05,sy:.99,lean:-.025,bob:.5},cipher:{sx:.94,sy:1.025,lean:-.035,bob:.35},brick:{sx:1.09,sy:.97,lean:.02,bob:.35},jade:{sx:.97,sy:1.015,lean:.045,bob:1.6},rook:{sx:1.06,sy:.985,lean:-.015,bob:.4},haze:{sx:.94,sy:1.015,lean:.065,bob:1.8},goldie:{sx:1.025,sy:1,lean:-.04,bob:1.2}};
let releaseReactions=new WeakMap();
function releaseReactionKind(m,t){return m.knockdown?'knockdown':m.airKind==='meteor'?'meteor':m.airKind==='launcher'||m.launch< -400?'uppercut':t.y<ground?'aerial':m.damage>=13?'heavy':m.height==='low'?'low':'body'}
const hitBeforeReleaseReactions=applyCombatHit;
applyCombatHit=function(a,t,m,d){const hp=t.hp,kind=releaseReactionKind(m,t),ok=hitBeforeReleaseReactions(a,t,m,d);if(ok&&t.hp<hp&&t.blockstun<=0&&!m.grab){releaseReactions.set(t,{kind,dir:d,age:0,life:['uppercut','aerial'].includes(kind)?.42:kind==='heavy'?.34:.24})}return ok};
const stepBeforeReleaseReactions=stepFighter;
stepFighter=function(f,t,dt){stepBeforeReleaseReactions(f,t,dt);const r=releaseReactions.get(f);if(r){r.age+=dt;if(r.age>=r.life)releaseReactions.delete(f)}};
function stageEntranceOffset(f){
 if(!fightOpening||fightOpening.phase!=='stage'||round!==1||f.hp<=0)return null;
 const p=Math.min(1,fightOpening.time/1.25),e=1-Math.pow(1-p,3),side=f===player?-1:1,t=1-e;
 const kind=selectedStage==='subway'?'train':selectedStage==='rooftop'||selectedStage==='parking'?'climb':selectedStage==='cleveland'?'crowd':'street';
 return {x:side*t*(kind==='train'?180:kind==='crowd'?100:240),y:kind==='climb'?t*160:kind==='crowd'?t*22:0,alpha:Math.min(1,.2+p*2),angle:kind==='climb'?side*t*.2:0};
}
const renderBeforeReleaseCharacters=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){
 const live=g===ctx&&(f===player||f===enemy),p=FIGHTER_PRESENTATION[f.character];
 if(!p||f.isBoss||!live)return renderBeforeReleaseCharacters(g,f,scale);
 g.save();const entrance=stageEntranceOffset(f);if(entrance){g.translate(entrance.x,entrance.y);g.globalAlpha*=entrance.alpha}
 const idle=f.hp>0&&!f.attack&&!f.stun&&!f.knockedDown&&!f.celebrating&&!f.block&&f.y===ground&&!roundVictory&&!cinematicFinisher&&!lastBar&&!fightOpening;
 // A small silhouette adjustment keeps the existing collision silhouette recognizable.
 g.translate(f.x,f.y);g.scale(p.sx,p.sy);if(idle){const amount=reducedMotionPreference()?.25:1;g.rotate(p.lean*amount);g.translate(0,Math.sin((f.animTime||0)*3.5)*p.bob*amount)}
 const r=releaseReactions.get(f);if(r&&f.hp>0&&!f.knockedDown&&!throwSequences.some(e=>e.t===f)&&!roundImpact){const k=Math.pow(1-r.age/r.life,2)*(reducedMotionPreference()?.3:1),local=r.dir*(f.face||1);const angle=r.kind==='uppercut'?-.19:r.kind==='aerial'?.16:r.kind==='heavy'?.2:r.kind==='low'?.1:r.kind==='meteor'?.23:.09;g.rotate(angle*local*k);g.scale(1+(r.kind==='body'?-.07:.035)*k,1-(r.kind==='heavy'?.08:r.kind==='body'?.035:0)*k)}
 if(entrance)g.rotate(entrance.angle);g.translate(-f.x,-f.y);renderBeforeReleaseCharacters(g,f,scale);g.restore();
};
const backdropBeforeReleaseEntrances=drawStageBackdrop;
drawStageBackdrop=function(g){backdropBeforeReleaseEntrances(g);if(g!==ctx||!fightOpening||fightOpening.phase!=='stage'||round!==1)return;const t=Math.min(1,fightOpening.time/1.25);if(t>=1)return;g.save();g.globalAlpha=(1-t)*.65;
 if(selectedStage==='subway'){for(const x of [player.x-45,enemy.x-45]){g.fillStyle='#152f3c';g.fillRect(x-15,200,110,194);g.strokeStyle='#9eaead';g.lineWidth=4;g.strokeRect(x-15,200,110,194);g.fillStyle='#6b8990';g.fillRect(x-15-t*65,204,53,187);g.fillRect(x+42+t*65,204,53,187)}}
 else if(['rooftop','parking'].includes(selectedStage)){g.strokeStyle='#b2aa8a';g.lineWidth=4;for(const x of [player.x,enemy.x]){g.beginPath();g.moveTo(x-25,350);g.lineTo(x-25,430);g.moveTo(x+25,350);g.lineTo(x+25,430);for(let y=360;y<430;y+=17){g.moveTo(x-25,y);g.lineTo(x+25,y)}g.stroke()}}
 else {g.fillStyle='#d9c5a3';for(const f of [player,enemy]){g.beginPath();g.ellipse(f.x,ground,24+t*35,3+t*5,0,0,Math.PI*2);g.fill()}}g.restore()};
const phaseBeforeReleaseEntrance=openingPhase;openingPhase=function(phase){phaseBeforeReleaseEntrance(phase);if(phase==='stage'&&round===1)fightOpening.stageDuration=2.1};
const resetBeforeReleaseCharacters=resetRound;resetRound=function(){resetBeforeReleaseCharacters();releaseReactions=new WeakMap()};
