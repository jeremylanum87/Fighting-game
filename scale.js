'use strict';
const ARENA_FIGHTER_SCALE=1.15;
const renderBeforeScale=renderStreetFighter;renderStreetFighter=function(g,f,scale=2.1){renderBeforeScale(g,f,g===ctx?scale*ARENA_FIGHTER_SCALE:scale)};
function scaleFighterBox(f,b){return {x:f.x+(b.x-f.x)*ARENA_FIGHTER_SCALE,y:f.y+(b.y-f.y)*ARENA_FIGHTER_SCALE,w:b.w*ARENA_FIGHTER_SCALE,h:b.h*ARENA_FIGHTER_SCALE}}
const hurtBeforeScale=hurtboxes;hurtboxes=function(f){return hurtBeforeScale(f).map(b=>scaleFighterBox(f,b))};
const attacksBeforeScale=attackHitboxes;attackHitboxes=function(f){return attacksBeforeScale(f).map(b=>scaleFighterBox(f,b))};
const pushBeforeScale=pushbox;pushbox=function(f){return scaleFighterBox(f,pushBeforeScale(f))};
counterCanReach=function(defender,attacker){const b=scaleFighterBox(defender,worldBox(defender,{x:0,y:-168,w:122,h:168}));return hurtboxes(attacker).some(h=>boxesOverlap(b,h))};
