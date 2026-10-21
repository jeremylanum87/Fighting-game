'use strict';
const STAGE_ACCENTS={court:['#ffb633','#39dfc6'],subway:['#3eeaff','#ffb84c'],corner:['#ff8860','#52ffb7'],rooftop:['#ef7dff','#56dfff'],warehouse:['#ffca46','#ff6976'],cleveland:['#39ddff','#ffca61'],underpass:['#bd7aff','#57ffbc'],laundromat:['#ff65d2','#5cecff'],parking:['#ff956b','#a292ff'],blockparty:['#ffcc47','#3ae6b2']};
const stageGraphicsCache=new Map();
function enrichStageImage(source){const c=document.createElement('canvas');c.width=1100;c.height=520;const g=c.getContext('2d');g.drawImage(source,0,0);try{const frame=g.getImageData(0,0,1100,520),d=frame.data;for(let i=0;i<d.length;i+=4){const l=d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722;for(let k=0;k<3;k++){const v=l+(d[i+k]-l)*1.35;d[i+k]=Math.max(0,Math.min(255,(v-110)*1.08+114+(k===2&&l<75?5:0)))}}g.putImageData(frame,0,0)}catch{}return c}
const builderBeforeStageGraphics=buildNeighborhoodStage;
buildNeighborhoodStage=function(id){return enrichStageImage(builderBeforeStageGraphics(id))};
for(const id of Object.keys(stageCache))stageCache[id]=enrichStageImage(stageCache[id]);
const enrichedCourt=enrichStageImage(court);street.clearRect(0,0,1100,520);street.drawImage(enrichedCourt,0,0);
function stageGraphicsLayer(id){if(stageGraphicsCache.has(id))return stageGraphicsCache.get(id);const c=document.createElement('canvas');c.width=1100;c.height=520;const g=c.getContext('2d'),pal=STAGE_ACCENTS[id]||STAGE_ACCENTS.court;
 const line=(x,y,x2,y2,color,w=2)=>{g.strokeStyle=color;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke()};
 const glow=(x,y,r,color)=>{const a=g.createRadialGradient(x,y,0,x,y,r);a.addColorStop(0,color);a.addColorStop(1,'#00000000');g.fillStyle=a;g.fillRect(x-r,y-r,r*2,r*2)};
 // Static colored pools, edge light and pavement reflections are baked once.
 g.globalCompositeOperation='screen';g.globalAlpha=.25;glow(80,240,240,pal[0]);glow(1020,240,240,pal[1]);g.globalAlpha=.16;glow(540,100,370,pal[1]);g.globalAlpha=1;g.globalCompositeOperation='source-over';
 const floor=g.createLinearGradient(0,414,0,520);floor.addColorStop(0,pal[0]+'30');floor.addColorStop(.55,pal[1]+'10');floor.addColorStop(1,'#00000000');g.fillStyle=floor;g.fillRect(0,414,1100,106);
 for(let j=0;j<24;j++){const x=(j*137)%1100,y=430+(j*19)%69;line(x,y,x+20+j%4*13,y,pal[j%2]+(j%3?'38':'68'),1+j%2)}
 // Lighting stays around the edges, leaving the central combat space readable.
 for(const x of [10,1086]){g.fillStyle='#101d2b';g.fillRect(x,287,5,126);line(x+3,288,x+3,398,pal[x===10?0:1],3);glow(x,340,68,pal[x===10?0:1]+'44')}
 if(id==='cleveland'){
 line(496,126,496,277,'#72ebff88');line(573,126,573,277,'#ffce8399');for(const [x,y,w]of [[505,104,59],[512,86,45],[519,69,31],[526,52,17]])line(x,y,x+w,y,'#ffe4a1',2);
 for(let i=0;i<24;i++){const x=440+(i*29)%330,y=284+i%11*7;line(x,y,x+12+i%5*5,y,i%2?'#4deaff88':'#ffd87d99',2)}
 line(40,208,1060,208,'#9bddd866',2);line(40,269,1060,269,'#ebc78177',2);
 }else if(id==='laundromat'){
 for(const [y,color]of [[135,pal[1]],[175,pal[0]]]){line(183,y,917,y,color,4);g.globalAlpha=.2;line(183,y,917,y,color,14);g.globalAlpha=1}
 g.strokeStyle=pal[1];g.lineWidth=3;g.strokeRect(193,204,310,194);g.strokeStyle=pal[0];g.strokeRect(610,204,293,194);glow(550,158,210,'#ff62ce30');
 }else if(id==='underpass'||id==='court'){
 g.save();g.translate(id==='court'?216:270,id==='court'?355:349);g.rotate(-.05);g.font='italic 900 '+(id==='court'?87:79)+'px Impact,sans-serif';const grad=g.createLinearGradient(0,-70,0,10);grad.addColorStop(0,pal[1]);grad.addColorStop(1,pal[0]);g.lineWidth=3;g.strokeStyle='#19243c';g.fillStyle=grad;g.fillText(id==='court'?'BLOCK':'MAKE NOISE',0,0);g.strokeText(id==='court'?'BLOCK':'MAKE NOISE',0,0);g.restore();
 for(let i=0;i<18;i++){const x=220+i*33,y=365+i%3*12;line(x,y,x,y+8+i%4*4,pal[i%2]+'99',2)}
 }else if(id==='subway'){
 for(const x of [110,460,800]){line(x,39,x+185,39,'#bbfbff',4);glow(x+90,57,125,'#50dfff33')}
 line(0,415,1100,415,'#ffce5a',3);g.strokeStyle='#63eaff';g.lineWidth=2;g.strokeRect(320,103,430,54);
 }else if(id==='corner'){
 g.strokeStyle='#72ffd4';g.lineWidth=3;g.strokeRect(186,115,728,291);line(180,82,920,82,'#ffc583',3);g.fillStyle='#ff9173';g.font='bold 22px monospace';g.fillText('OPEN',712,252);glow(750,250,90,'#ff887744');
 }else if(id==='warehouse'){
 for(const x of [72,982]){g.strokeStyle=pal[x===72?0:1];g.lineWidth=3;g.strokeRect(x+3,277,59,132)}line(140,181,490,181,pal[0],3);line(610,181,960,181,pal[1],3);
 }else if(id==='rooftop'||id==='blockparty'){
 for(let i=0;i<19;i++){const x=15+i*59,y=id==='rooftop'?148+x*.022:85+x*.032;g.fillStyle=pal[i%2];g.fillRect(x,y,6,9);glow(x,y,16,pal[i%2]+'66')}
 if(id==='blockparty'){g.strokeStyle='#ffdb65';g.lineWidth=3;g.strokeRect(324,205,455,62)}
 }else if(id==='parking'){g.strokeStyle='#ffb290';g.lineWidth=3;g.strokeRect(820,204,192,112);for(const x of [36,980])glow(x+34,187,110,'#ffd59844');line(0,475,1100,475,'#ffe69d',2)}
 // Near-camera pavement chips add depth without covering fighter silhouettes.
 g.fillStyle='#111e2866';for(let i=0;i<17;i++){const x=(i*193)%1100;g.fillRect(x,510+i%3*3,15+i%4*9,2)}
 if(stageGraphicsCache.size>=4)stageGraphicsCache.delete(stageGraphicsCache.keys().next().value);stageGraphicsCache.set(id,c);return c;
}
const backdropBeforeStageGraphics=drawStageBackdrop;
drawStageBackdrop=function(g){backdropBeforeStageGraphics(g);g.save();g.drawImage(stageGraphicsLayer(selectedStage),0,0);if(strongEffects&&!reducedMotionPreference()){const t=neighborhoodTime,pal=STAGE_ACCENTS[selectedStage]||STAGE_ACCENTS.court;g.globalAlpha=.45;for(let i=0;i<12;i++){const x=(i*157+t*(i%2?5:-4)+2200)%1100,y=180+(i*37)%210+Math.sin(t*.7+i)*8;g.fillStyle=pal[i%2];g.fillRect(x,y,i%3?2:3,2)}}g.restore()};
stagePreviewKey='';
