Chests can't be attacked, but can be opened. NPCs can't be opened, but can be attacked. Entity components decide what interaction type they respond to. This is done using the `InteractionService`. Similar to Physics and Rendering, entities and the player can register itself with the interaction service to be able to locate interact-able entities. 

```ts
export interface InteractionRegistration {
    onInteract?: (source: InteractionSource) => void;
    getPosition: () => SurfacePosition;
    source: InteractionSource;
}

export enum InteractionType {
    ATTACK = "ATTACK",
    BARTER = "BARTER",
    INTERACT = "INTERACT",
}

class InteractionService {
    ...
    public registerEntity(entity: InteractionEntity, type: InteractionType) {
        this.interactionMap[type].add(entity);
    }
}
```

Then when the player wants to attack, it can locate all the attack interact-ables in the vicinity. The entities can then have events emitted into them for them to respond to like `onDamaged`. All that is needed is that an entity register itself in the interaction service when created. This is done using compound components, which are simpler components built up with layers of more complicated ones:

```ts
return new Entity<NPCState>(
        CanBeInteractedWith(InteractionType.ATTACK),
        ...
)

export const CanBeInteractedWith = <T extends InteractionStateType>(
    type: InteractionType,
): EntityComponent<InteractionStateType> => {
    return registersSelf(type, (entity: Entity<T>) => ({
        onInteract: (source: InteractionSource) => {},
        getPosition: () => entity.getState(),
        source: {
            type: InteractionSourceType.ENTITY,
            entity,
        },
    }));
};

const registersSelf = (
    type: InteractionType,
    registration: (entity: Entity<SurfacePosition>) => InteractionRegistration
): EntityComponent<SurfacePosition> => {
    let reg: InteractionRegistration | undefined;
    return {
        getActions: (entity: Entity<SurfacePosition>) => ({
            onEntityCreated: () => {
                reg = registration(entity);
                entity
                    .getServiceLocator()
                    .getInteractionService()
                    .registerEntity(reg, type);
            },
            ...
        }),
    };
};
```

Compound components are very useful of reusing and encapsulating complex behaviors. For instance, with the Chest entity that provides the player a reward, a key hint is shown when it can be interacted with. The Chest does this using a compound component `onCanBeInteractedWithByPlayer`, that is made from other interaction service components:

```ts
onCanBeInteractedWithByPlayer(
    InteractionType.INTERACT,
    () => {
        interactHintId = RegisterKeyHint(serviceLocator)({
            code: ["E"],
            hint: "Open Chest",
        });
    },
    () => {
        if (interactHintId !== undefined) {
            DeregisterKeyHint(serviceLocator)(interactHintId);
        }
    }
),
```

