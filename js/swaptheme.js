"use strict";
const SCHEMES = ["light", "dark"];
const ICON = ["moon", "sun"];

function update_scheme(curscheme, container) {
    //yes, this the Wrong Way to this, but the Right Way is... painful.
    container.innerHTML =`
<svg class="scheme feather" aria-label="Switch Color Scheme">
  <title>Switch Color Scheme</title>
  <use xlink:href="/fonticons/feather.svg#${ICON[curscheme]}"/>
</svg>`;
    document.body.setAttribute('data-colorscheme', curscheme);
}

document.addEventListener("DOMContentLoaded", (e) => {
    let curscheme = document.cookie.split('; ')
        .map(cs => cs.split("="))
        .filter(c => c[0] == "colorscheme")
        .map(c => c[1]).at(0);
    if (curscheme === undefined
        || parseInt(curscheme, 10) === NaN
        || curscheme >= SCHEMES.length) {
        curscheme =
            (window.matchMedia("(prefers-color-scheme: dark)").matches) + 0;
    }
    let container = document.getElementById("change-color-scheme");
    update_scheme(curscheme, container);
    container.addEventListener("click", (e) => {
        curscheme = (curscheme + 1) % SCHEMES.length;
        document.cookie =
            `colorscheme=${curscheme}; expires=${(new Date(Date.now()+ 86400*365*1000)).toUTCString()}; path=/; SameSite=Lax;`;
        update_scheme(curscheme, container);
    });
});
