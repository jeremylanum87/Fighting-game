'use strict';
// Original pixel-art rig and animation frames. All times follow combat simulation.
const poseCache=new Map();let specialEffects=[];
const SKINS={volt:'#c08a62',ember:'#925f46',cipher:'#d2a47c',brick:'#a77450',jade:'#ba855b',rook:'#9e7256',haze:'#ca9b72',goldie:'#ad734b'};
function mix(a,b,t){return a+(b-a)*t}
function attackProgress(a){const m=a.move;return a.frame<m.startup?{phase:'charge',p:a.frame/m.startup}:a.frame<m.startup+m.active?{phase:'strike',p:(a.frame-m.startup)/m.active}:{phase:'recover',p:(a.frame-m.startup-m.active)/m.recovery}}
function rigPose(id,state,t){
 const p={head:[0,-59],hip:[0,-29],shoulder:[0,-47],leftElbow:[-13,-40],leftHand:[-10,-53],rightElbow:[15,-42],rightHand:[24,-50],leftKnee:[-10,-16],leftFoot:[-14,-1],rightKnee:[12,-16],rightFoot:[18,-1],angle:0,offset:0};
 const wave=Math.sin(t*Math.PI*2),kick=state==='attack2';
 if(state==='idle'){p.offset=Math.round(wave);p.rightHand[1]+=wave*2}
 if(state==='run'){p.leftFoot=[wave*21,-Math.max(0,wave)*12];p.rightFoot=[-wave*21,-Math.max(0,-wave)*12];p.leftKnee=[wave*11,-18];p.rightKnee=[-wave*11,-18];p.leftHand=[-wave*19,-39];p.rightHand=[wave*19,-39];p.head[0]=4;p.shoulder[0]=3}
 if(state==='jump'||state==='fall'){p.leftKnee=[-15,-22];p.leftFoot=[-19,-10];p.rightKnee=[15,-34];p.rightFoot=[23,-20];p.leftHand=[-23,-56];p.rightHand=[22,-65]}
 if(state==='guard'){p.leftHand=[3,-64];p.rightHand=[16,-61];p.rightElbow=[22,-45];p.head[0]=-4}
 if(state==='take-hit'){p.head[0]=-13;p.shoulder[0]=-8;p.leftHand=[-22,-40];p.rightHand=[11,-31];p.offset=3}
 if(state==='death'){p.angle=-Math.min(1,t)*Math.PI/2;p.offset=8}
 if(state==='attack1'){p.shoulder[0]=6;p.head[0]=4;p.rightElbow=[24,-45];p.rightHand=[43,-47];p.leftHand=[0,-55]}
 if(kick){p.rightKnee=[25,-25];p.rightFoot=[46,-28];p.rightHand=[8,-53];p.leftHand=[-20,-49];p.hip[0]=-3}
 if(state.startsWith('special:')){
  const [,slot,phase]=state.split(':'),u=slot==='fireball',i=slot==='uppercut',active=phase==='strike',recover=phase==='recover';
  const strength=active?Math.sin(Math.PI*Math.min(.95,t*.65+.2)):recover?1-t:t*.35;
  p.rightHand=[mix(24,45,strength),-48];p.rightElbow=[mix(15,26,strength),-42];
  if(id==='volt'){if(i){p.hip[1]-=strength*4;p.rightHand=[16,-66-strength*22];p.rightElbow=[23,-60];p.leftHand=[-3,-53];p.leftFoot=[-18,-3];p.rightFoot=[18,-10]}else if(u){p.leftHand=[15,-64];p.rightHand=[20,-65];p.head[0]=-4}else{p.shoulder[0]=8;const swap=Math.sin(t*Math.PI*8);p.rightHand=[32+swap*15,-48];p.leftHand=[25-swap*15,-54];p.leftFoot=[-25,-2]}}
  if(id==='ember'){if(u){p.leftHand=[17,-63];p.rightHand=[21,-60];p.rightElbow=[32,-47];if(active&&t>.5)p.rightHand=[43,-45]}else if(i){p.rightElbow=[39,-47];p.rightHand=[17,-61];p.head[0]=7}else{p.leftHand=[36,-47];p.rightHand=[43,-45];p.leftFoot=[-23,-1]}}
  if(id==='cipher'){if(u){p.shoulder[0]=-13;p.head[0]=-16;p.leftHand=[-22,-48];p.rightHand=[8,-50]}else if(i){p.rightHand=[49,-45];p.rightElbow=[31,-44];p.leftHand=[18,-52];p.hip[0]=-4}else{p.rightHand=[30+Math.sin(t*20)*16,-50];p.leftHand=[30-Math.sin(t*20)*16,-45]}}
  if(id==='brick'){if(u||i){p.leftHand=[28,-42-strength*(i?31:10)];p.rightHand=[39,-41-strength*(i?32:10)];p.leftElbow=[10,-34];p.rightElbow=[25,-33];if(active&&i&&t>.5){p.offset=7;p.leftHand=[31,-15];p.rightHand=[40,-13]}}else{p.leftHand=[-35,-47];p.rightHand=[44,-47];p.angle=active?wave*.12:0}}
  if(id==='jade'){if(u){p.offset=15;p.head[0]=-17;p.shoulder[0]=-10;p.leftHand=[-26,-28];p.rightHand=[7,-26]}else if(i){p.angle=active?Math.PI:Math.PI*t*.8;p.offset=active?-8:0;p.leftFoot=[-28,-8];p.rightFoot=[30,-20];p.leftHand=[-18,-76];p.rightHand=[18,-76]}else{p.offset=18;p.angle=active?t*Math.PI*4:0;p.leftFoot=[-39,-15];p.rightFoot=[43,-9];p.leftHand=[-20,-55]}}
  if(id==='rook'){if(u){p.leftHand=[27,-50];p.rightHand=[35,-56];p.shoulder[0]=-6;if(active&&t>.5){p.leftHand=[-25,-34];p.rightHand=[-14,-33]}}else if(i){p.offset=9;p.head[0]=14;p.shoulder[0]=13;p.leftHand=[33,-32];p.rightHand=[40,-26]}else{p.rightKnee=[24,-14];p.rightFoot=[45,-4];p.head[0]=-5}}
  if(id==='haze'){p.head[0]=10;p.shoulder[0]=8;p.leftFoot=[-26,-1];if(i){p.rightHand=[32+Math.sin(t*36)*17,-48+Math.cos(t*30)*8];p.leftHand=[30-Math.sin(t*36)*17,-54]}else if(u){p.rightHand=[49,-48];p.leftHand=[-18,-36]}else{p.rightHand=[-12,-49];p.leftHand=[-25,-38]}}
  if(id==='goldie'){if(u){p.offset=24;p.head[0]=-8;p.leftHand=[-18,-26];p.rightFoot=[46,-3];p.rightKnee=[25,-8]}else if(i){p.offset=wave*3;p.rightHand=[35+wave*10,-48];p.rightFoot=[25+Math.max(0,wave)*17,-4-Math.max(0,wave)*22];p.leftHand=[-23,-58]}else{p.offset=24;p.angle=active?t*Math.PI*4:Math.PI*.25;p.leftFoot=[-41,-12];p.rightFoot=[41,-22];p.leftHand=[-22,-57];p.rightHand=[17,-62]}}
  if(!active&&recover){p.offset*=1-t;p.angle*=1-t}
 }
 return typeof normalAttackPose==='function'?normalAttackPose(id,state,t,p):p;
}
const BODY_STYLES={
 volt:{width:.96,height:1,skin:'#c08a62',pants:'#253342',fit:'boxer',stance:1},
 ember:{width:1.02,height:1.02,skin:'#925f46',pants:'#25312e',fit:'hoodvest',stance:2},
 cipher:{width:.88,height:1.04,skin:'#d2a47c',pants:'#242638',fit:'coat',stance:3},
 brick:{width:1.26,height:1.08,skin:'#a77450',pants:'#292f34',fit:'wrestler',stance:4},
 jade:{width:.94,height:.98,skin:'#ba855b',pants:'#d5cdb3',fit:'capoeira',stance:5},
 rook:{width:1.14,height:1.03,skin:'#9e7256',pants:'#253444',fit:'bomber',stance:6},
 haze:{width:.88,height:.98,skin:'#ca9b72',pants:'#212c37',fit:'hoodie',stance:7},
 goldie:{width:1.08,height:1,skin:'#ad734b',pants:'#314357',fit:'varsity',stance:8}
};
function makeRigFrame(id,state,index,count){const c=document.createElement('canvas');c.width=160;c.height=160;const g=c.getContext('2d'),p=rigPose(id,state,index/Math.max(1,count-1)),color=fighterRoster[id].color,b=BODY_STYLES[id],skin=b.skin;g.imageSmoothingEnabled=false;g.translate(80,144+p.offset);g.scale(b.width,b.height);if(p.angle){g.translate(0,-29);g.rotate(p.angle);g.translate(0,29)}
 const fill=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h)};
 function line(a,b,w,c){g.strokeStyle=c;g.lineWidth=w;g.lineCap='square';g.beginPath();g.moveTo(Math.round(a[0]),Math.round(a[1]));g.lineTo(Math.round(b[0]),Math.round(b[1]));g.stroke()}
 if(state==='idle'||state==='guard'){
  if(id==='volt'){p.rightHand=[18,-61];p.leftHand=[-5,-58];p.rightElbow=[21,-43]}
  if(id==='ember'){p.head[0]=-4;p.leftHand=[-2,-57];p.rightHand=[23,-59];p.rightElbow=[26,-43]}
  if(id==='cipher'){p.rightHand=[29,-51];p.leftHand=[-4,-54];p.leftFoot=[-18,-1]}
  if(id==='brick'){p.leftHand=[-23,-38];p.rightHand=[28,-36];p.shoulder[1]=-49;p.leftFoot=[-19,-1];p.rightFoot=[22,-1]}
  if(id==='jade'){p.offset+=3;p.leftHand=[-23,-39];p.rightHand=[26,-42];p.leftFoot=[-23,-1];p.rightFoot=[25,-1];p.hip[0]=Math.sin(index)*3}
  if(id==='rook'){p.leftHand=[-12,-45];p.rightHand=[30,-43];p.rightElbow=[20,-38]}
  if(id==='haze'){p.head[0]=5;p.shoulder[0]=4;p.rightHand=[24,-56];p.leftHand=[-14,-43];p.leftFoot=[-22,-1]}
  if(id==='goldie'){p.leftHand=[-25,-48];p.rightHand=[23,-43];p.head[0]=-4;p.rightFoot=[24,-1]}
 }
 for(const [knee,foot] of [[p.leftKnee,p.leftFoot],[p.rightKnee,p.rightFoot]]){const w=id==='goldie'?14:id==='brick'?13:10;line(p.hip,knee,w,b.pants);line(knee,foot,w-1,b.pants);fill(foot[0]-5,foot[1]-2,id==='brick'?17:15,id==='brick'?7:5,id==='jade'?skin:id==='brick'?'#222a30':'#e8e0ca');if(id!=='jade')fill(foot[0]-5,foot[1]+2,16,2,'#131c23');if(id==='jade')fill(foot[0]-5,foot[1]-6,9,3,'#e9e2ce');if(id==='goldie')fill(knee[0]-4,knee[1]-1,8,2,'#597084')}
 const sleeveless=['boxer','hoodvest','wrestler','capoeira'].includes(b.fit);
 line(p.shoulder,p.leftElbow,id==='brick'?12:9,sleeveless?skin:b.fit==='varsity'?'#e2d9b9':color);line(p.leftElbow,p.leftHand,id==='brick'?10:7,skin);
 if(b.fit==='coat'){line([p.shoulder[0]-5,p.shoulder[1]],[p.hip[0]-8,p.hip[1]+13],12,color);line([p.shoulder[0]+5,p.shoulder[1]],[p.hip[0]+10,p.hip[1]+12],10,color)}
 line(p.shoulder,p.hip,id==='brick'?25:22,'#111c25');line([p.shoulder[0]-2,p.shoulder[1]],[p.hip[0]-2,p.hip[1]],id==='brick'?21:17,color);
 if(b.fit==='bomber'){line([p.shoulder[0]-7,p.shoulder[1]],[p.hip[0]+6,p.hip[1]],4,'#182532');fill(p.hip[0]-13,p.hip[1]-2,27,5,'#d9c9aa')}
 else if(b.fit==='wrestler'){fill(p.hip[0]-13,p.hip[1]-1,27,6,'#181d23');fill(p.hip[0]-5,p.hip[1]-1,11,6,'#b9b1a0');line([p.shoulder[0]-4,p.shoulder[1]-2],[p.hip[0]-4,p.hip[1]-4],3,'#e4d4aa')}
 else if(b.fit==='capoeira'){fill(p.hip[0]-11,p.hip[1]-2,24,4,'#e9b849');fill(p.hip[0]+5,p.hip[1]+1,3,14,'#e9b849')}
 else{fill(p.hip[0]-11,p.hip[1]-1,23,5,'#17212a');if(b.fit==='hoodie')fill(p.hip[0]-6,p.hip[1]-9,14,4,'#262838');if(b.fit==='varsity'){fill(p.shoulder[0]-8,p.shoulder[1]+5,5,8,'#eee2bf');fill(p.hip[0]-12,p.hip[1]-2,25,3,'#e3dbc2')}}
 line(p.shoulder,p.rightElbow,id==='brick'?13:10,sleeveless?skin:b.fit==='varsity'?'#e2d9b9':color);line(p.rightElbow,p.rightHand,id==='brick'?10:7,skin);
 for(const hand of [p.leftHand,p.rightHand]){if(b.fit==='boxer'){fill(hand[0]-6,hand[1]-6,13,12,'#172330');fill(hand[0]-5,hand[1]+3,12,4,'#eee6ce');fill(hand[0],hand[1]-5,6,2,color)}else{fill(hand[0]-4,hand[1]-4,9,8,skin);if(['hoodvest','wrestler','bomber'].includes(b.fit))fill(hand[0]-4,hand[1]+1,9,4,'#e2d9c2')}}
 const hx=p.head[0],hy=p.head[1];if(['hoodvest','hoodie'].includes(b.fit)){fill(hx-11,hy-12,22,24,b.fit==='hoodie'?color:'#263533');fill(hx-7,hy-9,16,19,'#15242b')}
 fill(hx-7,hy-8,15,17,skin);fill(hx-8,hy-11,17,b.fit==='wrestler'?4:7,'#18242b');
 if(b.fit==='boxer'){fill(hx-7,hy-14,14,5,'#17202b');fill(hx-7,hy-8,15,2,'#eee0b8')}
 if(b.fit==='capoeira'){fill(hx-10,hy-10,20,7,'#272323');fill(hx-12,hy-16,9,9,'#272323');fill(hx-9,hy-8,17,3,color)}
 if(b.fit==='varsity'){fill(hx-9,hy-12,20,7,color);fill(hx-18,hy-7,12,3,color);fill(hx+4,hy-12,3,5,'#f4e2a2')}
 if(b.fit==='coat'){fill(hx-11,hy-6,4,13,'#1d2430');fill(hx-10,hy-13,18,3,'#55546b');fill(hx+1,hy-2,11,4,'#202531');fill(hx+4,hy-2,4,1,'#b1dded')}
 if(b.fit==='hoodie'){fill(hx-8,hy+3,17,7,'#262735');fill(hx-7,hy+5,15,2,color)}
 if(b.fit==='wrestler'){fill(hx-7,hy+5,15,5,'#292323');fill(hx-4,hy-10,10,3,'#3a2921')}
 if(b.fit==='bomber')fill(hx+2,hy-9,7,3,'#a3a49b');
 fill(hx+4,hy-1,3,2,'#171d24');
 if(b.fit==='varsity'||b.fit==='coat'){line([p.shoulder[0]-5,p.shoulder[1]-1],[p.shoulder[0],p.shoulder[1]+8],b.fit==='varsity'?3:1,'#e8bd52');line([p.shoulder[0],p.shoulder[1]+8],[p.shoulder[0]+5,p.shoulder[1]-1],b.fit==='varsity'?3:1,'#e8bd52');if(b.fit==='varsity')fill(p.shoulder[0]-3,p.shoulder[1]+7,7,5,'#f4cf55')}
 return c;
}
function rigFrames(id,state){const key=id+':'+state;if(!poseCache.has(key)){const count=state==='guard'?1:state.startsWith('special:')?8:state==='run'?8:6;poseCache.set(key,Array.from({length:count},(_,i)=>makeRigFrame(id,state,i,count)))}return poseCache.get(key)}
function renderStreetFighter(g,f,scale=2.1){const id=f.character;if(!fighterRoster[id])return;let state=f.animState||'idle',progress=0;if(f.attack?.move?.cooldown){const a=attackProgress(f.attack);state=`special:${f.attack.type}:${a.phase}`;progress=a.p}else if(f.attack){const m=f.attack.move||getMove(f,f.attack.type);progress=Math.min(1,f.attack.frame/(m.startup+m.active+m.recovery))}else progress=['death','take-hit','jump','fall'].includes(state)?Math.min(1,(f.animTime||0)*2):((f.animTime||0)*(state==='run'?1.7:1))%1;const frames=rigFrames(id,state),frame=frames[Math.min(frames.length-1,Math.floor(progress*frames.length))];g.save();g.translate(f.x,f.y);g.scale(f.face||1,1);g.imageSmoothingEnabled=false;g.drawImage(frame,-80*scale,-144*scale,160*scale,160*scale);g.restore()}
// Both previews and in-match fighters use the same original rig.
drawFighter=function(f){if(!fighterRoster[f.character])return;ctx.save();ctx.fillStyle=typeof drawingGroundedFighter!=='undefined'&&drawingGroundedFighter?'#0000':'#0007';ctx.beginPath();ctx.ellipse(f.x,f.y+2,39,8,0,0,Math.PI*2);ctx.fill();if(f.crouch){ctx.translate(0,f.y*.25);ctx.scale(1,.75)}if(f.attack?.move?.dash){for(let i=3;i>0;i--){ctx.globalAlpha=.1+(3-i)*.07;renderStreetFighter(ctx,{...f,x:f.x-f.face*i*18},2.1)}}ctx.globalAlpha=1;if(f.knockedDown&&f.stun>0){ctx.translate(f.x,f.y-35);ctx.rotate(-f.face*Math.min(1,(f.hitDuration-f.stun)*4)*Math.PI/2);ctx.translate(-f.x,-(f.y-35))}renderStreetFighter(ctx,f);ctx.restore()};
const hitBeforeAnimation=applyCombatHit;applyCombatHit=function(attacker,target,m,dir){const before=target.hp,source=attacker.attack?.move;const result=hitBeforeAnimation(attacker,target,m,dir);if(result&&target.hp<before){specialEffects.push({x:target.x,y:target.y-55,age:0,duration:(m.knockdown||m.grab)? .65 : .3,color:source?.element==='fire'?'#ff7839':attacker.color,kind:m.grab||m.knockdown?'slam':source?.element==='electric'?'electric':'burst'});if(specialEffects.length>24)specialEffects.shift()}return result};
const updateBeforeAnimation=update;update=function(dt){const run=mode==='playing'&&hitstop===0;updateBeforeAnimation(dt);if(run){for(const e of specialEffects)e.age+=dt;specialEffects=specialEffects.filter(e=>e.age<e.duration)}};
const resetBeforeAnimation=resetRound;resetRound=function(){specialEffects=[];poseCache.clear();resetBeforeAnimation()};
const drawBeforeAnimation=draw;draw=function(){drawBeforeAnimation();for(const f of [player,enemy]){const a=f.attack,m=a?.move;if(!m?.cooldown)continue;const phase=attackProgress(a),t=phase.p;ctx.save();ctx.translate(f.x,f.y-65);ctx.scale(f.face,1);const color=m.element==='electric'?'#b5edff':m.element==='fire'?'#ff823c':f.color;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=15;ctx.lineWidth=3;if(phase.phase==='charge'){ctx.globalAlpha=.2+t*.5;ctx.beginPath();ctx.arc(23,-25,8+t*16,0,Math.PI*2);ctx.stroke()}else if(phase.phase==='strike'){ctx.globalAlpha=.85*(1-t*.45);if(m.element==='electric'){for(let b=0;b<3;b++){ctx.beginPath();ctx.moveTo(18+b*8,5);for(let k=1;k<7;k++)ctx.lineTo(18+b*8+Math.sin(k*5+a.frame)*12,-k*20);ctx.stroke()}}if(m.counter){ctx.beginPath();ctx.arc(0,0,48+t*22,-1.7,1.7);ctx.stroke();if(a.counterUsed){ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,55+t*90,0,Math.PI*2);ctx.stroke()}}else if(m.rotate||m.element==='wind'||m.element==='gold'){for(let j=0;j<3;j++){ctx.beginPath();ctx.ellipse(0,38+j*7,55+t*40,15+j*6,t*6+j,0,Math.PI*1.65);ctx.stroke()}}else if(m.multi){for(let j=0;j<5;j++){const y=-40+j*18;ctx.beginPath();ctx.moveTo(15+Math.sin(a.frame+j)*8,y);ctx.lineTo(60+Math.sin(a.frame*2+j)*20,y);ctx.stroke()}}}ctx.restore()}
 for(const e of specialEffects){const t=e.age/e.duration;ctx.save();ctx.translate(e.x,e.kind==='slam'?ground:e.y);ctx.globalAlpha=(1-t)*.85;ctx.strokeStyle=e.color;ctx.shadowColor=e.color;ctx.shadowBlur=12;ctx.lineWidth=4*(1-t)+1;ctx.beginPath();if(e.kind==='slam'){ctx.ellipse(0,0,20+t*120,6+t*22,0,0,Math.PI*2)}else{for(let k=0;k<10;k++){const angle=k*Math.PI/5;ctx.moveTo(Math.cos(angle)*(9+t*15),Math.sin(angle)*(9+t*15));ctx.lineTo(Math.cos(angle)*(25+t*45),Math.sin(angle)*(25+t*45))}}ctx.stroke();ctx.restore()}};
