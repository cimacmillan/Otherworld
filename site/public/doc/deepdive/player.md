The player receives a walk command from the input service. Depending on the angle the player is in, and it's speed, it moves its position. Turning the player is performed by keeping track of its angle. When turning right, the angle is increased (vice versa). To make this movement visible to the user, the player has a `Camera`. This camera can then be fetched by the various services that need it. For instance, the render service uses the camera to adjust the WebGL view matrices:

```ts
private calculateCameraMatrices() {
    const {
        position,
        angle,
        height,
        fov,
        aspectRatio,
        zNear,
        zFar,
    } = this.camera();

    const fieldOfView = (fov * Math.PI) / 180; // in radians
    const projectionMatrix = mat4.create();
    const modelViewMatrix = mat4.create();

    mat4.perspective(
        projectionMatrix,
        fieldOfView,
        aspectRatio,
        zNear,
        zFar
    );

    mat4.rotateY(modelViewMatrix, modelViewMatrix, angle);

    mat4.translate(modelViewMatrix, modelViewMatrix, [
        -position.x,
        -height,
        -position.y,
    ]);

    return { modelViewMatrix, projectionMatrix };
}
```

The player uses the same collision system as entities in the game, causing it to bump into entities and walls. This is achieved by keeping the physics service generic so that it doesn't depend on it's consumers being entities. When the player is created, it registers itself with the physics service, similar to the entities `PhysicsComponent`

```
this.physicsRegistration = {
    collidesEntities: true,
    collidesWalls: true,
    setHeight: (height: number) => (this.state.surface.height = height),
    setHeightVelocity: (heightVelocity: number) =>
        (this.state.surface.heightVelocity = heightVelocity),
    setVelocity: (x: number, y: number) =>
        (this.state.surface.velocity = { x, y }),
    setPosition: (x: number, y: number) => {
        this.state.surface.position = { x, y };
    },
    getPhysicsInformation: () => this.state.surface,
}
```

The player can interact with entities in the game, with actions like opening chests and attacking creatures. To handle this, an `InteractionService` is used. Entities can register an available interaction with it to this service, which the player can then use to fetch all the available interact-able entities:

```
public interact() {
    const interacts = this.serviceLocator
        .getInteractionService()
        .getInteractables(
            InteractionType.INTERACT,
            state.position,
            state.angle,
            1.5
        );
    interacts.forEach((ent) => {
        ent.onInteract &&
            ent.onInteract({
                type: InteractionSourceType.PLAYER,
                player: this
            });
    });
}
```

Attacking works in the same way but with a different `InteractionType`. 