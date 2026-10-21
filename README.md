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

## Individual movesets
Each character now has unique light/heavy tuning and three specials, accessible through U/I/O or the named mobile buttons. Motion inputs select the same slots. Specials have individual cooldowns; failed attempts do not spend them.

| Fighter | Style | U | I | O |
|---|---|---|---|---|
| Volt | Electric boxer | Spark Counter | Lightning Uppercut | Electric Rush |
| Ember | Counter fighter | Fire Counter | Punishing Elbow | Flame Burst |
| Cipher | Technical striker | Feint Step | Energy Palm | Precision Chain |
| Brick | Power wrestler | Clinch Throw | Power Slam | Heavy Lariat |
| Jade | Capoeira | Ginga Dodge | Handstand Kick | Whirlwind |
| Rook | Judo | Redirect Throw | Crushing Takedown | Reaping Trip |
| Haze | Speed striker | Dash Strike | Speed Barrage | Quick Step |
| Goldie | Breakdance | Floor Sweep | Rhythm Combo | Golden Windmill |

Counters only work during their active window against nearby strikes/projectiles and trigger once; throws defeat guarding but need close range and grounded targets. Armor prevents hit interruption but still takes damage. Dodges have a short invulnerability window. Throws launch opponents, and knockdowns extend recovery. Multi-hit specials use combo scaling. Existing licensed sprite animations are reused with rotations, movement, trails and elemental effects; no new hand-drawn attack sheets were added.

## Special attack animations
All 24 specials now have original procedural pixel-art startup, active and recovery pose frames. Streetwear rigs stay consistent across idle, movement, attacks, selection and title. Includes electric arcs, counter bursts, palm/projectile windup, lift/slam poses, handstands, windmills, barrage afterimages and impact rings. Frames are cached per round for mobile use. Combat timing and hitboxes remain unchanged.

## Collision boxes
Attacks now use facing-aware rectangles during active frames. Standing fighters have separate head/torso regions; crouch, air and grounded-knockdown states change the vulnerable area. Grabs need grounded body overlap; spinning attacks can hit either side. Projectiles use a swept rectangle between frames. H or the BOXES button shows blue body areas, red attacks/projectiles, and purple grabs/invulnerability. Damage, guard rules and cooldowns remain unchanged.

## Character identity and impact polish
Eight original rigs now have different silhouettes, stances, hair/headwear and clothing: boxing gloves, a hooded vest, long coat/headphones, wrestler tank/belt, capoeira wraps, belted bomber, slim hoodie/scarf, and varsity jacket/backward cap. Body collision regions scale to their proportions.
Hits and blocks have separate original synthesized sounds when BEAT is enabled. Heavy strikes add restrained shake, hit flashes and readable impact labels. Knockouts play a short banner/slowdown before round results. FX LOW disables shake, hit flashes and slowdown; reduced-motion system preferences enable it initially. Combat timings and movesets are retained.

## Roster archetypes
The roster now has more pronounced original fighting-game roles and silhouettes. Health: Volt 100, Ember 105, Cipher 90, Brick 125, Jade 95, Rook 115, Haze 80, Goldie 100. Walking speed, jump strength, aerial control, normal range/timing and normal-attack animation differ. CPU spacing follows each role. Timeouts compare remaining health percentages to avoid favoring high-health fighters. Mobile light/heavy buttons show their actual move names; selection explains strengths and weaknesses. These are original characters, not Street Fighter likenesses.
