'use strict';
const PERSONALITY_ROUTINES={volt:['GLOVE CHECK','SALUTE THE BLOCK'],ember:['ROLL THE SHOULDERS','COOL UNDER PRESSURE'],cipher:['READ THE ROOM','CALCULATED FINISH'],brick:['CHEST THUMP','HOLD THE BLOCK'],jade:['GINGA STEP','CIRCLE CELEBRATION'],rook:['CRACK THE KNUCKLES','RESPECTFUL BOW'],haze:['SHADOWBOX SHUFFLE','TOO QUICK'],goldie:['TIP THE CAP','CROWD CONDUCTOR']};
let personalityClock=0,stageHype=0;
const rigBeforePersonality=rigPose;
rigPose=function(id,state,t){const p=rigBeforePersonality(id,state,t);if(!state.startsWith('personality:'))return p;const victory=state.endsWith('victory'),wave=Math.sin(t*Math.PI*2),raise=Math.sin(Math.min(1,t*2)*Math.PI/2);p.offset=-(victory?3:1)*Math.abs(wave);
 if(id==='volt'){p.leftHand=[-10,-58];p.rightElbow=[20,-58];p.rightHand=[12,-60-24*raise];if(!victory)p.rightHand=[4+wave*8,-57]}
 if(id==='ember'){p.leftHand=[-23,-35];p.rightHand=[26,-34];p.shoulder[1]-=wave*3;p.head[0]=victory?-5:wave*3}
 if(id==='cipher'){p.leftHand=[-4,-38];p.rightElbow=[18,-43];p.rightHand=[12,-63];p.head[1]+=wave*2;p.leftFoot=[-22,-1]}
 if(id==='brick'){p.leftHand=[victory?-33:-8,victory?-62:-43];p.rightHand=[victory?34:5+wave*8,victory?-63:-45];p.leftElbow=[-30,-45];p.rightElbow=[30,-45];p.leftFoot=[-23,-1];p.rightFoot=[25,-1]}
 if(id==='jade'){p.hip[0]=wave*7;p.leftHand=[-26,-42+wave*8];p.rightHand=[29,-43-wave*8];p.leftFoot=[-25+wave*6,-Math.max(0,wave)*8];p.rightFoot=[25+wave*6,-Math.max(0,-wave)*8];if(victory)p.angle=wave*.16}
 if(id==='rook'){p.leftHand=[12,-43];p.rightHand=[16,-44];p.head[1]+=victory?raise*9:0;p.shoulder[0]=victory?raise*7:0;p.angle=victory?raise*.1:0}
 if(id==='haze'){p.head[0]=6;p.leftHand=[8+wave*15,-53];p.rightHand=[25-wave*15,-55];p.leftFoot=[-23+wave*4,-1];p.rightFoot=[22+wave*4,-1];p.offset=-Math.abs(wave)*4}
 if(id==='goldie'){p.rightHand= victory?[30,-58-wave*17]:[-10,-70];p.leftHand= victory?[-30,-57+wave*17]:[-24,-35];p.rightElbow=[24,-48];p.head[0]=-3}
 return p};
const personalityFrames=new Map();
function personalityFrame(id,state,t){const key=id+state;if(!personalityFrames.has(key)){personalityFrames.set(key,Array.from({length:12},(_,i)=>{const c=makeRigFrame(id,'personality:'+state,i,12);c.complete=true;c.naturalWidth=160;c.naturalHeight=160;c.src='personality:'+key+':'+i;return c}))}return personalityFrames.get(key)[Math.min(11,Math.floor((t%1)*12))]}
function personalityState(f){if(f.isBoss||f.hp<=0||f.stun>0||f.attack||f.y<ground)return null;if(f.celebrating)return 'victory';if(f.tauntTime>0)return 'entrance';if(mode==='countdown'&&fightOpening?.phase==='stage')return 'entrance';return null}
const renderBeforePersonality=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){const state=personalityState(f);if(state){let image=personalityFrame(f.character,state,personalityClock*(state==='victory'?.7:.9));if(f===player)image=recolorOutfit(image,f.character,chosenOutfit(f.character));const size=scale*(g===ctx?ARENA_FIGHTER_SCALE:1)*1.25;g.save();g.translate(f.x,f.y);g.scale((f.face||1)*.78,1);g.imageSmoothingEnabled=false;g.drawImage(image,-80*size,-144*size,160*size,160*size);g.restore();return}
 // Body anticipation and recoil follow existing move phases; hitboxes stay fixed.
 const a=f.attack;if(a&&['punch','kick'].includes(a.type)&&!f.isBoss&&f.hp>0&&!f.stun){const phase=attackProgress(a),heavy=a.type==='kick',strength=heavy?1:.6;let dx=0,tilt=0;if(phase.phase==='charge'){dx=-5*phase.p;tilt=-.025*phase.p}else if(phase.phase==='strike'){dx=7*Math.sin(phase.p*Math.PI);tilt=.035}else{dx=4*(1-phase.p);tilt=.025*(1-phase.p)}g.save();g.translate(f.x,f.y);g.rotate(tilt*strength*f.face);g.translate(-f.x+dx*strength*f.face,-f.y);renderBeforePersonality(g,f,scale);g.restore();return}renderBeforePersonality(g,f,scale)};
