# Fighter special effects and animation

`signature-special-polish.js` gives all eight fighters a distinct visual motif:

| Fighter | Motif |
| --- | --- |
| Volt | Jagged cyan lightning, yellow cores and rush afterimages |
| Ember | Layered flame ribbons and filled hot flame shapes |
| Cipher | Rotating hexagonal seals and energy squares |
| Brick | Ground fractures and rising concrete fragments |
| Jade | Green and turquoise wind crescents |
| Rook | Interlocking blue pressure rings and inward chevrons |
| Haze | Magenta/cyan velocity streaks and crisp afterimages |
| Goldie | Gold record rings, spokes and warm spiral accents |

Three special slots, signature projectiles and Supers get phase-specific atlas poses and visual articulation: readable startup compression, a character-specific active strike and recovery that settles into stance. Release cues happen once on activation; connected impacts use the attacker's motif, while guarded hits get a smaller guard arc. Signature projectile trails carry the same theme. Existing projectile hitboxes and trajectories remain intact.

The new geometry is drawn in world coordinates and does not consume gameplay randomness. It does not modify move damage, startup/active/recovery frames, cooldowns, collision boxes or character positions. Vector bursts are capped at 12. Full effects adds layers and limited rush afterimages; Low effects and reduced-motion settings simplify them. Pause, hidden-page state and gameplay hitstop freeze timers; effects can fade after the round even if its final hitstop value remains set. Reset/title navigation clears transient events.

Validation: `node signature-special-polish.test.cjs` checks eight unique motifs, 40 specials across three phases, render purity, frame data, single activation cues, event bounds, pause/hitstop/background behavior, post-round cleanup, Low effects and resets. Browser gallery renders all eight fighters; CPU showcase simulation completed nine automatically rotating bouts. Offline cache checks passed. Physical Android/Xbox frame rates have not been measured during this change.
