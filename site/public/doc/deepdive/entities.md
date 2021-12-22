Entities in Otherworld are groups of components that act upon a shared state. Components can be added to entities to add more complex behaviour:

```
const entity = new Entity(
    state,
    new RenderComponent(),
    new PhysicsComponent(),
    ...
)
```

Each component can update the entities state or communicate with other components. For instance, an entity that should move after being hit can have a component that recognises hits and them updates the state so that the physics component will move the entity. How does this work?

```
export class Entity<State> {
    private components: Array<EntityComponent<Partial<State>>>;

    constructor(
        private state: State,
        ...components: Array<EntityComponent<Partial<State>>>
    ) {
        this.components = components;
    }

    public update() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update && this.components[i].update(this);
        }
    }
}
```

Each individual component can then update its parent entity's state when updating:

```
interface PhysicsState {
    velocity: ...
}

export const PhysicsComponent = (): EntityComponent<PhysicsState> => {
    return {
        update: (entity: Entity<PhysicsState>) => {
            entity.setState({ velocity: {...}})
        }
    };
};
```

Notice here that the physics component only acts upon the physics state. An entity like an NPC has many state attributes like health, but the physics component of that entity should only care about attributes like the velocity. This means the overall entity's state is a union of all of its component's states:

```
const npc = new Entity<
    PhysicsState |
    RenderState | 
    HealthState | 
    ...
>(
    new PhysicsComponent(),
    new RenderComponent(),
    new HealthComponent(),
    ...
)
```

This also allows components to read or set values in state that other components act on. For example, the physics component controls the velocity but we want a component that changes the entity's colour depending on its speed:

```
interface State extends PhysicsState {
    colour: ...
}
const entity = new Entity<State>(
    new PhysicsComponent(),
    {
        update: (entity: Entity<State>) => {
            const { velocity } = entity.getState();
            entity.setState({
                colour: Math.magnitude(velocity)
            })
        }
    }
    ...
)
```

Components can also receive and act on events from the outside world. For instance, if you wanted to create an npc that is damaged by explosive mines in an area, you could create a component that receives that event and one that emits it:

```
const npc = new Entity<NPCState>(
    {
        getActions: (entity: Entity<NPCState>) => ({
            onExplosion: (damage: number) => {
                const { health } = entity.getState();
                entity.setState({
                    health: health - damage
                })
            }
        })
    }
    ...
)

const mine = new Entity<MineState>(
     {
        update: (entity: Entity<MineState>) => ({
            if (entity.timeLeft <= 0) {
                world.forEachEntity((otherEntity) => otherEntity.getActions().onExplosion(100))
            }
        })
    }
) 
```
