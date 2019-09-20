
/*

TODO Proper loading of resources

*/

let game_sources = ["js/sound.js", "js/graphics.js"];
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

/*

window.onload = function() {




    // Get the canvas and context
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
 
    // Define the image dimensions
    var width = canvas.width;
    var height = canvas.height;
 
    // Create an ImageData object
    var imagedata = context.createImageData(width, height);

    // Create the image
    function createImage(offset) {
        // Loop over all of the pixels
        for (var x=0; x<width; x++) {
            for (var y=0; y<height; y++) {
                // Get the pixel index
                var pixelindex = (y * width + x) * 4;
 
                // Generate a xor pattern with some random noise
                var red = ((x+offset) % 256) ^ ((y+offset) % 256);
                var green = ((2*x+offset) % 256) ^ ((2*y+offset) % 256);
                var blue = 50 + Math.floor(Math.random()*100);
 
                // Rotate the colors
                blue = (blue + offset) % 256;
 
                // Set the pixel data
                imagedata.data[pixelindex] = red;     // Red
                imagedata.data[pixelindex+1] = green; // Green
                imagedata.data[pixelindex+2] = blue;  // Blue
                imagedata.data[pixelindex+3] = 255;   // Alpha
            }
        }
    }
 
    // Main loop
    function main(tframe) {

        // res.bassdrum.play();

        prom = mySound.play();
        prom.catch((e) => {console.log(e)})
        // if (prom !== null){
        //     prom.catch(() => { media.play(); })
        // }

        // Request next frame
        framesPerSecond = 1
        setTimeout(function() {
            window.requestAnimationFrame(function(timestamp) {
                main(timestamp)
            });
        }, 1000 / framesPerSecond);

        // Create the image
        createImage(Math.floor(tframe / 10));
 
        // Draw the image data to the canvas
        context.putImageData(imagedata, 0, 0);

    }
 
    // Call the main loop
    main(0);
}

*/