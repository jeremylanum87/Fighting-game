'use strict';
const STAGE_MATERIALS={
 court:{ambient:'#798f9f',rim:'#efc682',bounce:'#b89a69',dust:'#ac936e',surface:'asphalt',wet:false},
 subway:{ambient:'#88a9af',rim:'#bcf3e8',bounce:'#9bada4',dust:'#8d9c98',surface:'tile',wet:true},
 corner:{ambient:'#718f99',rim:'#f2b578',bounce:'#a99a80',dust:'#a28d72',surface:'paving',wet:false},
 rooftop:{ambient:'#8786ad',rim:'#b4d9ee',bounce:'#9c8c93',dust:'#b9a99a',surface:'roof',wet:false},
 warehouse:{ambient:'#879083',rim:'#e1c38b',bounce:'#a99b7e',dust:'#b3a187',surface:'concrete',wet:false},
 cleveland:{ambient:'#7f9da8',rim:'#f1ce8e',bounce:'#a6afa0',dust:'#bba785',surface:'paving',wet:true},
 underpass:{ambient:'#7f9693',rim:'#b9cfb6',bounce:'#9f9e86',dust:'#a8a088',surface:'concrete',wet:false},
 laundromat:{ambient:'#9d82ad',rim:'#9ce7ed',bounce:'#c496b6',dust:'#a2c4ca',surface:'paving',wet:true},
 parking:{ambient:'#9b91ad',rim:'#ebc695',bounce:'#b6a388',dust:'#b3aa92',surface:'asphalt',wet:false},
 blockparty:{ambient:'#b5a18b',rim:'#ffe0ab',bounce:'#b7aa81',dust:'#c2ae87',surface:'paving',wet:false}
};
let drawingGroundedFighter=false,stageLightingDepth=0,groundingSourceIds=new WeakMap(),nextGroundingSource=0,groundContacts=new WeakMap(),surfacePuffs=[];
const stageLightingCache=new Map(),stagePlaneCache=new Map(),footAnchorCache=new Map(),groundShadowCache=new Map();
const rgb=color=>[1,3,5].map(n=>parseInt(color.slice(n,n+2),16));
function stageLitAtlas(source,f){
 const width=source.naturalWidth||source.width,height=source.naturalHeight||source.height;if(height!==160||width<1280)return source;
 let id=groundingSourceIds.get(source);if(!id){id=++nextGroundingSource;groundingSourceIds.set(source,id)}const key=id+':'+selectedStage+':'+(f.face<0?'L':'R');if(stageLightingCache.has(key))return stageLightingCache.get(key);
 try{const c=document.createElement('canvas');c.width=width;c.height=height;const g=c.getContext('2d');g.drawImage(source,0,0);const frame=g.getImageData(0,0,width,height),d=frame.data,original=new Uint8ClampedArray(d),p=STAGE_MATERIALS[selectedStage]||STAGE_MATERIALS.court,a=rgb(p.ambient),rim=rgb(p.rim),bounce=rgb(p.bounce),side=f.face<0?2:-2;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=(y*width+x)*4;if(original[i+3]<20)continue;const local=x%160,edgeX=x+side,edge=local+side>=0&&local+side<160&&(original[(y*width+edgeX)*4+3]<40),up=y>1&&original[((y-2)*width+x)*4+3]<40,foot=Math.max(0,(y-106)/54);
 for(let k=0;k<3;k++){let value=original[i+k]*.94+a[k]*.06;value=value*(1-foot*.11)+bounce[k]*foot*.11;if(edge||up)value=value*.72+rim[k]*.28;d[i+k]=Math.round(value)}}g.putImageData(frame,0,0);
 const cap=coarseGameDevice()?6:12;if(stageLightingCache.size>=cap)stageLightingCache.delete(stageLightingCache.keys().next().value);stageLightingCache.set(key,c);return c;
 }catch{return source}
}
const damageAtlasBeforeGrounding=battleDamageAtlas;
battleDamageAtlas=function(source,f){const damaged=damageAtlasBeforeGrounding(source,f);return stageLightingDepth>0?stageLitAtlas(damaged,f):damaged};
function footAnchors(f){const id=f.character;if(footAnchorCache.has(id))return footAnchorCache.get(id);const image=arcadeSprites[id];if(!image?.complete||image.naturalWidth<1280)return [-20,21];try{const c=document.createElement('canvas');c.width=160;c.height=160;const g=c.getContext('2d');g.drawImage(image,0,0,160,160,0,0,160,160);const d=g.getImageData(0,0,160,160).data;let bottom=0;for(let y=120;y<153;y++)for(let x=15;x<145;x++)if(d[(y*160+x)*4+3]>150)bottom=y;const columns=[];for(let x=15;x<145;x++){let solid=false;for(let y=Math.max(120,bottom-3);y<=bottom;y++)if(d[(y*160+x)*4+3]>150)solid=true;if(solid)columns.push(x)}const groups=[];for(const x of columns){const last=groups[groups.length-1];if(!last||x-last[last.length-1]>8)groups.push([x]);else last.push(x)}let anchors=groups.map(v=>(v[0]+v[v.length-1])/2-80);if(anchors.length<2)anchors=[-20,21];else anchors=[anchors[0],anchors[anchors.length-1]];footAnchorCache.set(id,anchors);return anchors}catch{return [-20,21]}}
function groundShadowSprite(f){if(groundShadowCache.has(f.character))return groundShadowCache.get(f.character);const image=arcadeSprites[f.character];if(!image?.complete||image.naturalWidth<1280)return null;const c=document.createElement('canvas');c.width=c.height=160;const g=c.getContext('2d');g.drawImage(image,0,0,160,160,0,0,160,160);g.globalCompositeOperation='source-in';g.fillStyle='#07111b';g.fillRect(0,0,160,160);groundShadowCache.set(f.character,c);return c}
function groundedVisualDrop(f){if(roundImpact||cinematicFinisher||lastBar)return 0;const defeated=defeatedFighters.get(f);if(defeated)return Math.max(0,ground-f.y)*Math.min(1,defeated.age/defeated.life);if((roundVictory?.winner===f||f.celebrating)&&['roundover','finished'].includes(mode))return Math.max(0,ground-f.y)*Math.min(1,(roundVictory?.age||victoryAges.get(f)||0)/.3);return 0}
function drawGroundContact(f){const entrance=stageEntranceOffset(f),groundX=f.x+(entrance?.x||0);const p=STAGE_MATERIALS[selectedStage]||STAGE_MATERIALS.court,elevation=Math.max(0,ground-f.y-groundedVisualDrop(f)),down=defeatedFighters.get(f),settle=down?Math.min(1,down.age/down.life):0,b=BODY_STYLES[f.character],factor=Math.sqrt(b?.width||1),radius=(48+settle*48)*factor;
 ctx.save();ctx.globalAlpha=entrance?.alpha??1;const shadow=!down&&groundShadowSprite(f);if(shadow){const size=2.1*ARENA_FIGHTER_SCALE*.7*(b?.height||1);ctx.save();ctx.globalAlpha=Math.max(.035,.14-elevation*.0004);ctx.translate(groundX+elevation*.12,ground+3);ctx.transform((f.face||1)*.78*factor,0,-.22,-.07,0,0);ctx.drawImage(shadow,-80*size,-144*size,160*size,160*size);ctx.restore()}ctx.fillStyle=`rgba(6,13,19,${Math.max(.08,.23-elevation*.0008)})`;ctx.beginPath();ctx.ellipse(groundX+(f.face||1)*settle*45,ground+3,radius+elevation*.08,Math.max(4,9-elevation*.015),0,0,Math.PI*2);ctx.fill();
 if(elevation<14&&!down){const scale=2.1*ARENA_FIGHTER_SCALE*.7*(b?.height||1)*.78*factor;for(const anchor of footAnchors(f)){ctx.fillStyle=`rgba(5,10,14,${.28*(1-elevation/14)})`;ctx.beginPath();ctx.ellipse(groundX+anchor*scale*(f.face||1),ground+2,14*factor,3.3,0,0,Math.PI*2);ctx.fill()}}
 if(p.wet&&strongEffects&&elevation<45&&!f.knockedDown&&!down){const pose=detailedArtPose(f);let image=pose.image;if(image?.complete||image?.width){if(f===player&&!f.isBoss)image=recolorOutfit(image,f.character,chosenOutfit(f.character));image=stageLitAtlas(damageAtlasBeforeGrounding(image,f),f);const size=2.1*ARENA_FIGHTER_SCALE*.7*(b?.height||1);ctx.save();ctx.beginPath();ctx.rect(0,ground+5,1100,32);ctx.clip();ctx.globalAlpha=.065*(1-elevation/45);ctx.translate(groundX,ground+5);ctx.scale((f.face||1)*.78*factor,-.12);ctx.drawImage(image,pose.col*160,0,160,160,-80*size,-144*size,160*size,160*size);ctx.restore()}}
 ctx.restore();
}
const drawFighterBeforeGrounding=drawFighter;
drawFighter=function(f){drawGroundContact(f);drawingGroundedFighter=true;try{drawFighterBeforeGrounding(f)}finally{drawingGroundedFighter=false}};
const renderBeforeGrounding=renderStreetFighter;
renderStreetFighter=function(g,f,scale=2.1){const live=g===ctx&&(f===player||f===enemy),replay=typeof cinematicReplay!=='undefined'&&cinematicReplay&&g===$('#highlightReplayCanvas').getContext('2d');if(!live&&!replay)return renderBeforeGrounding(g,f,scale);stageLightingDepth++;g.save();g.translate(0,groundedVisualDrop(f));try{renderBeforeGrounding(g,f,scale)}finally{g.restore();stageLightingDepth--}};
function surfacePuff(f,landing=false){if(reducedMotionPreference())return;const p=STAGE_MATERIALS[selectedStage]||STAGE_MATERIALS.court;const b=BODY_STYLES[f.character],contact=groundContacts.get(f),anchor=landing?0:footAnchors(f)[contact?.footStep||0]*2.1*ARENA_FIGHTER_SCALE*.7*(b?.height||1)*.78*Math.sqrt(b?.width||1)*(f.face||1);surfacePuffs.push({x:f.x+anchor,y:ground+2,age:0,life:landing?.42:.24,wet:p.wet,color:p.wet?p.rim:p.dust,landing,dir:f.vx>=0?1:-1});if(surfacePuffs.length>18)surfacePuffs.shift()}
const stepBeforeGrounding=stepFighter;
stepFighter=function(f,t,dt){const y=f.y,x=f.x;stepBeforeGrounding(f,t,dt);let s=groundContacts.get(f);if(!s){s={distance:0,footStep:0};groundContacts.set(f,s)}if(f.hp<=0)return;if(y<ground&&f.y===ground)surfacePuff(f,true);if(f.y===ground&&!f.stun&&!f.block&&!f.attack){s.distance+=Math.abs(f.x-x);if(s.distance>26){s.distance=0;s.footStep=1-s.footStep;surfacePuff(f)}}};
function stageFloorPlane(){if(stagePlaneCache.has(selectedStage))return stagePlaneCache.get(selectedStage);const c=document.createElement('canvas');c.width=1100;c.height=520;const g=c.getContext('2d'),p=STAGE_MATERIALS[selectedStage]||STAGE_MATERIALS.court;g.strokeStyle=p.bounce;g.lineWidth=1;g.globalAlpha=.10;
 if(['tile','paving','roof'].includes(p.surface)){for(const y of [438,464,503]){g.beginPath();g.moveTo(0,y);g.lineTo(1100,y);g.stroke()}for(let x=-600;x<1800;x+=165){g.beginPath();g.moveTo(550+(x-550)*.45,414);g.lineTo(x,520);g.stroke()}}
 else for(let i=0;i<44;i++){const x=(i*173)%1100,y=424+(i*31)%92;g.fillStyle=p.bounce;g.fillRect(x,y,8+i%4*5,1)}
 const shade=g.createLinearGradient(0,470,0,520);shade.addColorStop(0,'#07121b00');shade.addColorStop(1,'#07121b40');g.globalAlpha=1;g.fillStyle=shade;g.fillRect(0,470,1100,50);if(stagePlaneCache.size>=2)stagePlaneCache.delete(stagePlaneCache.keys().next().value);stagePlaneCache.set(selectedStage,c);return c}
