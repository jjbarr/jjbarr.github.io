"use strict";
const THEME = "tmr";
const LIGHT = "l";
const DARK = "d";
const ICON = {
    "l": "moon",
    "d": "sun"
};
const COLORS = [
    "fg",
    "bg",
    "line",
    "sel",
    "com",
    "red",
    "orange",
    "yellow",
    "green",
    "aqua",
    "blue",
    "purple"
];

function update_scheme(curscheme, container) {
    //yes, this the Wrong Way to this, but the Right Way is... painful.
    container.innerHTML =`
<svg class="scheme feather" aria-label="Switch Color Scheme">
  <title>Switch Color Scheme</title>
  <use xlink:href="/fonticons/feather.svg#${ICON[curscheme]}"/>
</svg>`;
    for(const color of COLORS) {
        document.documentElement.style
            .setProperty(`--${color}`,
                         `var(--${THEME}-${curscheme}-${color})`);
    }
}

document.addEventListener("DOMContentLoaded", (e) => {
    let curscheme = window.localStorage.getItem("prefcolors")
        || (window.matchMedia("(prefers-color-scheme: dark)").matches
            ? DARK
            : LIGHT);
    let container = document.getElementById("change-color-scheme");
    update_scheme(curscheme, container);
    container.addEventListener("click", (e) => {
        curscheme = curscheme === DARK? LIGHT : DARK;
        update_scheme(curscheme, container);
    });
});
