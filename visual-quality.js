'use strict';
const VISUAL_MODES=['auto','performance','4k'];
let visualQualityMode=safeStorageGet('block-cypher-visual-quality-v1');if(!VISUAL_MODES.includes(visualQualityMode))visualQualityMode='auto';
let visualRenderScale=1,visualAutoWidth=1100,visualSampleLast=null,visualSampleMs=0,visualSampleCount=0;
const highDetailStages=new Map();
function autoVisualWidth(){const box=typeof canvas.getBoundingClientRect==='function'?canvas.getBoundingClientRect():null,width=box?.width||canvas.clientWidth||window.innerWidth||1100,dpr=Math.max(1,Math.min(2.5,window.devicePixelRatio||1)),wanted=width*dpr;return wanted>1900?2200:wanted>1300?1650:1100}
function applyVisualQuality(resetAuto=true){window.blockCypherVisualMode=visualQualityMode;if(resetAuto)visualAutoWidth=autoVisualWidth();const width=visualQualityMode==='4k'?3840:visualQualityMode==='performance'?1100:visualAutoWidth,height=Math.round(width*520/1100);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;highDetailStages.clear()}visualRenderScale=width/1100;ctx.imageSmoothingEnabled=false;$('#visualQuality').value=visualQualityMode;$('#visualQualityStatus').textContent=(visualQualityMode==='4k'?'4K width':visualQualityMode==='performance'?'Performance / classic pixels':'Auto / sharp arcade')+' · '+width+' × '+height+(visualQualityMode==='4k'?' · Higher graphics load. Use Auto or Performance on slower phones.':'');visualSampleLast=null;visualSampleMs=0;visualSampleCount=0}
function setVisualQuality(mode){if(!VISUAL_MODES.includes(mode))return false;visualQualityMode=mode;safeStorageSet('block-cypher-visual-quality-v1',mode);applyVisualQuality();return true}
$('#visualQuality').onchange=()=>setVisualQuality($('#visualQuality').value);
function highDetailStage(id,width){const key=id+':'+width;if(highDetailStages.has(key))return highDetailStages.get(key);const c=document.createElement('canvas');c.width=width;c.height=Math.round(width*520/1100);const g=c.getContext('2d'),s=width/1100,pal=STAGE_ACCENTS[id]||STAGE_ACCENTS.court;g.setTransform(s,0,0,c.height/520,0,0);
 const line=(x,y,x2,y2,color,w=.4)=>{g.strokeStyle=color;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke()};
 // Deterministic fine grain and pavement chips have sub-world-pixel resolution.
 for(let i=0;i<1100;i++){const x=(i*137.19)%1100,y=418+(i*23.73)%101;g.fillStyle=i%3?'#d8dfc918':'#091b2c26';g.fillRect(x,y,.3+(i%4)*.17,.3+(i%3)*.1)}
 for(let i=0;i<56;i++){const x=(i*71.7)%1100,y=425+(i*13.3)%72;line(x,y,x+8+i%7*3,y,pal[i%2]+'24',.35)}
 if(id==='cleveland'){
 for(let x=505;x<566;x+=15)for(let y=142;y<271;y+=19){line(x,y,x+5,y,'#fff0bc99',.45);line(x+2.5,y,x+2.5,y+7,'#173c4d88',.4)}
 for(let x=40;x<1060;x+=34)for(const y of [208,269]){g.fillStyle='#f5e4b388';g.beginPath();g.arc(x,y,.65,0,Math.PI*2);g.fill()}
 for(let i=0;i<100;i++){const x=(i*97.43)%1100,y=284+(i*7.27)%79;line(x,y,x+3+i%9,y,i%2?'#b3ffff3b':'#ffe4ab55',.35)}
 }else if(id==='laundromat'){
 for(const x of [196,612]){const shine=g.createLinearGradient(x,205,x+290,395);shine.addColorStop(0,'#d8f9ff00');shine.addColorStop(.48,'#e6fcff16');shine.addColorStop(.5,'#e6fcff00');g.fillStyle=shine;g.fillRect(x,207,288,188);line(x+8,212,x+8,391,'#e9ffff88',.4)}
 for(let i=0;i<6;i++){const x=(i<3?211+i*93:624+(i-3)*88)+39;g.strokeStyle='#f1ffff66';g.lineWidth=.5;g.beginPath();g.arc(x,349,27,0,Math.PI*2);g.stroke();for(let j=0;j<4;j++){g.fillStyle='#263d50';g.fillRect(x-31+j*20,306,.65,.65)}}
 }else if(id==='court'||id==='underpass'||id==='corner'){
 const top=id==='court'?267:id==='underpass'?245:185,bottom=id==='corner'?410:405;for(let i=0;i<800;i++){const x=(i*83.17)%1100,y=top+(i*19.7)%(bottom-top);g.fillStyle=i%2?'#f1d4ab12':'#101e2d20';g.fillRect(x,y,.5,.5)}
 if(id==='court')for(let x=0;x<1100;x+=26)line(x,280,x+55,410,'#d0e8d21c',.35);
 if(id==='corner'){for(const x of [220,680]){line(x+3,223,x+3,387,'#cbffdf66',.5);line(x+7,228,x+70,265,'#e0fff21f',.5)}}
 }else if(id==='subway'){
 for(let y=90;y<400;y+=24)line(0,y+2,1100,y+2,'#e6f9ef16',.35);for(const x of [110,460,800])line(x,34,x+185,34,'#ffffffaa',.45);line(0,422,1100,422,'#fff0b477',.4);g.fillStyle='#cce5d9';g.font='7px monospace';g.fillText('NORTHBOUND / ALL CITY LINE',335,169);
 }else if(id==='warehouse'){
 for(let x=152;x<960;x+=18){if(x>490&&x<622)continue;line(x+1,192,x+1,405,'#f5dfac23',.35)}for(const x of [38,338,728,1058])for(let y=50;y<370;y+=50){g.fillStyle='#d4d3bc88';g.fillRect(x,y,1,1)}
 }else if(id==='rooftop'||id==='parking'){
 const base=id==='rooftop'?350:330;for(let i=0;i<16;i++){const x=i*68+14,h=45+(i*47%110);line(x,base-h,x,base,'#eadac922',.4)}for(let i=0;i<38;i++){const x=(i*79)%1100,y=415+(i*29)%100;line(x,y,x+7,y+1,'#141f3030',.4)}
 }else if(id==='blockparty'){
 for(let i=0;i<8;i++){const x=i*153-29;for(let y=100;y<310;y+=11)line(x,y,x+130,y,'#342a2515',.35)}for(let x=15;x<1100;x+=55)line(x,87+x/1100*35,x+26,88+x/1100*35,'#fff0bb77',.45);
 }
 // A restrained horizon-to-pavement gradient gives the higher-resolution layer depth.
 const light=g.createLinearGradient(0,411,0,520);light.addColorStop(0,pal[0]+'12');light.addColorStop(1,'#00000000');g.fillStyle=light;g.fillRect(0,411,1100,109);
 if(highDetailStages.size>=2)highDetailStages.delete(highDetailStages.keys().next().value);highDetailStages.set(key,c);return c}
