# Grounding fighters in the stage

`stage-grounding.js` integrates the original fighter art with each stage rather than changing combat geometry:

- All ten stages have ambient, rim and ground-bounce colors. Derived atlas lighting preserves source pixels and alpha, including outfits and battle damage. Lighting is baked on cache misses, not recomputed for every drawn pixel each frame. The cache is capped at six atlases on coarse-pointer devices and twelve elsewhere. Replay fighters also receive stage lighting.
- Shadows combine a faint projected silhouette, a ground-anchored ambient shadow and tighter contact patches positioned from the fighter atlas's foot pixels. Jumping lightens and broadens the ground shadow; it does not leave a shadow floating beside the airborne fighter. The old redundant ellipse is suppressed only while the grounding renderer is active.
- Walking alternates contact dust or ripples beneath the feet. Landings create a wider surface response. Subway, laundromat and Cleveland surfaces have faint reflections; other surfaces stay matte. These are artistic material treatments, not claims about current real-world conditions.
- Perspective floor joints, pavement grain, near-camera shading and small curb details add a foreground plane. Foreground detail stays below the combat area. Reduced motion suppresses dust/ripple motion and foreground drift.
- After aerial round finishes, defeated fighters and celebrating winners visually settle to the floor. Their actual coordinates, health, score and collision state stay unchanged. Slow-motion finish and cinematic gates retain priority.

Temporary surface events are capped at 18, floor layers at two, and shadow masks at one small tile per fighter. Background cache cleanup also clears lighting/floor/shadow canvases. No gameplay randomness is consumed.

Validation: `node stage-grounding.test.cjs` checks render purity, stage/foot coverage, visual-only end-of-round settlement, cinematic priority, landings, bounded effects/caches, pause/background behavior and reset. Native browser canvas checks confirm stage-dependent tint, preservation of the original atlas, cache limits and scene rendering. Defeat, offline, emulated Android touch/replay checks pass; CPU showcase completed nine rotating bouts. Physical Android/Xbox frame rates are not measured here.
