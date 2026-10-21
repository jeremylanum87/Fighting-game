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
The game opens on Start / How to Play / Beat controls. Choose from Volt, Ember, Cipher, Brick, Jade, Rook, Haze and Goldie, then choose a CPU opponent. The fighters use original detailed arcade artwork with distinct movement and damage profiles. HOME returns to the opening screen; confirming a selection starts a fresh match.

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

- **Quick Match:** choose opponent, one of ten stages, and Easy/Normal/Hard CPU difficulty. Rival introductions precede the first round; victory dialogue follows a match.
- **Training:** no timer; dummy health refills between attempts and after KOs. Dummy options: stand, guard, low guard, jump, or CPU. Watch individual move and character-combo demonstrations, reset practice, and toggle hitboxes. Manual input stops a demo.
- **Arcade:** seven roster rivals followed by The Promoter, a black-and-gold boss with dedicated artwork, portrait and readable signature attacks. Each match is first-to-two rounds. Losing offers a retry at the same opponent. Clearing the ladder unlocks the chosen character's original ending in the title-screen gallery. Endings and the current arcade checkpoint save locally. Continue Arcade resumes the saved rival and round score with fresh round health/time.
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


### Director update: animation, readability and final boss
Nine new motion sheets add 72 original illustrated poses. Normal attacks now show dedicated windup, extension and recovery, and walking uses alternate strides. Heavy/special windups display LOW, OVERHEAD, HEAVY, COUNTER, EVADE or SUPER cues. The Promoter has Velvet Rope (projectile), Hostile Takeover (overhead), Floor Tax (low), Venue Crusher and Final Contract (super), with long visible recovery openings. His AI follows delayed observations and rotates attacks rather than simply using Brick’s tactics.

PHONE CHECK on the title screen shows recent in-game FPS, viewport fit and a safe independent multi-touch test. See ANDROID-PLAYTEST.md for the physical-device checklist. Automated input/render/combat checks were run in the workspace; a physical Android playtest remains required.


### Neighborhood event update
Ten original synthesized hip-hop stage profiles add bass, minor chords, melody and drums per stage. Enable AUDIO on the title screen; Music and Effects / voice volumes save separately in Controls. Optional announcer calls use the browser’s speech voice, preferring a locally installed English voice. Voice availability offline depends on the device; the game’s text cues remain visible. No sampled or commercial music is included.

Stage life includes passing corner-store traffic, subway trains, rooftop DJ movement, court boombox activity and warehouse light beams. Spectators raise their arms for heavy hits, combos, supers and round results. Low effects reduces ambient motion and detail.

DAILY CHALLENGES rotates three goals at 00:00 UTC across six challenge types. Quick Match and Arcade count; Training is excluded. Badges, progress and full-clear streak save locally. There is no online leaderboard or account sync.

The app manifest and service worker support Android home-screen installation and offline play after the first successful online cache. INSTALL / OFFLINE opens the browser installation prompt when available, or shows Chrome menu instructions. All local game code and PNG artwork are precached; external web fonts fall back to system fonts offline. Existing app caches update on normal service-worker activation, usually after old tabs close. Run `node offline.test.cjs` for cache/install checks.


### Learn to play, outfit colors and arcade continuation
LEARN TO PLAY on the title screen starts nine interactive lessons: movement, jump, standing guard, low guard, overhead guard, light → heavy → special, a super, punishing recovery, and a practice fight. The lesson advances only after the player completes the action; each can be retried or exited. Tutorial combat uses Training and does not award match records or daily progress. Completion unlocks Midnight outfit colors for the roster.

Fighter selection includes Street (original), Midnight (tutorial completion), Neon (a match win with that fighter), and Champion (that fighter’s Arcade clear). Recolors target clothing pixels and preserve the original source images. Outfit choices save locally and do not change stats.

CONTINUE ARCADE restores the chosen fighter, difficulty, rival order/index, round and round score. Closing mid-round restarts that round at full health and a fresh timer; individual positions/HP are not saved. Winning a match checkpoints the next rival; a loss checkpoints a retry. Clearing the boss removes the active checkpoint. Starting a new arcade ladder replaces the previous checkpoint. Saves live only on this device and are removed by clearing browser data.


