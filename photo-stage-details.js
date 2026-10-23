'use strict';
// Original pixel geometry studied from the photographs linked in STAGE-REFERENCES.md.
// No remote images, random simulation calls, or per-frame texture generation.
const locationDetailCache=new Map();
function locationStageDetails(id){
 if(locationDetailCache.has(id))return locationDetailCache.get(id);
 const c=document.createElement('canvas');c.width=1100;c.height=520;const g=c.getContext('2d');
 const r=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h)};
 const l=(x,y,a,b,color,w=1)=>{g.strokeStyle=color;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(a,b);g.stroke()};
 const p=(pts,color)=>{g.fillStyle=color;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()};
 const label=(s,x,y,color='#d0b992',size=10)=>{g.fillStyle=color;g.font=`bold ${size}px monospace`;g.fillText(s,x,y)};
 function brick(x,y,w,h){r(x,y,w,h,'#59443f');for(let yy=y;yy<y+h;yy+=12){l(x,yy,x+w,yy,'#9c786044');for(let xx=x+(yy%24?0:17);xx<x+w;xx+=34)l(xx,yy,xx,Math.min(yy+12,y+h),'#241f2c77')}r(x,y,w,5,'#c59b70');r(x,y+6,w,3,'#282c37')}
 function escape(x,y){for(let level=0;level<2;level++){const yy=y+level*50;r(x,yy,100,5,'#1a2630');l(x,yy-24,x+100,yy-24,'#74827e');for(let j=0;j<=10;j++)l(x+j*10,yy-24,x+j*10,yy,'#25343b',2);l(x+8,yy,x+83,yy+46,'#29373d',3);l(x+19,yy,x+94,yy+46,'#87918a',2);for(let j=0;j<8;j++)l(x+10+j*9,yy+j*5,x+23+j*9,yy+j*5,'#4c5c60',2)}}
 function window(x,y){r(x-3,y-3,37,42,'#ac8b70');r(x,y,31,34,'#182d3b');r(x+3,y+3,11,27,'#d1b17a66');l(x+15,y,x+15,y+34,'#716d68',2);r(x-5,y+35,41,5,'#ceb18b')}
 function tank(x,y){for(const dx of [7,65])l(x+dx,y+74,x+dx-5,y+135,'#263943',5);l(x+5,y+85,x+65,y+126,'#68777b',2);l(x+65,y+85,x+5,y+126,'#68777b',2);r(x,y,76,75,'#785b49');for(let j=0;j<12;j++)r(x+j*6,y,2,75,j%2?'#b49367':'#413e3c');p([[x-8,y],[x+38,y-25],[x+84,y]],'#414d58');for(const dy of [10,35,64])r(x-2,y+dy,80,4,'#222f39');l(x+79,y-3,x+79,y+98,'#a2a598',2);for(let j=0;j<12;j++)l(x+75,y+j*8,x+84,y+j*8,'#788687')}
 if(id==='cleveland'){
 // Red swing-truss rhythm, inspired by Center Street Bridge; stylized, not a survey.
 for(const yy of [208,269])l(40,yy,1060,yy,'#8d4038',7);
 for(let x=40;x<1060;x+=102){l(x,208,x+102,269,'#af5d45',4);l(x,269,x+102,208,'#703b38',3);r(x-3,205,7,67,'#b0664d');for(const yy of [212,262])r(x-1,yy,2,2,'#e2b178')}
 brick(0,163,151,119);brick(943,171,157,109);for(const x of [16,65,111,958,1007,1053]){r(x,187,22,42,'#203b43');r(x,233,22,32,'#253b40');r(x-2,229,26,3,'#ba9474')}
 for(let i=0;i<37;i++){const x=(i*79)%1100,y=285+i%10*7;l(x,y,x+9+i%5*5,y,i%2?'#cf87574b':'#88b5b34b',2)}
 for(const x of [30,320,767,1072]){r(x,376,10,33,'#263c41');r(x-3,376,16,5,'#baaa80');l(x+5,381,x+40,385,'#a7a387',2)}
 label('CUYAHOGA RIVER',460,361,'#a9c4ba',10);
 }else if(['corner','laundromat','blockparty'].includes(id)){
 for(const x of [25,953]){brick(x,8,120,260);for(const y of [27,90,153]){window(x+12,y);window(x+71,y)}escape(x+9,78);r(x+111,10,5,287,'#203139');r(x+110,272,9,29,'#687b79')}
 if(id==='corner'){for(const x of [232,692])for(let j=0;j<8;j++){r(x+j*19,272,10,22,['#c69662','#8eae76','#bb755d'][j%3]);r(x+j*19+2,268,6,5,'#c2b89e')}label('FRESH DAILY',245,383,'#e7d7a1',13);label('COLD DRINKS',694,383,'#e7d7a1',13)}
 if(id==='laundromat'){label('WASH • FOLD • DRY',281,192,'#d9c9b8',12);r(530,240,52,29,'#d5c8a2');label('OPEN',534,252,'#374a54',11);label('24 / 7',532,264,'#374a54',10)}
 if(id==='blockparty'){l(150,46,940,63,'#302e35',2);for(let j=0;j<22;j++){const x=165+j*35;r(x,48+j*.7,4,8,j%2?'#efd49a':'#cbe2bf')}label('NEIGHBORS / SINCE 2010',387,288,'#e0bb83',14)}
 }else if(id==='rooftop'||id==='parking'){
 tank(id==='rooftop'?142:340,id==='rooftop'?187:176);
 for(const x of [25,1018]){brick(x,282,62,125);r(x-4,278,70,8,'#b3a18d')}
 if(id==='rooftop'){r(830,283,99,35,'#6b7779');for(let j=0;j<15;j++)r(835+j*6,287,2,26,'#283d47');l(918,284,918,219,'#71848b',3);l(888,231,949,231,'#a7b3ad',2);l(897,218,939,218,'#a7b3ad',2)}
 else {label('EXIT →',99,391,'#d5c89b',14);for(let j=0;j<4;j++){r(643+j*21,366,9,40,'#be9a59');r(643+j*21,381,9,8,'#343b40')}r(480,375,97,32,'#343f47');label('07',509,398,'#b9bba9',23)}
 }else if(id==='subway'){
 for(const x of [85,520,1005]){r(x,70,4,343,'#c7c4a0');r(x+22,70,6,343,'#34484d');for(let yy=85;yy<400;yy+=19){r(x+7,yy,3,3,'#d0c9a2');r(x+18,yy,3,3,'#253b42')}}
 r(172,110,110,54,'#182d36');label('UPTOWN',183,130,'#d4d7c7',15);label('LOCAL / 07',183,150,'#d4d7c7',12);
 for(const x of [135,802]){r(x,331,152,9,'#96765a');for(let j=0;j<4;j++)r(x,342+j*5,152,3,'#685b4c');r(x+12,359,6,40,'#253940');r(x+130,359,6,40,'#253940')}
 for(let x=0;x<1100;x+=11)r(x,419,3,2,'#f0cc73');
 }else if(id==='warehouse'){
 for(const x of [170,640]){r(x,31,280,63,'#21373f');for(let j=0;j<7;j++){r(x+j*40,32,2,60,'#8d9284');r(x+j*40+5,38,29,23,'#8aa7a14a')}r(x,61,280,3,'#b3a483')}
 for(const x of [31,1051])for(let yy=40;yy<405;yy+=22)r(x+5,yy,4,4,'#c4b285');
 for(const x of [154,861]){r(x,365,71,42,'#74583e');for(let j=0;j<4;j++)r(x,370+j*9,71,3,'#bb9362');l(x+3,368,x+67,403,'#362f2c',3)}
 }else if(id==='underpass'){
 for(let x=0;x<1100;x+=115){l(x,10,x+100,130,'#a5aa972b',3);for(let j=0;j<4;j++)r(x+j*18,28+j*17,3,3,'#92998a')}
 for(const x of [87,954]){for(let j=0;j<7;j++)r(x+j*9,131,2,35+j%3*13,'#333d3d55');r(x,283,57,34,'#b8aa8766');label('216',x+8,305,'#384b49',17)}
 l(160,395,208,362,'#bbc1a2',3);l(208,362,234,396,'#bbc1a2',3);l(160,395,234,396,'#576e69',2);
 }else if(id==='court'){
 // Rucker-inspired housing rhythm and perimeter mesh, kept off the court center.
 for(const x of [12,950]){brick(x,28,138,205);for(const yy of [48,105,162])for(const xx of [x+14,x+61,x+105]){r(xx,yy,17,30,'#253c48');r(xx,yy+29,20,3,'#ad9374')}}
 for(const [a,b] of [[0,180],[920,1100]]){for(let x=a;x<b;x+=12){l(x,242,Math.min(x+60,b),350,'#a8b7a548');l(x,350,Math.min(x+60,b),242,'#a8b7a548')}l(a,241,b,241,'#8d9e92',3)}
 }
 // Subtle pavement wear stays below the action, at the near-camera edge.
 for(let i=0;i<32;i++){const x=i*137%1100,y=477+i%5*7;l(x,y,x+10+i%3*5,y+2,'#b1ac9130');if(i%5===0){l(x,y,x+8,y+8,'#152b3655');l(x+8,y+8,x+26,y+6,'#152b3655')}}
 if(locationDetailCache.size>=4)locationDetailCache.delete(locationDetailCache.keys().next().value);
 locationDetailCache.set(id,c);return c;
}
const backdropBeforeLocationDetails=drawStageBackdrop;
drawStageBackdrop=function(g){backdropBeforeLocationDetails(g);g.save();g.imageSmoothingEnabled=false;g.drawImage(locationStageDetails(selectedStage),0,0);g.restore()};
stagePreviewKey='';
