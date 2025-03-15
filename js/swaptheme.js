"use strict";
const SCHEMES = ["light", "dark"];
const ICON = ["moon", "sun"];
let curscheme = document.cookie.split('; ')
    .map(cs => cs.split("="))
    .filter(c => c[0] == "colorscheme")
    .map(c => c[1]).at(0);

let container = null;

function update_scheme() {
    //yes, this the Wrong Way to this, but the Right Way is... painful.
    container.innerHTML =`
<svg class="scheme feather" aria-label="Switch Color Scheme"
     tabindex=1 role='button'>
  <title>Switch Color Scheme</title>
  <use xlink:href="/fonticons/feather.svg#${ICON[curscheme]}"/>
</svg>`;
    document.body.setAttribute('data-colorscheme', curscheme);
    const swap = () => {
        curscheme = (curscheme + 1) % SCHEMES.length;
        document.cookie =
            `colorscheme=${curscheme}; expires=${(new Date(Date.now()+ 86400*365*1000)).toUTCString()}; path=/; SameSite=Lax;`;
        update_scheme();
    }
    const svg = container.getElementsByTagName('svg')[0];
    svg.addEventListener('click', swap);
    svg.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            swap(e);
            container.getElementsByTagName('svg')[0].focus();
        }
    });
    
}

document.addEventListener("DOMContentLoaded", (e) => {
    if (curscheme === undefined
        || parseInt(curscheme, 10) === NaN
        || curscheme >= SCHEMES.length) {
        curscheme =
            (window.matchMedia("(prefers-color-scheme: dark)").matches) + 0;
    }
    container = document.getElementById("change-color-scheme");
    update_scheme();
});