const backdropBeforeGrounding=drawStageBackdrop;drawStageBackdrop=function(g){backdropBeforeGrounding(g);g.save();g.drawImage(stageFloorPlane(),0,0);g.restore()};
const updateBeforeGrounding=update;
update=function(dt){const advance=['playing','roundover','finished'].includes(mode)&&!document.hidden&&!superCinema&&!(mode==='playing'&&hitstop>0)&&$('#controlSettings').hidden;updateBeforeGrounding(dt);if(advance){for(const p of surfacePuffs)p.age+=dt;surfacePuffs=surfacePuffs.filter(p=>p.age<p.life)}};
const drawBeforeGrounding=draw;
draw=function(){drawBeforeGrounding();if(!['playing','paused','countdown','roundover','finished'].includes(mode)||superCinema)return;ctx.save();ctx.setTransform(canvas.width/1100,0,0,canvas.height/520,0,0);for(const p of surfacePuffs){const t=p.age/p.life;ctx.globalAlpha=(1-t)*(strongEffects?.35:.16);ctx.strokeStyle=p.color;ctx.fillStyle=p.color;ctx.lineWidth=1.5;if(p.wet){ctx.beginPath();ctx.ellipse(p.x,p.y,8+t*(p.landing?55:26),2+t*6,0,0,Math.PI*2);ctx.stroke()}else{for(let i=0;i<(strongEffects?5:2);i++){const x=p.x+(i-2)*t*(p.landing?18:9)-p.dir*t*12,y=p.y-Math.sin(t*Math.PI)*(3+i%3*4);ctx.beginPath();ctx.ellipse(x,y,2+t*5,1+t*2,0,0,Math.PI*2);ctx.fill()}}}
 // Near-camera curb chips give the floor a foreground plane without hiding fighters.
 ctx.globalAlpha=.7;const shift=reducedMotionPreference()?0:Math.max(-4,Math.min(4,((player.x+enemy.x)/2-550)*-.015));for(const x of [0,1040]){ctx.fillStyle='#14242e';ctx.fillRect(x+shift,510,60,10);ctx.fillStyle=(STAGE_MATERIALS[selectedStage]||STAGE_MATERIALS.court).bounce;ctx.fillRect(x+shift,510,60,2)}ctx.restore()};
function clearGrounding(){groundContacts=new WeakMap();surfacePuffs=[]}
const resetBeforeGrounding=resetRound;resetRound=function(){resetBeforeGrounding();clearGrounding()};
const trimBeforeGrounding=trimReleaseVisualCaches;trimReleaseVisualCaches=function(){trimBeforeGrounding();stageLightingCache.clear();stagePlaneCache.clear();groundShadowCache.clear()};
const titleBeforeGrounding=showTitleScreen;showTitleScreen=function(){clearGrounding();titleBeforeGrounding()};
