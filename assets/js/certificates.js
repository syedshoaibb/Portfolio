/*==========================================================
    PORTFOLIO
    FILE: certificates.js
==========================================================*/

"use strict";

const Certificates = {

    container: null,

    init() {

        this.container = document.getElementById("certificate-grid");

        if (!this.container) {
            return;
        }

        this.load();

    },

    load() {

        try {

            const certificates = window.SMS && SMS.data && SMS.data.certificates;

            if (!Array.isArray(certificates)) {
                throw new Error("SMS.data.certificates is missing. Is portfolio-data.js loaded before certificates.js?");
            }

            if (certificates.length === 0) {

                this.container.innerHTML =
                    '<div class="empty-state"><h3>No certificates yet</h3><p>Add entries to assets/data/portfolio-data.js.</p></div>';

                return;

            }

            this.container.innerHTML = certificates.map((c, i) => this.row(c, i)).join("");

            if (window.SMS && SMS.reveal) {
                SMS.reveal(this.container);
            }

        } catch (error) {

            console.error("Certificates:", error);

            this.container.innerHTML =
                '<div class="error-state"><h3>Certificates could not load</h3><p>Check that assets/data/portfolio-data.js exists and has no typos, then reload.</p></div>';

        }

    },

    row(certificate, index) {

        const e = SMS.esc;
        const meta = [certificate.organization, certificate.date].filter(Boolean).join(" · ");
        const isWorkshop = /workshop/i.test(certificate.title);

        const icon = isWorkshop
            ? '<path d="M4 6h16M6 6v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6M9 21l3-4 3 4" />'
            : '<circle cx="12" cy="9" r="5.5"/><path d="M8.8 13.6 7.5 21l4.5-2.6 4.5 2.6-1.3-7.4"/>';

        const link = SMS.isLink(certificate.link)
            ? '<a class="btn btn-secondary btn-sm" href="' + e(certificate.link) + '" target="_blank" rel="noopener">View certificate</a>'
            : '<span class="cert-done">Completed</span>';

        return '' +
            '<article class="cert reveal">' +
                '<div class="cert-top">' +
                    '<span class="cert-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + icon + "</svg></span>" +
                    '<span class="cert-no">' + String(index + 1).padStart(2, "0") + "</span>" +
                "</div>" +
                "<h3>" + e(certificate.title) + "</h3>" +
                '<p class="org">' + e(meta) + "</p>" +
                '<div class="cert-foot"><span class="cert-tag">' + (isWorkshop ? "Workshop" : "Course") + "</span>" + link + "</div>" +
            "</article>";

    }

};

document.addEventListener("DOMContentLoaded", function () {

    Certificates.init();

});
