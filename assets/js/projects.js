/*==========================================================
    PORTFOLIO
    FILE: projects.js
    Reads SMS.data.projects (assets/data/portfolio-data.js) and renders
    every project as a clean card. The first (spotlight) project is a
    wide featured card. Details live on pages/project.html.
==========================================================*/

"use strict";

const Projects = {

    grid: null,
    projects: [],

    init() {

        this.grid = document.getElementById("projects-grid");

        if (!this.grid) {
            return;
        }

        this.load();

    },

    load() {

        try {

            const data = window.SMS && SMS.data && SMS.data.projects;

            if (!Array.isArray(data)) {
                throw new Error("SMS.data.projects is missing. Is portfolio-data.js loaded before projects.js?");
            }

            if (data.length === 0) {
                this.showEmpty();
                return;
            }

            this.projects = data.slice().sort((a, b) => a.id - b.id);

            this.render();

        } catch (error) {

            console.error("Projects:", error);
            this.showError();

        }

    },

    render() {

        this.grid.innerHTML = this.projects.map((p, i) => this.card(p, i + 1)).join("");

        this.bindGlow();

        if (window.SMS && SMS.reveal) {
            SMS.reveal(this.grid);
        }

    },

    detailUrl(project) {

        return "pages/project.html?id=" + encodeURIComponent(project.slug || project.id);

    },

    status(project) {

        const label = project.status || "Unknown";

        return '<span class="status ' + SMS.slug(label) + '">' + SMS.esc(label) + "</span>";

    },

    card(project, number) {

        const e = SMS.esc;
        const tech = project.technologies || [];
        const shown = tech.slice(0, 4).map(t => '<span class="project-tag">' + e(t) + "</span>").join("");
        const more = tech.length > 4 ? '<span class="project-tag project-tag-more">+' + (tech.length - 4) + "</span>" : "";
        const featured = project.spotlight ? " pcard-featured" : "";
        const badge = project.spotlight ? '<span class="pcard-badge">Featured</span>' : "";

        return '' +
            '<article class="pcard reveal' + featured + '">' +
                '<div class="pcard-body">' +
                    '<div class="pcard-top">' +
                        '<span class="pcard-index">' + String(number).padStart(2, "0") + "</span>" +
                        '<span class="pcard-cat">' + e(project.category || "") + "</span>" +
                        badge +
                        this.status(project) +
                    "</div>" +
                    '<h3 class="pcard-title"><a href="' + this.detailUrl(project) + '">' + e(project.title) + "</a></h3>" +
                    '<p class="pcard-text">' + e(project.summary || project.description) + "</p>" +
                    '<div class="project-tags">' + shown + more + "</div>" +
                    '<div class="pcard-foot">' +
                        '<span class="pcard-more">View details <span aria-hidden="true">&rarr;</span></span>' +
                        '<div class="pcard-links">' + this.iconLinks(project) + "</div>" +
                    "</div>" +
                "</div>" +
            "</article>";

    },

    iconLinks(project) {

        const e = SMS.esc;
        const name = project.short || project.title;
        let html = "";

        if (SMS.isLink(project.github)) {

            html += '<a class="icon-link" href="' + e(project.github) + '" target="_blank" rel="noopener" ' +
                'aria-label="GitHub repository for ' + e(name) + '" title="GitHub repository">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg></a>';

        }

        if (SMS.isLink(project.live)) {

            html += '<a class="icon-link" href="' + e(project.live) + '" target="_blank" rel="noopener" ' +
                'aria-label="' + e(project.liveLabel || "Live demo") + ': ' + e(name) + '" title="' + e(project.liveLabel || "Live demo") + '">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg></a>';

        }

        return html;

    },

    /* A soft light follows the pointer across each card. */

    bindGlow() {

        /* Touch screens have no pointer to follow, and measuring the card on every touch move
           is what made scrolling feel sticky when a finger started on a card. */
        if (window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches) {
            return;
        }

        this.grid.querySelectorAll(".pcard").forEach(card => {

            card.addEventListener("pointermove", event => {

                if (event.pointerType === "touch") {
                    return;
                }


                const box = card.getBoundingClientRect();

                card.style.setProperty("--mx", (event.clientX - box.left) + "px");
                card.style.setProperty("--my", (event.clientY - box.top) + "px");

            }, { passive: true });

        });

    },

    showEmpty() {

        this.grid.innerHTML =
            '<div class="empty-state"><h3>No projects yet</h3><p>Add an entry to assets/data/portfolio-data.js and it will show up here.</p></div>';

    },

    showError() {

        this.grid.innerHTML =
            '<div class="error-state"><h3>Projects could not load</h3>' +
            '<p>The project data did not load. Check that assets/data/portfolio-data.js exists and has no typos ' +
            '(a missing comma or quote is the usual cause), then reload the page.</p></div>';

    }

};

document.addEventListener("DOMContentLoaded", function () {

    Projects.init();

});
