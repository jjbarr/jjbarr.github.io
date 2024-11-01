"use strict";
const THEME = "sel";
const LIGHT = "w";
const DARK = "b";
const ICON = {
    "w": "moon",
    "b": "sun"
};
const COLORS = [
    "bg0",
    "bg1",
    "bg2",
    "dim0",
    "fg0",
    "fg1",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "cyan",
    "magenta",
    "violet",
    "br-red",
    "br-orange",
    "br-yellow",
    "br-green",
    "br-blue",
    "br-cyan",
    "br-magenta",
    "br-violet",
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
        window.localStorage.setItem("prefcolors", curscheme);
        update_scheme(curscheme, container);
    });
});
