export enum TiledObjectType {
    Wall = "Wall",
    Door = "Door",
}

export const defaultTiledObjectProperties: Record<
    TiledObjectType,
    Record<string, string>
> = {
    [TiledObjectType.Wall]: {},
    [TiledObjectType.Door]: {},
};
