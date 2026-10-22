'use strict';
require('./combat.test.cjs');
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
// Exercise the actual pose function with controlled art/state dependencies.
const source=fs.readFileSync(__dirname+'/fighter-art.js','utf8').split('const renderBeforeUnifiedArt=')[0];
const context=vm.createContext({motionArt:{volt:{}},arcadeSprites:{volt:{}},throwSequences:[],reactions:new WeakMap(),strongEffects:true});
vm.runInContext(source,context);
vm.runInContext(`
const f={character:'volt',x:500,y:430,hp:75,stun:.3,face:1,animTime:0};
reactions.set(f,{age:0,life:.32,dir:1,kind:'heavy'});
const before=JSON.stringify(f),heavy=detailedArtPose(f);
if(heavy.x<=f.x||heavy.sx>=1||heavy.sy<=1||heavy.angle<=0)throw Error('Heavy hit needs visible recoil');
if(JSON.stringify(f)!==before)throw Error('Visual pose changed combat');
reactions.set(f,{age:0,life:.2,dir:1,kind:'light'});
const light=detailedArtPose(f);if(light.x>=heavy.x)throw Error('Heavy/light differentiation');
f.face=-1;const mirrored=detailedArtPose(f);if(mirrored.angle>=0)throw Error('Mirrored recoil');
strongEffects=false;const reduced=detailedArtPose(f);if(reduced.x<=f.x||reduced.x>=light.x)throw Error('Reduced motion readable recoil');
reactions.set(f,{age:.2,life:.2,dir:1,kind:'light'});const settled=detailedArtPose(f);if(settled.x!==f.x||settled.sx!==1)throw Error('Recoil did not settle');
f.knockedDown=true;reactions.set(f,{age:0,life:.65,dir:1,kind:'down'});if(detailedArtPose(f).angle!==0)throw Error('Duplicated knockdown rotation');
`,context);
console.log('PASS hit recoil intensity, mirrored facing, reduced motion, settling, knockdown and unchanged combat state');
