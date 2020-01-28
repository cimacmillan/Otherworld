import { ScreenBuffer, DepthBuffer } from ".";
import { Camera, Sprite } from "../types";
import { vec_sub, vec_add, vec_rotate, vec_distance, clipToRange, swapSort, randomFloatRange } from "../util/math";
import { fastTextureMap } from "./Shader";

export function drawSprites(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, sprites: Sprite[]) {
    for (let i = 0; i < sprites.length; i++) {
        sprites[i].projectPosition = vec_rotate(vec_sub(sprites[i].position, camera.position), -camera.angle)
    }

    sprites.sort((spriteA, spriteB) => (spriteA.projectPosition!.y - spriteB.projectPosition!.y));

    for (let i = 0; i < sprites.length; i++) {
        drawSprite(screen, depth_buffer, camera, sprites[i]);
    }
}

export function drawSprite(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera, sprite: Sprite) {
    const projectPosition = sprite.projectPosition!;
    const distance = -projectPosition.y;

    const centre = {x: randomFloatRange(15, 25), y: randomFloatRange(15, 25)};
    const diff = vec_sub(sprite.position, centre);
    sprite.position = vec_add(vec_rotate(diff, 0.4 / Math.pow(vec_distance(diff) / 2, 2) ), centre);

    if (distance < camera.clip_depth) {
        return;
    }

    const projectMult = (camera.focal_length / distance) * screen.height;

    let width = (sprite.size.x * projectMult);
    let height = (sprite.size.y * projectMult);

    let x = ((projectPosition.x * projectMult) + (0.5 * screen.width));
    let y = (((camera.height - sprite.height) * projectMult)  + (0.5 * screen.height));

    let x1 = clipToRange((x - width/2), 0, screen.width-1);
    let x2 = clipToRange((x + width/2), 0, screen.width-1);
    let y1 = clipToRange((y - height/2), 0, screen.height-1);
    let y2 = clipToRange((y + height/2), 0, screen.height-1);

    for (let xPixel = x1; xPixel < x2; xPixel++) {

        const x_alpha = (xPixel - (x - width/2)) / (width);
        const u = (sprite.texcoord.start.x * (1.0 - x_alpha)) + (sprite.texcoord.end.x * x_alpha);

        for (let yPixel = y1; yPixel < y2; yPixel++) {

            const y_alpha = (yPixel - (y - height/2)) / (height);
            const v = (sprite.texcoord.start.y * (1.0 - y_alpha)) + (sprite.texcoord.end.y * y_alpha);

            const colour = fastTextureMap(sprite.texture, u, v);

            if (colour.a < 255) continue;

            screen.putPixelColour(~~xPixel, ~~yPixel, colour);
            depth_buffer.setDistance(~~xPixel, ~~yPixel, distance);
        }
    }

}
