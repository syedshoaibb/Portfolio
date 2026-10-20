/*==========================================================
    PORTFOLIO
    FILE: security.js

    Keeps the visitor experience to what is meant to be seen.

    Honest note: anything a browser can display can still be
    inspected by someone determined. These measures stop casual
    copying and poking, nothing more. The real protection is that
    this site holds no secrets: no keys, no private data, and the
    server (see _headers and _redirects) only serves what is needed.
==========================================================*/

"use strict";

const Security = {

    init() {

        this.preventClickjacking();
        this.preventImageDrag();
        this.limitContextMenu();
        this.limitShortcuts();

    },

    /* If another site frames this page, break out of the frame. */
    preventClickjacking() {

        try {

            if (window.top !== window.self) {
                window.top.location = window.self.location;
            }

        } catch (error) {

            /* A sandboxed or cross-origin frame can block this; the
               X-Frame-Options header in _headers is the real protection. */

        }

    },

    preventImageDrag() {

        document.querySelectorAll("img").forEach(function (image) {

            image.setAttribute("draggable", "false");

        });

        document.addEventListener("dragstart", function (event) {

            if (event.target && event.target.tagName === "IMG") {
                event.preventDefault();
            }

        });

    },

    /* No right-click menu: no "Save image as", "View source" or "Inspect". */
    limitContextMenu() {

        document.addEventListener("contextmenu", function (event) {

            event.preventDefault();

        });

    },

    /* Casual shortcuts for source, inspector and save. */
    limitShortcuts() {

        document.addEventListener("keydown", function (event) {

            const key = (event.key || "").toLowerCase();
            const mod = event.ctrlKey || event.metaKey;

            const blocked =
                key === "f12" ||
                (mod && event.shiftKey && (key === "i" || key === "j" || key === "c" || key === "k")) ||
                (mod && event.altKey && (key === "i" || key === "u")) ||
                (mod && (key === "u" || key === "s"));

            if (blocked) {
                event.preventDefault();
                event.stopPropagation();
            }

        }, true);

    }

};

document.addEventListener("DOMContentLoaded", function () {

    Security.init();

});
