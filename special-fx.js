'use strict';
// Bounded cosmetic events: never touch move timing, damage or collision.
const SPECIAL_COLORS={volt:['#00eaff','#ffed32','#9270ff'],ember:['#ff3c76','#ff991f','#fff23a'],cipher:['#bb55ff','#20f5ff','#ff51df'],brick:['#ff6930','#ffd532','#ff39ac'],jade:['#19ff9e','#bfff30','#28dfff'],rook:['#39cfff','#895bff','#fff06a'],haze:['#ff45dd','#43eaff','#b187ff'],goldie:['#ffdd27','#ff7b29','#fff8ae']};
let specialShows=[];
function specialShow(f,impact=false,x=f.x,y=f.y-76){
 const colors=SPECIAL_COLORS[f.character]||SPECIAL_COLORS.goldie;
 specialShows.push({x,y,face:f.face,id:f.character,colors,impact,age:0,life:impact?.48:.65,super:!!f.attack?.move?.isSuper});
 if(specialShows.length>8)specialShows.shift();
 const n=strongEffects?(impact?24:16):4;
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2,s=90+detailRandom()*220;detailSpark(x,y,colors[i%3],Math.cos(a)*s,Math.sin(a)*s,.25+detailRandom()*.25)}
}
const attackBeforeSpecialShow=attack;
attack=function(f,type){const ok=attackBeforeSpecialShow(f,type);if(ok&&f.attack&&(['fireball','uppercut','spinKick','super'].includes(type)))specialShow(f);return ok};
const hitBeforeSpecialShow=applyCombatHit;
applyCombatHit=function(a,t,m,d){const hp=t.hp,ok=hitBeforeSpecialShow(a,t,m,d);if(ok&&t.hp<hp&&!t.blockstun&&(m.cooldown||m.isSuper))specialShow(a,true,t.x,t.y-(m.height==='low'?30:78));return ok};
const updateBeforeSpecialShow=update;
update=function(dt){const advance=['playing','roundover','finished'].includes(mode)&&!superCinema&&!document.hidden;updateBeforeSpecialShow(dt);if(advance&&!superCinema){for(const e of specialShows)e.age+=dt;specialShows=specialShows.filter(e=>e.age<e.life)}};
const resetBeforeSpecialShow=resetRound;
resetRound=function(){specialShows=[];resetBeforeSpecialShow()};
function drawSpecialShow(g,e){
 const p=e.age/e.life,fade=Math.sin(Math.PI*Math.min(1,p*1.3))*(1-p),r=(e.impact?30:45)+p*(e.super?185:125),count=strongEffects&&!reducedMotionPreference()?18:5;
 g.save();g.translate(e.x,e.y);g.scale(e.face,1);g.globalCompositeOperation='lighter';g.globalAlpha=fade*(strongEffects?.8:.45);
 // Expanding multicolor comic rays surround the fighter rather than covering them.
 for(let i=0;i<count;i++){const a=i/count*Math.PI*2+p*.7,inner=r*.65,outer=r*(i%2?1.15:1.5);g.fillStyle=e.colors[i%3];g.beginPath();g.moveTo(Math.cos(a-.035)*inner,Math.sin(a-.035)*inner);g.lineTo(Math.cos(a)*outer,Math.sin(a)*outer);g.lineTo(Math.cos(a+.035)*inner,Math.sin(a+.035)*inner);g.closePath();g.fill()}
 for(let j=0;j<(strongEffects?3:1);j++){
 g.strokeStyle=e.colors[j%3];g.lineWidth=strongEffects?5-j:2;g.beginPath();
 if(e.id==='volt'){for(let k=0;k<10;k++){const x=(k-4)*r/4,y=Math.sin(k*2.5+j+p*5)*r*.35;k?g.lineTo(x,y):g.moveTo(x,y)}}
 else if(e.id==='ember'){g.moveTo(-r,30+j*12);g.bezierCurveTo(-r*.4,-r*1.4,r*.25,r,r,-r*.6)}
 else if(e.id==='haze'){g.moveTo(-r,-35+j*34);g.bezierCurveTo(-r*.3,-65+j*25,r*.3,65-j*25,r,15+j*12)}
 else if(e.id==='brick'||e.id==='rook'){for(let k=0;k<=8;k++){const a=k*Math.PI/4,x=Math.cos(a)*r,y=Math.sin(a)*r*.55;k?g.lineTo(x,y):g.moveTo(x,y)}}
 else g.ellipse(0,0,r,r*(e.id==='jade'?.35:.8),p*2+j,0,Math.PI*1.8);
 g.stroke();
 }
 if(strongEffects){g.globalAlpha*=.7;for(let i=0;i<6;i++){const a=i*Math.PI/3-p*2,x=Math.cos(a)*r,y=Math.sin(a)*r*.75;g.fillStyle=e.colors[i%3];g.fillRect(x-3,y-3,6,6)}}
 g.restore();
}
const drawBeforeSpecialShow=draw;
draw=function(){drawBeforeSpecialShow();if(!['playing','paused','roundover','finished'].includes(mode)||superCinema)return;for(const e of specialShows)drawSpecialShow(ctx,e)};
