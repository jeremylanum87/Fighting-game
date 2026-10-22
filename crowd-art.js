'use strict';
// Original shaded pixel spectators. Cached poses replace the older block figures.
const CROWD_SKINS=[['#a87554','#704c3e','#d0a17c'],['#704c3b','#49362e','#a47759'],['#cf9e75','#986b50','#ebc39a'],['#966347','#603e32','#c58b63']];
const CROWD_COLORS={court:['#b98c41','#598f87','#967790'],subway:['#687d94','#877665','#688c82'],corner:['#ae725d','#6d9274','#a38d5d'],rooftop:['#9680ad','#5b9da5','#c39955'],warehouse:['#8c7c68','#5b8587','#946974'],cleveland:['#5e99a8','#bd854e','#7c8b98'],underpass:['#8a76a8','#62967c','#b6895e'],laundromat:['#ac799b','#608eaa','#8c8c72'],parking:['#88819c','#ae7f66','#638f94'],blockparty:['#bf9657','#699e8b','#b47b76']};
const crowdArtCache=new Map();
function crowdLook(id,index){const stage=Object.keys(STAGES).indexOf(id),outfits=['varsity','hoodie','jersey','jacket','tee','coat','vest','headphones'];return {key:id+':'+index,skin:CROWD_SKINS[(index+stage)%4],shirt:(CROWD_COLORS[id]||CROWD_COLORS.court)[index%3],style:id==='subway'&&index%2?'coat':outfits[(index+stage)%outfits.length],hair:(index+stage)%5,cap:index%4===0,chain:index%3===0}}
function buildCrowdPose(look,pose,frame){const c=document.createElement('canvas');c.width=56;c.height=100;const g=c.getContext('2d'),[skin,shade,light]=look.skin,shirt=look.shirt,cheer=pose==='cheer',wave=Math.sin(frame*Math.PI/2),bob=pose==='dance'?Math.round(Math.abs(wave)*2):0;g.imageSmoothingEnabled=false;g.translate(0,-bob);
 const r=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h)};
 function limb(points,width,color){g.strokeStyle='#17252a';g.lineWidth=width+2;g.lineCap='square';g.lineJoin='round';g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();g.strokeStyle=color;g.lineWidth=width;g.stroke();g.strokeStyle=light+'77';g.lineWidth=1;g.stroke()}
 // Shoes, denim folds and distinct hems stay anchored to the same pavement line.
 limb([[23,61],[20,78],[18,93]],8,'#263a4b');limb([[32,61],[34,79],[37,93]],8,'#304657');r(16,77,6,2,'#5c7180');r(31,81,6,2,'#647586');r(11,91,13,5,'#cfccba');r(32,91,14,5,'#ded7c2');r(10,96,15,2,'#17262c');r(32,96,15,2,'#17262c');r(13,91,6,2,shirt);r(37,91,6,2,shirt);
 const left=cheer?[[18,40],[10,27],[10+wave*2,12]]:pose==='phone'?[[18,40],[12,32],[16,23]]:[[18,40],[12,53],[15+wave*2,63]],right=cheer?[[37,40],[45,26],[44-wave*2,11]]:pose==='dance'?[[37,40],[45,46],[47,38+wave*4]]:[[37,40],[43,51],[40,60]];
 limb(left,5,look.style==='jersey'||look.style==='tee'?skin:shirt);limb(right,5,look.style==='jersey'||look.style==='tee'?skin:shirt);
 r(17,33,22,31,'#17262b');r(18,34,20,28,shirt);r(18,38,3,23,'#17252a55');r(34,37,3,25,'#edf0d12b');r(21,62,15,3,'#1a2d35');r(23,30,9,8,skin);r(23,33,9,3,shade);
 if(look.style==='varsity'){r(18,34,5,24,'#cdc5ab');r(34,35,4,24,'#cdc5ab');r(27,37,1,25,'#dfd7b4');r(20,56,6,2,'#152b34');r(31,56,4,2,'#152b34')}
 if(look.style==='hoodie'){r(20,30,16,10,'#253a49');r(24,36,1,11,'#d6d2bd');r(31,36,1,10,'#d6d2bd');r(23,52,10,6,'#253a4955')}
 if(look.style==='coat'){r(17,57,10,16,shirt);r(29,57,11,16,shirt);r(27,36,2,36,'#24323b');r(22,46,2,2,'#c9c4ac');r(22,53,2,2,'#c9c4ac')}
 if(look.style==='jacket'||look.style==='vest'){r(26,36,4,25,'#d8d1b7');r(19,39,6,6,'#17252a55');r(32,39,4,6,'#17252a55')}
 if(look.style==='jersey'){r(23,35,9,3,'#dfd8bc');r(25,43,3,12,'#e3ddc3');r(30,43,3,12,'#e3ddc3');r(21,60,15,2,'#e3ddc3')}
 if(look.chain){g.strokeStyle='#d2b46a';g.lineWidth=1;g.beginPath();g.moveTo(23,37);g.lineTo(28,45);g.lineTo(33,37);g.stroke();r(27,44,3,3,'#e1c674')}
 // Shaded cheeks, ears, brows, nose and mouth replace featureless square heads.
 r(21,11,15,21,'#1a272c');r(22,13,13,18,skin);r(22,18,3,12,shade);r(24,14,8,3,light);r(20,20,3,6,skin);r(34,20,3,6,shade);r(31,22,5,3,light);r(26,20,3,1,'#3c302d');r(32,20,2,1,'#3c302d');r(27,22,2,2,'#192831');r(33,22,1,2,'#192831');r(30,25,3,1,shade);r(27,28,6,cheer?3:1,cheer?'#392f30':shade);if(cheer)r(28,28,4,1,'#dbccb2');
 if(look.hair===0){r(19,8,19,8,'#252929');r(17,10,5,11,'#252929');r(35,10,5,9,'#252929');r(20,6,14,4,'#34322f');r(20,10,4,2,'#4a4035')}
 else if(look.hair===1){r(21,9,16,7,'#2c2c2b');for(let i=0;i<4;i++)r(19+i*5,14,3,17+i%2*5,'#302d2b')}
 else if(look.hair===2){r(21,9,15,6,'#30302d');r(22,10,12,2,'#64605a')}
 else if(look.hair===3){r(20,9,17,7,shirt);r(21,7,15,3,shirt);r(20,14,17,3,'#35424b')}
 else{r(22,10,14,5,'#31302b');r(19,8,7,9,'#31302b');r(18,7,7,6,'#494134')}
 if(look.cap){r(20,9,18,7,shirt);r(30,15,13,3,shirt);r(23,10,7,1,'#e3ddba66')}
 if(look.style==='headphones'){g.strokeStyle='#182831';g.lineWidth=3;g.beginPath();g.arc(28,17,10,Math.PI,Math.PI*2);g.stroke();r(18,17,4,10,'#bec5b7');r(35,17,4,10,'#bec5b7')}
 if(pose==='phone'){r(13,16,6,10,'#172b37');r(14,17,4,7,'#8dcdcd')}
 return c}
