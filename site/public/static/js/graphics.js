
class DepthBuffer {
    constructor(width, height) {
        this.data = Array(width * height).fill(0);
        this.width = width;
        this.height = height;
    }

    isCloser(x, y, distance) {
        let index = (y * this.width) + x;
        return 1.0 / distance > this.data[index];
    }

    setDistance(x, y, distance) {
        let index = (y * this.width) + x;
        this.data[index] = 1.0 / distance;
    }

    reset() {
        this.data = Array(this.width * this.height).fill(0);
    }
}

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

    putPixel(x, y, red, green, blue, alpha) {
        var pixelindex = (y * this.width + x) * 4;
        this.image_data.data[pixelindex] = red;
        this.image_data.data[pixelindex+1] = green;
        this.image_data.data[pixelindex+2] = blue;
        this.image_data.data[pixelindex+3] = alpha;

    }

    render_to_canvas() {
        this.canvas_context.putImageData(this.image_data, 0, 0);
        this.canvas_context.drawImage( screen.canvas, 0, 0, this.resolution_divisor * screen.canvas.width, this.resolution_divisor * screen.canvas.height );
    }
}

function vec_cross(a, b) {
    return (a.x * b.y) - (a.y * b.x);
}

function vec_sub(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

function vec_add(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    }
}


function vec_divide(a, b) {
    return {
        x: a.x / b.x,
        y: a.y / b.y
    }
}

function vec_rotate(a, theta) {
    return {
        x: a.x * Math.cos(theta) - a.y * Math.sin(theta),
        y: a.y * Math.cos(theta) + a.x * Math.sin(theta)
    }
}

function fire_ray(origin, direction) {

    let intersecting_rays = [];

    map.wall_buffer.forEach((wall) => {

        let wall_direction = vec_sub(wall.p1, wall.p0);

        //Funky maths
        let wall_interpolation = (vec_cross(origin, direction) - vec_cross(wall.p0, direction)) /  vec_cross(wall_direction, direction);
        let ray_interpolation =  (vec_cross(wall.p0, wall_direction) - vec_cross(origin, wall_direction)) /  vec_cross(direction, wall_direction);

        if (wall_interpolation >= 0 && wall_interpolation <= 1 && ray_interpolation > camera.focal_length) {

            let intersection = {x: origin.x + ray_interpolation * direction.x, y: origin.y + ray_interpolation * direction.y};
            let length = Math.sqrt(Math.pow(intersection.x - origin.x, 2) + Math.pow(intersection.y - origin.y, 2));

            intersecting_rays.push({
                wall: wall,
                wall_interpolation: wall_interpolation,
                ray_interpolation: ray_interpolation,
                origin: origin, 
                direction: direction,
                intersection: intersection,
                length: length
            });
        }

    });

    return intersecting_rays;
}

function convert_unit(x, range, a, b) {
    let grad = x / range;
    let new_unit = (a * (1 - grad)) + (b * grad);
    return new_unit;
}

function createImage(screen, offset) {

    depth_buffer.reset();

    // Loop over all of the pixels
    for (var x=0; x < screen.width; x++) {

        for (var y=0; y < screen.height; y++) {
            screen.putPixel(x, y, 0, 0, 0, 255);
        }


        let x_grad = convert_unit(x, screen.width, -1.0, 1.0);
        let direction = vec_rotate({x: x_grad, y: -camera.focal_length}, camera.angle);
        let origin = camera.position;
        let theta = Math.atan(x_grad / -camera.focal_length);

        let intersecting_rays = fire_ray(origin, direction);
        
        intersecting_rays.forEach((ray) => {

            let wall_height = 2.0 / (ray.length * Math.cos(theta));
            for (var y = 0; y < screen.height; y++) {

                let y_grad = (y / screen.height) * 2 - 1;
                let wall_check = Math.abs(y_grad);

                if(wall_check < wall_height && depth_buffer.isCloser(x, y, ray.length)) {

                    depth_buffer.setDistance(x, y, ray.length);

                    screen.putPixel(x, y, 
                        255, 
                        ((ray.intersection.x % 2) / 2)  * 255, 
                        ((ray.intersection.y % 2) / 2)  * 255, 
                        255);

                }
            }
        })

    }
}

