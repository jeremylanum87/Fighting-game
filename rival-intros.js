'use strict';
// Each unordered pairing has a two-sided exchange; reversed picks reverse the speakers.
const RIVAL_EXCHANGES=[
 ['volt','ember','You keep waiting. I keep setting the pace.','A fast start still needs a clean finish.'],
 ['volt','cipher','You can read me after the bell.','Your lead hand already told the story.'],
 ['volt','brick','Concrete cracks when lightning hits.','Then show me more than a flash.'],
 ['volt','jade','Keep dancing. I will find the beat.','You have to catch it first.'],
 ['volt','rook','One opening. That is all I need.','One rushed step. That is all I need.'],
 ['volt','haze','Speed is good. Timing is better.','Try timing what you cannot catch.'],
 ['volt','goldie','Save the applause for the finish.','Then give the block a finish worth cheering.'],
 ['ember','cipher','You study the room. I study the opening.','Let us see whose notes hold up.'],
 ['ember','brick','Even steel cools if you wait.','These hands came straight from the furnace.'],
 ['ember','jade','I can wait out a rhythm.','Good. I change mine every round.'],
 ['ember','rook','No rush. We settle this clean.','Balance first. Then we settle it.'],
 ['ember','haze','All that speed. Still nowhere to hide.','Who said I was running away?'],
 ['ember','goldie','The crowd cannot guard for you.','No, but they can count every clean hit.'],
 ['cipher','brick','Every wall has a weak point.','Bring better plans than the last crew.'],
 ['cipher','jade','Your steps repeat. I caught the pattern.','That was the warmup.'],
 ['cipher','rook','I know where you want this fight.','Knowing and stopping it are different jobs.'],
 ['cipher','haze','You move fast. Your habits do not.','Keep watching. You might learn something.'],
 ['cipher','goldie','There is a plan under all that style.','Of course. Make the whole block remember.'],
 ['brick','jade','You cannot dance through a wall.','I only need to dance around it.'],
 ['brick','rook','Same block. Different kind of heavy.','Let the footwork decide the difference.'],
 ['brick','haze','You will have to stand still sometime.','Only when the round is over.'],
 ['brick','goldie','The block needs muscle, not a spotlight.','Tonight it gets both.'],
 ['jade','rook','Loosen up. Your shoulders tell on you.','Stay balanced. Your feet tell on you.'],
 ['jade','haze','Fast feet. Can you keep a rhythm?','Set the track. I will set the pace.'],
 ['jade','goldie','The circle has room for one headliner.','Then let us earn the encore.'],
 ['rook','haze','Speed means nothing without a landing.','Catch me before you coach me.'],
 ['rook','goldie','Give the crowd a clean fight.','Clean hands. Loud finish.'],
 ['haze','goldie','Blink and you miss the whole show.','Then I will make the replay worth it.']
];
const RIVAL_REMATCH={
 volt:['Same pace. Sharper hands.','I caught the timing. Run it back.'],
 ember:['Patience paid. Let us see it again.','I rushed once. That ends here.'],
 cipher:['The read was right. New chapter?','New round. Revised plan.'],
 brick:['Still standing. Still my block.','That crack gets patched right now.'],
 jade:['Found the rhythm. Want another dance?','New beat. Try following this one.'],
 rook:['Balance held. Let us keep it clean.','I found the step I missed.'],
 haze:['Too quick last time. Keep up.','That one slowed me down. Not this one.'],
 goldie:['The block asked for an encore.','They have not heard my best verse yet.']
};
let rivalLastMatch=null,rivalArtTime=-1,rivalIntroCaption='';
function rivalIdentity(f){return f.isCrewBoss?'rivet':f.isBoss?'promoter':f.character}
function rivalExchange(a,b){
 const aid=rivalIdentity(a),bid=rivalIdentity(b);
 if(rivalLastMatch&&rivalLastMatch.mode===gameMode&&rivalLastMatch.ids.includes(aid)&&rivalLastMatch.ids.includes(bid)&&rivalLastMatch.ids.slice().sort().join(':')===[aid,bid].sort().join(':')){
 const line=f=>{const id=rivalIdentity(f);return RIVAL_REMATCH[f.character]?.[id===rivalLastMatch.winner?0:1]||'Run it back. We settle it clean.'};
 return {lines:[line(a),line(b)],caption:'RUN IT BACK / THE RIVALRY CONTINUES',rematch:true};
 }
 if(b.isCrewBoss)return {lines:['Cleveland heard the call. I came to answer.','The mills went quiet. These hands never did.'],caption:'THE 216 / EARN YOUR NAME'};
 if(b.isBoss)return {lines:['The main event needs a new headliner.','A name on the flyer has to be earned.'],caption:'FINAL CONTRACT / MAIN EVENT'};
 const pair=RIVAL_EXCHANGES.find(p=>p[0]===aid&&p[1]===bid||p[0]===bid&&p[1]===aid);
 const lines=pair?(pair[0]===aid?[pair[2],pair[3]]:[pair[3],pair[2]]):['Same name. Different game.','Then let the hands decide.'];
 return {lines,caption:selectedStage==='cleveland'?'CUYAHOGA CYPHER / THE BLOCK IS LISTENING':'ONE BLOCK / TWO REPUTATIONS'};
}
const poseBeforeRivalFaceoffs=detailedArtPose;
detailedArtPose=function(f){
 const p=poseBeforeRivalFaceoffs(f);
 if(!f.rivalFaceoff||!strongEffects)return p;
 const t=f.animTime||0,w=Math.sin(t*4);
 if(f.character==='volt'){p.angle+=w*.035;p.sy*=1+w*.012}
 if(f.character==='ember'){p.angle+=w*.025;p.sy*=1+w*.018}
 if(f.character==='cipher')p.angle-=Math.sin(Math.min(1,t/.8)*Math.PI)*.045;
 if(f.character==='brick')p.sx*=1+Math.abs(w)*.025;
 if(f.character==='jade'){p.angle+=w*.07;p.x+=w*6}
 if(f.character==='rook')p.angle+=Math.sin(Math.min(1,t/1.1)*Math.PI)*.1;
 if(f.character==='haze'){p.x+=Math.sin(t*7)*7;p.y-=Math.abs(Math.sin(t*7))*3}
 if(f.character==='goldie'){p.angle+=w*.035;p.y-=Math.abs(w)*2}
 return p;
};
function paintRivalFaceoffs(){
 if(!fightOpening||fightOpening.phase!=='versus'||document.hidden)return;
 for(const [side,source,face] of [['Player',player,1],['Enemy',enemy,-1]]){
 const target=$('#rival'+side+'Canvas'),g=target.getContext('2d');
 const image=source.isBoss?motionArt.promoter:arcadeSprites[source.character];
 const ready=!!image?.complete&&image.naturalWidth>=1280;
 $('#opening'+side+'Art').classList.toggle('rival-art-ready',ready);
 if(!ready)continue; // Original portraits remain the loading fallback.
 const t=strongEffects?fightOpening.time:0;
 const fake={character:source.character,isBoss:source.isBoss,isCrewBoss:source.isCrewBoss,x:180+(strongEffects?Math.sin(t*2)*3:0),y:ground,face,hp:100,stun:0,blockstun:0,attack:null,animTime:t,tauntTime:strongEffects?1:0,rivalFaceoff:true,invulnerable:0,hitFlash:0};
 g.save();g.clearRect(0,0,360,300);g.translate(0,-150);
 renderStreetFighter(g,fake,2.7);g.restore();
 }
 const caption=fightOpening.time<1.6?fighterName(player)+' SPEAKS':fighterName(enemy)+' ANSWERS';
 $('#rivalIntroStatus').textContent=rivalIntroCaption+' · '+caption;
 $('#openingPlayerArt').classList.toggle('rival-speaking',fightOpening.time<1.6);
 $('#openingEnemyArt').classList.toggle('rival-speaking',fightOpening.time>=1.6);
}
const startBeforeRivalIntros=startFightOpening;
startFightOpening=function(versus=true){
 startBeforeRivalIntros(versus);
 if(!versus||!fightOpening)return;
 const exchange=rivalExchange(player,enemy);
 $('#openingPlayerLine').textContent='“'+exchange.lines[0]+'”';
 $('#openingEnemyLine').textContent='“'+exchange.lines[1]+'”';
 fightOpening.versusDuration=exchange.rematch?3.2:3.8;
 rivalIntroCaption=exchange.caption;rivalArtTime=-1;
 $('#rivalSkipIntro').hidden=false;paintRivalFaceoffs();
};
function skipRivalIntro(){
 if(mode!=='intro'||fightOpening?.phase!=='versus')return false;
 clearInput();openingPhase('fight');return true;
}
$('#rivalSkipIntro').onclick=skipRivalIntro;
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#controlSettings').hidden!==false&&skipRivalIntro())e.preventDefault()});
const updateBeforeRivalIntros=update;
update=function(dt){
 updateBeforeRivalIntros(dt);
 if(mode!=='intro'||fightOpening?.phase!=='versus'||document.hidden)return;
 if(fightOpening.time-rivalArtTime<1/30)return;
 rivalArtTime=fightOpening.time;paintRivalFaceoffs();
};
const endBeforeRivalIntros=endRound;
endRound=function(){
 const active=mode==='playing'&&gameMode!=='training';endBeforeRivalIntros();
 if(active&&mode==='finished')rivalLastMatch={mode:gameMode,ids:[rivalIdentity(player),rivalIdentity(enemy)],winner:wins[0]>wins[1]?rivalIdentity(player):rivalIdentity(enemy)};
};
const dismissBeforeRivalIntros=dismissFightOpening;
dismissFightOpening=function(){
 dismissBeforeRivalIntros();rivalArtTime=-1;
 for(const side of ['Player','Enemy']){$('#opening'+side+'Art').classList.remove('rival-speaking','rival-art-ready')}
};
$('#rivalSkipIntro').hidden=true;