const backdropBeforeVisualQuality=drawStageBackdrop;
drawStageBackdrop=function(g){backdropBeforeVisualQuality(g);if(visualQualityMode==='performance')return;const width=g===ctx?canvas.width:1100;g.save();g.imageSmoothingEnabled=true;const detail=highDetailStage(selectedStage,width);if(g===ctx){g.setTransform(1,0,0,1,0,0);g.drawImage(detail,0,0)}else g.drawImage(detail,0,0,width,Math.round(width*520/1100),0,0,1100,520);g.restore()};
const drawBeforeVisualQuality=draw;
draw=function(){ctx.save();ctx.setTransform(canvas.width/1100,0,0,canvas.height/520,0,0);ctx.imageSmoothingEnabled=false;try{drawBeforeVisualQuality()}finally{ctx.restore()}};
function sampleVisualQuality(timestamp){if(visualQualityMode!=='auto'||mode!=='playing'||document.hidden||superCinema||lastBar){visualSampleLast=null;return}if(visualSampleLast===null){visualSampleLast=timestamp;return}const dt=timestamp-visualSampleLast;visualSampleLast=timestamp;if(dt<=0||dt>250){visualSampleMs=0;visualSampleCount=0;return}visualSampleMs+=dt;visualSampleCount++;if(visualSampleMs>=1800){const avg=visualSampleMs/visualSampleCount;visualSampleMs=0;visualSampleCount=0;if(avg>25&&visualAutoWidth>1100){visualAutoWidth=visualAutoWidth>1650?1650:1100;applyVisualQuality(false)}}}
const frameBeforeVisualQuality=frame;
frame=function(timestamp){sampleVisualQuality(timestamp);frameBeforeVisualQuality(timestamp)};
window.addEventListener('resize',()=>{if(visualQualityMode==='auto')applyVisualQuality()});
applyVisualQuality();
