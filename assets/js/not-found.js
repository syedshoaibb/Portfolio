/*==========================================================
    PORTFOLIO
    FILE: not-found.js
    Shows the address that was not found, on the 404 page.
    textContent only, so nothing in the URL can run as markup.
==========================================================*/

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const path = document.getElementById("nf-path");

    if (path) {
        path.textContent = window.location.pathname || "/";
    }

});
