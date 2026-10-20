/*==========================================================
    PORTFOLIO
    FILE: theme.js
    Dark is the default. A saved choice wins.
    The inline script in <head> applies it before first paint.
==========================================================*/

"use strict";

const Theme = {

    button: null,

    init() {

        this.button = document.querySelector(".theme-toggle");

        this.render();

        if (this.button) {

            this.button.addEventListener("click", () => this.toggle());

        }

    },

    current() {

        return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

    },

    toggle() {

        const next = this.current() === "light" ? "dark" : "light";

        if (next === "light") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }

        try {
            localStorage.setItem("theme", next);
        } catch (error) { /* storage can be blocked */ }

        this.render();

    },

    render() {

        const light = this.current() === "light";

        if (this.button) {

            this.button.textContent = light ? "☾" : "☀";
            this.button.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
            this.button.setAttribute("aria-pressed", String(light));

        }

        const meta = document.querySelector('meta[name="theme-color"]');

        if (meta) {
            meta.setAttribute("content", light ? "#EDF5FA" : "#0A2233");
        }

    }

};

document.addEventListener("DOMContentLoaded", function () {

    Theme.init();

});