### Five new city stages
- Cleveland, Ohio / Cuyahoga Cypher: original riverfront promenade with a Terminal Tower-inspired crown, downtown skyline, steel truss bridge, river reflections and passing barge. This is a themed illustration rather than a geographic reconstruction.
- Concrete Echo: a graffiti-covered underpass with concrete pillars and traffic above.
- Spin Cycle: a neon laundry storefront with moving machine drums and pavement reflections.
- Level Seven: a rooftop parking deck with skyline, parked car and lighting.
- Summer on the Block: a daylight street festival with bunting, vendors, DJ and speakers.

All five are selectable in Fighter Select → Match Setup → Stage, with a preview and their own music profile. Cleveland is the initial Quick Match stage, and Arcade visits the five new locations before Subway, Rooftop and the Warehouse boss. The original stages remain available. Stage geometry shares the same ground/collision rules, and the backgrounds are cached procedural Canvas artwork available offline.


### Combat audio quality pass
Nineteen original mono 44.1 kHz OGG impact variants cover light/heavy hits, kicks, guards, throws, landings, swing whooshes and KOs (about 130 KB compressed). These are layered original synthesis with filtered transients, body thumps and short room reflections, not recorded foley or third-party samples. Decode/preload starts when AUDIO is enabled; synthesized fallback remains available if a file cannot decode. Variants rotate with small playback-rate differences and restrained stereo positioning.

Music and effects share one Web Audio context and an output chain with low-cut EQ, dynamic compression and soft peak shaping. Old combat beeps are suppressed while hit/swing/landing sounds play. The sample-voice budget is capped at twelve. Music ducks under browser announcements and briefly under heavy impacts; voice end/error handlers and a timeout restore it. Muting, pausing or hiding the page stops active sample voices. All OGG files are included in the offline cache. Browser announcer speech remains the device’s own voice service and is controlled by the existing toggle.


### Hip-hop DJ announcer
The announcer uses concise original DJ-style round, fight, super and victory calls, faster delivery, a lower voice pitch and a short original vinyl-style cue when speech starts. Controls includes an English device-voice selector and TEST DJ VOICE; the choice saves locally. Automatic selection prefers local US English, then other available English voices, and updates when the browser’s voice list loads. Music ducking, mute/volume gates and the announcer toggle remain active. The spoken voice is the phone/browser speech engine rather than a prerecorded human DJ, so its character and offline availability vary by device.


### Survival, Rival Sets, mastery and highlights
SURVIVAL is an endless sequence of single-round opponents. Health and super meter carry forward, with 18% maximum-health recovery after each win. Rival health and power gradually increase within caps. Best wave and score save locally; an active run does not resume after leaving or reloading.

RIVAL SET is a best-of-three series of normal first-to-two-round matches. Between matches the rival adapts to repeated lows, projectiles, throws or jumps. Adaptation uses the existing delayed CPU observations, with no extra reaction-speed or damage boost.

CHARACTER MASTERY tracks each fighter separately through Rookie, Contender, Regular, Headliner and Block Legend. Competitive wins, named combo routes and recovery punishes earn XP; Training does not. Headliner unlocks the cyan Master outfit for that fighter. Rewards are cosmetic and saved on this device.

Post-match highlights show the best combo, biggest recovery punish, finishing move and mastery earned. These are actual match statistics, not video recordings. Continue advances the selected mode or starts a Quick Match rematch; close returns to the result options. Survival does not advance daily challenges. Clearing browser data removes local records and unlocks.


### Colorful special-move spectacle
All three specials and supers now launch bounded multicolor comic rays and signature lightning, flame ribbons, cosmic rings, angular shockwaves, wind halos, speed ribbons or gold rings. Successful unblocked special hits add larger bursts; projectile impacts retain their owner palette. Cosmetic effects never change damage or hitboxes, freeze during pause/super cut-ins and simplify to four launch particles in Low FX.


