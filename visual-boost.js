'use strict';
// Cached material highlights supplement the 1.5× texture/ray/trail detail pass.
const visualBoostCache=new Map();
function visualBoostLayer(id){if(visualBoostCache.has(id))return visualBoostCache.get(id);const c=document.createElement('canvas');c.width=1100;c.height=520;const g=c.getContext('2d'),p=STAGE_MATERIALS[id]||STAGE_MATERIALS.court,pal=STAGE_ACCENTS[id]||STAGE_ACCENTS.court;
 const line=(x,y,a,b,color,w=1)=>{g.strokeStyle=color;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(a,b);g.stroke()};
 const glass=(x,y,w,h)=>{const shine=g.createLinearGradient(x,y,x+w,y+h);shine.addColorStop(0,'#e3faff00');shine.addColorStop(.4,'#e3faff00');shine.addColorStop(.43,'#e3faff24');shine.addColorStop(.57,'#e3faff0a');shine.addColorStop(.6,'#e3faff00');g.fillStyle=shine;g.fillRect(x,y,w,h);line(x+2,y+2,x+w-2,y+2,'#e1fcff55',1)};
 const glow=(x,y,r,color)=>{const a=g.createRadialGradient(x,y,0,x,y,r);a.addColorStop(0,color);a.addColorStop(1,'#00000000');g.fillStyle=a;g.fillRect(x-r,y-r,r*2,r*2)};
 // Broad light stays at the sides; the central fight lane retains its contrast.
 glow(20,330,155,pal[0]+'18');glow(1080,320,170,pal[1]+'16');
 if(id==='cleveland'){for(let x=50;x<1060;x+=51){line(x,209,x+9,209,'#ffde9b80');line(x,269,x+9,269,'#a2d5d580');for(const y of [215,261]){g.fillStyle='#f4d59b88';g.fillRect(x,y,2,2)}}for(let i=0;i<75;i++){const x=i*83%1100,y=284+i%12*6;line(x,y,x+6+i%7*3,y,i%3?'#a4dce945':'#ffe0a277',1)}for(const x of [16,65,111,958,1007,1053])glass(x,187,22,42)}
 else if(id==='subway'){for(const x of [85,520,1005]){line(x+3,82,x+3,402,'#d7f3dd6b');line(x+24,82,x+24,402,'#0c263c70')}for(let x=20;x<1100;x+=44){g.fillStyle='#f9dfa379';g.fillRect(x,422,2,1)}glass(170,110,112,54);for(let x=10;x<1100;x+=60)line(x,120,x+35,120,'#effef51f')}
 else if(id==='corner'){for(const x of [220,680]){glass(x+3,223,178,165);for(let j=0;j<7;j++){line(x+12+j*23,273,x+18+j*23,273,'#f0d9a994');line(x+12+j*23,299,x+18+j*23,299,'#e8f8d077')}}line(181,145,918,145,'#fff0c16b',2)}
 else if(id==='laundromat'){for(let i=0;i<6;i++){const x=(i<3?250+i*93:663+(i-3)*88);for(let j=0;j<12;j++){const a=j*Math.PI/6;line(x+Math.cos(a)*25,349+Math.sin(a)*25,x+Math.cos(a)*27,349+Math.sin(a)*27,'#efffff88',1)}glass(x-28,326,56,41)}glass(196,207,305,188);glass(612,207,288,188)}
 else if(id==='warehouse'){for(const x of [170,640])glass(x,32,280,62);for(let x=155;x<960;x+=36){if(x>490&&x<622)continue;line(x,196,x,401,'#f1d6a22c');for(const y of [203,387]){g.fillStyle='#d4d4b77a';g.fillRect(x,y,2,2)}}}
 else if(id==='underpass'){for(const x of [86,954]){for(let i=0;i<24;i++){const y=145+i*10;line(x+8+i%4*10,y,x+12+i%4*10,y+2,'#d0d3b42c')}line(x+40,178,x+31,219,'#152d3440');line(x+31,219,x+43,244,'#152d3440')}}
 else if(id==='court'){for(const [a,b]of [[0,180],[920,1100]])for(let x=a;x<b;x+=12){g.fillStyle='#c6e5cc44';g.fillRect(x,241,2,2)}for(let i=0;i<36;i++){const x=i*131%1100;line(x,412,x+9,412,'#f8dfb528')}}
 else if(id==='rooftop'||id==='parking'){for(let i=0;i<70;i++){const x=i*61%1100,y=190+i%7*19;line(x,y,x+3,y,'#ffd9993d')}for(const x of [25,1018])line(x,282,x+60,282,'#ffe8ba66');if(id==='rooftop')for(let j=0;j<15;j++)line(836+j*6,286,836+j*6,313,'#d4e4dc33');else{glass(829,212,174,96);line(0,477,1100,477,'#ffdf914f')}}
 else if(id==='blockparty'){for(let j=0;j<22;j++){const x=165+j*35;glow(x,52+j*.7,11,'#fff1b322')}for(let i=0;i<8;i++){const x=i*153-20;glass(x+20,95+i%3*25,45,75)}}
 // Fine seams and edge glints support the existing floor perspective.
 for(let i=0;i<84;i++){const x=i*137.3%1100,y=432+i*23.7%77;line(x,y,x+3+i%4*4,y,p.bounce+'24',.6)}
 const cap=coarseGameDevice()?1:2;if(visualBoostCache.size>=cap)visualBoostCache.delete(visualBoostCache.keys().next().value);visualBoostCache.set(id,c);return c;
}
const backdropBeforeVisualBoost=drawStageBackdrop;
drawStageBackdrop=function(g){backdropBeforeVisualBoost(g);if(visualQualityMode==='performance')return;g.save();g.drawImage(visualBoostLayer(selectedStage),0,0);g.restore()};
const trimBeforeVisualBoost=trimReleaseVisualCaches;trimReleaseVisualCaches=function(){trimBeforeVisualBoost();visualBoostCache.clear()};
