/*==========================================================
    PORTFOLIO
    FILE: loader-init.js
    Runs the moment the loading screen is parsed (before first
    paint of the page behind it). While the loading screen is up,
    the page behind it cannot be scrolled and the hero waits for
    its entrance. loader.js lifts the lock when the screen goes.

    Safety net: the lock is always dropped after 4.5 seconds, even
    if every other script fails, so a visitor is never trapped.
==========================================================*/

(function () {

    var root = document.documentElement;

    if (root.classList.contains("no-loader")) {
        return;
    }

    root.classList.add("is-loading");

    setTimeout(function () {
        root.classList.remove("is-loading");
    }, 4500);

})();
