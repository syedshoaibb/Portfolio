/*==========================================================
    PORTFOLIO
    FILE: animations.js
    Everything that moves with the scroll.

    1. Reveal       Elements glide in once as they enter the screen,
                    from the direction set in DIRECTIONS, staggered
                    among their siblings.
    2. Titles       Section titles rise word by word from a mask.
    3. Scroll-linked  Hero drifts away, the aurora glows move at their
                    own speed, and the
                    resume page turns as it crosses the screen.
    4. Pointer glow Cards get a soft light that follows the pointer.

    Anything rendered later (projects, certificates, project details)
    is picked up by calling SMS.reveal(root).
    Respects "reduce motion": content simply shows, nothing moves.
==========================================================*/

"use strict";

(function () {

    window.SMS = window.SMS || {};

    const AUTO = [
        ".section-header",
        ".about-point",
        ".fact",
        ".skill-row",
        ".resume-card",
        ".contact-email",
        ".contact-actions",
        ".certificate-row",
        ".detail-block",
        ".footer-brand",
        ".footer-col",
        ".footer-bottom"
    ].join(",");

    /* Where each kind of element comes from. Default is up. */
    const DIRECTIONS = {
        ".split > .section-header": "from-left",
        ".skill-row": "from-right",
        ".resume-card": "from-scale",
        ".contact-email": "from-scale"
    };

    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let observer = null;

    function show(element) {

        element.classList.add("revealed");

    }

    function getObserver() {

        if (observer || !("IntersectionObserver" in window)) {
            return observer;
        }

        observer = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    show(entry.target);
                    observer.unobserve(entry.target);

                }

            });

        }, { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });

        return observer;

    }

    /* Wrap each word of a title so it can rise from behind a mask.
       The visible spans are hidden from screen readers and the full
       text is kept in aria-label. */

    function splitTitles(scope) {

        if (reduced) {
            return;
        }

        scope.querySelectorAll(".section-title:not(.split-title), .resume-card h2:not(.split-title)").forEach(function (title) {

            const text = title.textContent.trim();

            if (!text) {
                return;
            }

            title.setAttribute("aria-label", text);
            title.classList.add("split-title");

            title.innerHTML = text.split(/\s+/).map(function (word, i) {

                return '<span class="w" aria-hidden="true" style="--wi:' + i + '"><span>' +
                    word.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }) +
                    "</span></span>";

            }).join(" ");

        });

    }

    /* Tag static elements and give each one a stagger delay
       based on its position among similar siblings. */

    function tag(scope) {

        scope.querySelectorAll(AUTO).forEach(function (element) {

            if (element.classList.contains("reveal")) {
                return;
            }

            const siblings = Array.from(element.parentElement.children).filter(function (child) {
                return child.matches(AUTO);
            });

            const position = Math.min(siblings.indexOf(element), 5);

            element.style.setProperty("--d", (position * 90) + "ms");
            element.classList.add("reveal");

            Object.keys(DIRECTIONS).forEach(function (selector) {

                if (element.matches(selector)) {
                    element.classList.add(DIRECTIONS[selector]);
                }

            });

        });

        /* Cards rendered by script: stagger the first few in each group. */

        scope.querySelectorAll(".pcard.reveal, .cert.reveal").forEach(function (element, i) {

            element.style.setProperty("--d", Math.min(i, 3) * 90 + "ms");

        });

    }

    SMS.reveal = function (root) {

        const scope = root || document;

        tag(scope);
        splitTitles(scope);

        const items = scope.querySelectorAll(".reveal:not(.revealed)");
        const io = reduced ? null : getObserver();

        items.forEach(function (element) {

            if (io) {
                io.observe(element);
            } else {
                show(element);
            }

        });

    };

    /* ------------------------------------------------------
       Scroll-linked motion. One rAF-throttled scroll handler
       writes CSS variables; the CSS decides how they look.
       Variables are set on the smallest element that needs
       them, so a scroll never restyles the whole page.
    ------------------------------------------------------ */

    /* How deep the water is: 0 at the top of the page, 1 at the bottom.
       A slow colour change, not movement, so it also runs with reduced motion. */

    function depthTint() {

        /* Only the water layer is touched: one small element, moved by the compositor. */
        const backdrop = document.querySelector(".bg-water");

        if (!backdrop) {
            return;
        }

        let queued = false;

        const coarse = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
        let shown = -1;
        let timer = 0;

        function set() {

            queued = false;

            const max = document.documentElement.scrollHeight - window.innerHeight;
            const depth = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
            const rounded = Math.round(depth * 100) / 100;

            /* Skip no-op writes: every write restyles the water layer. */
            if (rounded === shown) {
                return;
            }

            shown = rounded;
            backdrop.style.setProperty("--depth", String(rounded));

        }

        function request() {

            /* Phones: wait until the finger lifts, then let a CSS transition do the fade. */
            if (coarse) {

                clearTimeout(timer);
                timer = setTimeout(set, 140);
                return;

            }

            if (!queued) {
                queued = true;
                window.requestAnimationFrame(set);
            }

        }

        window.addEventListener("scroll", request, { passive: true });
        window.addEventListener("resize", request);
        window.addEventListener("load", request);

        set();

    }

    function scrollLinked() {

        /* Phones: no scroll-linked effects. They re-style the page on every scroll tick. */
        if (reduced || (window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches)) {
            return;
        }

        const hero = document.querySelector(".hero");
        const backdrop = document.querySelector(".background-wrapper");
        const scrub = Array.from(document.querySelectorAll(".resume-card"));

        let ticking = false;

        function update() {

            ticking = false;

            const y = window.scrollY;
            const vh = window.innerHeight;

            if (hero) {

                const p = Math.min(1, Math.max(0, y / (hero.offsetHeight * 0.75)));
                hero.style.setProperty("--hp", p.toFixed(3));

            }

            if (backdrop) {
                backdrop.style.setProperty("--sy", String(Math.round(y)));
            }

            scrub.forEach(function (element) {

                const box = element.getBoundingClientRect();
                const centre = box.top + box.height / 2;
                const p = Math.max(-1, Math.min(1, (centre - vh / 2) / vh));

                element.style.setProperty("--p", p.toFixed(3));

            });

        }

        function request() {

            if (!ticking) {

                ticking = true;
                window.requestAnimationFrame(update);

            }

        }

        window.addEventListener("scroll", request, { passive: true });
        window.addEventListener("resize", request);
        
        update();

    }

    /* ------------------------------------------------------
       Pointer glow on cards (colour only, never movement).
       One delegated listener covers cards rendered later too.
    ------------------------------------------------------ */

    function pointerGlow() {

        let frame = 0;

        document.addEventListener("pointermove", function (event) {

            if (frame || event.pointerType === "touch") {
                return;
            }

            const card = event.target.closest && event.target.closest(".pcard, .cert");

            if (!card) {
                return;
            }

            frame = window.requestAnimationFrame(function () {

                frame = 0;

                const box = card.getBoundingClientRect();

                card.style.setProperty("--mx", (event.clientX - box.left) + "px");
                card.style.setProperty("--my", (event.clientY - box.top) + "px");

            });

        }, { passive: true });

    }

    /* Anything within the last few percent of the page can never cross the
       observer's margin, so at the very bottom reveal what is still hidden. */

    function revealAtBottom() {

        let done = false;

        window.addEventListener("scroll", function () {

            if (done || window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 6) {
                return;
            }

            done = true;

            document.querySelectorAll(".footer .reveal:not(.revealed)").forEach(show);

            setTimeout(function () { done = false; }, 600);

        }, { passive: true });

    }

    document.addEventListener("DOMContentLoaded", function () {

        revealAtBottom();
        SMS.reveal(document);
        depthTint();
        scrollLinked();
        pointerGlow();

    });

})();
