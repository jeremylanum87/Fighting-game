# Neon Clash

A standalone rooftop arcade fighting game. Open `index.html` in a browser, or serve this directory with `python3 -m http.server 8000` and visit http://localhost:8000.

- A / D: move; W: jump
- J: punch; K: kick; L: hold to block
- P: pause / resume
- Touch controls are provided on small screens.

Fight the CPU in a first-to-two-rounds match. Each round lasts 60 seconds; the fighter with more health wins when time expires. Draws award no points. Sound is optional. No build step or dependencies are required; fonts fall back to local fonts offline.

## Mobile browsers
Open the hosted game URL in Safari or Chrome. Large touch controls support moving and attacking together. Rotate to landscape for a wider view. Switching apps pauses the match. The standalone Neon-Clash-Mobile.html bundles all game code in one file.
