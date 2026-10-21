# Neon Clash

A standalone rooftop arcade fighting game. Open `index.html` in a browser, or serve this directory with `python3 -m http.server 8000` and visit http://localhost:8000.

- A / D: move; W: jump
- J: punch; K: kick; L: hold to block
- P: pause / resume
- Touch controls are provided on small screens.

Fight the CPU in a first-to-two-rounds match. Each round lasts 60 seconds; the fighter with more health wins when time expires. Draws award no points. Sound is optional. No build step or dependencies are required; fonts fall back to local fonts offline.

## Mobile browsers
Open the hosted game URL in Safari or Chrome. Large touch controls support moving and attacking together. Rotate to landscape for a wider view. Switching apps pauses the match. The standalone Neon-Clash-Mobile.html bundles all game code in one file.

## Neon Fist combat update
Fixed 60 Hz combat with startup/active/recovery phases, 10-frame input buffering, light-to-heavy-to-special cancels on hit or block, combo damage scaling, hitstop, low/overhead blocking, and fireball/rising/spinning strikes. Keyboard: S duck, U fireball, I rising strike, O spin. Tap J/K to attack; holding no longer repeats attacks. Mobile has dedicated buttons. Motion inputs are relative to facing. This adaptation is CPU/local play; online rollback and account services from Neon Fist are not included.

## Block Cypher street edition
Summer-2010 hip-hop art direction: original brick/graffiti basketball-court backdrop, apartment fire escapes, chain-link fencing, wheatpaste flyers, boombox and warm lamps. Optional original 92 BPM synthesized boom-bap beat follows the BEAT toggle and mutes when paused or hidden. No music samples or recordings. Combat and licensed fighter sprite sheets are retained.

## Title screen and expanded roster
The game opens on Start / How to Play / Beat controls. Choose from Volt, Ember, Cipher, Brick, Jade, Rook, Haze and Goldie, then choose a CPU opponent. New fighters use color variants of the existing CC0 animation sets and slightly different movement/damage profiles. HOME returns to the opening screen; confirming a selection starts a fresh match.
