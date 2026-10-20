/*==========================================================
    PORTFOLIO
    FILE: navbar.js
==========================================================*/

"use strict";

const Navbar = {

    header: null,
    menuToggle: null,
    navLinks: null,
    links: [],
    sections: [],
    progress: null,
    ticking: false,

    init() {

        this.header = document.querySelector(".header");
        this.menuToggle = document.querySelector(".menu-toggle");
        this.navLinks = document.querySelector(".nav-links");
        this.progress = document.querySelector(".scroll-progress");
        this.links = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));

        this.sections = this.links
            .map(link => document.querySelector(link.getAttribute("href")))
            .filter(Boolean);

        if (!this.header) {
            return;
        }

        this.bindEvents();
        this.update();

    },

    bindEvents() {

        window.addEventListener("scroll", () => this.requestUpdate(), { passive: true });
        window.addEventListener("resize", () => this.requestUpdate());

        if (this.menuToggle && this.navLinks) {

            this.menuToggle.addEventListener("click", () => {

                this.setMenu(!this.navLinks.classList.contains("open"));

            });

            document.addEventListener("keydown", (event) => {

                if (event.key === "Escape" && this.navLinks.classList.contains("open")) {

                    this.setMenu(false);
                    this.menuToggle.focus();

                }

            });

            this.links.forEach(link => {

                link.addEventListener("click", () => this.setMenu(false));

            });

        }

    },

    setMenu(open) {

        this.navLinks.classList.toggle("open", open);
        this.header.classList.toggle("menu-open", open);

        this.menuToggle.setAttribute("aria-expanded", String(open));
        this.menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        this.menuToggle.textContent = open ? "✕" : "☰";

    },

    requestUpdate() {

        if (this.ticking) {
            return;
        }

        this.ticking = true;

        requestAnimationFrame(() => {

            this.update();
            this.ticking = false;

        });

    },

    update() {

        this.header.classList.toggle("scrolled", window.scrollY > 24);

        this.updateActiveLink();
        this.updateProgress();

    },

    updateActiveLink() {

        const probe = 140;
        let current = "";

        this.sections.forEach(section => {

            if (section.getBoundingClientRect().top <= probe) {
                current = section.id;
            }

        });

        this.links.forEach(link => {

            const active = link.getAttribute("href") === "#" + current;

            link.classList.toggle("active", active);

            if (active) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }

        });

    },

    updateProgress() {

        if (!this.progress) {
            return;
        }

        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

        this.progress.style.transform = "scaleX(" + ratio + ")";

    }

};

document.addEventListener("DOMContentLoaded", function () {

    Navbar.init();

});
