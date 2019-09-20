

class Screen {
    constructor(canvas_element_name, resolution_divisor) {
        this.canvas = document.getElementById(canvas_element_name);
        this.canvas_context = this.canvas.getContext("2d");
        this.canvas_context.imageSmoothingEnabled = false;
        this.resolution_divisor = resolution_divisor;
        this.width = this.canvas.width / resolution_divisor;
        this.height = this.canvas.height / resolution_divisor;
        this.image_data = this.canvas_context.createImageData(this.width, this.height);
    }

    render_to_canvas() {
        this.canvas_context.putImageData(this.image_data, 0, 0);
        this.canvas_context.drawImage( screen.canvas, 0, 0, this.resolution_divisor * screen.canvas.width, this.resolution_divisor * screen.canvas.height );
    }

}

function createImage(screen, offset) {
    // Loop over all of the pixels
    for (var x=0; x < screen.width; x++) {

        let x_grad = (x / screen.width) * 2 - 1;
        let distance = (1 / Math.abs(x_grad));
        let wall_height = 1 / distance;

        for (var y=0; y < screen.height; y++) {

            var pixelindex = (y * screen.width + x) * 4;

            let y_grad = (y / screen.height) * 2 - 1;
            let wall_check = Math.abs(y_grad);
            
            if(wall_check > wall_height) {
                screen.image_data.data[pixelindex] = 0;     // Red
                screen.image_data.data[pixelindex+1] = 0; // Green
                screen.image_data.data[pixelindex+2] = 0;  // Blue
                screen.image_data.data[pixelindex+3] = 255;   // Alpha
                continue;
            }

            var pos = distance + offset;
            var red = ((pos * 256) % 256)
            var green = 0;
            if((pos % 2) < 1){
                var green = red;
                var red = 0;
            }
            var blue = 0;

            // // Rotate the colors
            // blue = (blue + offset) % 256;

            // Set the pixel data
            screen.image_data.data[pixelindex] = red;     // Red
            screen.image_data.data[pixelindex+1] = green; // Green
            screen.image_data.data[pixelindex+2] = blue;  // Blue
            screen.image_data.data[pixelindex+3] = 255;   // Alpha
        }
    }
}

