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

## Arcade graphics edition
Eight new detailed pixel-art strips (64 source poses) replace the simple procedural fighters, with eight portrait images. Runtime pose sequencing and transforms adapt them to the existing normal attacks and 24 specials; these are eight source poses per fighter, not bespoke hand-drawn frames for every move. Beveled health bars, portraits, low-resolution pixel scaling and an animated spectator layer complete the arcade presentation. The original roster, combat logic, archetypes and mobile controls are preserved.

## Named combo system
Tap attacks to chain connected normals into specials. Two connected lights can chain together, then cancel into heavy and a compatible special. Whiffs cannot cancel; a third light cannot loop the chain. Fourteen-frame input buffering makes follow-ups easier on touch controls.
Each fighter has an on-screen named route: Live Wire, Burn Notice, Word Perfect, Block Rocker, Ginga Flow, Checkmate, Fast Forward, and Gold Record. The guide uses the selected fighter’s move names. The HUD tracks actual health damage and hit count, counts a multi-hit special as one route input, and marks combos complete/blocked/interrupted when the defender recovers, guards, or turns the fight around. Existing progressive damage scaling and special cooldowns still apply.

## Neighborhood expansion

- **Quick Match:** choose opponent, one of five stages, and Easy/Normal/Hard CPU difficulty. Rival introductions precede the first round; victory dialogue follows a match.
- **Training:** no timer; dummy health refills between attempts and after KOs. Dummy options: stand, guard, low guard, jump, or CPU. Watch individual move and character-combo demonstrations, reset practice, and toggle hitboxes. Manual input stops a demo.
- **Arcade:** seven roster rivals followed by The Promoter, a gold-tinted heavyweight boss variant using Brick's artwork/moves with boss tuning. Each match is first-to-two rounds. Losing offers a retry at the same opponent. Clearing the ladder unlocks the chosen character's original ending in the title-screen gallery. Endings save locally; an in-progress ladder currently lasts for the page session.
- **Stages:** Basketball Court, Subway Platform, Corner Store, Rooftop Cypher, and Warehouse. All new backdrops and animated elements are original Canvas artwork; collision dimensions remain consistent.
- **CPU difficulty:** changes reaction delays, guarding, movement, combo choices, and projectile evasion. Normal opponents receive no health/damage bonus from difficulty. The final boss is explicitly stronger.
- **Mobile controls:** adjust button size, spacing, movement/attack pad height, opacity and left-handed layout. Preferences save locally on the device. Optional short vibration plays on heavy hits where supported. Open controls with the gear button during a fight; the game pauses while settings are open. Fullscreen and landscape locking are attempted only after pressing the button, with a browser-support fallback.

No account is required. Clearing browser storage removes saved controls and endings. The new progression and training features remain offline/local play; online multiplayer is not included.

## Character-select redesign
Selection now uses one large animated fighter showcase, eight portrait tiles in a 4×2 grid, a live profile with health/speed/heavy-damage/reach bars, a VS matchup strip and a LOCK IN button. Detailed mode/opponent/stage/difficulty settings live in a collapsible setup row. Mobile stacks the showcase above the roster and keeps confirmation sticky. Arrow keys navigate the grid; Enter/Space select a fighter. Selection sounds respect sound settings and reveal animations respect reduced-motion preferences. Existing Quick/Training/Arcade choices and match confirmation are preserved.


### Fighter polish and personal records
Each CPU uses a character-specific spacing and attack strategy. Extra movement, guard, crouch, hurt and knockdown frames are generated locally from the original arcade atlas. Entrances and victory poses reuse each fighter’s signature pose; taunts are cosmetic, available with T or the touch button, and have a six-second cooldown.

Controls includes an optional diagonal movement thumbstick and horizontal/vertical pad offsets. Personal Records on the title screen tracks match wins/losses, rounds won, best combo hits/damage and arcade clears in local storage (`block-cypher-records-v1`). Training is excluded. Clearing browser data removes saved records.


### Super moves
Land hits and block attacks to charge a 100-point meter. Press R or tap SUPER to spend a full meter on the selected fighter’s signature super. Supers are grounded, blockable mid attacks, with long recovery and no invulnerability; they can cancel hit-confirmed light/heavy/low normals. The short cinematic freezes both fighters and the round timer, respecting pause and hidden tabs. Supers do not generate meter. Meter carries between rounds and resets for a new match. Training starts with full player meter and has a FILL SUPER METER button.


### Training coach
Training includes live hit/guard/whiff feedback, input-buffer expiry guidance, late-link detection, a recent successful-input history and the next move in the character combo route. Feedback stays out of competitive matches and is suppressed while a demonstration runs. Compact in-arena notices remain visible in landscape; detailed coaching and training settings sit below the battle area.


### Faster combat and smooth motion
Combat runs at 1.08× speed through fixed simulation steps. The round clock, rival openings and super cinematic retain their normal pace. Runtime pixel animation adds continuous walk cycles, breathing idle, air/landing transitions and subtle attack anticipation/follow-through, with interpolated movement between simulation steps. Large hit/throw corrections remain immediate.


### Detailed effects
Layered impact sparks, blue guard shards, landing dust, short special-move afterimages and fighter-specific energy/flame/wind/gold/speed/quake effects run entirely on Canvas. Projectile trails have character palettes and distinct fire or energy details. Effects use a separate random generator and never change hitboxes or damage. Particle counts are capped at 180 in full effects and 28 in FX LOW; low mode removes afterimages. Effects freeze during pause and super cinematics.


### Balance, CPU fairness and adaptive effects
Brick has 120 HP and a 36-base-damage super; Haze has 84 HP. Rook’s normal reaps stagger, leaving knockdowns to his specials. Super chip is one point per multi-hit strike or three for a single hit. CPUs observe attack/position snapshots delayed by 260/190/140 ms on Easy/Normal/Hard, adjusted for combat pace.

Effects quality defaults to Auto and can be changed in Controls or via the arena FX button (Auto → Full → Low). Auto reduces detail after sustained slow frames and restores it only after a longer stable period; pauses and hidden tabs are excluded. Quick Match results include a same-fighter, same-stage, same-difficulty rematch with a fresh score/meter and short round opening.


Arena fighters render 15% larger, with matching melee/hurt/counter/push geometry. Portraits and selection previews retain their original framing. Body separation derives from pushbox widths and respects arena corners. Projectile dimensions remain tied to their own artwork.
