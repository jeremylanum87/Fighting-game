# Skyline air combos

All eight fighters can launch, chase, chain aerial attacks and finish with a meteor slam. The former Down + Heavy low-kick input now starts the dedicated launcher. Block it standing; a blocked launcher cannot be jump-cancelled.

| Action | Xbox / default touch layout | Keyboard |
| --- | --- | --- |
| Launcher | Down + Y | S + K |
| Chase a successful launch (within 0.65 seconds) | A | W |
| Air light / air heavy | X / Y | J / K |
| Rising air strike | Left stick click / Special 2 touch button | I |
| Meteor slam | Right stick click / Special 3 touch button | O |

A connected aerial attack can cancel into the next aerial attack. Release and tap each button; holding does not repeat. Special 1 projectiles retain their existing ground rules. The attack guide in the game explains the route.

Try **Down + Heavy → Jump → Light → Heavy → Special 3 → Jump → Heavy**. A meteor allows one ground bounce per juggle. Further slams end on the floor. Juggle damage scales down, with the existing combo scaling applied too. At the juggle limit the defender automatically recovers, gains brief protection and falls out of the combo. Landing clears the juggle. Blocks, dead fighters and invulnerable recovery cannot be launched.

| Fighter | Air combo callout | Maximum juggle hits |
| --- | --- | --- |
| Volt | Sky Voltage | 6 |
| Ember | Solar Flare | 6 |
| Cipher | Orbit Breaker | 7 |
| Brick | Concrete Comet | 5 |
| Jade | Heaven Spiral | 8 |
| Rook | Sky Checkmate | 6 |
| Haze | Hyper Velocity | 8 |
| Goldie | Platinum Orbit | 7 |

The budget counts the initial launcher and connected airborne hits from any source. CPU fighters use the same aerial attacks and recovery limits. Effects include colored impact rings, radial streaks, speed trails, tilted attack silhouettes, meteor shockwaves and air-combo callouts. Low-effects / reduced-motion settings simplify them. Effects pause with gameplay and clear between rounds.

Validation: `node air-combos.test.cjs` covers launch/chase/cancels, ground bounce, recovery limits, block/KO/landing/reset/pause and all fighter air strikes. Also manually scripted actual browser collision checks for launcher → chase → air light.
