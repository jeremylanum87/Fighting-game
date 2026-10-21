'use strict';
const NEW_STAGES={cleveland:'Cleveland, Ohio · Cuyahoga Cypher',underpass:'Concrete Echo · Graffiti Underpass',laundromat:'Spin Cycle · Neon Laundry Street',parking:'Level Seven · Rooftop Parking',blockparty:'Summer on the Block · Street Festival'};
Object.assign(STAGES,NEW_STAGES);
Object.assign(STAGE_TRACKS,{cleveland:{name:'CUYAHOGA AFTER DARK',bpm:90,root:51.91,chords:[0,3,5,-2],melody:[12,19,15,10]},underpass:{name:'CONCRETE ECHO',bpm:94,root:46.25,chords:[0,0,5,3],melody:[7,12,10,15]},laundromat:{name:'SPIN CYCLE FM',bpm:86,root:61.74,chords:[0,5,3,7],melody:[19,15,22,12]},parking:{name:'LEVEL SEVEN',bpm:96,root:55,chords:[0,-2,3,5],melody:[12,17,19,15]},blockparty:{name:'SUMMER BLOCK MIX',bpm:100,root:65.41,chords:[0,5,7,3],melody:[12,19,22,24]}});
function arcadeStage(index){return ['cleveland','underpass','laundromat','parking','blockparty','subway','rooftop','warehouse'][index]||'court'}
function buildCityStage(id){const c=document.createElement('canvas');c.width=1100;c.height=520;const g=c.getContext('2d');
 const r=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const line=(x,y,x2,y2,color,w=2)=>{g.strokeStyle=color;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke()};
 const text=(s,x,y,size,color='#dfca98')=>{g.fillStyle=color;g.font=`bold ${size}px monospace`;g.fillText(s,x,y)};
 const poly=(points,color)=>{g.fillStyle=color;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()};
 const sky=(top,bottom)=>{const a=g.createLinearGradient(0,0,0,410);a.addColorStop(0,top);a.addColorStop(1,bottom);g.fillStyle=a;g.fillRect(0,0,1100,520)};
 const windows=(x,y,w,h,color='#bcb184')=>{for(let yy=y+12;yy<y+h-8;yy+=19)for(let xx=x+8;xx<x+w-6;xx+=15)if((Math.floor(xx/15)+Math.floor(yy/19))%4!==0)r(xx,yy,5,8,color)};
 const skyline=(base,color,lit)=>{for(let i=0;i<18;i++){const x=i*68-20,h=40+(i*47%125);r(x,base-h,59,h,color);if(lit)windows(x,base-h,59,h,lit)}};
 const floor=(color,edge)=>{r(0,411,1100,109,color);r(0,410,1100,5,edge);for(let i=0;i<170;i++)r((i*127)%1100,420+(i*43)%98,2,1,'#c2bfa71b');line(0,454,1100,454,'#101d1b44',1)};
 const speaker=(x,y)=>{r(x,y,46,82,'#1b252e');g.strokeStyle='#8a8a79';g.lineWidth=3;for(const yy of [y+22,y+59]){g.beginPath();g.arc(x+23,yy,15,0,Math.PI*2);g.stroke()}r(x+7,y+5,30,2,'#c2ad7d')};
 if(id==='cleveland'){
 sky('#152838','#9d7065');for(let i=0;i<7;i++)r(i*180-40,52+i%3*18,130,5,'#b69f8b22');skyline(277,'#263c4b','#b9ac79');
 // Original landmark-inspired skyline: stepped Terminal Tower crown and tall downtown offices.
 r(496,126,77,153,'#54606a');windows(496,126,77,153,'#d3bb84');r(505,103,59,24,'#707a7a');r(512,85,45,20,'#a59f89');r(519,68,31,19,'#b3ac94');r(526,51,17,18,'#d8c8a2');r(532,31,5,22,'#ecdca7');r(507,119,56,4,'#ddc58f');
 r(648,93,70,185,'#344955');r(659,71,48,24,'#425d64');r(681,52,5,23,'#92aaa7');windows(648,93,70,185,'#b7a477');r(355,159,92,120,'#394c56');windows(355,159,92,120);
 // Cuyahoga river and steel truss bridge.
 r(0,279,1100,89,'#29494f');for(let i=0;i<45;i++){const x=i*29%1100;line(x,292+i%9*7,x+12+i%5*5,292+i%9*7,i%3?'#78928455':'#d4b16f88',2)}
 for(const y of [208,269])line(40,y,1060,y,'#253a42',9);for(let x=40;x<1060;x+=102){line(x,208,x+102,269,'#2e4349',7);line(x,269,x+102,208,'#2e4349',5);line(x,208,x,269,'#51615e',4)}for(const x of [70,394,724,1048]){r(x,269,18,63,'#535c59');r(x-8,320,35,17,'#73746a');r(x+4,193,4,16,'#debb75')}
 r(0,367,1100,44,'#5e665f');line(0,356,1100,356,'#a2a28b',5);for(let x=12;x<1100;x+=52)r(x,356,4,54,'#7d887e');
 r(16,310,214,44,'#173e43');text('CLEVELAND / OHIO',28,338,19,'#e2c78d');r(809,365,254,31,'#253e3c');text('CUYAHOGA CYPHER',824,387,20);
 for(const x of [263,941]){r(x,247,5,163,'#263c3e');r(x-15,242,37,8,'#7c8d80');r(x-11,250,29,6,'#e3c58d')}
 floor('#3b4848','#c4b58d');text('THE FLATS / 216 / AFTER DARK',22,498,12);line(100,473,380,473,'#d7c99c44',3);line(720,473,1000,473,'#d7c99c44',3);
 }else if(id==='underpass'){
 sky('#414d50','#73807b');skyline(251,'#36474a',null);poly([[0,0],[1100,0],[1100,105],[0,162]],'#252e32');for(let x=-80;x<1200;x+=160){poly([[x,0],[x+35,0],[x+155,132],[x+120,138]],'#51595a');line(x,38,x+143,139,'#141f25',5)}
 r(0,240,1100,171,'#59635e');for(let y=248;y<411;y+=27){line(0,y,1100,y,'#354842',2);for(let x=(y%54?0:50);x<1100;x+=100)line(x,y,x,y+27,'#46544c',1)}
 for(const [x,w] of [[70,95],[935,105]]){r(x,95,w,316,'#70766b');r(x+9,106,w-18,305,'#808477');r(x-13,100,w+26,24,'#414f4d');for(let i=0;i<6;i++)line(x+12,160+i*33,x+w-11,172+i*33,'#4d5d56',2)}
 g.save();g.translate(270,349);g.rotate(-.045);g.font='italic 900 79px Impact,sans-serif';g.lineWidth=10;g.strokeStyle='#253a40';g.strokeText('MAKE NOISE',0,0);g.lineWidth=3;g.strokeStyle='#d8cf9f';g.strokeText('MAKE NOISE',0,0);g.fillStyle='#bd755d';g.fillText('MAKE NOISE',0,0);g.restore();text('RESPECT THE CIRCLE',340,387,20,'#abd1bf');for(let i=0;i<24;i++)r(250+i*25,362,3,8+i%5*4,i%2?'#77ac9a':'#c78b67');
 for(const x of [216,832]){r(x,370,34,41,'#85664e');r(x-3,369,40,6,'#cda77c');line(x+5,380,x+30,397,'#4e4f40',2)}floor('#434d49','#b9a887');for(let x=0;x<1100;x+=130)line(x,412,x-48,520,'#888d7344',2);text('CONCRETE ECHO / THE UNDERPASS',22,498,12);
 }else if(id==='laundromat'){
 sky('#18283d','#655266');r(0,117,1100,294,'#59434b');for(let y=123;y<410;y+=18){line(0,y,1100,y,'#332f3c',1);for(let x=(y%36?0:35);x<1100;x+=70)line(x,y,x,y+18,'#372f3c',1)}
 r(170,124,760,59,'#273844');line(183,135,917,135,'#a88bc2',3);line(183,175,917,175,'#db9ea7',3);text('SPIN CYCLE / OPEN LATE',238,164,34,'#f0c6bd');
 r(184,194,730,216,'#263b4b');r(196,207,305,188,'#81a8a8');r(612,207,288,188,'#81a8a8');r(516,205,80,205,'#7b8c8c');r(525,219,62,132,'#456d78');r(582,355,4,23,'#ecc58d');
 for(let i=0;i<6;i++){const x=i<3?211+i*93:624+(i-3)*88;r(x,297,78,87,'#c6c2a9');r(x+7,303,64,12,'#788b89');g.fillStyle='#1e3e4b';g.beginPath();g.arc(x+39,349,25,0,Math.PI*2);g.fill();g.strokeStyle='#a6c7bf';g.lineWidth=5;g.stroke();r(x+11,308,9,3,'#e7c985')}
 r(10,327,105,84,'#557c81');r(20,336,84,57,'#233d4c');text('24 HRS',29,367,18,'#c5abce');r(967,289,91,122,'#9e7967');r(975,298,75,80,'#4d545a');text('SOAP',983,329,17);for(let i=0;i<4;i++)r(982+i*15,351,9,15,'#c2b2aa');
 floor('#354553','#b9a49d');for(let i=0;i<20;i++){const x=i*61%1100;line(x,445+i%5*12,x+35,445+i%5*12,i%2?'#a179a666':'#c8bba044',2)}text('SPIN CYCLE / NIGHT OWLS WELCOME',22,498,12);
 }else if(id==='parking'){
 sky('#303751','#b77a69');skyline(330,'#3c4054','#b19a7c');g.fillStyle='#e8c792';g.beginPath();g.arc(877,85,26,0,Math.PI*2);g.fill();r(0,329,1100,81,'#666d70');r(0,333,1100,9,'#aca38d');for(let x=18;x<1100;x+=70){r(x,349,42,44,'#303e49');line(x,350,x+42,394,'#7b8078',2)}
 r(64,175,10,236,'#34454b');r(30,171,80,11,'#899184');r(36,183,68,7,'#ecd5a0');r(1008,175,10,236,'#34454b');r(974,171,80,11,'#899184');r(980,183,68,7,'#ecd5a0');
 r(820,204,192,112,'#263b48');r(829,212,174,96,'#405764');text('LEVEL 07',846,249,26,'#dfd2a9');text('NO LIMITS',852,281,18,'#d3ac88');
 r(161,346,150,41,'#89645f');poly([[182,346],[203,321],[267,321],[289,346]],'#77575a');r(211,326,46,17,'#93aaac');for(const x of [187,285]){g.fillStyle='#192b35';g.beginPath();g.arc(x,388,12,0,Math.PI*2);g.fill()}r(165,355,8,8,'#f1c990');
 floor('#58615e','#d6c28f');for(const x of [0,260,520,780,1040])line(x,414,x-80,520,'#d0c29188',4);line(0,475,1100,475,'#dbbf6d',3);text('LEVEL SEVEN / ABOVE THE NOISE',22,502,12,'#f0ddaa');
 }else{
 sky('#6d8f92','#dac090');for(let i=0;i<8;i++){const x=i*153-35;r(x,70+i%3*25,147,341,'#9b6f59');r(x+6,80+i%3*25,135,325,i%2?'#b48568':'#937d66');windows(x+12,86+i%3*25,122,220,'#31454a');r(x,314,146,97,'#415450');r(x+15,330,110,70,'#d4b997')}
 for(const y of [85,135]){line(0,y,1100,y+35,'#504e3d',2);for(let x=15;x<1100;x+=55)poly([[x,y+2+x/1100*35],[x+28,y+3+x/1100*35],[x+13,y+28+x/1100*35]],['#c76d52','#dcb866','#5d968c','#b396b5'][Math.floor(x/55)%4])}
 r(324,205,455,62,'#25473e');text('SUMMER ON THE BLOCK',347,245,31,'#edce85');speaker(74,329);speaker(982,329);r(374,352,351,60,'#384e4b');r(365,345,370,12,'#d0ae77');for(const x of [430,635]){g.fillStyle='#172b2f';g.beginPath();g.ellipse(x,346,39,10,0,0,Math.PI*2);g.fill();g.strokeStyle='#c4c7b0';g.stroke()}
 for(const [x,color] of [[153,'#9ab18a'],[852,'#c18d73']]){r(x,354,92,57,color);poly([[x-10,354],[x+45,326],[x+103,354]],'#e1bb7c');r(x+12,365,68,23,'#364e47');text('FRESH',x+18,384,13)}floor('#5d6257','#d5bd8c');for(let i=0;i<16;i++)r(15+i*73,434+i%3*13,7,3,['#c79c72','#7caa94','#d9c88b'][i%3]);text('SUMMER 2010 / EVERYBODY IN THE CIRCLE',22,498,12);
 }return c;
}
const builderBeforeCity=buildNeighborhoodStage;buildNeighborhoodStage=function(id){return NEW_STAGES[id]?buildCityStage(id):builderBeforeCity(id)};
const backdropBeforeCity=drawStageBackdrop;drawStageBackdrop=function(g){backdropBeforeCity(g);const t=neighborhoodTime;g.save();if(selectedStage==='cleveland'){const x=t*17%1400-220;g.fillStyle='#263b43';g.fillRect(x,321,147,17);g.fillRect(x+103,306,26,15);g.fillStyle='#e3c688';g.fillRect(x+109,310,12,5);g.strokeStyle='#a7c5bb66';g.lineWidth=2;for(let j=0;j<(strongEffects?12:4);j++){const y=286+j*6;g.beginPath();g.moveTo((j*113+t*9)%1100,y);g.lineTo((j*113+t*9)%1100+23,y);g.stroke()}}
 else if(selectedStage==='laundromat'){for(let i=0;i<6;i++){const x=i<3?250+i*93:663+(i-3)*88;g.strokeStyle=i%2?'#d5c4a8':'#a1c5c2';g.lineWidth=3;g.beginPath();g.arc(x,349,15,t*(strongEffects?2:1)+i,t*(strongEffects?2:1)+i+Math.PI*1.3);g.stroke()}if(strongEffects){g.globalAlpha=.1;g.fillStyle='#e8b5cd';g.fillRect(184,427,730,5)}}
 else if(selectedStage==='underpass'&&strongEffects){const x=t*110%1600-300;g.fillStyle='#65716d';g.fillRect(x,59,144,19);g.fillStyle='#333f42';g.fillRect(x+20,42,76,20);g.fillStyle='#d4c392';g.fillRect(x+134,67,10,5)}
 else if(selectedStage==='parking'&&strongEffects){g.globalAlpha=.12;g.fillStyle='#e9d8a4';g.beginPath();g.moveTo(1050,370);g.lineTo(680+Math.sin(t*.3)*60,438);g.lineTo(1045,430);g.closePath();g.fill()}
 else if(selectedStage==='blockparty'){g.fillStyle='#9e7255';g.fillRect(546,305,15,17);g.fillStyle='#a77564';g.fillRect(539,322,29,23);g.strokeStyle='#cba375';g.lineWidth=5;g.beginPath();g.moveTo(541,328);g.lineTo(520,337+Math.sin(t*4)*5);g.moveTo(566,328);g.lineTo(584,337-Math.sin(t*4)*5);g.stroke()}g.restore()};
let stagePreviewKey='';function drawStagePreview(){const id=$('#modeSelect').value==='arcade'?arcadeStage(0):$('#stageSelect').value;if(!STAGES[id]||stagePreviewKey===id)return;stagePreviewKey=id;const target=$('#stagePreview'),g=target.getContext('2d'),previous=selectedStage;try{selectedStage=id;g.save();g.scale(target.width/1100,target.height/520);drawStageBackdrop(g);g.restore();$('#stagePreviewCaption').textContent=STAGES[id]}finally{selectedStage=previous}}
$('#stageSelect').addEventListener('change',()=>{stagePreviewKey='';drawStagePreview()});const selectRenderBeforeCity=renderSelectScreen;renderSelectScreen=function(t){selectRenderBeforeCity(t);if(!$('#characterSelect').hidden)drawStagePreview()};

if(mode==='title'&&selectedStage==='court')selectedStage='cleveland';
