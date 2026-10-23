'use strict';
// Damage is derived from health, with no combat mutations or gameplay RNG.
const battleDamageCache=new WeakMap();
function battleDamageLevel(f){
 const ratio=Math.max(0,Math.min(1,f.hp/(f.maxHp||100)));
 return ratio>.75?0:ratio>.5?1:ratio>.25?2:3;
}
function damageAtlasPixels(data,width,height,level,seed){
 if(!level)return;
 const original=new Uint8ClampedArray(data);
 const skin=i=>original[i+3]>180&&original[i]>85&&original[i]>original[i+1]*1.14&&original[i+1]>original[i+2]*1.08;
 const mark=(x,y,color,alpha)=>{
 if(x<0||x>=width||y<0||y>=height)return;
 const i=(y*width+x)*4;if(original[i+3]<180)return;
 for(let c=0;c<3;c++)data[i+c]=Math.round(data[i+c]*(1-alpha)+color[c]*alpha);
 };
 for(let frame=0;frame<Math.floor(width/160);frame++){
 const start=frame*160,skinPoints=[],cloth=[];
 for(let y=25;y<Math.min(148,height);y++)for(let x=26;x<138;x++){
 const i=(y*width+start+x)*4;if(original[i+3]<180)continue;
 if(skin(i))skinPoints.push([start+x,y]);else if(y>75&&y<130&&original[i]+original[i+1]+original[i+2]>85)cloth.push([start+x,y]);
 }
 if(skinPoints.length){
 const top=Math.min(...skinPoints.map(p=>p[1]));
 const upper=skinPoints.filter(p=>p[1]<=top+15);
 const point=upper[Math.floor(upper.length*(.35+(seed%3)*.1))]||skinPoints[0];
 for(let dy=0;dy<3+level;dy++)for(let dx=0;dx<3+level;dx++){
 const x=point[0]+dx-1,y=point[1]+dy;
 if(x<width&&y<height&&skin((y*width+x)*4))mark(x,y,[78,46,76],.38+level*.1);
 }
 if(level>=2){
 const cut=upper[Math.floor(upper.length*.72)]||point;
 for(let x=0;x<level+1;x++)mark(cut[0]+x,cut[1],[132,35,38],.8);
 mark(cut[0],cut[1]-1,[230,172,142],.45);
 }
 if(level===3){
 const point=skinPoints[Math.floor(skinPoints.length*.65)];
 for(let n=0;n<3;n++)mark(point[0]+n,point[1]+n,[91,48,61],.65);
 }
 }
 for(let n=0;n<level*4&&cloth.length;n++){
 const p=cloth[(seed*37+n*157)%cloth.length];
 mark(p[0],p[1],[192,179,149],.4);
 mark(p[0]+1,p[1],[32,27,36],.65);
 if(level>=2)mark(p[0]+2,p[1]+1,[32,27,36],.55);
 }
 }
}
function battleDamageAtlas(source,f){
 const level=battleDamageLevel(f),width=source.naturalWidth||source.width,height=source.naturalHeight||source.height;
 if(!level||!Number.isFinite(f.hp)||!width||height!==160||width<1280)return source;
 let cache=battleDamageCache.get(source);if(!cache){cache=new Map();battleDamageCache.set(source,cache)}
 const key=f.character+':'+level;
 if(cache.has(key))return cache.get(key);
 try{
 const result=document.createElement('canvas');result.width=width;result.height=height;
 const g=result.getContext('2d');g.drawImage(source,0,0);
 const pixels=g.getImageData(0,0,width,height);
 const seed=String(f.character).split('').reduce((sum,c)=>sum+c.charCodeAt(0),0);
 damageAtlasPixels(pixels.data,width,height,level,seed);g.putImageData(pixels,0,0);
 if(cache.size>=24)cache.delete(cache.keys().next().value);
 cache.set(key,result);return result;
 }catch{return source}
}
