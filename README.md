# Root Labs Giveaway Meter

A flashy vertical meter overlay for TikTok LIVE. Shows clicks-to-go and unlocks a giveaway when the bar fills.

Same tech stack as your previous widgets (Test Tube, Price Urgency, Live Orders): Node.js + Express + Socket.io, deployed to Railway from GitHub.

## What it looks like

**Overlay** (goes into TikTok LIVE Studio as a Link source):
- Single big number: clicks remaining
- Below it: "MORE CLICKS TO UNLOCK"
- Vertical neon meter with animated rainbow fill, rising bubbles, shimmer stripes
- Rotating multicolor border around the card
- When 85%+ full → urgent red pulse
- When 100% → confetti burst + rainbow "GIVEAWAY UNLOCKED" banner

**Producer panel** (control on a second device):
- Live state: clicks / target / remaining + progress bar
- Host script line that updates with the meter state
- Add clicks: +1 / +5 / +10 / +25 / +50 / +100
- Subtract: -1 / -5 / -10 / -25
- Targets: 100 / 250 / 500 / 1000 / 2000 + custom
- Edit overlay labels (prize name + CTA)
- Auto-fill demo (5 sec, for rehearsal)
- Force unlock (for scripted reveal moment)
- Reset

## File structure
```
rootlabs-giveaway-meter/
├── README.md
├── package.json
├── server.js
└── public/
    ├── overlay.html
    └── producer.html
```

## Local test
```
npm install
node server.js
```
Then open `http://localhost:3000/overlay.html` and `http://localhost:3000/producer.html` in two browser tabs.

## Deploy to Railway (same as before)

1. Push these files to a new GitHub repo. Keep the structure exactly as shown — `server.js` and `package.json` at root, `public/` folder beside them.
2. Railway → New Project → Deploy from GitHub repo → it auto-detects Node and runs `npm start`.
3. Railway gives you a URL like `https://yourwidget-production.up.railway.app`.
4. Append the filename to access each view:
   - `https://yourwidget-production.up.railway.app/overlay.html`
   - `https://yourwidget-production.up.railway.app/producer.html`
   - `https://yourwidget-production.up.railway.app/health`

## Add to TikTok LIVE Studio

1. Open LIVE Studio
2. Click "+" → add source → Link
3. Paste the `/overlay.html` URL
4. The card is sized for the **top-right corner** (360 × ~620px). Drag to position.

If running both this and the Price Urgency widget on the same stream, put this one bottom-right and Price Urgency top-right so the rim-glow animations don't both compete in the same corner.

## How to use on stream

**Pre-stream:**
1. Open producer on phone/laptop
2. Click your target (e.g. `500`)
3. Edit prize name and CTA if not the defaults
4. Confirm overlay tab on the streaming machine shows `500 MORE CLICKS TO UNLOCK`

**During stream:**
- Producer watches link-click analytics (or TikTok Shop dashboard for orders) and presses the +clicks buttons as engagement comes in
- Host reads the "HOST READS THIS" line, which auto-updates by fill level
- At 85% the overlay goes red-urgent — this is the cue for the host to land the close
- At 100% the confetti fires, banner appears, host calls out the unlock

**Mid-stream adjustments:**
- Over-counted? Use the `-` buttons
- Want a scripted reveal beat? `FORCE UNLOCK NOW` jumps to 100% with full celebration
- Want to run the bit a second time? `RESET METER TO ZERO` and start over