### Fighter personality update
Eight original twelve-frame rig routines add signature stage entrances, taunts and victory celebrations: Volt glove-check/salute, Ember shoulder-roll, Cipher thoughtful finish, Brick power pose, Jade ginga dance, Rook knuckle-check/bow, Haze shadowboxing and Goldie cap-tip/crowd conducting. Versus cards use arrival animations and rival replies; stage introductions name each routine. Normal strikes have additional phase-based anticipation and follow-through without changes to timing, damage or hitboxes. Heavy hits, combos and supers trigger crowd phone lights and brief stage-edge lighting. Low FX removes extra light beams and reduced-motion settings disable card movement.


### Combat feel and mobile polish
Input buffering keeps the latest action for twelve combat frames (about 185 ms at current pace). A successful attack consumes pending inputs, preventing older taps firing later. Light and heavy hits have distinct cosmetic recoil; existing knockdown falls remain separate. At a corner, blocked melee pressure pushes the attacker back 24 pixels. Both fighters receive ten simulation frames of invulnerability after a complete knockdown ends, allowing movement or a buffered escape. Normal standing hitstun/combo rules remain intact.

Arcade CPU guard, combo decisions, movement and delayed observations interpolate across the eight-rival ladder according to selected difficulty. Quick Match and Rival Set difficulty choices retain their existing settings. Backgrounding cancels held inputs; touch pads suppress selection/browser gestures, and narrow-screen footer buttons wrap with larger targets. Automated simulation, Canvas-render and offline-cache checks cover these changes; physical Android frame rate and touch latency still require device testing.


### Dedicated character throws
Tap THROW on the touch pad or press G. All eight fighters have a dedicated ground throw, separate from existing command-grab specials. Volt: Live Wire Toss (15 base damage); Ember: Backdraft Clinch (17); Cipher: Checkmate Flip (15); Brick: Concrete Drop (22); Jade: Ginga Sweep (15); Rook: Crosswalk Suplex (20); Haze: Quick Switch (13); Goldie: Platinum Spin (16). Fighter power modifies actual damage.

Each has original reach/lift/release rig poses and a distinct launch trajectory. Throws beat standing/crouching guard at close range, miss jumping opponents, cannot cancel a normal attack, and cannot grab hitstun, blockstun, knockdowns or invulnerability. Startup is 6–11 frames, with three active frames, punishable whiff recovery and a 1.1-second cooldown. G uses the same latest-action buffer as other attacks. Training includes a throw demonstration. CPU rivals can occasionally throw a nearby blocking opponent based on delayed observations.


### Paired throws, victory routines and startup audio
Successful dedicated throws now show both fighters together through a half-second grab/lift/release sequence. Sweep, toss, suplex and spin trajectories differ by character, with a landing burst. These are visual sequences over the existing damage/collision simulation; no additional damage is applied. They freeze on pause and clear on reset or interruption. Each fighter has a 24-frame victory routine that blends into a signature pose and continues with subtle movement, plus a named victory caption.

Audio now defaults to enabled and unlocks automatically on the first tap or keypress, including START. Android/browser autoplay rules prevent audible playback before a gesture. The AUDIO button still mutes, and that preference saves locally alongside existing volume settings. No microphone permission is required.


### Eight signature projectiles
Tap PROJECTILE or press F; Training includes Signature projectile demonstrations. These are additional moves and preserve all existing specials. Volt fires Neon Bolt (fast lightning); Ember casts Backdraft Flame (slower, heavier flame); Cipher sends Cipher Pulse (energy ring); Brick launches Concrete Quake (short ground eruption); Jade throws Ginga Wind Disc (fast wind ring); Rook sends Crosswalk Shockwave (longer low wave); Haze fires Afterimage Dart (fastest, lightest hit); Goldie throws Platinum Disc (spinning record). Each has its own speed, range, damage, cooldown, launch pose and swept collision dimensions.

Ground use only, one projectile per owner across all projectile moves, and no repeated firing from holding F. Brick/Rook waves require low guard or a jump; the others use normal guard. Existing special projectiles and supers retain their behavior. CPU fighters occasionally use signature shots at range based on delayed observations. Low FX removes extra signature trails.
