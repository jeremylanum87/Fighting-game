# Android preview of the playable browser game

This project bundles the current web game into an offline Android WebView app.
It is separate from the Unreal rebuild. Requires Android 8+ and a current Android System WebView.

GitHub Actions builds an APK and publishes a prerelease when these Android files change on main.
Download Block-Cypher-Android-preview.apk from the repository's Releases page.
On Android, open the APK and allow your browser/file manager to install it when prompted.

This is a debug-signed preview. It has not been tested on a physical phone.
Later previews may require uninstalling the previous build, which removes local saves.
Do not use this signing setup for a production release.

## Local build

Install JDK 17, Android SDK/platform 35 and Gradle 8.9, then run from this directory:

    gradle :app:assembleDebug

Output: app/build/outputs/apk/debug/app-debug.apk

All game assets are copied during preBuild; no remote game URL is required.
External requests are blocked and no Internet permission is requested.
The PWA installer is replaced in the app bundle because files are already installed.
Device storage saves belong to the app and are separate from Chrome saves.

Before release: test multi-touch, landscape/notches, audio unlock, suspension, offline cold start,
local saves and long sessions. Add a production signing key, app icons and a stable update path.
