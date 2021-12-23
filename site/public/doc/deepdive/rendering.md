Otherworld uses WebGL and GLSL for rendering. The are 5 vertex shaders and 3 fragment shaders that are used to render the various geometries in the game. The game can achieve fast render times with tens of thousands of entities by batch rendering every game entity at once. This is achieved by maintaining large arrays for the parameters of the shader for each entity. For instance, for rendering `Particles` this is the `ParticleRenderService`, which maintains large arrays for the various particle positions, colours:

```ts
export class ParticleRenderService {
    private gl: WebGLRenderingContext;

    private particleArray: SyncedArray<ParticleRender>;

    private shader: CompiledShader;

    private positionBuffer: WebGLBuffer;
    private translationBuffer: WebGLBuffer;
    private colourBuffer: WebGLBuffer;

    private positions: Float32Array;
    private translations: Float32Array;
    private colours: Float32Array;
```

When a particle entity is created, it registers itself with this service. The service then extends the attribute arrays if needed and sets them to the particle's values. See how depending on the particle's position in the particle array, corresponds to a different index in the positions array. This is because the positions array represents triangle vertices. So for every particle, there are 2 triangles. Each triangle has 3 vertices. Every vertex has 3 dimensions representing its position:

```ts
private onInjection(index: number, sprite: ParticleRender) {
    const t1i = index * 2 * 3 * 3;
    const tex = index * 2 * 3 * 2;
    const col = index * 2 * 3 * 3;

    const halfWidth = sprite.size[0] / 2;
    const halfHeight = sprite.size[1] / 2;

    this.positions[t1i] = -halfWidth;
    this.positions[t1i + 1] = halfHeight;
    this.positions[t1i + 2] = 0;
    ...
```

The same pattern is used for most of Otherworld's rendering. Entity's leverage the various render services using the `ServiceLocator`, containing all the world's systems. An entity can have a `RenderComponent` added to it, which interfaces with the `RenderService` depending on its state:

```ts
export const SpriteRenderComponent = (): EntityComponent<SpriteRenderState> => {
    let toRenderRef: RenderItem;

    return {
        getActions: (entity: Entity<SpriteRenderState>) => ({
            onEntityCreated: () => {
                toRenderRef = entity
                    .getServiceLocator()
                    .getRenderService()
                    .spriteRenderService.createItem(getSpriteFromState(entity));
            },
            onEntityDeleted: () => {
                if (toRenderRef) {
                    entity
                        .getServiceLocator()
                        .getRenderService()
                        .spriteRenderService.freeItem(toRenderRef);
                    toRenderRef = undefined;
                }
            },
        }),
        update: (entity: Entity<SpriteRenderState>) => {
            const sprite = getSpriteFromState(entity);
            entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.updateItem(toRenderRef, sprite);
        },
    };
};
```

When an entity is created with this component, it registers itself with the `SpriteRenderService`, updates the values for the sprite every frame, then frees the sprite when the entity is deleted. This registration and batch processing system is faster than rendering the sprites separately inside the entity class or in a component. This pattern is also used for Physics.


