'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const env=vm.createContext({
 MOVES:{uppercut:{}},ground:430,player:{},enemy:{},resetRound(){},impactLabels:[],particles:[],
 addSuperMeter(f,n){f.superMeter=Math.min(100,(f.superMeter||0)+n)},updateSuperHud(){},detailBurst(){},impactSound(){},tone(){},
 onComboHit(a,t,m,n,b){env.lastCombo={n,b}},
 Math
});
const core=fs.readFileSync(__dirname+'/combat.js','utf8');
vm.runInContext(core.slice(core.indexOf('function applyCombatHit('),core.indexOf('\nstepFighter=function')),env);
vm.runInContext(fs.readFileSync(__dirname+'/perfect-block.js','utf8'),env);
vm.runInContext(`
const makeGuard=()=>({x:500,y:ground,hp:100,block:true,blockstun:0,stun:0,crouch:false,invulnerable:0,color:'#fff'});
const a={x:400,color:'#fff'},m={chip:2,blockstun:12,height:'mid',damage:13};
let f=makeGuard();observeGuardTiming(f,1/60);
applyCombatHit(a,f,m,1);
if(f.hp!==100||f.superMeter!==15||f.blockstun!==7)throw Error('Perfect reward/recovery');
applyCombatHit(a,f,m,1);
if(f.hp!==98||f.superMeter!==22||f.blockstun!==12)throw Error('Repeated impact perfect');
f=makeGuard();observeGuardTiming(f,1/60);observeGuardTiming(f,.14);applyCombatHit(a,f,m,1);
if(f.hp!==98||f.superMeter!==7)throw Error('Late guard reward');
f=makeGuard();observeGuardTiming(f,1/60);f.block=false;observeGuardTiming(f,.02);f.block=true;observeGuardTiming(f,.02);applyCombatHit(a,f,m,1);
if(f.hp!==98||f.superMeter!==7)throw Error('Tap spam refreshed window');
f.block=false;f.blockstun=0;observeGuardTiming(f,.5);f.block=true;observeGuardTiming(f,1/60);applyCombatHit(a,f,m,1);
if(f.hp!==98||f.superMeter!==22)throw Error('Guard did not rearm');
f=makeGuard();f.hp=1;observeGuardTiming(f,1/60);applyCombatHit(a,f,m,1);if(f.hp!==1)throw Error('Perfect chip KO');
f=makeGuard();f.superMeter=96;observeGuardTiming(f,1/60);applyCombatHit(a,f,m,1);if(f.superMeter!==100)throw Error('Meter cap');
f=makeGuard();observeGuardTiming(f,1/60);applyCombatHit(a,f,{...m,height:'low',hitstun:15},1);
if(f.hp>=100||f.superMeter)throw Error('Wrong guard rewarded');
f=makeGuard();observeGuardTiming(f,1/60);applyCombatHit(a,f,{...m,grab:true,hitstun:15},1);
if(f.hp>=100||f.superMeter)throw Error('Throw rewarded');
player=f;enemy=makeGuard();resetRound();if(guardTiming.has(player)||guardTiming.has(enemy))throw Error('Reset timing leaked');
`,env);
assert.ok(core.includes('observeGuardTiming(player,dt);observeGuardTiming(enemy,dt)'));
console.log('PASS real combat block integration: timing, chip immunity/KO prevention, recovery, single-use, spam cooldown, rearm, meter cap, throws, low guard and reset');
