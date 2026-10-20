/*==========================================================
    PORTFOLIO
    FILE: loader.js
    Hides on page load, but never before the intro has played
    (MIN_MS), and never later than the cap, so a slow font or
    image can never keep the loader on screen. When it goes, the
    scroll lock (set by loader-init.js) is lifted and the hero
    starts its entrance.
==========================================================*/

"use strict";

const Loader = {

    MIN_MS: 1500,

    loader: null,
    done: false,
    started: 0,

    init() {

        this.loader = document.getElementById("loader");

        if (!this.loader) {
            return;
        }

        this.started = performance.now();

        if (document.readyState === "complete") {

            this.hide();

        } else {

            window.addEventListener("load", () => this.hide());

            setTimeout(() => this.finish(), 2400);

        }

    },

    /* Wait out the rest of the logo animation, then close. */
    hide() {

        if (this.done || !this.loader) {
            return;
        }

        const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const wait = reduced ? 0 : Math.max(0, this.MIN_MS - (performance.now() - this.started));

        setTimeout(() => this.finish(), wait);

    },

    finish() {

        if (this.done || !this.loader) {
            return;
        }

        this.done = true;

        document.documentElement.classList.remove("is-loading");
        this.loader.classList.add("is-done");

        try {
            sessionStorage.setItem("loaderSeen", "1");
        } catch (error) { /* storage can be blocked */ }

        setTimeout(() => {

            if (this.loader) {
                this.loader.remove();
            }

        }, 1100);

    }

};

document.addEventListener("DOMContentLoaded", function () {

    Loader.init();

});
