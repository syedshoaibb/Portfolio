/*==========================================================
    PORTFOLIO
    FILE: scroll.js
    Back-to-top button.
==========================================================*/

"use strict";

const Scroll = {

    button: null,

    init() {

        this.button = document.getElementById("scroll-top");

        if (!this.button) {
            return;
        }

        window.addEventListener("scroll", () => this.toggle(), { passive: true });

        this.button.addEventListener("click", () => {

            window.scrollTo({ top: 0, behavior: "smooth" });

        });

        this.toggle();

    },

    toggle() {

        this.button.classList.toggle("show", window.scrollY > 600);

    }

};

document.addEventListener("DOMContentLoaded", function () {

    Scroll.init();

});
