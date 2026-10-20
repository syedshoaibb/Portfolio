/*==========================================================
    PORTFOLIO
    FILE: cursor.js
    A small ring that follows the pointer. Fine pointers only,
    never when reduced motion is requested. The real cursor stays.
==========================================================*/

"use strict";

const Cursor = {

    dot: null,
    ring: null,

    x: -100,
    y: -100,
    ringX: -100,
    ringY: -100,

    running: false,

    init() {

        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        this.dot = document.getElementById("cursor");
        this.ring = document.getElementById("cursor-blur");

        if (!fine || reduced || !this.dot || !this.ring) {
            return;
        }

        document.documentElement.classList.add("has-cursor");

        this.bindEvents();

    },

    bindEvents() {

        window.addEventListener("mousemove", (event) => {

            this.x = event.clientX;
            this.y = event.clientY;

            if (this.ringX < 0) {
                this.ringX = this.x;
                this.ringY = this.y;
            }

            this.dot.style.transform = "translate3d(" + this.x + "px," + this.y + "px,0)";

            this.dot.classList.remove("hidden");
            this.ring.classList.remove("hidden");

            if (!this.running) {
                this.running = true;
                requestAnimationFrame(() => this.loop());
            }

        }, { passive: true });

        document.addEventListener("mouseleave", () => {

            this.dot.classList.add("hidden");
            this.ring.classList.add("hidden");

        });

        /* Delegation, so links added later (projects, certificates) work too. */

        document.addEventListener("mouseover", (event) => {

            const target = event.target.closest("a, button, [role='button']");

            this.dot.classList.toggle("active", Boolean(target));
            this.ring.classList.toggle("active", Boolean(target));

        });

    },

    loop() {

        this.ringX += (this.x - this.ringX) * 0.18;
        this.ringY += (this.y - this.ringY) * 0.18;

        this.ring.style.transform = "translate3d(" + this.ringX + "px," + this.ringY + "px,0)";

        if (Math.abs(this.x - this.ringX) > 0.1 || Math.abs(this.y - this.ringY) > 0.1) {

            requestAnimationFrame(() => this.loop());

        } else {

            this.running = false;

        }

    }

};

document.addEventListener("DOMContentLoaded", function () {

    Cursor.init();

});
