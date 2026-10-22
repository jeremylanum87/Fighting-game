# Retro Rumble 2026 — Unreal Engine 5 foundation

**Status: source-code foundation only. Not yet a playable Unreal build or APK.** The original JavaScript game at the repository root is unchanged.

## What is implemented
- Native Unreal C++ game module and project targets (UE 5.4 baseline).
- ARRFighter: King (boxing all-rounder) and Voltage (fast electric rushdown), 1000 HP, super meter, 6 attacks, specials, supers, guarded chip damage, launchers, KO, combo counter, 2.5D Y-axis movement.
- ARRPlayerController: keyboard mapping and BlueprintCallable mobile inputs for movement, jump, block and 8 attack types.
- Blueprint events for attack animations, hit VFX, and knockout.
- Input action mappings for desktop prototyping.

## Character moves (prototype tuning)
| Fighter | Special | Super | Identity |
|---|---|---|---|
| King | Iron Fist Rush | Cleveland Knockout | higher damage, close-range boxing |
| Voltage | Thunder Dash | Motor City Blackout | quicker attacks, longer reach, electrical FX hooks |

## Unreal Editor setup (requires PC/cloud workstation)
1. Open `RetroRumble2026.uproject` in Unreal Engine 5.4, allow module compilation.
2. Create a Blueprint subclass of `ARRFighter` for King and Voltage. Set FighterId, skeletal mesh, animations, collision, and VFX.
3. Create a Blueprint subclass of `ARRPlayerController`, set it as controller in a custom GameMode, and assign a mobile HUD widget.
4. In a level, spawn both fighters on the Y axis (e.g. Y=-250 and Y=250), assign Opponent references, and possess King with the player controller. Configure the camera to look along X so fighters move horizontally on screen.
5. Build a UMG HUD with health and meter bars bound to HealthPercent/MeterPercent, combo count and KO overlay.
6. Add touch controls: left/right movement via repeating button press or virtual joystick (call MobileMove every frame while held), jump, hold block, six punch/kick buttons, special and super. Call MobileBlock(false) on release.
7. Use OnAttackStarted, OnHitReceived, OnKnockout Blueprint events to play animations, hit sparks, electricity effects, sound, and KO screen.
8. Add opponent AI, round restart orchestration, full animation-driven hit detection, and automated tests before calling it playable.

## Important limitations
- No 3D fighter models, animations, stages, UI widget assets, AI opponent, or actual APK included.
- Attack range/damage values are initial placeholders; hit checking is distance-based and needs proper collision/hitbox refinement.
- No Unreal Editor/compiler is available in this chat; code has **not** been compiled or playtested.
- EnhancedInput plugin is enabled for future upgrades; this prototype's keyboard binds use legacy input mappings.
- Mobile Unreal builds require a supported Android SDK/NDK toolchain and Unreal-capable build machine.
- The existing HTML/JavaScript prototype remains your immediately playable phone option.
