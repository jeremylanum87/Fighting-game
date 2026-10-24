'use strict';
// Bounded state snapshots, not a second simulation or a recording of large canvas frames.
let replayFrames=[],replayClock=0,cinematicReplay=null,replayShown=false,replayPending=false,replayBackdrop=null;
const REPLAY_INTERVAL=1/12,REPLAY_LIMIT=72;
function replayFighter(f){const out={};for(const k of ['x','y','vx','vy','face','character','name','color','hp','maxHp','stun','blockstun','block','crouch','knockedDown','animTime','animState','hitFlash','isBoss','spriteSet','spriteFilter'])out[k]=f[k];out.attack=f.attack?{...f.attack,move:{...f.attack.move}}:null;out.celebrating=false;out.tauntTime=0;return out}
function captureReplayFrame(){replayFrames.push({fighters:[replayFighter(player),replayFighter(enemy)]});if(replayFrames.length>REPLAY_LIMIT)replayFrames.shift()}
function closeHighlightReplay(){cinematicReplay=null;replayBackdrop=null;$('#highlightReplay').hidden=true;const pending=replayPending;replayPending=false;if(pending&&mode==='finished')renderHighlights()}
function startHighlightReplay(){if(replayShown||replayFrames.length<3)return false;replayShown=true;replayPending=true;cinematicReplay={age:0,frames:replayFrames.slice(-48),life:Math.min(5,replayFrames.length/12*1.15)};
 replayBackdrop=document.createElement('canvas');replayBackdrop.width=1100;replayBackdrop.height=520;drawStageBackdrop(replayBackdrop.getContext('2d'));$('#highlightReplay').hidden=false;$('#highlightsPanel').hidden=true;return true}
const highlightsBeforeReplayClip=renderHighlights;
renderHighlights=function(){if(mode==='finished'&&!replayShown&&replayFrames.length>=3){replayPending=true;$('#highlightsPanel').hidden=true;return}if(cinematicReplay){replayPending=true;$('#highlightsPanel').hidden=true;return}highlightsBeforeReplayClip()};
const endBeforeReplayClip=endRound;endRound=function(){if(mode==='playing'&&gameMode!=='training')captureReplayFrame();endBeforeReplayClip()};
const updateBeforeReplayClip=update;
update=function(dt){const active=mode==='playing'&&!document.hidden&&!superCinema&&!hitstop;updateBeforeReplayClip(dt);if(active&&mode==='playing'){replayClock+=dt;if(replayClock>=REPLAY_INTERVAL){replayClock%=REPLAY_INTERVAL;captureReplayFrame()}}
 if(document.hidden||!$('#controlSettings').hidden)return;
 if(mode==='finished'&&!replayShown&&replayFrames.length>=3&&!roundImpact&&!roundVictory&&!cinematicFinisher&&!lastBar)startHighlightReplay();
 if(cinematicReplay){if(mode!=='finished'){closeHighlightReplay();return}cinematicReplay.age+=dt;if(cinematicReplay.age>=cinematicReplay.life)closeHighlightReplay()}
};
const drawBeforeReplayClip=draw;draw=function(){drawBeforeReplayClip();if(!cinematicReplay||!replayBackdrop)return;const c=$('#highlightReplayCanvas'),g=c.getContext('2d'),r=cinematicReplay,progress=Math.min(1,r.age/r.life),position=progress*(r.frames.length-1),index=Math.floor(position),a=r.frames[index],b=r.frames[Math.min(index+1,r.frames.length-1)];g.save();g.scale(c.width/1100,c.height/520);g.drawImage(replayBackdrop,0,0);for(let i=0;i<2;i++){const f={...a.fighters[i]},next=b.fighters[i],alpha=position-index;f.x+=(next.x-f.x)*alpha;f.y+=(next.y-f.y)*alpha;g.fillStyle='#0005';g.beginPath();g.ellipse(f.x,ground+2,35,7,0,0,Math.PI*2);g.fill();renderStreetFighter(g,f,2.1*ARENA_FIGHTER_SCALE)}g.restore();$('#highlightReplayProgress').style.width=(progress*100)+'%'};
function clearHighlightReplay(){cinematicReplay=null;replayFrames=[];replayClock=0;replayShown=false;replayPending=false;replayBackdrop=null;$('#highlightReplay').hidden=true}
const resetBeforeReplayClip=resetRound;resetRound=function(){resetBeforeReplayClip();clearHighlightReplay()};
const titleBeforeReplayClip=showTitleScreen;showTitleScreen=function(){clearHighlightReplay();titleBeforeReplayClip()};
const selectionBeforeReplayClip=openCharacterSelection;openCharacterSelection=function(){clearHighlightReplay();selectionBeforeReplayClip()};
