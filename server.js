const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.static(path.join(__dirname, "public")));

// ---------- STATE ----------
let state = {
  clicks: 0,
  target: 500,
  fillPct: 0,
  remaining: 500,
  unlocked: false,
  prizeLabel: "GIVEAWAY"
};

function recalc() {
  if (state.clicks < 0) state.clicks = 0;
  if (state.clicks > state.target) state.clicks = state.target;
  state.fillPct = Math.min(100, Math.round((state.clicks / state.target) * 100));
  state.remaining = Math.max(0, state.target - state.clicks);
  state.unlocked = state.remaining === 0;
}

function pushState() {
  recalc();
  io.emit("state", state);
}

// ---------- HEALTH ----------
app.get("/health", (req, res) => {
  res.json({ ok: true, state });
});

// ---------- SOCKET ----------
io.on("connection", (socket) => {
  socket.emit("state", state);

  socket.on("add_clicks", (n) => {
    const v = parseInt(n);
    if (!isNaN(v)) {
      state.clicks += v;
      pushState();
    }
  });

  socket.on("sub_clicks", (n) => {
    const v = parseInt(n);
    if (!isNaN(v)) {
      state.clicks -= v;
      pushState();
    }
  });

  socket.on("set_target", (t) => {
    const v = parseInt(t);
    if (!isNaN(v) && v >= 1) {
      state.target = v;
      pushState();
    }
  });

  socket.on("reset", () => {
    state.clicks = 0;
    pushState();
  });

  socket.on("force_unlock", () => {
    state.clicks = state.target;
    pushState();
  });

  socket.on("set_labels", (data) => {
    if (data && typeof data === "object") {
      if (typeof data.prizeLabel === "string") state.prizeLabel = data.prizeLabel.slice(0, 40);
      pushState();
    }
  });

  socket.on("auto_demo", () => {
    // fill smoothly over 5 sec for rehearsal
    state.clicks = 0;
    pushState();
    const steps = 25;
    const stepSize = Math.ceil(state.target / steps);
    let i = 0;
    const t = setInterval(() => {
      i++;
      state.clicks += stepSize;
      pushState();
      if (i >= steps || state.clicks >= state.target) clearInterval(t);
    }, 200);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("\n  Root Labs Giveaway Meter");
  console.log("  Overlay:   http://localhost:" + PORT + "/overlay.html");
  console.log("  Producer:  http://localhost:" + PORT + "/producer.html");
  console.log("");
});
