'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const env=vm.createContext({document:{createElement:()=>createCanvas(1,1)},console});
vm.runInContext(fs.readFileSync(__dirname+'/battle-damage.js','utf8'),env);
(async()=>{
 const ids=['volt','ember','cipher','brick','jade','rook','haze','goldie'];
 const gallery=createCanvas(960,1920),g=gallery.getContext('2d');g.fillStyle='#18232f';g.fillRect(0,0,960,1920);g.imageSmoothingEnabled=false;
 for(let row=0;row<ids.length;row++){
 const id=ids[row],source=await loadImage(__dirname+'/assets/arcade/'+id+'.png');
 env.source=source;env.f={character:id,hp:100,maxHp:100};env.imageData=null;
 const pristine=JSON.stringify(env.f),clean=vm.runInContext('battleDamageAtlas(source,f)',env);
 assert.equal(clean,source);assert.equal(JSON.stringify(env.f),pristine);
 let lastCount=0;
 for(let col=0;col<4;col++){
 env.f.hp=[100,70,45,20][col];const before=JSON.stringify(env.f);
 const result=vm.runInContext('battleDamageAtlas(source,f)',env);
 assert.equal(vm.runInContext('battleDamageLevel(f)',env),col);
 assert.equal(result,vm.runInContext('battleDamageAtlas(source,f)',env));
 assert.equal(JSON.stringify(env.f),before);
 const original=createCanvas(1280,160);original.getContext('2d').drawImage(source,0,0);
 const compare=createCanvas(1280,160);compare.getContext('2d').drawImage(result,0,0);
 const a=original.getContext('2d').getImageData(0,0,1280,160).data,b=compare.getContext('2d').getImageData(0,0,1280,160).data;
 let count=0;
 for(let i=0;i<a.length;i+=4){
 assert.equal(a[i+3],b[i+3],'Silhouette alpha changed');
 if(a[i+3]===0)assert.equal(a[i]+a[i+1]+a[i+2],b[i]+b[i+1]+b[i+2]);
 if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2])count++;
 }
 if(col)assert.ok(count>lastCount,id+' damage tier did not add wear');
 lastCount=count;
 g.drawImage(result,0,0,160,160,col*240,row*240,240,240);
 g.fillStyle='#f7d18a';g.font='bold 12px sans-serif';g.fillText(id.toUpperCase()+' / '+['FRESH','WORN','BRUISED','BATTERED'][col],col*240+10,row*240+230);
 }
 env.f.hp=100;assert.equal(vm.runInContext('battleDamageAtlas(source,f)',env),source);
 }
 fs.writeFileSync('/workspace/battle-damage-preview.png',gallery.toBuffer('image/png'));
 console.log('PASS all eight fighters / four damage levels, deterministic cache, preserved alpha/silhouettes, pure rendering and health reset');
})().catch(e=>{console.error(e);process.exit(1)});
