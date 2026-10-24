# Block Radio announcer upgrade

The hip-hop DJ now has rotating short calls for launches, aerial combinations, meteor slams, throws, Perfect Blocks and low-health fightbacks, alongside round, Fight, Super and winner announcements. Situational commentary is disabled in Training.

A bounded three-call priority queue prevents overlap. Fight, Supers and results can interrupt less important commentary; stale commentary expires and each category has a repeat cooldown. Utterance tokens prevent cancelled or delayed callbacks from stopping a newer line. Music ducks while speech is active, with a timeout fallback. Mute, zero effects volume, pause, navigation and backgrounding stop pending announcements.

Controls adds **Announcer delivery** (Hip-hop DJ / Hype, Classic arcade, Minimal), **Callout frequency**, independent **Announcer volume**, and **DJ captions**. Voice choice remains available. Automatic choice favors local English voices and enhanced/natural voice names or Android quality ratings. Caption text appears when speech is unavailable; spoken delivery still depends on the installed voice engine. No voice actor recordings or third-party voice clones are bundled.

The Android app uses its native TextToSpeech engine through a narrow local-page bridge. Installed English voices appear in the voice selector; local voices can work offline if their data is installed. The TTS service is declared in manifest package visibility queries. The engine stops on pause and shuts down on Activity destruction. The WebView continues blocking external page navigation and resource requests.

Checks: `node dj-upgrade.test.cjs` exercises priority/preemption, stale callbacks, queue bounds, repeats, volume, key-moment filtering, caption fallback, a mocked native voice bridge, and hidden/mute cleanup. Offline and browser CPU showcase tests also pass. Android compilation is verified in CI; actual speaker quality and Android TTS voice availability require a physical device.
