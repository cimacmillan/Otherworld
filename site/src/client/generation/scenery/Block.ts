export function block(
    startx: number,
    starty: number,
    width: number,
    depth: number,
    texture: number,
    height?: number,
    offset?: number,
    collides?: boolean
) {
    return [
        {
            startx,
            starty,
            endx: startx + width,
            endy: starty,
            height,
            offset,
            texture,
            collides,
        },
        {
            startx: startx + width,
            starty,
            endx: startx + width,
            endy: starty + depth,
            height,
            offset,
            texture,
            collides,
        },
        {
            startx: startx + width,
            starty: starty + depth,
            endx: startx,
            endy: starty + depth,
            height,
            offset,
            texture,
            collides,
        },
        {
            startx,
            starty: starty + depth,
            endx: startx,
            endy: starty,
            height,
            offset,
            texture,
            collides,
        },
    ];
}
