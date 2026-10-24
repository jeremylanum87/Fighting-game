'use strict';
const fs=require('node:fs'),Module=require('node:module');
const m=new Module(__filename+'.integration',module);m.filename=__filename;m.paths=module.paths;
const checks=String.raw`{
for(const side of ['Player','Enemy'])$('#opening'+side+'Art').classList.toggle=()=>{};
showTitleScreen();startMode('quick');selectCharacter('volt');$('#confirmFighter').onclick();$('#stageFightStart').onclick();dismissFightOpening();mode='playing';sound=true;mixPrefs.announcer=true;mixPrefs.effects=.8;document.hidden=false;$('#controlSettings').hidden=true;
const delivered=[];speechSynthesis.speak=u=>delivered.push(u);clearDjUpgrade();djHistory.clear();djPrefs.style='hype';djPrefs.chatter='full';djPrefs.volume=.5;djPrefs.captions=true;
if(!queueDjCall('combo','Clean combination!',40,6000)||!djActive||delivered.length!==1)throw Error('Queued speech missing');if(queueDjCall('combo','Repeat',40,6000))throw Error('Cooldown failed');const old=delivered[0];announce('Fight!');if(djActive?.kind!=='fight'||delivered.length!==2)throw Error('Critical preemption failed');old.onend();if(djActive?.kind!=='fight')throw Error('Stale callback cancelled new line');if(delivered[1].volume!==.4)throw Error('Independent volume wrong');
for(let i=0;i<10;i++)queueDjCall('extra'+i,'Extra',30,0);if(djQueue.length>3)throw Error('Unbounded queue');
clearDjUpgrade();djPrefs.chatter='key';if(queueDjCall('light','Noise',40,0))throw Error('Key moments leaked chatter');announce('Round 2');if(!djActive||!djActive.text.includes('2'))throw Error('Round call missing');
clearDjUpgrade();sound=false;const count=delivered.length;djPrefs.chatter='full';queueDjCall('caption','Muted caption',40,0);if(delivered.length!==count||$('#djCaption').hidden)throw Error('Muted/caption fallback');sound=true;
clearDjUpgrade();const nativeCalls=[];window.BlockCypherVoice={isReady:()=>true,getVoices:()=>JSON.stringify([{name:'Native Test',lang:'en-US',voiceURI:'android:native-test',localService:true}]),speak:(...args)=>nativeCalls.push(args),stop:()=>{}};djVoiceChoice='android:native-test';queueDjCall('native','Native DJ test',80,0);if(nativeCalls.length!==1||nativeCalls[0][4]!=='android:native-test'||!englishDjVoices().some(v=>v.voiceURI==='android:native-test'))throw Error('Android voice route failed');
const token=djActive.token;finishDjCall(token+1);if(!djActive)throw Error('Wrong native token accepted');finishDjCall(token);if(djActive)throw Error('Native completion failed');delete window.BlockCypherVoice;
clearDjUpgrade();document.hidden=true;if(queueDjCall('hidden','Hidden',80,0))throw Error('Hidden call queued');document.hidden=false;
queueDjCall('cleanup','Cleanup',80,0);quietQualityVoices();if(djActive||djQueue.length||!$('#djCaption').hidden||voiceDuckUntil)throw Error('Mute cleanup failed');
console.log('PASS priority/preemption, stale callback protection, bounded queue, repeat cooldown, independent volume, key-moment filtering, captions, native Android routing and visibility/mute cleanup');
}`;
const loads=['perfect-block.js','defense.js','defense-training.js','release-demo.js','rival-intros.js','gamepad.js','story.js','battle-damage.js','finishers.js','victory-flow.js','round-impact.js','defeated.js','air-combos.js','showcase.js','movement-polish.js','photo-stage-details.js','release-character-polish.js','highlight-replay.js','mobile-release-polish.js','dj-upgrade.js'].map(name=>"\nvm.runInContext(fs.readFileSync(__dirname+'/"+name+"','utf8'),env);").join('');
m._compile(fs.readFileSync(__dirname+'/combat.test.cjs','utf8')+loads+
"\nvm.runInContext("+JSON.stringify(checks)+",env);",__filename);
