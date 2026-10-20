/*==========================================================
    PORTFOLIO
    FILE: theme-init.js
    Tiny blocking script loaded in <head>. It runs before first
    paint so there is no flash of the wrong theme, and it marks
    JavaScript as available for the CSS.
==========================================================*/

(function () {

    var root = document.documentElement;

    root.classList.add("js");

    try {

        if (localStorage.getItem("theme") === "light") {
            root.setAttribute("data-theme", "light");
        }

        if (sessionStorage.getItem("loaderSeen")) {
            root.classList.add("no-loader");
        }

    } catch (error) { /* storage can be blocked */ }

})();
