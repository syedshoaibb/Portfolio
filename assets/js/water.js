/*==========================================================
    PORTFOLIO
    FILE: water.js
    A quiet water drop: every click or tap leaves two soft rings that
    spread out and fade. Nothing else (no splashes, no droplets).

    Each ripple draws on its own small canvas (about 250px square), and
    the animation loop only runs while a ripple is on screen, so it costs
    nothing the rest of the time. On touch screens a tap makes the ripple (a scroll or a swipe
    does not), so scrolling stays smooth.
==========================================================*/

"use strict";

(function () {

    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverCapable = window.matchMedia && window.matchMedia("(hover: hover)").matches;

    /* The name's water reflection only animates on desktop. Phones skip it entirely. */
    if (!hoverCapable || reduced) {

        document.querySelectorAll("#name-ripple animate").forEach(function (node) {
            node.remove();
        });

    }

    if (reduced) {
        return;
    }

    const touchScreen = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;

    const DURATION = 1100;                         /* ms for the whole ripple */
    const MAX_RADIUS = touchScreen ? 58 : 76;
    const PAD = 10;
    const SIDE = (MAX_RADIUS + PAD) * 2;
    const MAX_DROPS = 5;                           /* ripples alive at once */

    let drops = [];
    let dpr = 1;
    let frame = 0;
    let glow = "156,212,242";
    let glow2 = "112,220,208";

    function hexToRgb(value, fallback) {

        const m = /^#([0-9a-f]{6})$/i.exec((value || "").trim());

        if (!m) {
            return fallback;
        }

        const n = parseInt(m[1], 16);

        return ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);

    }

    function readColors() {

        const cs = getComputedStyle(document.documentElement);

        glow = hexToRgb(cs.getPropertyValue("--glow"), glow);
        glow2 = hexToRgb(cs.getPropertyValue("--glow-2"), glow2);

    }

    function makeCanvas(x, y) {

        dpr = Math.min(window.devicePixelRatio || 1, touchScreen ? 1.5 : 2);

        const c = document.createElement("canvas");

        c.width = Math.round(SIDE * dpr);
        c.height = Math.round(SIDE * dpr);
        c.className = "water-canvas";
        c.setAttribute("aria-hidden", "true");

        const st = c.style;

        st.position = "fixed";
        st.left = Math.round(x - SIDE / 2) + "px";
        st.top = Math.round(y - SIDE / 2) + "px";
        st.width = SIDE + "px";
        st.height = SIDE + "px";
        st.pointerEvents = "none";
        st.zIndex = "99996";

        const g = c.getContext("2d");

        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        document.body.appendChild(c);

        return { el: c, g: g };

    }

    /* Easing */

    function outCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function outQuart(t) { return 1 - Math.pow(1 - t, 4); }
    function inOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function addDrop(x, y) {

        readColors();

        const surface = makeCanvas(x, y);

        drops.push({ c: surface, x: SIDE / 2, y: SIDE / 2, born: performance.now() });

        if (drops.length > MAX_DROPS) {
            drops.shift().c.el.remove();
        }

        if (!frame) {
            frame = requestAnimationFrame(tick);
        }

    }

    function ring(d, t, delay, scale, weight) {

        const ctx = d.c.g;

        const p = (t - delay) / (DURATION - delay);

        if (p <= 0 || p >= 1) {
            return;
        }

        const radius = MAX_RADIUS * scale * outQuart(p);
        const fade = Math.pow(1 - p, 1.6);
        const band = 4 + 7 * p;                                /* the watery band widens as it travels */

        /* A soft lens of light just inside the edge. */
        const inner = Math.max(0, radius - band);
        const g = ctx.createRadialGradient(d.x, d.y, inner, d.x, d.y, radius);

        g.addColorStop(0, "rgba(" + glow + ",0)");
        g.addColorStop(1, "rgba(" + glow + "," + (0.07 * fade).toFixed(3) + ")");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();

        /* The bright thin edge. */
        ctx.lineWidth = Math.max(0.6, weight * (1 - p * 0.7));
        ctx.strokeStyle = "rgba(" + glow + "," + (0.32 * fade).toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.stroke();

    }

    function tick(now) {

        const alive = [];

        for (let i = 0; i < drops.length; i++) {

            const d = drops[i];
            const t = now - d.born;

            if (t >= DURATION + 200) {
                d.c.el.remove();
                continue;
            }

            alive.push(d);

            const ctx = d.c.g;

            ctx.clearRect(0, 0, SIDE, SIDE);

            /* Two rings, the second a little behind and a little smaller. */
            ring(d, t, 0, 1, 1.4);
            ring(d, t, 160, 0.62, 1);

        }

        drops = alive;

        frame = drops.length ? requestAnimationFrame(tick) : 0;

    }

    /* Mouse: the instant the button goes down. Touch: on lift, and only if the finger stayed put
       (a scroll or swipe makes no ripple, which also keeps scrolling smooth). */

    let startX = 0;
    let startY = 0;
    let moved = false;

    document.addEventListener("pointerdown", function (event) {

        if (event.button > 0) {
            return;
        }

        startX = event.clientX;
        startY = event.clientY;
        moved = false;

        if (event.pointerType !== "touch") {
            addDrop(event.clientX, event.clientY);
        }

    }, { passive: true });

    document.addEventListener("pointermove", function (event) {

        if (event.pointerType === "touch" && !moved) {

            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            if (dx * dx + dy * dy > 100) {
                moved = true;
            }

        }

    }, { passive: true });

    document.addEventListener("pointerup", function (event) {

        if (event.pointerType === "touch" && !moved) {
            addDrop(event.clientX, event.clientY);
        }

    }, { passive: true });

})();