const openingBeforePersonality=startFightOpening;
startFightOpening=function(versus=true){openingBeforePersonality(versus);if(!versus)return;personalityClock=0;const a=player.character,b=enemy.character;const call=RIVAL_PAIRS[a+':'+b]||RIVAL_LINES[a].intro;const replies={volt:'Then keep your guard up. I brought the pace.',ember:'Talk is cheap. Let your hands speak.',cipher:'That tells me everything I need to know.',brick:'This block is not moving for anybody.',jade:'Good. Now try to follow my rhythm.',rook:'We settle it clean. Show me your balance.',haze:'Finish that sentence. I will be over there.',goldie:'The crowd heard you. Give them a show.'};$('#openingPlayerLine').textContent='“'+call+'”';$('#openingEnemyLine').textContent='“'+(enemy.isBoss?'Your name is not on the flyer. Earn your spot.':replies[b])+'”';$('#openingPlayerArt').dataset.routine=a;$('#openingEnemyArt').dataset.routine=b};
const phaseBeforePersonality=openingPhase;
openingPhase=function(phase){phaseBeforePersonality(phase);if(phase==='stage')$('#roundOpeningSub').textContent=PERSONALITY_ROUTINES[player.character][0]+' / '+(enemy.isBoss?'THE PROMOTER':PERSONALITY_ROUTINES[enemy.character][0])};
const updateBeforePersonality=update;
update=function(dt){const on=['intro','countdown','playing','roundover','finished'].includes(mode)&&!document.hidden&&!superCinema;updateBeforePersonality(dt);if(on&&!superCinema){personalityClock+=dt;stageHype=Math.max(0,stageHype-dt)}};
const hitBeforePersonality=applyCombatHit;
applyCombatHit=function(a,t,m,d){const hp=t.hp,ok=hitBeforePersonality(a,t,m,d);if(ok&&t.hp<hp&&!t.blockstun&&(m.isSuper||m.damage>=15||a.combo>=3))stageHype=Math.max(stageHype,m.isSuper?1.5:.85);return ok};
const resetBeforePersonality=resetRound;resetRound=function(){personalityClock=0;stageHype=0;resetBeforePersonality()};
const crowdBeforePersonality=drawArcadeCrowd;
drawArcadeCrowd=function(){crowdBeforePersonality();if(!stageHype)return;ctx.save();const bounce=strongEffects?Math.sin(personalityClock*15)*5:0;for(const [i,x]of [130,290,760,950].entries()){ctx.fillStyle=i%2?'#ffdc64':'#8cecff';ctx.fillRect(x,334+bounce,7,10);if(strongEffects){ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+3,339+bounce,13,0,Math.PI*2);ctx.stroke()}}ctx.restore()};
const backdropBeforePersonality=drawStageBackdrop;
drawStageBackdrop=function(g){backdropBeforePersonality(g);if(!stageHype||!strongEffects)return;g.save();g.globalAlpha=Math.min(.2,stageHype*.15);g.fillStyle=(SPECIAL_COLORS[player.character]||SPECIAL_COLORS.volt)[0];for(const x of [40,1020]){g.beginPath();g.moveTo(x,190);g.lineTo(x-45,405);g.lineTo(x+55,405);g.closePath();g.fill()}g.restore()};
