# Cleveland showcase release checks

The Featured Fight entry uses Volt and Ember on Cleveland's Cuyahoga Cypher.
It is a focused demo build, not a claim that the full game has passed release certification.

## Automated checks completed

- Featured-fight navigation with both fighters, easy/normal configuration and normal round progression.
- Original fighter, opponent, stage and difficulty choices restored on exit.
- Full roster remains available through Fight.
- Health display, round markers and attack cues do not change combat state.
- Optional audio mix respects mute.
- Combat, defense and offline cache regression checks.

Commands: node release-demo.test.cjs; node defense-training.test.cjs; node defense.test.cjs; node perfect-block.test.cjs; node offline.test.cjs.

## Required before calling this a production release

- Browser layout check: not completed; local test-server permission requests were interrupted.
- Physical Android Chrome testing: not completed. Test narrow portrait and landscape, notches, simultaneous touches, interrupted gestures, audio unlock, pause/resume, offline reload and saved settings.
- Performance: measure a full ten-minute session on lower-end and current Android phones. Aim for stable 60 FPS in Auto, with no sustained drops below 50 FPS; confirm Performance remains playable on the lowest supported device.
- Matchup balance: play both sides against every opponent; record damage, escape opportunities and repeatable pressure before changing stats.
- Art review: inspect every animation transition, special, hit reaction and throw on an actual display.
- Audio listening: compare music, effects and DJ levels using both phone speakers and headphones.
- Licensing/credits review and a clean-install/update test on the deployed site.

Do not mark these manual gates complete from mocked-DOM tests or native Canvas rendering alone.
