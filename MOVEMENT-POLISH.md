# Jump and guard animation polish

`movement-polish.js` adds visual articulation using the existing character atlases. Jumping has a short takeoff stretch, independent leg angles, a stronger apex tuck, falling torso lean and a 0.2-second landing compression. A ground-anchored shadow changes size with elevation during these jump poses.

Standing and crouching blocks have an articulated lead arm, braced torso, subtle breathing and a short recoil on blocked impact. A compact guard arc and impact lines clarify contact; Perfect Block uses a warm highlight. Fighter-specific motion amplitudes preserve light and heavyweight differences. Reduced motion limits movement and suppresses impact streaks. Existing outfits and battle damage remain visible.

Attack, throw, hurt, knockout, victory and cinematic rendering retain priority. These changes do not modify jump velocity, gravity, guard timing, hitboxes, damage or meter rewards. Animation clocks advance through fighter simulation, so pause, hitstop and cinematic freezes retain their poses. Round resets clear visual state.

Validation: `node movement-polish.test.cjs` checks rise/apex/fall/landing, high/low guards, recoil, render purity, pause, attack/defeat priority and reset. Browser previews cover 20 poses across Volt, Ember, Jade and Brick. The browser CPU showcase completed 10 automatic bouts after integration. `node offline.test.cjs` validates offline coverage.
