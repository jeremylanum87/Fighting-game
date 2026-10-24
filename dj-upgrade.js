'use strict';
const DJ_CALLS={
 launch:['Take it upstairs!','Air time!','To the skyline!'],
 juggle:['Keep that combo flying!','Above the block!','Skyline pressure!'],
 combo:['Clean combination!','That is a statement!','Putting it together!'],
 perfect:['Perfect defense!','Denied! Clean block!','Right on time!'],
 comeback:['Still in this!','Do not count them out!','The comeback is alive!'],
 meteor:['Bring it down!','Meteor crash!','Back to the pavement!'],
 throw:['Take a seat!','Caught you reaching!','No standing around!'],
 fight:["Let's go! Fight!",'Step up! Fight!','The circle is yours! Fight!'],
 round:['Stay ready! Round','Next up! Round','Hands up! Round'],
 knockout:['Knockout! That is the round!','Lights out! That is the round!','Knockout! Respect the finish!'],
 intro:["You're tuned into Block Cypher. Step to the circle!"]};
let djPrefs={style:'hype',volume:.85,captions:true,chatter:'full',...(safeStorageGet('block-cypher-dj-upgrade-v1')||{})};
if(!['hype','classic','minimal'].includes(djPrefs.style))djPrefs.style='hype';if(!['full','key'].includes(djPrefs.chatter))djPrefs.chatter='full';djPrefs.volume=Math.max(0,Math.min(1,Number(djPrefs.volume)||0));djPrefs.captions=djPrefs.captions!==false;
let djQueue=[],djActive=null,djToken=0,djGap=0,djCaptionLife=0,djHistory=new Map(),djVariations={},djComboCalls=new WeakMap(),djComebackCalled=new WeakSet();
function nativeDj(){return typeof window.BlockCypherVoice!=='undefined'?window.BlockCypherVoice:null}
const englishBeforeDjUpgrade=englishDjVoices;
englishDjVoices=function(){const voices=englishBeforeDjUpgrade();try{const bridge=nativeDj();if(bridge){const native=JSON.parse(bridge.getVoices());if(Array.isArray(native))for(const v of native)if(typeof v.name==='string'&&/^en(?:-|$)/i.test(v.lang))voices.push(v)}}catch{}return voices};
const selectedBeforeDjUpgrade=selectedDjVoice;
selectedDjVoice=function(){const voices=englishDjVoices();if(djVoiceChoice!=='auto')return selectedBeforeDjUpgrade();const score=v=>(v.localService?100:0)+(v.lang==='en-US'?15:0)+(/natural|enhanced|premium|neural/i.test(v.name)?20:0)+(Number(v.quality)||0)/50;return voices.sort((a,b)=>score(b)-score(a))[0]||null};
const refreshBeforeDjUpgrade=refreshDjVoices;
refreshDjVoices=function(){refreshBeforeDjUpgrade();const bridge=nativeDj();if(bridge){$('#djVoice').disabled=false;$('#testDj').disabled=false;$('#djVoiceStatus').textContent=bridge.isReady()?'Android DJ voice / uses installed English voices. Local voices can work offline.':'Android DJ voice is starting or needs an English voice installed. Captions remain available.'}};
function djPick(kind){const lines=DJ_CALLS[kind]||DJ_CALLS.intro,n=djVariations[kind]||0;djVariations[kind]=n+1;return lines[n%lines.length]}
function djVoiceAllowed(){return sound&&mixPrefs.announcer&&mixPrefs.effects>0&&djPrefs.volume>0&&!document.hidden}
function clearDjUpgrade(){djToken++;djActive=null;djQueue=[];djGap=0;djCaptionLife=0;$('#djCaption').hidden=true;voiceDuckUntil=0;voiceDuckToken++;try{if(typeof speechSynthesis!=='undefined')speechSynthesis.cancel();nativeDj()?.stop()}catch{}}
function finishDjCall(token){if(!djActive||djActive.token!==token)return;djActive=null;djGap=.22;voiceDuckUntil=(audio?.currentTime||0)+.1}
function pumpDjCalls(){
 if(djActive||djGap>0||document.hidden)return;const now=performance.now();djQueue=djQueue.filter(c=>c.expires>now);if(!djQueue.length)return;
 djQueue.sort((a,b)=>b.priority-a.priority||a.at-b.at);const call=djQueue.shift(),token=++djToken;
 djActive={...call,token,age:0,limit:Math.min(7,1.2+call.text.length*.065)};
 if(djPrefs.captions){$('#djCaption').textContent='BLOCK RADIO / '+call.text;$('#djCaption').hidden=false;djCaptionLife=Math.min(4,1.5+call.text.length*.025)}
 if(!djVoiceAllowed()){finishDjCall(token);return}
 const voice=selectedDjVoice(),rate=djPrefs.style==='hype'?1.09:djPrefs.style==='classic'?.99:1.03,pitch=djPrefs.style==='hype'?.9:.96,volume=djPrefs.volume*mixPrefs.effects;
 try{
 const bridge=nativeDj(),useNative=bridge&&(!voice||voice.voiceURI?.startsWith('android:')||typeof speechSynthesis==='undefined');
 if(useNative){if(!bridge.isReady()){finishDjCall(token);return}voiceDuckUntil=(audio?.currentTime||0)+djActive.limit;bridge.speak(call.text,rate,pitch,volume,voice?.voiceURI||'',String(token));if(djPrefs.style==='hype'&&call.priority>=70)playDjDrop();return}
 if(typeof speechSynthesis==='undefined'||typeof SpeechSynthesisUtterance==='undefined'){finishDjCall(token);return}
 const u=new SpeechSynthesisUtterance(call.text);u.lang=voice?.lang||'en-US';if(voice)u.voice=voice;u.rate=rate;u.pitch=pitch;u.volume=volume;beginVoiceDuck(u);const start=u.onstart,end=u.onend,error=u.onerror;u.onstart=()=>{if(!djActive||djActive.token!==token)return;if(start)start();if(djPrefs.style==='hype'&&call.priority>=70)playDjDrop()};u.onend=()=>{if(!djActive||djActive.token!==token)return;if(end)end();finishDjCall(token)};u.onerror=()=>{if(!djActive||djActive.token!==token)return;if(error)error();finishDjCall(token)};speechSynthesis.speak(u);
 }catch{finishDjCall(token)}
}
function queueDjCall(kind,text,priority=40,cooldown=5000){
 if(document.hidden||(!djVoiceAllowed()&&!djPrefs.captions))return false;
 if((djPrefs.chatter==='key'||djPrefs.style==='minimal')&&priority<70)return false;
 const now=performance.now(),key=kind,last=djHistory.get(key);if(last!==undefined&&now-last<cooldown)return false;djHistory.set(key,now);
 const call={kind,text,priority,at:now,expires:now+(priority>=70?4500:2000)};
 if(djActive&&priority>=80&&priority>djActive.priority){const caption=call;clearDjUpgrade();djQueue.push(caption)}else {djQueue.push(call);djQueue.sort((a,b)=>b.priority-a.priority||a.at-b.at);djQueue=djQueue.slice(0,3)}pumpDjCalls();return true;
}
announce=function(text){let kind='intro',priority=70,line=text;
 const roundMatch=/^Round (\d+)$/.exec(text),winner=/^(?:Knockout!\s*)?(.+?) wins!$/.exec(text);
 if(roundMatch){kind='round-'+roundMatch[1];priority=85;line=djPrefs.style==='hype'?djPick('round')+' '+roundMatch[1]+'!':'Round '+roundMatch[1]+'.'}
 else if(/^Fight!?$/i.test(text)){kind='fight';priority=95;line=djPrefs.style==='hype'?djPick('fight'):'Fight!'}
 else if(winner){kind='winner';priority=100;line=djPrefs.style==='hype'?'Make some noise for '+winner[1]+'!':winner[1]+' wins!'}
 else if(/Knockout!|Round over!/.test(text)){kind='round-end';priority=100;line=/Knockout!/.test(text)?djPick('knockout'):'That is the round! Stay ready!'}
 else if(Object.values(SUPER_MOVES).some(m=>m.name===text)||text==='Final Contract'){kind='super';priority=90;line=djPrefs.style==='hype'?'Turn it up! '+text+'!':text+'!'}
 queueDjCall(kind,line,priority,kind==='fight'?800:1500);
};
const hitBeforeDjUpgrade=applyCombatHit;
applyCombatHit=function(a,t,m,d){const hp=t.hp,ok=hitBeforeDjUpgrade(a,t,m,d);if(!ok||t.hp<=0||mode!=='playing'||gameMode==='training')return ok;
 if(t.blockstun>0){if(guardTiming.get(t)?.age<=.12)queueDjCall('perfect',djPick('perfect'),45,6500);return ok}if(t.hp>=hp)return ok;
 if(m.airKind==='launcher')queueDjCall('launch',djPick('launch'),50,6000);
 else if(m.airKind==='meteor')queueDjCall('meteor',djPick('meteor'),55,6500);
 else if(m.grab)queueDjCall('throw',djPick('throw'),45,6500);
 else if(a.combo>=4&&!djComboCalls.get(a)){djComboCalls.set(a,true);queueDjCall('combo',djPick(a.y<ground?'juggle':'combo'),50,6000)}
 if(a.hp/a.maxHp<=.25&&!djComebackCalled.has(a)){djComebackCalled.add(a);queueDjCall('comeback',fighterName(a)+'! '+djPick('comeback'),60,9000)}return ok;
};
const updateBeforeDjUpgrade=update;
update=function(dt){updateBeforeDjUpgrade(dt);if(document.hidden||mode==='paused')return;for(const f of [player,enemy])if(!f.combo||!f.comboTimer)djComboCalls.delete(f);if(djActive){djActive.age+=dt;if(djActive.age>=djActive.limit){try{if(typeof speechSynthesis!=='undefined')speechSynthesis.cancel();nativeDj()?.stop()}catch{}finishDjCall(djActive?.token)}}djGap=Math.max(0,djGap-dt);djCaptionLife=Math.max(0,djCaptionLife-dt);if(!djCaptionLife)$('#djCaption').hidden=true;pumpDjCalls()};
function saveDjUpgrade(){safeStorageSet('block-cypher-dj-upgrade-v1',djPrefs);$('#djStyle').value=djPrefs.style;$('#djChatter').value=djPrefs.chatter;$('#djAnnouncerVolume').value=Math.round(djPrefs.volume*100);$('#djCaptions').checked=djPrefs.captions}
$('#djStyle').onchange=()=>{clearDjUpgrade();djPrefs.style=$('#djStyle').value;saveDjUpgrade()};$('#djChatter').onchange=()=>{clearDjUpgrade();djPrefs.chatter=$('#djChatter').value;saveDjUpgrade()};$('#djAnnouncerVolume').oninput=()=>{djPrefs.volume=Math.max(0,Math.min(1,Number($('#djAnnouncerVolume').value)/100));clearDjUpgrade();saveDjUpgrade()};$('#djCaptions').onchange=()=>{djPrefs.captions=$('#djCaptions').checked;saveDjUpgrade();if(!djPrefs.captions)$('#djCaption').hidden=true};
const quietBeforeDjUpgrade=quietQualityVoices;quietQualityVoices=function(){clearDjUpgrade();quietBeforeDjUpgrade()};
const enabledBeforeDjUpgrade=$('#announcerEnabled').onchange;$('#announcerEnabled').onchange=()=>{clearDjUpgrade();enabledBeforeDjUpgrade()};
const voiceBeforeDjUpgrade=$('#djVoice').onchange;$('#djVoice').onchange=()=>{clearDjUpgrade();voiceBeforeDjUpgrade()};
const resetBeforeDjUpgrade=resetRound;resetRound=function(){clearDjUpgrade();djHistory.clear();djComboCalls=new WeakMap();djComebackCalled=new WeakSet();resetBeforeDjUpgrade()};
const titleBeforeDjUpgrade=showTitleScreen;showTitleScreen=function(){clearDjUpgrade();titleBeforeDjUpgrade()};
const effectsBeforeDjUpgrade=$('#volume-effects').oninput;$('#volume-effects').oninput=()=>{effectsBeforeDjUpgrade();if(mixPrefs.effects<=0)clearDjUpgrade()};
const selectBeforeDjUpgrade=openCharacterSelection;openCharacterSelection=function(){clearDjUpgrade();selectBeforeDjUpgrade()};
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearDjUpgrade()});
window.addEventListener('blockcypher-voice',e=>{if(e.detail?.state==='end'||e.detail?.state==='error')finishDjCall(Number(e.detail.token))});
window.addEventListener('blockcypher-voices-ready',refreshDjVoices);
saveDjUpgrade();refreshDjVoices();
