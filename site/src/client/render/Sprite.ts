import { DepthBuffer, ScreenBuffer } from ".";
import { Camera, Sprite, Colour } from "../types";
import { clipToRange, randomFloatRange, swapSort, vec_add, vec_distance, vec_rotate, vec_sub } from "../util/math";
import { shade } from "./Shader";

export function drawSprites(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, sprites: Sprite[], backgroundColour: Colour) {
    for (let i = 0; i < sprites.length; i++) {
        sprites[i].projectPosition = vec_rotate(vec_sub(sprites[i].position, camera.position), -camera.angle);
    }

    sprites.sort((spriteA, spriteB) => (spriteA.projectPosition!.y - spriteB.projectPosition!.y));

    for (let i = 0; i < sprites.length; i++) {
        drawSprite(screen, depth_buffer, camera, sprites[i], backgroundColour);
    }
}

export function drawSprite(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, sprite: Sprite, backgroundColour: Colour) {
    const projectPosition = sprite.projectPosition!;
    const distance = -projectPosition.y;
    if (distance < camera.clip_depth || distance > camera.far_clip_depth) {
        return;
    }

    const projectMult = (camera.focal_length / distance) * screen.height;

    const width = (sprite.size.x * projectMult);
    const halfwidth = width / 2;
    const height = (sprite.size.y * projectMult);
    const halfheight = height / 2;

    const x = ((projectPosition.x * projectMult) + (0.5 * screen.width));
    const y = (((camera.height - sprite.height) * projectMult)  + (0.5 * screen.height));

    const x1 = (x - halfwidth) < 0 ? 0 : x - halfwidth;
    const x2 = (x + halfwidth) > screen.width - 1 ? screen.width - 1 : x + halfwidth;
    const y1 = (y - halfheight) < 0 ? 0 : y - halfheight;
    const y2 = (y + halfheight) > screen.height - 1 ? screen.height - 1 : y + halfheight;

    for (let xPixel = x1; xPixel < x2; xPixel++) {

        const x_alpha = (xPixel - (x - width / 2)) / (width);
        const u = (sprite.texcoord.start.x * (1.0 - x_alpha)) + (sprite.texcoord.end.x * x_alpha);

        for (let yPixel = y1; yPixel < y2; yPixel++) {

            const y_alpha = (yPixel - (y - height / 2)) / (height);
            const v = (sprite.texcoord.start.y * (1.0 - y_alpha)) + (sprite.texcoord.end.y * y_alpha);

            const colour = shade(sprite.texture, u, v, distance, camera.far_clip_depth);

            if (colour.a < 255) { continue; }

            screen.putPixelColour(~~xPixel, ~~yPixel, colour, distance, camera.far_clip_depth, backgroundColour);
            depth_buffer.setDistance(~~xPixel, ~~yPixel, distance);
        }
    }

}
