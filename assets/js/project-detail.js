/*==========================================================
    PORTFOLIO
    FILE: project-detail.js
    Renders pages/project.html?id=<slug> from SMS.data.projects.
==========================================================*/

"use strict";

const ProjectDetail = {

    root: null,
    base: "../",

    init() {

        this.root = document.getElementById("project-detail");

        if (!this.root) {
            return;
        }

        const id = new URLSearchParams(window.location.search).get("id");

        try {

            const projects = window.SMS && SMS.data && SMS.data.projects;

            if (!Array.isArray(projects)) {
                throw new Error("SMS.data.projects is missing. Is portfolio-data.js loaded before project-detail.js?");
            }

            const project = projects.find(p => String(p.slug) === id || String(p.id) === id);

            if (!project) {
                this.notFound(projects);
                return;
            }

            this.render(project, projects);

        } catch (error) {

            console.error("Project detail:", error);

            this.root.innerHTML =
                '<div class="container"><div class="error-state"><h3>This project could not load</h3>' +
                '<p>Reload the page, or go back to the <a class="link" href="../index.html#projects">projects list</a>.</p></div></div>';

        }

    },

    notFound(projects) {

        const links = projects.map(p =>
            '<li><a class="link" href="project.html?id=' + encodeURIComponent(p.slug) + '">' + SMS.esc(p.short || p.title) + "</a></li>"
        ).join("");

        this.root.innerHTML =
            '<div class="container detail-hero"><h1 class="detail-title">That project does not exist</h1>' +
            '<p class="detail-summary">The link may be old. Pick one of these instead:</p>' +
            '<ul class="detail-list">' + links + "</ul></div>";

    },

    fact(label, value) {

        return value ? "<div><dt>" + SMS.esc(label) + "</dt><dd>" + SMS.esc(value) + "</dd></div>" : "";

    },

    render(project, projects) {

        const e = SMS.esc;

        document.title = (project.short || project.title) + " | Syed Madanin Shoaib";

        const description = document.querySelector('meta[name="description"]');

        if (description) {
            description.setAttribute("content", project.description);
        }

        const live = SMS.isLink(project.live)
            ? '<a class="btn btn-primary" href="' + e(project.live) + '" target="_blank" rel="noopener">' + e(project.liveLabel || "Live demo") + "</a>"
            : "";

        const github = SMS.isLink(project.github)
            ? '<a class="btn btn-secondary" href="' + e(project.github) + '" target="_blank" rel="noopener">Source code</a>'
            : "";

        const tags = (project.technologies || [])
            .map(t => '<span class="project-tag">' + e(t) + "</span>")
            .join("");

        /* Overview: short text beside a small picture. */
        const overview = '' +
            '<section class="detail-block detail-overview">' +
                '<div class="detail-overview-text">' +
                    "<h2>Overview</h2>" +
                    "<p>" + e(project.overview || project.description) + "</p>" +
                "</div>" +
                '<figure class="detail-figure">' +
                    '<img src="' + this.base + e(project.image) + '" alt="' + e(project.imageAlt || project.title) + '" width="800" height="560" data-fallback="figure">' +
                "</figure>" +
            "</section>";

        /* How it works: numbered steps. */
        const workflow = (project.workflow || []).length
            ? '<section class="detail-block"><h2>How it works</h2><ol class="steps">' +
                project.workflow.map(step =>
                    "<li><strong>" + e(step.label) + "</strong><span>" + e(step.text) + "</span></li>"
                ).join("") +
              "</ol></section>"
            : "";

        const evidence = (project.evidence || []).length
            ? '<section class="detail-block"><h2>What the forensics module checks</h2><ul class="detail-list">' +
                project.evidence.map(i => "<li><strong>" + e(i.label) + ".</strong> " + e(i.text) + "</li>").join("") +
              "</ul></section>"
            : "";

        const highlights = (project.highlights || []).length
            ? '<section class="detail-block"><h2>Key points</h2><ul class="detail-list">' +
                project.highlights.map(h => "<li>" + e(h) + "</li>").join("") +
              "</ul></section>"
            : "";

        const others = projects
            .filter(p => p !== project)
            .map(p => '<a class="project-tag project-tag-link" href="project.html?id=' + encodeURIComponent(p.slug) + '">' + e(p.short || p.title) + "</a>")
            .join("");

        this.root.innerHTML = '' +
            '<section class="detail-hero"><div class="container">' +
                '<a class="detail-back" href="../index.html#projects">Back to projects</a>' +
                '<h1 class="detail-title">' + e(project.title) + "</h1>" +
                '<p class="detail-summary">' + e(project.description) + "</p>" +
                '<dl class="detail-facts">' +
                    this.fact("Status", project.status) +
                    this.fact("Context", project.context) +
                    this.fact("Problem statement", project.problemStatement) +
                    this.fact("Team", project.team) +
                    this.fact("My part", project.role) +
                "</dl>" +
                ((live || github) ? '<div class="btn-row">' + live + github + "</div>" : "") +
                (project.note ? '<p class="project-note mt-4">' + e(project.note) + "</p>" : "") +
            "</div></section>" +
            '<section class="section detail-body"><div class="container detail-container">' +
                overview + workflow + evidence + highlights +
                '<section class="detail-block"><h2>Built with</h2><div class="project-tags">' + tags + "</div></section>" +
                '<section class="detail-block"><h2>Other projects</h2><div class="project-tags">' + others + "</div></section>" +
            "</div></section>";

        SMS.bindImageFallbacks(this.root);

        if (window.SMS && SMS.reveal) {
            SMS.reveal(this.root);
        }

    }

};

document.addEventListener("DOMContentLoaded", function () {

    ProjectDetail.init();

});
