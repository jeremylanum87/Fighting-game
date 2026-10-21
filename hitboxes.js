'use strict';
// Collision geometry uses world coordinates; facing mirrors local boxes.
function boxesOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function worldBox(f,b){return {x:f.face<0?f.x-b.x-b.w:f.x+b.x,y:f.y+b.y,w:b.w,h:b.h}}
function hurtboxes(f){if(f.hp<=0)return [];if(f.y===ground&&f.knockedDown&&f.stun>0)return [{x:f.x-46,y:f.y-38,w:92,h:38}];if(f.crouch&&f.y===ground)return [{x:f.x-27,y:f.y-102,w:54,h:102}];if(f.y<ground)return [{x:f.x-23,y:f.y-137,w:46,h:58},{x:f.x-26,y:f.y-79,w:52,h:70}];return [{x:f.x-18,y:f.y-145,w:36,h:42},{x:f.x-26,y:f.y-103,w:52,h:103}]}
function attackHitboxes(f){const a=f.attack;if(!a)return [];const m=a.move||getMove(f,a.type);if(a.frame<m.startup||a.frame>=m.startup+m.active||m.projectile||m.counter||m.dodge||(a.type==='fireball'&&!f.character))return [];
 if(m.box)return [worldBox(f,m.box)];
 const reach=Math.max(28,(m.range||100)-24);let box;
 if(m.grab)box={x:12,y:-119,w:Math.max(18,reach-12),h:105};
 else if(m.rotate)box={x:-reach*.7,y:-95,w:reach*1.4,h:88};
 else if(m.height==='low')box={x:18,y:-39,w:reach-18,h:35};
 else if(m.height==='overhead')box={x:22,y:-117,w:reach-22,h:72};
 else if(a.type==='uppercut'&&m.launch!==0)box={x:2,y:-187,w:reach-2,h:145};
 else if(a.type==='punch'||m.multi)box={x:22,y:-119,w:reach-22,h:43};
 else box={x:18,y:-103,w:reach-18,h:65};
 return [worldBox(f,box)];
}
function meleeConnects(attacker,target){const m=attacker.attack?.move||getMove(attacker,attacker.attack?.type);if(!m||m.grab&&target.y!==ground)return false;return attackHitboxes(attacker).some(a=>hurtboxes(target).some(b=>boxesOverlap(a,b)))}
function projectileHitbox(p,previousX=p.x){return {x:Math.min(previousX,p.x)-22,y:p.y-15,w:Math.abs(p.x-previousX)+44,h:30}}
function projectileConnects(p,target,previousX=p.x){return hurtboxes(target).some(b=>boxesOverlap(projectileHitbox(p,previousX),b))}
function counterCanReach(defender,attacker){return hurtboxes(attacker).some(b=>boxesOverlap(worldBox(defender,{x:0,y:-168,w:122,h:168}),b))}
function pushbox(f){return {x:f.x-24,y:f.y-(f.crouch?80:110),w:48,h:f.crouch?80:110}}
let showHitboxes=false;
function toggleHitboxes(){showHitboxes=!showHitboxes;const b=document.querySelector('#hitboxToggle');if(b){b.textContent=showHitboxes?'BOXES ON':'BOXES OFF';b.setAttribute('aria-pressed',String(showHitboxes))}}
const hitboxButton=document.querySelector('#hitboxToggle');if(hitboxButton)hitboxButton.onclick=toggleHitboxes;
window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h'&&!e.repeat){e.preventDefault();toggleHitboxes()}});
const drawBeforeHitboxes=draw;draw=function(){drawBeforeHitboxes();if(!showHitboxes||!['playing','paused','roundover','finished'].includes(mode))return;ctx.save();ctx.lineWidth=2;function outline(box,color){ctx.strokeStyle=color;ctx.fillStyle=color+'22';ctx.fillRect(box.x,box.y,box.w,box.h);ctx.strokeRect(box.x,box.y,box.w,box.h)}for(const f of [player,enemy]){for(const b of hurtboxes(f))outline(b,f.invulnerable>0?'#a294c4':'#68c5ff');for(const b of attackHitboxes(f))outline(b,f.attack.move?.grab?'#cf91ff':'#ff765d')}for(const p of projectiles)outline(projectileHitbox(p),'#ff765d');ctx.font='10px monospace';ctx.fillStyle='#fff1d3';ctx.fillText('BLUE: BODY   RED: ATTACK   PURPLE: GRAB / INVULNERABLE',20,475);ctx.restore()};
