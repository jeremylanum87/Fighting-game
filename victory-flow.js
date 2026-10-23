'use strict';
let roundVictory=null,victoryHighlightsShown=false;
const highlightsBeforeVictoryFlow=renderHighlights;
renderHighlights=function(){
 if(roundVictory||cinematicFinisher||lastBar){
 if(roundVictory)roundVictory.pendingHighlights=true;
 $('#highlightsPanel').hidden=true;return;
 }
 if(mode==='finished'&&victoryHighlightsShown)return;
 highlightsBeforeVictoryFlow();
 if(mode==='finished'&&!$('#highlightsPanel').hidden)victoryHighlightsShown=true;
};
const endBeforeVictoryFlow=endRound;
endRound=function(){
 const active=mode==='playing'&&gameMode!=='training',before=[...wins];
 if(active){roundVictory={winner:null,age:0,life:1.8,pendingHighlights:false};victoryHighlightsShown=false}
 endBeforeVictoryFlow();
 if(!active)return;
 const winner=wins[0]>before[0]?player:wins[1]>before[1]?enemy:null;
 if(!roundVictory||!winner||!['roundover','finished'].includes(mode)){roundVictory=null;return}
 roundVictory.winner=winner;roundVictory.final=mode==='finished';
 $('#highlightsPanel').hidden=true;$('#overlay').classList.add('hidden');
};
const updateBeforeVictoryFlow=update;
update=function(dt){
 const gate=roundVictory,blocked=!!cinematicFinisher||!!lastBar;
 updateBeforeVictoryFlow(dt);
 if(!gate||roundVictory!==gate)return;
 if(!['roundover','finished'].includes(mode)){roundVictory=null;return}
 if(blocked||cinematicFinisher||lastBar||document.hidden||$('#controlSettings').hidden===false)return;
 gate.age+=dt;
 if(gate.age>=gate.life){
 roundVictory=null;
 if(resultReveal)resultReveal.time=0;
 if(gate.final&&gate.pendingHighlights)renderHighlights();
 }
};
const revealBeforeVictoryFlow=revealResult;
revealResult=function(dt){if(!roundVictory)revealBeforeVictoryFlow(dt)};
const poseBeforeVictoryFlow=detailedArtPose;
detailedArtPose=function(f){
 const p=poseBeforeVictoryFlow(f),v=roundVictory;
 if(!v||v.winner!==f||cinematicFinisher||lastBar)return p;
 const t=v.age,w=strongEffects?Math.sin(t*5):0;
 p.image=f.isBoss?motionArt.promoter:arcadeSprites[f.character];
 p.col=t<.15?0:ART_VICTORIES[f.character]?.frame||6;p.kind='round-victory';p.x=f.x;p.y=f.y;p.angle=0;p.sx=p.sy=1;
 if(f.character==='volt')p.y-=Math.abs(w)*4;
 if(f.character==='ember'){p.angle=w*.025;p.sy+=Math.abs(w)*.015}
 if(f.character==='cipher')p.angle=strongEffects?-.035:0;
 if(f.character==='brick')p.sx+=Math.abs(w)*.03;
 if(f.character==='jade'){p.angle=w*.09;p.x+=w*5}
 if(f.character==='rook')p.angle=strongEffects?Math.sin(Math.min(1,t/1.3)*Math.PI)*.14:0;
 if(f.character==='haze'){p.x+=w*7;p.y-=Math.abs(w)*3}
 if(f.character==='goldie')p.angle=w*.04;
 return p;
};
function clearVictoryFlow(){roundVictory=null;victoryHighlightsShown=false}
const resetBeforeVictoryFlow=resetRound;
resetRound=function(){clearVictoryFlow();resetBeforeVictoryFlow()};
const titleBeforeVictoryFlow=showTitleScreen;
showTitleScreen=function(){clearVictoryFlow();titleBeforeVictoryFlow()};
const selectBeforeVictoryFlow=openCharacterSelection;
openCharacterSelection=function(){clearVictoryFlow();selectBeforeVictoryFlow()};
