/* ==========================================================
   For Jaanu ❤️  ·  script.js
   Everything you might want to change lives in CONFIG.
   ========================================================== */

const CONFIG = {
  // — Artwork —
  // The two cats are drawn in code (animated SVG), so no image files are needed.
  // To use your own picture/GIF instead, put its path here, e.g. "kissing-cat.webp".
  kissImage: "",     // shown after she clicks Yes
  stickerImage: "",  // shown when the gift is opened

  // — Music —
  // Leave empty to use the built-in soft music-box melody,
  // or point to your own file, e.g. "assets/romantic.mp3".
  musicSrc: "",
  musicVolume: 0.5,

  // — Timing —
  gifDurationMs: 6000,   // how long the kissing cat plays before the gift appears
  loaderMinMs: 1900,     // minimum time the loading screen stays visible

  // — Playful text —
  noLabels: ["🙈 No", "🙊 Nope!", "😜 Missed!", "💨 Too slow", "🙃 Hehe", "🤭 Can't!", "🏃 Catch me", "😝 Never!"],
  yesLabels: [
    { from: 0, text: "💖 Yes" },
    { from: 3, text: "💖 Yes!" },
    { from: 6, text: "💖 Yes! Yes!" },
    { from: 10, text: "💖 YES!!!" },
  ],
  taunts: [
    "Nice try 😜",
    "Oops, it slipped away! 🙈",
    "Are you sure? 🥺",
    "Just press Yes 💖",
    "That button is shy 😳",
    "Too slow! 💨",
    "Catch me if you can 🏃",
    "Think of the cat! 🐱",
    "Wrong button, love 😘",
  ],

  // — The letter —
  letter: {
    greeting: "My Dearest Jaanu, ❤️",
    paragraphs: [
      "You will never have to compete with anyone else.",
      "I don't care how beautiful or perfect another girl may be—you will always be the most beautiful in my eyes.",
      "You are my choice, my priority, my peace, and my forever.",
      "No one could ever replace you because you hold a place in my heart that belongs only to you.",
      "I promise to cherish you, respect you, and stand beside you through every smile and every challenge.",
      "Thank you for being you.",
    ],
    signoff: "Forever Yours, ❤️",
  },
};

