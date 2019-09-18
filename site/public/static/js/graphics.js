

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

