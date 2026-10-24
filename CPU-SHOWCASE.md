# CPU vs CPU expert showcase

Choose **WATCH / CPU VS CPU** on the main menu, or select **CPU vs CPU / Expert showcase** in fighter selection. Pick CPU 01, its opponent and the stage, then start. Both fighters are controlled by the expert spectator policy. The difficulty selector is locked to Hard.

The policy uses independent decision clocks, six-frame observation histories, hit confirms, grounded launcher cancels, jump chases, aerial chains, meteor finishes, anti-air specials, ranged pressure, throws against guards, throw-escape attempts, guard breakaway at low health, backdashes, projectile defense and earned Supers. It reads game state, not controller input. It has no health, damage, meter or cooldown bonuses and obeys normal juggle recovery. This is a purpose-built demonstration AI, not a claim of optimal or unbeatable play.

Rounds continue automatically three seconds after the slow-motion KO, finisher and victory animation gates complete. Completed matches rotate both fighters and the stage, then begin a fresh first-to-two match. The first matchup is the one selected by the viewer. Pause, settings and Home remain available. Fighter attack inputs are disabled while watching. Player records, Respect, daily challenges and mastery do not advance.

Checks:

- `node showcase.test.cjs`: mode setup, input isolation, normal Super costs, independent AI state, movement, pause, reward protection and returning to normal player control.
- `node air-combos.test.cjs`: existing combat and aerial regression suite.
- `node offline.test.cjs`: offline cache coverage.
- Browser simulation: 24,000 update frames, 10 automatically rotated bouts; observed throws, blocked hits, aerial hits and 20 earned Supers. Player save totals unchanged. This is automated desktop-browser validation, not a physical Android or Xbox performance test.
