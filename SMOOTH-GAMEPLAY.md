# Smooth movement / precise combat

Chosen direction: gentle acceleration and stopping, stronger airborne steering, crisp pixel poses with connecting motion, and brief impact pauses. Primary target is Android browser touch controls.

`smooth-gameplay.js` ramps horizontal velocity using fixed simulation steps. Ground acceleration is 2600 world units/s², braking 3400, and a direction reversal uses 4200 until the new target speed is reached. Original forward/backward top speeds and character movement multipliers remain intact. Guard, attacks, hitstun, crouching, knockdowns and defensive locks immediately stop ordinary walking momentum. Backdash and attack-driven movement retain their existing rules. Non-CPU training dummies remain stationary.

Air steering uses each fighter's existing air-control value plus 0.2, bounded between 0.5 and 0.98, with bounded acceleration and reversal. Jump height, gravity, attack frame data, hitbox definitions, damage, input buffer and hitstop have not changed. Normal player fights and ordinary CPU movement use smoothing; expert CPU showcase keeps its existing movement policy.

Walking now uses articulated nearest-neighbor atlas segments to connect stride poses and settle into idle. There are no alpha-blended ghost frames. Jump lean changes continuously with vertical speed through the apex; landing compression now starts at contact and settles out. Reduced-motion settings limit the new motion. Clearing input, pausing/backgrounding and changing rounds clears retained momentum.

Validation:

- `node smooth-gameplay.test.cjs`: ramps, original top speeds, reversal, bounded stronger air steering, guard/hitstun stop, render purity, unchanged frame data/hitstop, pause and input cleanup.
- Air-combo, movement-animation and offline regression checks passed.
- Emulated Android browser, 844 × 390: real dispatched touch events on the D-pad produced first-frame velocity 43.33, full velocity 260, release braking to zero, and simultaneous move+jump air velocity 195 (previous Volt target: 143). This validates browser input behavior, not physical touchscreen latency or subjective feel.
- CPU showcase completed nine automatic bouts with the existing expert policy.