function crowdPoseImage(look,pose,frame){const key=look.key+':'+pose+frame;if(!crowdArtCache.has(key)){if(crowdArtCache.size>=128)crowdArtCache.delete(crowdArtCache.keys().next().value);crowdArtCache.set(key,buildCrowdPose(look,pose,frame))}return crowdArtCache.get(key)}
function drawDetailedSpectator(g,id,i,x,y,scale=1,pose='idle'){const frame=strongEffects?Math.floor(neighborhoodTime*4+i)%4:0,image=crowdPoseImage(crowdLook(id,i),pose,frame);g.drawImage(image,x-28*scale,y-98*scale,56*scale,100*scale)}
// Replace the complete old crowd chain so its block arms/extra figures cannot overlap.
drawArcadeCrowd=function(){const s=stageMoments,gather=selectedStage==='rooftop'&&s.stage===selectedStage?s.winner:null,cheer=crowdCheer>0||stageHype>0||s.stage===selectedStage&&s.superGlow>0;ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=.88;
 for(const [i,start]of [76,204,326,724,892,1024].entries()){let x=start;if(gather){const target=Math.max(30,Math.min(1070,gather.x+(i<3?-1:1)*(75+i%3*33))),p=strongEffects?Math.min(1,gather.age/1.2):1;x=start+(target-start)*p}const pose=cheer||gather?'cheer':i%3===1?'phone':i%3===2?'dance':'idle';drawDetailedSpectator(ctx,selectedStage,i,x,410,i%2?.86:.92,pose)}
 // A second, smaller row adds depth without filling the center with full-size bodies.
 if(selectedStage==='blockparty'||selectedStage==='rooftop'){ctx.globalAlpha=.7;for(const [i,x]of [440,610].entries())drawDetailedSpectator(ctx,selectedStage,6+i,x,397,.65,cheer?'cheer':'dance')}
 ctx.globalAlpha=1;if(selectedStage==='rooftop'||selectedStage==='blockparty'){const look={...crowdLook(selectedStage,7),key:selectedStage+':dj',style:'headphones'},frame=strongEffects?Math.floor(neighborhoodTime*4)%4:0,image=crowdPoseImage(look,cheer?'cheer':'dance',frame),x=selectedStage==='rooftop'?849:531,y=selectedStage==='rooftop'?282:298;ctx.drawImage(image,0,0,56,68,x,y,40,49)}ctx.restore()};
