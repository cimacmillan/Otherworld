import { ScreenBuffer, DepthBuffer } from ".";
import { Camera, Sprite } from "../types";
import { vec_sub, vec_add, vec_rotate, vec_distance, clipToRange, swapSort } from "../util/math";
import { textureMap } from "./Shader";

function drawSprite(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, sprite: Sprite) {
    const projectPosition = sprite.projectPosition!;

    const diff = vec_sub(sprite.position, {x: 5, y: 5});
    sprite.position = vec_add(vec_rotate(diff, 0.04 / Math.pow(vec_distance(diff), 2) ), {x: 5, y: 5});

    // Angle of 0 is looking up? 
    const distance = -projectPosition.y;

    if (distance < camera.clip_depth) {
        return;
    }

    const projectMult = (camera.focal_length / distance) * screen.height;

    let width = sprite.size.x * projectMult;
    let height = sprite.size.y * projectMult;

    let x = (projectPosition.x * projectMult) + (0.5 * screen.width);
    let y = ((camera.height - sprite.height) * projectMult)  + (0.5 * screen.height);

    let x1 = clipToRange(Math.floor(x - width/2), 0, screen.width-1);
    let x2 = clipToRange(Math.floor(x + width/2), 0, screen.width-1);
    let y1 = clipToRange(Math.floor(y - height/2), 0, screen.height-1);
    let y2 = clipToRange(Math.floor(y + height/2), 0, screen.height-1);
    
    for (let xPixel = x1; xPixel < x2; xPixel++) {

        const x_alpha = (xPixel - (x - width/2)) / (width);

        for (let yPixel = y1; yPixel < y2; yPixel++) {

            const y_alpha = (yPixel - (y - height/2)) / (height);

            const a0 = (1 - x_alpha) * (1 - y_alpha);
            const a1 = (x_alpha) * (1 - y_alpha);
            const a2 = (x_alpha) * (y_alpha);
            const a3 = (1 - x_alpha) * (y_alpha);

            const colour = textureMap(sprite.texture, sprite.texcoord, a0, a1, a2, a3);

            if (colour.a === 0) continue;

            screen.putPixelColour(xPixel, yPixel, colour);
            depth_buffer.setDistance(xPixel, yPixel, distance);
        }
    }

}

export function drawSprites(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, sprites: Sprite[]) {
    sprites.forEach((sprite) => {
        sprite.projectPosition = vec_rotate(vec_sub(sprite.position, camera.position), -camera.angle)
    })
    
    swapSort(sprites, (spriteA, spriteB) => (spriteA.projectPosition!.y < spriteB.projectPosition!.y));

    sprites.forEach((sprite) => {
        drawSprite(screen, depth_buffer, camera, sprite);
    });
}