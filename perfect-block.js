'use strict';
// Timing uses simulation seconds, so pauses, hitstop and cinematics freeze it.
const guardTiming=new WeakMap();
function observeGuardTiming(f,dt){
 let s=guardTiming.get(f);
 if(!s){s={held:false,age:1,cooldown:0,armed:false};guardTiming.set(f,s)}
 s.cooldown=Math.max(0,s.cooldown-dt);
 const held=!!f.block&&f.y===ground&&!f.attack&&!f.stun&&f.hp>0;
 if(held&&!s.held){s.armed=s.cooldown===0&&f.blockstun<=0;s.age=0;s.cooldown=.45}
 else s.age+=dt;
 if(!held)s.armed=false;
 s.held=held;
}
function resolveGuardReward(f,m){
 const s=guardTiming.get(f),perfect=!!s&&s.armed&&s.age<=.12;
 if(s)s.armed=false; // One reward per deliberate guard press.
 addSuperMeter(f,perfect?15:7);
 if(perfect){
 f.blockstun=Math.max(2,Math.ceil(m.blockstun*.55));
 f.hitFlash=.07;
 impactLabels.push({x:f.x,y:f.y-165,text:'PERFECT BLOCK',age:0,life:.75,color:'#8cffff'});
 if(impactLabels.length>8)impactLabels.shift();
 if(typeof detailBurst==='function')detailBurst(f.x,f.y-95,f.character,true,true,false);
 impactSound(true,true,false);tone(880);
 }
 updateSuperHud();
 return perfect;
}
const resetBeforeGuardReward=resetRound;
resetRound=function(){resetBeforeGuardReward();guardTiming.delete(player);guardTiming.delete(enemy)};
