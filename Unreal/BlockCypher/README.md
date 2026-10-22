# Block Cypher — Unreal Engine 5 source prototype

An initial Android app rebuild with 3D blockout fighters on a 2D combat plane. Targets Unreal Engine 5.5. The browser game remains a separate project.

**Status:** the standalone C++ combat core compiles and passes tests. The Unreal runtime source has NOT been compiled or run here: Unreal Editor, UnrealBuildTool and the Android SDK are not installed. This package contains no APK/AAB and is not a finished visual upgrade.

## Implemented in source

- Title, Volt/Ember choice, Cleveland industrial arena, first-to-two rounds and rematch.
- Procedural placeholder humanoids with guard, strike and recoil poses; fixed side camera.
- A 60 Hz combat simulation with a capped frame accumulator.
- Edge-triggered light/heavy attacks, jumps, throws and 25-meter projectiles.
- Perfect Block: approximately 117 ms; no chip, +15 meter and shorter blockstun. Normal blocks grant +7.
- Block + back: backdash with four simulation frames of protection, vulnerable recovery and cooldown.
- Block + Heavy in blockstun: 50-meter Breakaway, knockback and nearby hostile projectile removal.
- Nine-frame pre-contact throw escape window with tap cooldown.
- HUD health, meter, combos, defensive cues and round scores.
- Multi-touch buttons, keyboard and Xbox D-pad/face/shoulder controls.
- Pause, application-background pause and a CPU using delayed observations.

## Open and run

1. Install UE 5.5 and its C++ development tools. On Windows, install Visual Studio 2022's Game Development with C++ workload and the SDK required by your UE installation.
2. Extract the source to a writable folder. Generate project files from BlockCypher.uproject, then compile BlockCypherEditor / Development Editor.
3. Generate the map once. From your UE installation, run this command with your absolute paths:

       UnrealEditor "/absolute/path/BlockCypher.uproject" /Engine/Maps/Entry -ExecutePythonScript="/absolute/path/Scripts/create_arena.py"

   Alternatively, open /Engine/Maps/Entry, enable Python Editor Script Plugin and Editor Scripting Utilities if needed, then execute Scripts/create_arena.py through the editor's Python tools.
4. Open /Game/Maps/ClevelandPrototype and press Play. C++ creates the camera, geometry, fighters and HUD.
5. Enter advances the title; 1 chooses Volt and 2 chooses Ember. Touch either half of the selection screen on a phone.

Content/Maps/ClevelandPrototype.umap is generated in Unreal, not supplied as a fake text asset. The setup script preserves an existing map. Generate it before cooking.

## Controls

| Action | Keyboard | Xbox | Touch |
|---|---|---|---|
| Move | A / D | D-pad left / right | LEFT / RIGHT |
| Duck | S | D-pad down | DUCK |
| Jump | W | A | A JUMP |
| Light / Heavy | J / K | X / Y | X LIGHT / Y HEAVY |
| Throw / escape | G | B | B THROW |
| Guard | L | LB | LB BLOCK |
| Projectile | U | RB | RB POWER |
| Backdash | Guard + tap away | LB + away | BLOCK + away |
| Breakaway | Guard + Heavy in blockstun | LB + Y | BLOCK + HEAVY |
| Pause | P | Start | top-right PAUSE |
| Rematch | R / Enter | — | center result panel |
| Title | Esc | — | not yet implemented |

Mouse clicks navigate menus; desktop combat uses keyboard/gamepad. Analog sticks, rebinding and a touch return-to-title action are follow-up work.

## Android packaging

1. Use UE Platforms → Android → SDK/Turnkey to install the SDK, NDK and Java versions supported by your exact UE version.
2. Generate the map and compile the project before cooking.
3. Start with Development / Android ARM64 and an appropriate texture target (ASTC on supported devices).
4. Launch on a USB-debugging-enabled Android device. Check multi-touch, input latency, resume, cutouts, frame pacing and thermals.
5. After device validation configure release signing and Shipping/AAB packaging. Keep signing keys outside source control.

Initial settings use mobile forward rendering without Lumen, virtual shadows or motion blur. Performance has not been measured. UE5 has no official HTML5 export; this project does not replace GitHub Pages.

## Tests

From this folder with a C++17 compiler:

    g++ -std=c++17 -Wall -Wextra -Werror -pedantic Tests/combat_core_test.cpp -o combat-core-tests
    ./combat-core-tests

Address and undefined-behavior sanitizers also passed. Leak detection was disabled because LeakSanitizer cannot operate under this container's tracing restrictions.

Tests exercise the actual engine-independent core used by the UE adapter. They do not establish that the UE adapter compiles, Android builds or the UI renders correctly.

## Remaining work

- Replace blockout shapes with licensed/original skeletal meshes, animation blueprints and proper attack/throw montages.
- Author Cleveland environment art, lighting, Niagara effects, audio and rival conversations.
- Port the full roster, combos/cancels, low/overhead attack rules, supers, progression and Defense Lab. These are NOT included yet.
- Upgrade touch UI to UMG/CommonUI with safe-area handling, navigation and accessibility.
- Add round countdowns, balance the CPU and provide touch navigation back to title.
- Compile with UnrealHeaderTool/UnrealBuildTool, generate the map, PIE-test, cook and validate on physical Android devices.

No browser art/audio assets are silently copied into this native prototype. Engine basic shapes are placeholders; Epic's engine/content terms apply. Review third-party licensing before importing production assets.
