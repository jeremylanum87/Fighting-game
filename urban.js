'use strict';
// Original court artwork and synthesized beat. No sampled recordings.
const court=document.createElement('canvas');court.width=1100;court.height=520;
const street=court.getContext('2d');
function buildCourt(){
 const g=street;const fill=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
 const sky=g.createLinearGradient(0,0,0,430);sky.addColorStop(0,'#19212b');sky.addColorStop(1,'#bd7653');g.fillStyle=sky;g.fillRect(0,0,1100,520);
 // Apartment blocks and window grids.
 for(let b=0;b<13;b++){const x=b*95-35,top=55+(b*41%110);fill(x,top,88,260,'#292c31');fill(x+3,top+5,82,4,'#46413c');for(let y=top+18;y<290;y+=27)for(let col=0;col<4;col++){fill(x+10+col*19,y,10,15,(b+col+y)%5===0?'#dba65e':'#53514b');fill(x+10+col*19,y+8,10,2,'#292c31')}if(b%3===0){g.strokeStyle='#151d23';g.lineWidth=3;for(let y=top+45;y<290;y+=40){g.strokeRect(x+45,y,36,7);g.beginPath();g.moveTo(x+48,y+7);g.lineTo(x+75,y+40);g.stroke()}}}
 // Brick retaining wall.
 fill(0,264,1100,157,'#57403b');for(let row=0;row<10;row++){const y=267+row*16;fill(0,y,1100,2,'#302e2c');for(let x=(row%2)*35;x<1100;x+=70)fill(x,y,2,16,'#302e2c')}
 // Pasted flyers and original hand-lettered tags.
 for(const [x,y,rot,text] of [[50,309,-.08,'BLOCK PARTY'],[888,316,.07,'OPEN MIC'],[945,292,-.09,'2010']]){g.save();g.translate(x,y);g.rotate(rot);fill(-4,-5,75,66,'#c5b99c');fill(0,0,67,12,'#242a2b');g.fillStyle='#ba5138';g.font='900 10px sans-serif';g.fillText(text,1,30);g.fillStyle='#2b3435';g.font='8px monospace';g.fillText('FRI / 8PM',3,46);g.restore()}
 g.save();g.translate(213,355);g.rotate(-.055);g.font='italic 900 87px Impact, sans-serif';g.lineJoin='round';g.lineWidth=14;g.strokeStyle='#252c2c';g.strokeText('BLOCK',0,0);g.lineWidth=6;g.strokeStyle='#d9cba2';g.strokeText('BLOCK',0,0);g.fillStyle='#e6ab3c';g.fillText('BLOCK',0,0);g.font='italic 900 47px Impact,sans-serif';g.fillStyle='#72a69b';g.fillText('CYPHER / 2010',27,52);g.restore();
 // Chain-link court fence, posts, and a basketball hoop.
 g.strokeStyle='#9a99965c';g.lineWidth=1;for(let x=-190;x<1250;x+=25){g.beginPath();g.moveTo(x,195);g.lineTo(x+120,300);g.stroke();g.beginPath();g.moveTo(x+120,195);g.lineTo(x,300);g.stroke()}fill(0,191,1100,5,'#5a6264');for(const x of [20,355,735,1080])fill(x,190,5,114,'#717673');
 fill(825,164,8,225,'#626968');fill(768,146,123,76,'#d3cdb4');fill(775,153,109,62,'#79888a');g.strokeStyle='#e4d9b7';g.lineWidth=3;g.strokeRect(810,182,40,28);g.strokeStyle='#d9663d';g.lineWidth=5;g.beginPath();g.ellipse(831,222,27,5,0,0,Math.PI*2);g.stroke();g.strokeStyle='#e8e0c399';g.lineWidth=1;for(let i=0;i<7;i++){g.beginPath();g.moveTo(806+i*8,224);g.lineTo(817+i*5,248);g.stroke()}g.beginPath();g.moveTo(817,248);g.lineTo(847,248);g.stroke();
 // Asphalt and painted court markings.
 const asphalt=g.createLinearGradient(0,411,0,520);asphalt.addColorStop(0,'#363c3d');asphalt.addColorStop(1,'#242d30');g.fillStyle=asphalt;g.fillRect(0,411,1100,109);fill(0,410,1100,4,'#b2a587');g.strokeStyle='#d7c9a16b';g.lineWidth=3;g.beginPath();g.ellipse(550,495,160,47,0,0,Math.PI*2);g.stroke();g.beginPath();g.moveTo(550,414);g.lineTo(550,520);g.stroke();g.strokeRect(770,423,220,86);for(let i=0;i<160;i++){const x=(i*127)%1100,y=417+(i*37)%103;fill(x,y,2,1,'#c7bda515')}
 g.strokeStyle='#111c1e';g.lineWidth=2;g.beginPath();g.moveTo(145,520);g.lineTo(168,481);g.lineTo(156,469);g.lineTo(181,437);g.stroke();
 // Boombox on the edge of the court.
 fill(68,375,111,41,'#172327');fill(76,380,94,31,'#68716a');for(const x of [94,151]){g.fillStyle='#19282b';g.beginPath();g.arc(x,396,13,0,Math.PI*2);g.fill();g.strokeStyle='#b9b59a';g.lineWidth=2;g.stroke();g.beginPath();g.arc(x,396,5,0,Math.PI*2);g.stroke()}fill(113,386,20,10,'#dbb247');g.strokeStyle='#172327';g.lineWidth=5;g.strokeRect(96,364,51,12);
 // Street lamps cast warm pools of light.
 for(const x of [178,1025]){fill(x,118,6,297,'#242d2d');fill(x-29,117,64,8,'#3e4744');const glow=g.createRadialGradient(x,130,4,x,130,130);glow.addColorStop(0,'#ffc26755');glow.addColorStop(1,'#ffc26700');g.fillStyle=glow;g.fillRect(x-130,0,260,260);fill(x-23,125,53,5,'#ffdb8d')}
 g.fillStyle='#dfd3b5';g.font='bold 11px monospace';g.fillText('THE BLOCK / AFTER HOURS',22,499);
}
buildCourt();
draw=function(){ctx.drawImage(court,0,0);drawFighter(player);drawFighter(enemy);for(const p of particles){ctx.globalAlpha=p.t/.3;rect(p.x,p.y,5,5,p.color)}ctx.globalAlpha=1;updateBeat()};
// 92 BPM swung sixteenth-note groove, synthesized with Web Audio.
let beatAudio=null,beatBus=null,beatTime=0,beatStep=0,beatNoise=null;
function initBeat(){if(beatAudio)return;beatAudio=new AudioContext();beatBus=beatAudio.createGain();beatBus.gain.value=0;beatBus.connect(beatAudio.destination);beatNoise=beatAudio.createBuffer(1,beatAudio.sampleRate*.2,beatAudio.sampleRate);const data=beatNoise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;}
function drum(at,type){const ac=beatAudio,gain=ac.createGain();gain.connect(beatBus);if(type==='kick'||type==='bass'){const osc=ac.createOscillator();osc.connect(gain);osc.type=type==='bass'?'triangle':'sine';osc.frequency.setValueAtTime(type==='bass'?[55,55,65.41,49][Math.floor(beatStep/8)%4]:130,at);if(type==='kick')osc.frequency.exponentialRampToValueAtTime(42,at+.13);gain.gain.setValueAtTime(type==='bass'?.14:.55,at);gain.gain.exponentialRampToValueAtTime(.001,at+.22);osc.start(at);osc.stop(at+.24)}else{const src=ac.createBufferSource(),filter=ac.createBiquadFilter();src.buffer=beatNoise;filter.type='highpass';filter.frequency.value=type==='hat'?6500:1200;src.connect(filter);filter.connect(gain);gain.gain.setValueAtTime(type==='hat'?.08:.23,at);gain.gain.exponentialRampToValueAtTime(.001,at+(type==='hat'?.035:.12));src.start(at);src.stop(at+.16)}}
function updateBeat(){if(!beatAudio)return;const on=sound&&mode==='playing'&&!document.hidden;beatBus.gain.setTargetAtTime(on?.32:0,beatAudio.currentTime,.04);if(!on){beatTime=0;return}if(!beatTime)beatTime=beatAudio.currentTime+.04;let guard=0;while(beatTime<beatAudio.currentTime+.1&&guard++<4){const n=beatStep%16;if([0,7,10].includes(n))drum(beatTime,'kick');if(n===4||n===12)drum(beatTime,'snare');if(n%2===0||n===15)drum(beatTime,'hat');if(n%4===0)drum(beatTime,'bass');beatStep++;beatTime+=(60/92/4)*(n%2?.84:1.16)}}
const originalSoundClick=$('#sound').onclick;$('#sound').onclick=()=>{originalSoundClick();if(sound){try{initBeat();beatAudio.resume().catch(()=>{});}catch{}}$('#sound').textContent=sound?'BEAT ON':'BEAT OFF'};
