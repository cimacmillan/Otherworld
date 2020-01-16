import { ScreenBuffer, DepthBuffer } from ".";
import { Camera, Sprite } from "../types";
import { vec_sub, vec_add, vec_rotate, vec_distance, clipToRange, swapSort } from "../util/math";
import { textureMap } from "./Shader";

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

            const u = (sprite.texcoord.t0.x * a0) + (sprite.texcoord.t1.x * a1) + (sprite.texcoord.t2.x * a2) + (sprite.texcoord.t3.x * a3);
            const v = (sprite.texcoord.t0.y * a0) + (sprite.texcoord.t1.y * a1) + (sprite.texcoord.t2.y * a2) + (sprite.texcoord.t3.y * a3);

            const colour = textureMap(sprite.texture, u, v);

            if (colour.a === 0) continue;

            screen.putPixelColour(xPixel, yPixel, colour);
            depth_buffer.setDistance(xPixel, yPixel, distance);
        }
    }

}
