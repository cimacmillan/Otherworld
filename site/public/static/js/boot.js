

let game_sources = ["js/sound.js", "js/graphics.js", "js/map.js", "js/input.js"];
let game_main = "js/game.js";

function loadSource(url) {
    let element = document.createElement("script");
    element.src = url;
    document.body.appendChild(element);
}

window.onload = function() {
    console.log("Window Loaded");
    console.log("Loading Sources...")
    game_sources.map(url => loadSource(url));

    setTimeout(() => loadSource(game_main), 1000)
};