(() => {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================
     Hand-drawn animated cats (inline SVG – no image files needed)
     kind = "kiss"   → cat blowing kisses
     kind = "flower" → cat holding a bouquet of tulips
     ========================================================== */
  function catSVG(kind) {
    const kiss = kind === "kiss";
    const label = kiss ? "A cat blowing kisses" : "A cat holding a bouquet of pink tulips";

    const eye = (x) => `
      <g transform="translate(${x} 138)"><g class="eye">
        <ellipse rx="15" ry="19" fill="#2b2230"/>
        <circle cx="-4" cy="-6" r="5.5" fill="#fff"/>
        <circle cx="5" cy="7" r="2.6" fill="#fff" opacity=".85"/>
      </g></g>`;

    const mouth = kiss
      ? `<path d="M150 171 L150 177" stroke="#b0306a" stroke-width="2.5" stroke-linecap="round"/>
         <g transform="translate(150 184)"><g class="pucker">
           <ellipse rx="8" ry="7" fill="#e0457b"/>
           <ellipse cx="-2" cy="-2" rx="3" ry="2" fill="#ff8fb1" opacity=".75"/>
         </g></g>`
      : `<ellipse class="tongue" cx="150" cy="184" rx="7" ry="9" fill="#ff7aa8"/>
         <path d="M150 171 L150 177" stroke="#b0306a" stroke-width="2.5" stroke-linecap="round"/>
         <path d="M134 177 Q142 190 150 178 Q158 190 166 177" fill="none" stroke="#b0306a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

    const bow = kiss ? "" : `
      <g transform="translate(212 60) rotate(18)">
        <path d="M0 0 L-26 -14 L-26 14 Z" fill="#ffb3cd"/>
        <path d="M0 0 L26 -14 L26 14 Z" fill="#ffb3cd"/>
        <circle r="6" fill="#ff6fa0"/>
      </g>`;

    const head = `
      <g class="cat-head">
        <g class="ear ear-l">
          <path d="M66 112 L74 34 Q76 28 82 31 L132 68 Z" fill="#b9b4c4"/>
          <path d="M82 98 L85 54 L116 75 Z" fill="#ffc2d4"/>
        </g>
        <g class="ear ear-r">
          <path d="M234 112 L226 34 Q224 28 218 31 L168 68 Z" fill="#b9b4c4"/>
          <path d="M218 98 L215 54 L184 75 Z" fill="#ffc2d4"/>
        </g>
        <ellipse cx="150" cy="140" rx="90" ry="76" fill="#b9b4c4"/>
        <ellipse cx="106" cy="134" rx="28" ry="32" fill="#9f98b0" opacity=".45"/>
        <ellipse cx="194" cy="134" rx="28" ry="32" fill="#9f98b0" opacity=".45"/>
        <path d="M150 66 C140 92 134 118 122 150 L178 150 C166 118 160 92 150 66 Z" fill="#fff"/>
        <ellipse cx="150" cy="172" rx="46" ry="36" fill="#fff"/>
        ${eye(108)}${eye(192)}
        <ellipse cx="86" cy="170" rx="14" ry="9" fill="#ff8fb1" opacity=".55"/>
        <ellipse cx="214" cy="170" rx="14" ry="9" fill="#ff8fb1" opacity=".55"/>
        <path d="M143 160 Q150 156 157 160 Q154 169 150 171 Q146 169 143 160 Z" fill="#ff8fb1"/>
        ${mouth}
        <g stroke="#8c7f9e" stroke-width="2" stroke-linecap="round" opacity=".7" fill="none">
          <path d="M68 168 L30 160"/><path d="M68 177 L28 180"/><path d="M71 186 L34 198"/>
          <path d="M232 168 L270 160"/><path d="M232 177 L272 180"/><path d="M229 186 L266 198"/>
        </g>
        ${bow}
      </g>`;

    const heart = "M0 7 C-16 -3 -11 -17 0 -9 C11 -17 16 -3 0 7 Z";
    const kissExtras = `
      <g transform="translate(80 228)">
        <ellipse rx="15" ry="18" fill="#fff"/><ellipse cy="5" rx="7" ry="6" fill="#ff8fb1"/>
      </g>
      <g transform="translate(232 214)"><g class="kiss-paw">
        <ellipse rx="16" ry="20" fill="#fff"/><ellipse cy="6" rx="7.5" ry="6" fill="#ff8fb1"/>
        <circle cx="-7" cy="-5" r="3" fill="#ff8fb1"/><circle cx="0" cy="-8" r="3" fill="#ff8fb1"/><circle cx="7" cy="-5" r="3" fill="#ff8fb1"/>
      </g></g>
      <g transform="translate(168 178)">
        <path class="kiss-heart" d="${heart}" fill="#ff5f95"/>
        <path class="kiss-heart k2" d="${heart}" fill="#ff8fb1"/>
        <path class="kiss-heart k3" d="${heart}" fill="#ff6fa0"/>
      </g>`;

    const tulip = (x, y, r) => `
      <g transform="translate(${x} ${y}) rotate(${r})">
        <path d="M-14 -4 C-14 -22 -7 -27 -7 -27 L0 -18 L7 -27 C7 -27 14 -22 14 -4 C14 9 -14 9 -14 -4 Z" fill="#ff9fc0"/>
        <path d="M-6 -2 C-6 -14 0 -18 0 -18 C0 -18 6 -14 6 -2 C6 6 -6 6 -6 -2 Z" fill="#ffc2d4"/>
      </g>`;
    const star = (x, y, d) => `
      <g transform="translate(${x} ${y})"><path class="twinkle" style="animation-delay:${d}s"
        d="M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z" fill="#ff8fb1"/></g>`;

    const flowerExtras = `
      <g transform="translate(20 70) scale(.8)"><g class="bouquet"><g transform="rotate(-8 82 262)">
        <path d="M82 250 L58 170 M82 250 L82 150 M82 250 L106 170" stroke="#5dbb7a" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M74 214 Q46 206 38 180 Q66 182 74 214 Z" fill="#7fd39a"/>
        <path d="M90 214 Q118 206 126 180 Q98 182 90 214 Z" fill="#7fd39a"/>
        ${tulip(58, 166, -8)}${tulip(82, 146, 0)}${tulip(106, 166, 8)}
        <path d="M50 206 L114 206 L94 266 L70 266 Z" fill="#ffd3e2" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
        <path d="M52 208 L82 228 L112 208" fill="none" stroke="#ffb3cd" stroke-width="3" stroke-linejoin="round"/>
        <g transform="translate(82 242)">
          <path d="M0 0 L-16 -9 L-16 9 Z M0 0 L16 -9 L16 9 Z" fill="#ff6fa0"/><circle r="4" fill="#e0457b"/>
        </g>
        <ellipse cx="66" cy="238" rx="12" ry="14" fill="#fff"/>
        <ellipse cx="98" cy="240" rx="12" ry="14" fill="#fff"/>
      </g></g></g>
      ${star(36, 86, 0)}${star(268, 100, 0.8)}${star(252, 36, 1.5)}${star(28, 140, 2)}`;

    return `<svg class="cat cat-${kind}" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
      <ellipse cx="150" cy="288" rx="84" ry="8" fill="rgba(160,60,100,.16)"/>
      <path class="cat-tail" d="M205 262 C256 262 272 214 248 188" fill="none" stroke="#b9b4c4" stroke-width="20" stroke-linecap="round"/>
      <ellipse cx="150" cy="238" rx="64" ry="52" fill="#b9b4c4"/>
      <ellipse cx="150" cy="254" rx="38" ry="36" fill="#fff"/>
      <ellipse cx="118" cy="284" rx="22" ry="10" fill="#fff"/>
      <ellipse cx="182" cy="284" rx="22" ry="10" fill="#fff"/>
      ${head}
      ${kiss ? kissExtras : flowerExtras}
    </svg>`;
  }

  // Puts the artwork into a container. If you set an image path in CONFIG, that image is used instead.
  function fillArt(el, src, kind) {
    if (src) {
      el.textContent = "";
      const img = new Image();
      img.alt = "";
      img.src = src;
      el.appendChild(img);
    } else {
      el.innerHTML = catSVG(kind);
    }
  }

  const heartsLayer = $("#hearts-layer");
  const sparkleLayer = $("#sparkle-layer");
  const fxLayer = $("#fx-layer");
  const loader = $("#loader");
  const musicBtn = $("#music-btn");

  const askCard = $("#ask-card");
  const choices = $("#choices");
  const yesBtn = $("#yes-btn");
  const noBtn = $("#no-btn");
  const noSlot = $("#no-slot");
  const taunt = $("#taunt");

  const kissGif = $("#kiss-art");
  const openBtn = $("#open-gift");
  const sticker = $("#sticker");
  const stickerImg = $("#sticker-art");
  const stage = $("#envelope-stage");
  const envelope = $("#envelope");
  const letter = $("#letter");
  const letterBody = $("#letter-body");
  const letterSticker = $("#letter-sticker");

  /* ==========================================================
     Screens
     ========================================================== */
  function goTo(id) {
    document.querySelectorAll(".screen.is-active").forEach((s) => s.classList.remove("is-active"));
    const next = $("#" + id);
    next.scrollTop = 0;
    next.classList.add("is-active");
  }

  /* ==========================================================
     Loader
     ========================================================== */
  const loaderStart = performance.now();
  let loaderHidden = false;

  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    const delay = Math.max(0, CONFIG.loaderMinMs - (performance.now() - loaderStart));
    setTimeout(() => {
      loader.classList.add("done");
      document.body.classList.add("ready");
      setTimeout(() => loader.remove(), 1000);
    }, delay);
  }

  const preload = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = img.onerror = resolve;
      img.src = src;
    });

  Promise.resolve(document.fonts && document.fonts.ready).then(hideLoader);
  setTimeout(hideLoader, 6000); // safety net

  fillArt(kissGif, CONFIG.kissImage, "kiss");
  fillArt(stickerImg, CONFIG.stickerImage, "flower");
  fillArt(letterSticker, CONFIG.stickerImage, "flower");

  /* ==========================================================
     Floating hearts + sparkles
     ========================================================== */
  const HEARTS = ["❤", "♥", "💗", "💖", "💕"];

  function spawnHeart(preAged = false) {
    if (heartsLayer.childElementCount > 26) return;
    const h = document.createElement("span");
    const dur = rand(9, 18);
    h.className = "heart";
    h.textContent = pick(HEARTS);
    h.style.left = rand(0, 100) + "vw";
    h.style.fontSize = rand(12, 34) + "px";
    h.style.setProperty("--dur", dur + "s");
    h.style.setProperty("--sway", rand(-60, 60) + "px");
    h.style.setProperty("--op", rand(0.3, 0.7).toFixed(2));
    if (preAged) h.style.animationDelay = -rand(0, dur * 0.9) + "s";
    h.addEventListener("animationend", () => h.remove());
    heartsLayer.appendChild(h);
  }

  function initBackground() {
    for (let i = 0; i < 10; i++) spawnHeart(true);
    setInterval(spawnHeart, 700);

    for (let i = 0; i < 24; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = "✦";
      s.style.left = rand(2, 96) + "%";
      s.style.top = rand(2, 96) + "%";
      s.style.fontSize = rand(8, 18) + "px";
      s.style.setProperty("--dur", rand(3, 6) + "s");
      s.style.setProperty("--delay", -rand(0, 6) + "s");
      sparkleLayer.appendChild(s);
    }
  }
  initBackground();

  /* ==========================================================
     Particle bursts + falling confetti hearts
     ========================================================== */
  function burst(x, y, count = 20, small = false) {
    if (reduceMotion) count = Math.ceil(count / 3);
    const set = small
      ? ["✨", "💖", "💗"]
      : ["💖", "💗", "💕", "💘", "✨", "🌸", "💞", "⭐", "🎀"];

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "fx";
      el.textContent = pick(set);
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.fontSize = (small ? rand(12, 20) : rand(16, 30)) + "px";
      fxLayer.appendChild(el);

      const angle = rand(0, Math.PI * 2);
      const dist = small ? rand(30, 70) : rand(70, 200);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - (small ? 10 : 40);

      const anim = el.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.2)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${rand(-90, 90)}deg)`,
            opacity: 1,
            offset: 0.6,
          },
          {
            transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy + 60}px)) scale(0.6)`,
            opacity: 0,
          },
        ],
        { duration: rand(800, 1400), easing: "cubic-bezier(.2,.8,.3,1)" }
      );
      anim.onfinish = () => el.remove();
    }
  }

  function fallOne() {
    const el = document.createElement("span");
    el.className = "fx";
    el.textContent = pick(["💖", "💗", "💕", "🌸", "✨", "💞"]);
    el.style.left = rand(0, 100) + "vw";
    el.style.top = "0px";
    el.style.fontSize = rand(16, 32) + "px";
    fxLayer.appendChild(el);
    const sway = rand(-80, 80);
    const anim = el.animate(
      [
        { transform: "translate3d(0,-50px,0) rotate(0deg)", opacity: 1 },
        { transform: `translate3d(${sway}px, ${window.innerHeight + 60}px, 0) rotate(${rand(-200, 200)}deg)`, opacity: 0.9 },
      ],
      { duration: rand(2800, 5000), easing: "linear" }
    );
    anim.onfinish = () => el.remove();
  }

  function rain(ms = 4500) {
    if (reduceMotion) return;
    const end = performance.now() + ms;
    const t = setInterval(() => {
      if (performance.now() > end) return clearInterval(t);
      fallOne();
    }, 90);
  }

  // Little sparkle on every tap (except the escaping No button)
  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest && e.target.closest("#no-btn")) return;
    burst(e.clientX, e.clientY, 6, true);
  });

  /* ==========================================================
     Music (built-in music box, or your own file)
     ========================================================== */
  const Music = (() => {
    let ctx, master, timer, nextTime = 0, step = 0, audioEl = null, playing = false;

    // C – Am – F – G, bass note + three upper notes
    const CHORDS = [
      [130.81, 261.63, 329.63, 392.0],
      [110.0, 261.63, 329.63, 440.0],
      [87.31, 261.63, 349.23, 440.0],
      [98.0, 246.94, 293.66, 392.0],
    ];
    const PATTERN = [1, 2, 3, 2, 3, 2, 1, 2];
    const STEP = 0.42;

    function ensureCtx() {
      if (ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = CONFIG.musicVolume * 0.8;
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.32;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.38;
      const wet = ctx.createGain();
      wet.gain.value = 0.5;
      master.connect(ctx.destination);
      master.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(ctx.destination);
      return true;
    }

    function tone(freq, t, dur, vol, type = "sine") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    }

    function schedule() {
      while (nextTime < ctx.currentTime + 0.6) {
        const chord = CHORDS[Math.floor(step / 8) % CHORDS.length];
        const s = step % 8;
        if (s === 0) tone(chord[0], nextTime, 2.8, 0.16, "triangle");
        const f = chord[PATTERN[s]] * 2;
        tone(f, nextTime, 1.6, 0.07);
        tone(f * 2, nextTime, 0.5, 0.015);
        nextTime += STEP;
        step++;
      }
    }

    function start() {
      if (playing) return;
      if (CONFIG.musicSrc) {
        if (!audioEl) {
          audioEl = new Audio(CONFIG.musicSrc);
          audioEl.loop = true;
          audioEl.volume = CONFIG.musicVolume;
        }
        audioEl.play().catch(() => {});
      } else {
        if (!ensureCtx()) return;
        ctx.resume();
        nextTime = ctx.currentTime + 0.1;
        timer = setInterval(schedule, 120);
      }
      playing = true;
      updateBtn();
    }

    function stop() {
      if (!playing) return;
      if (audioEl) audioEl.pause();
      clearInterval(timer);
      playing = false;
      updateBtn();
    }

    function updateBtn() {
      musicBtn.textContent = playing ? "🔊" : "🔇";
      musicBtn.setAttribute("aria-pressed", String(playing));
      musicBtn.setAttribute("aria-label", playing ? "Turn music off" : "Turn music on");
    }

    document.addEventListener("visibilitychange", () => {
      if (!playing) return;
      if (document.hidden) {
        if (audioEl) audioEl.pause();
        if (ctx) ctx.suspend();
      } else {
        if (audioEl) audioEl.play().catch(() => {});
        if (ctx) ctx.resume();
      }
    });

    return { start, stop, toggle: () => (playing ? stop() : start()) };
  })();

  musicBtn.addEventListener("click", () => Music.toggle());

  /* ==========================================================
     The "No" button that runs away
     ========================================================== */
  let escapes = 0;
  let escaped = false;
  let accepted = false;
  let lastEscape = 0;
  let pointer = { x: -999, y: -999 };

  const trackPointer = (e) => { pointer = { x: e.clientX, y: e.clientY }; };
  document.addEventListener("pointermove", trackPointer);
  document.addEventListener("pointerdown", trackPointer);

  const overlaps = (x, y, w, h, r) =>
    x < r.right && x + w > r.left && y < r.bottom && y + h > r.top;

  function yesLabelFor(n) {
    let text = CONFIG.yesLabels[0].text;
    for (const l of CONFIG.yesLabels) if (n >= l.from) text = l.text;
    return text;
  }

  function growYes() {
    yesBtn.textContent = yesLabelFor(escapes);
    const baseW = yesBtn.offsetWidth; // layout width, unaffected by scale
    const fit = Math.max(1, (window.innerWidth * 0.9) / baseW);
    const scale = Math.min(1 + escapes * 0.16, fit);
    choices.style.setProperty("--yes-scale", scale.toFixed(3));
    // keeps getting shinier even after it can't get any wider
    choices.style.setProperty("--yes-glow", Math.min(escapes / 12, 1).toFixed(3));
  }

  function escapeNo(e) {
    if (accepted) return;
    const now = performance.now();
    if (now - lastEscape < 180) {
      if (e && e.cancelable) e.preventDefault();
      return;
    }
    lastEscape = now;
    if (e && e.cancelable) e.preventDefault();

    // First escape: lift the button out of the card so it can roam the whole screen.
    // (It moves to <body> because the glass card would otherwise trap fixed positioning.)
    if (!escaped) {
      escaped = true;
      const r = noBtn.getBoundingClientRect();
      noSlot.style.width = r.width + "px";
      noBtn.style.left = r.left + "px";
      noBtn.style.top = r.top + "px";
      document.body.appendChild(noBtn);
      noBtn.classList.add("is-escaping");
      void noBtn.offsetWidth;          // commit the starting position
      void noSlot.offsetWidth;
      noSlot.classList.add("collapsed"); // Yes slides to the centre
    }

    escapes++;
    noBtn.textContent = CONFIG.noLabels[escapes % CONFIG.noLabels.length];
    taunt.textContent = CONFIG.taunts[(escapes - 1) % CONFIG.taunts.length];
    taunt.classList.remove("pop");
    void taunt.offsetWidth;
    taunt.classList.add("pop");

    growYes();

    // Pick a random spot that isn't on top of Yes or right under the finger
    const w = noBtn.offsetWidth;
    const h = noBtn.offsetHeight;
    const m = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const yes = yesBtn.getBoundingClientRect();
    const avoid = { left: yes.left - 14, right: yes.right + 14, top: yes.top - 14, bottom: yes.bottom + 14 };

    let x, y, tries = 0;
    do {
      x = m + Math.random() * Math.max(0, vw - w - 2 * m);
      y = m + Math.random() * Math.max(0, vh - h - 2 * m);
      tries++;
    } while (
      tries < 40 &&
      (overlaps(x, y, w, h, avoid) || Math.hypot(x + w / 2 - pointer.x, y + h / 2 - pointer.y) < 140)
    );

    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
    noBtn.classList.remove("wiggle");
    void noBtn.offsetWidth;
    noBtn.classList.add("wiggle");

    if (!reduceMotion) {
      const r = noBtn.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 5, true);
    }
  }

  ["pointerenter", "pointerdown", "touchstart", "click", "focus"].forEach((evt) =>
    noBtn.addEventListener(evt, escapeNo, { passive: false })
  );

  // Mouse gets nudged away before it even touches the button
  document.addEventListener("pointermove", (e) => {
    if (!escaped || accepted || e.pointerType !== "mouse") return;
    const r = noBtn.getBoundingClientRect();
    const pad = 40;
    if (e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad) {
      escapeNo(e);
    }
  });

  window.addEventListener("resize", () => {
    if (!escaped || accepted) return;
    const r = noBtn.getBoundingClientRect();
    noBtn.style.left = Math.min(Math.max(8, r.left), window.innerWidth - r.width - 8) + "px";
    noBtn.style.top = Math.min(Math.max(8, r.top), window.innerHeight - r.height - 8) + "px";
  });

  /* ==========================================================
     "Yes" → celebration → gift
     ========================================================== */
  yesBtn.addEventListener("click", async () => {
    if (accepted) return;
    accepted = true;

    Music.start();

    const r = yesBtn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 30);

    noBtn.classList.add("vanish");
    askCard.classList.add("leaving");
    setTimeout(() => noBtn.remove(), 600);

    await wait(850);
    fillArt(kissGif, CONFIG.kissImage, "kiss"); // restart the animation
    goTo("screen-celebrate");

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    burst(cx, cy, 36);
    rain(5000);
    setTimeout(() => burst(cx * 0.5, cy * 0.8, 20), 500);
    setTimeout(() => burst(cx * 1.5, cy * 0.8, 20), 900);
    setTimeout(() => burst(cx, cy * 0.6, 26), 1500);

    await wait(CONFIG.gifDurationMs);
    goTo("screen-gift");
  });

  /* ==========================================================
     Gift → sticker → envelope → letter
     ========================================================== */
  function buildLetter() {
    const { greeting, paragraphs, signoff } = CONFIG.letter;
    letterBody.textContent = "";
    let i = 0;
    const add = (tag, cls, text) => {
      const el = document.createElement(tag);
      el.className = "line " + cls;
      el.style.setProperty("--i", i++);
      el.textContent = text;
      letterBody.appendChild(el);
    };
    add("h3", "greeting", greeting);
    paragraphs.forEach((p) => add("p", "", p));
    add("p", "signoff", signoff);
  }
  buildLetter();

  openBtn.addEventListener(
    "click",
    async (e) => {
      burst(e.clientX, e.clientY, 22);
      openBtn.classList.add("gone");
      await wait(550);
      openBtn.hidden = true;

      sticker.hidden = false;
      burst(window.innerWidth / 2, window.innerHeight * 0.35, 24);
      await wait(900);

      stage.hidden = false;
      await wait(1200);

      envelope.classList.add("is-open");       // flap opens
      await wait(950);

      envelope.classList.add("is-out");        // letter slides out
      await wait(1500);

      envelope.classList.add("is-gone");       // envelope drops away
      sticker.classList.add("leave");
      await wait(850);

      stage.hidden = true;
      sticker.hidden = true;
      letter.hidden = false;                   // the letter unfolds
      await wait(60); // let the layout settle, then scroll so the sticker + top of the letter are visible
      $("#screen-gift").scrollTo({ top: Math.max(0, letter.offsetTop - 120), behavior: "smooth" });
      burst(window.innerWidth / 2, window.innerHeight * 0.4, 30);
      rain(3500);
    },
    { once: true }
  );
})();
