/*==========================================================
    PORTFOLIO
    FILE: particles.js
    Soft code symbols and bubbles drift through the water behind
    the page. Each one follows a smooth, looping current (no jumps,
    no respawning): they steer around the screen edges, glide around
    text and panels instead of blinking out, and bend gently away
    from the pointer.

    Built to stay light on phones:
      - every glyph is drawn once into a small glowing sprite, then
        stamped each frame (no per-frame blur, which is what made the
        old version heavy)
      - the keep-out zones are measured once and cached in page
        coordinates, so scrolling costs nothing
      - on touch screens there are fewer particles, they draw at
        about 30 frames a second, and they rest while a finger is
        scrolling
      - the loop pauses in hidden tabs

    Reduced-motion visitors get the same drift, much slower.
==========================================================*/

"use strict";

(function () {

    const canvas = document.getElementById("particles");

    if (!canvas || !canvas.getContext) {
        return;
    }

    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;

    const GLYPHS = ["0", "1", "{ }", "</>", "[ ]", "=>", ";", "#", "0x", "&&", "//", "( )", "!=", "01", "fn"];

    /* Things particles must not sit on. One rectangle per element, not per line of text. */
    const TEXT = "h1,h2,h3,h4,p,li,dt,dd,figcaption,label,.hero-hello,.section-kicker,.lede";
    const PANELS = ".mail,.pcard,.resume-card,.resume-paper,.detail-figure,.detail-facts,.btn,.btn-nav," +
        ".nav-social,.theme-toggle,.menu-toggle,.chip,.project-tag,.pass-chip,.logo,.cert,img,input,textarea";

    const PAD = 12;
    const FRAME_MS = touch ? 33 : 0;           /* about 30 fps on touch screens */
    const pointer = { x: -9999, y: -9999 };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let items = [];
    let zones = [];                             /* page coordinates: { l, t, r, b } */
    let visible = [];                           /* zones overlapping the screen right now */
    let color = { r: 156, g: 212, b: 242 };
    let isLight = false;
    let last = 0;
    let frame = 0;
    let time = 0;
    let lastScroll = -1e9;
    let sprites = new Map();

    function readTheme() {

        const root = document.documentElement;
        const cs = getComputedStyle(root);
        const value = (cs.getPropertyValue("--particle") || cs.getPropertyValue("--glow")).trim();
        const m = /^#([0-9a-f]{6})$/i.exec(value);

        if (m) {
            const n = parseInt(m[1], 16);
            color = { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
        }

        isLight = root.getAttribute("data-theme") === "light";
        sprites = new Map();

    }

    function rgba(a) {
        return "rgba(" + color.r + "," + color.g + "," + color.b + "," + a + ")";
    }

    function baseAlpha(depth) {
        return isLight ? 0.34 + depth * 0.36 : 0.34 + depth * 0.34;
    }

    /* ------------------------------------------------------
       Sprites: the glow is painted once, here, never per frame.
    ------------------------------------------------------ */

    function spriteFor(it) {

        const key = (it.bubble ? "b" : it.glyph) + "|" + it.size.toFixed(1) + "|" + dpr;
        let s = sprites.get(key);

        if (s) {
            return s;
        }

        const blur = (5 + it.depth * 7) * (isLight ? 0.6 : 1);
        const pad = Math.ceil(blur * 1.6) + 2;
        const w = it.bubble
            ? it.size * 2
            : Math.ceil(it.size * (it.glyph.length * 0.62 + 0.4));
        const h = it.bubble ? it.size * 2 : Math.ceil(it.size * 1.4);

        const cw = Math.ceil((w + pad * 2) * dpr);
        const ch = Math.ceil((h + pad * 2) * dpr);

        const c = document.createElement("canvas");
        c.width = cw;
        c.height = ch;

        const g = c.getContext("2d");

        g.scale(dpr, dpr);
        g.shadowColor = rgba(0.8);
        g.shadowBlur = blur;
        g.fillStyle = rgba(1);

        const cx = w / 2 + pad;
        const cy = h / 2 + pad;

        if (it.bubble) {

            g.beginPath();
            g.arc(cx, cy, it.size, 0, Math.PI * 2);
            g.fill();

        } else {

            g.font = "500 " + it.size.toFixed(1) + "px 'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace";
            g.textAlign = "center";
            g.textBaseline = "middle";
            g.fillText(it.glyph, cx, cy);

        }

        s = { canvas: c, w: cw / dpr, h: ch / dpr };
        sprites.set(key, s);

        return s;

    }

    /* ------------------------------------------------------
       Keep-out zones. Measured in page coordinates so scrolling
       never forces a re-measure. They are refreshed when the
       layout can have changed: load, resize, fonts, content added,
       and a moment after scrolling stops.
    ------------------------------------------------------ */

    function collectZones() {

        const sx = window.scrollX;
        const sy = window.scrollY;
        const out = [];

        function add(el) {

            const r = el.getBoundingClientRect();

            if (r.width < 2 || r.height < 2) {
                return;
            }

            out.push({ l: r.left + sx - PAD, t: r.top + sy - PAD, r: r.right + sx + PAD, b: r.bottom + sy + PAD });

        }

        document.querySelectorAll(TEXT).forEach(add);
        document.querySelectorAll(PANELS).forEach(add);

        zones = out;

    }

    function pickVisible() {

        const sy = window.scrollY;
        const top = sy - 60;
        const bottom = sy + height + 60;

        visible.length = 0;

        for (let i = 0; i < zones.length; i++) {

            const z = zones[i];

            if (z.b > top && z.t < bottom) {
                visible.push(z);
            }

        }

    }

    function zoneAt(x, y, extra) {

        /* x, y are screen coordinates; zones are in page coordinates. */
        const px = x + window.scrollX;
        const py = y + window.scrollY;

        for (let i = 0; i < visible.length; i++) {

            const z = visible[i];

            if (px > z.l - extra && px < z.r + extra && py > z.t - extra && py < z.b + extra) {
                return z;
            }

        }

        return null;

    }

    let refreshTimer = 0;

    function refreshSoon(delay) {

        clearTimeout(refreshTimer);

        refreshTimer = setTimeout(function () {

            if (!document.hidden) {
                collectZones();
            }

        }, delay);

    }

    /* ------------------------------------------------------ */

    function make() {

        const depth = Math.random();                 /* 0 far, 1 near */
        const bubble = Math.random() < 0.36;

        return {
            x: Math.random() * width,
            y: Math.random() * height,
            depth: depth,
            bubble: bubble,
            glyph: GLYPHS[(Math.random() * GLYPHS.length) | 0],
            size: bubble ? 1.8 + depth * 3.4 : 11 + depth * 9,
            speed: 14 + depth * 26,                  /* px per second */
            heading: Math.random() * Math.PI * 2,
            vx: 0,
            vy: 0,
            turn: 0.12 + Math.random() * 0.2,        /* how slowly it changes course */
            turn2: 0.07 + Math.random() * 0.12,
            phase: Math.random() * Math.PI * 2,
            phase2: Math.random() * Math.PI * 2,
            tw: 0.4 + Math.random() * 0.6,           /* shimmer rate */
            vis: 0
        };

    }

    let bitmapH = 0;

    function resize() {

        const oldW = width;
        const oldH = height;
        const w = window.innerWidth;
        const h = window.innerHeight;

        /* A phone's address bar grows and shrinks the screen while you scroll. That must never
           resize (or stretch) the canvas: the canvas is made tall enough once, its CSS size is
           always its real pixel size, and only the particles' working height changes. */

        if (w === oldW && bitmapH && h <= bitmapH) {
            height = h;
            return;
        }

        dpr = Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2);
        width = w;
        height = h;

        bitmapH = touch ? Math.max(h, window.screen ? window.screen.height || h : h) : h;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(bitmapH * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = bitmapH + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        sprites = new Map();

        const count = touch
            ? Math.round(Math.min(26, Math.max(16, width / 18)))
            : Math.round(Math.min(56, Math.max(20, width / 32)));

        /* Keep the particles that already exist and slide them with the new size,
           so a resize never makes them jump or respawn. */

        if (oldW && oldH) {

            items.forEach(function (it) {
                it.x *= width / oldW;
                it.y *= height / oldH;
            });

        }

        while (items.length < count) {
            items.push(make());
        }

        if (items.length > count) {
            items.length = count;
        }

        collectZones();

    }

    /* Ease a number toward a target, independent of frame rate. */

    function ease(from, to, rate, dt) {
        return from + (to - from) * (1 - Math.exp(-rate * dt));
    }

    function draw(it) {

        const shimmer = 0.88 + 0.12 * Math.sin(time * it.tw + it.phase);
        const a = baseAlpha(it.depth) * it.vis * shimmer;

        if (a < 0.01) {
            return;
        }

        const s = spriteFor(it);

        ctx.globalAlpha = Math.min(1, a);
        ctx.drawImage(s.canvas, it.x - s.w / 2, it.y - s.h / 2, s.w, s.h);

    }

    function step(now) {

        frame = requestAnimationFrame(step);

        /* Touch screens: rest while a finger is scrolling, and draw about 30 times a second. */
        if (touch && now - lastScroll < 140) {
            last = now;
            return;
        }

        if (FRAME_MS && now - last < FRAME_MS - 2) {
            return;
        }

        const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
        last = now;
        time += dt;

        ctx.clearRect(0, 0, width, bitmapH);

        pickVisible();

        const pace = reduced ? 0.35 : 1;
        const edge = 90;

        for (let i = 0; i < items.length; i++) {

            const it = items[i];

            /* A slow current: the heading turns gently, never snaps. */
            it.heading += (Math.sin(time * it.turn + it.phase) * 0.55 + Math.sin(time * it.turn2 + it.phase2) * 0.4) * dt;

            let tx = Math.cos(it.heading) * it.speed * pace;
            let ty = Math.sin(it.heading) * it.speed * pace;

            if (it.bubble) {
                ty -= (5 + it.depth * 7) * pace;
            }

            /* Near an edge the current bends back into the screen. */
            if (it.x < edge) { tx += (1 - it.x / edge) * it.speed * 1.6 * pace; }
            if (it.x > width - edge) { tx -= (1 - (width - it.x) / edge) * it.speed * 1.6 * pace; }
            if (it.y < edge) { ty += (1 - it.y / edge) * it.speed * 1.6 * pace; }
            if (it.y > height - edge) { ty -= (1 - (height - it.y) / edge) * it.speed * 1.6 * pace; }

            /* Over text or a panel: drift toward the nearest open edge. */
            const zone = zoneAt(it.x, it.y, it.size * 0.5);

            if (zone) {

                const px = it.x + window.scrollX;
                const py = it.y + window.scrollY;
                const dl = px - zone.l;
                const dr = zone.r - px;
                const dtp = py - zone.t;
                const db = zone.b - py;
                const m = Math.min(dl, dr, dtp, db);
                const out = it.speed * 1.4 * pace;

                if (m === dl) { tx -= out; }
                else if (m === dr) { tx += out; }
                else if (m === dtp) { ty -= out; }
                else { ty += out; }

            }

            /* Velocity follows the target smoothly (this is what makes it glide). */
            it.vx = ease(it.vx, tx, 1.4, dt);
            it.vy = ease(it.vy, ty, 1.4, dt);

            /* Bend away from the pointer (mouse only). */
            if (!reduced && !touch) {

                const dx = it.x - pointer.x;
                const dy = it.y - pointer.y;
                const d2 = dx * dx + dy * dy;

                if (d2 < 16900) {
                    const d = Math.sqrt(d2) || 1;
                    const k = 1 - d / 130;
                    it.vx += (dx / d) * k * k * 220 * dt;
                    it.vy += (dy / d) * k * k * 220 * dt;
                }

            }

            it.x += it.vx * dt;
            it.y += it.vy * dt;

            /* A hard stop far past the edge, in case a resize moved the screen. */
            it.x = Math.min(width + 20, Math.max(-20, it.x));
            it.y = Math.min(height + 20, Math.max(-20, it.y));

            /* Dim (never vanish) while crossing text, back to full in open water. */
            it.vis = ease(it.vis, zone ? 0.18 : 1, 2.2, dt);

            draw(it);

        }

        ctx.globalAlpha = 1;

    }

    function start() {

        if (frame) {
            return;
        }

        last = performance.now();
        frame = requestAnimationFrame(step);

    }

    function stop() {

        cancelAnimationFrame(frame);
        frame = 0;

    }

    readTheme();
    resize();
    start();

    /* Layout moves while the page loads and reveals. Re-measure at calm moments only. */

    window.addEventListener("scroll", function () {

        lastScroll = performance.now();
        refreshSoon(260);

    }, { passive: true });

    window.addEventListener("load", function () {
        refreshSoon(50);
        refreshSoon(900);
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { refreshSoon(50); });
    }

    /* Content added later (projects, certificates) arrives as new nodes. */

    if ("MutationObserver" in window) {

        new MutationObserver(function () {
            refreshSoon(400);
        }).observe(document.querySelector("main") || document.body, { childList: true, subtree: true });

    }

    let resizeTimer = 0;

    window.addEventListener("resize", function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            resize();
            refreshSoon(100);
        }, 150);

    });

    if (!touch) {

        window.addEventListener("pointermove", function (event) {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
        }, { passive: true });

        document.addEventListener("pointerleave", function () {
            pointer.x = -9999;
            pointer.y = -9999;
        });

    }

    document.addEventListener("visibilitychange", function () {

        if (document.hidden) {
            stop();
        } else {
            refreshSoon(50);
            start();
        }

    });

    new MutationObserver(function () {

        readTheme();

    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

})();
