/*==========================================================
    PORTFOLIO
    FILE: main.js
    Loaded first. Defines the small shared helpers (window.SMS)
    that the other scripts use.
==========================================================*/

"use strict";

window.SMS = window.SMS || {};

/* Escape text before it goes into innerHTML. */
SMS.esc = function (value) {

    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {

        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];

    });

};

/* A real link is anything other than empty or "#". */
SMS.isLink = function (value) {

    return typeof value === "string" && value.trim() !== "" && value.trim() !== "#";

};

/* "In Progress" -> "in-progress" */
SMS.slug = function (value) {

    return String(value || "unknown").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

};

/* Hide an image's wrapper if the image fails to load.
   Mark images with data-fallback="<selector of element to hide>". */
SMS.bindImageFallbacks = function (root) {

    (root || document).querySelectorAll("img[data-fallback]").forEach(function (img) {

        function hide() {

            const target = img.closest(img.getAttribute("data-fallback"));

            if (target) {
                target.hidden = true;
            }

        }

        img.addEventListener("error", hide, { once: true });

        if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
            hide();
        }

    });

};

const App = {

    init() {

        this.setCurrentYear();
        this.bindCopyEmail();
        this.bindToTop();

    },

    bindToTop() {

        document.querySelectorAll("[data-to-top]").forEach(function (link) {

            link.addEventListener("click", function (event) {

                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });

            });

        });

    },

    setCurrentYear() {

        document.querySelectorAll("[data-year]").forEach(function (el) {

            el.textContent = new Date().getFullYear();

        });

    },

    bindCopyEmail() {

        const button = document.querySelector("[data-copy-email]");
        const status = document.getElementById("copy-status");

        if (!button || !status) {
            return;
        }

        button.addEventListener("click", async function () {

            const email = button.getAttribute("data-copy-email");

            try {

                await navigator.clipboard.writeText(email);
                status.textContent = "Email address copied.";

            } catch (error) {

                status.textContent = "Copy failed. The address is " + email + ".";

            }

            setTimeout(function () { status.textContent = ""; }, 3500);

        });

    }

};

document.addEventListener("DOMContentLoaded", function () {

    App.init();

});
