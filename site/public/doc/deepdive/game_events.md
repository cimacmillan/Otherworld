Game events are the way many of Otherworld's subsystems communicate. They represent something happening, and allow different parts of the game to respond to things happening in the game. Game events are a great way to manage side effects. When the player is hurt health is reduced, audio is played and interface updated:

```js
class Player {
    onDamage: (amount: number) => {
        this.health -= amount;
        audioService.playSound(Sounds.playerHurt);
        uiService.updateHealth(this.health);
    }
}

class Enemy {
    onDamage: (amount: number) => {
        this.health -= amount;
        audioService.playSound(Sounds.enemyHurt);
        uiService.updateEntityHealth(this.id, this.health);
    }
}
```

It becomes difficult to maintain these from within these classes. If we wanted to start updating health a different way or playing different sounds when the entities are hurt; we would have to traverse all the usages, updating each one. This is time consuming and not easy to change. 

Instead of managing side effects, we can emit `events`. The `Player` and `Enemy` classes can then focus on what happens within their classes. 

```js
interface Damaged {
    type: string;
    amount: number;
    health: number;
}

class Player {
    onDamage: (amount: number) => {
        this.health -= amount;
        emit({
            type: "PlayerDamaged",
            amount,
            health: this.health
        });
    }
}

class Enemy {
    onDamage: (amount: number) => {
        this.health -= amount;
        emit({
            type: "EnemyDamaged",
            amount,
            health: this.health
        });
    }
}
```

Different game subsystems can then respond to these events in their own classes. Updating any subsystems interface with side effects is  straightforward, where adjustments occur in a single place and no changes to `Player` or `Enemy` need to be made.

```js
class AudioService {
    onEvent(event: Damaged) {
        switch (event.type) {
            case "PlayerDamaged":
                this.playSound(Sounds.playerHurt);
                break;
            case "EnemyDamaged":
                this.playSound(Sounds.enemyHurt);
                break;
        }
    }
}

class UIService {
    onEvent(event: Damaged) {
        switch (event.type) {
            case "PlayerDamaged":
                this.updateHealth(event.health);
                break;
            case "EnemyDamaged":
                this.updateEntityHealth(event.health);
                break;
        }
    }
}
```

Otherworld used this pattern at the beginning of development. In TypeScript, a GameEvent object would contain a type and a payload. The type can then be read using a switch case to extract the payload type:

```ts
enum GameEventType {
    PlayerDamaged,
    EnemyDamaged
}

interface PlayerDamagedEvent {
    type: GameEventType.PlayerDamaged;
    payload: {
        playerHealth: number;
    }
}

interface EnemyDamagedEvent {
    type: GameEventType.EnemyDamaged;
     payload: {
        enemyHealth: number;
    }
}

type GameEvent = PlayerDamagedEvent | EnemyDamagedEvent;


class Player {
    update(){
        if (wasDamaged) {
            emit({
                type: GameEventType.PlayerDamaged,
                payload: {
                    playerHealth: this.health
                }
            })
        }
    }
}

function onEvent(event: GameEvent) {    
    switch (event.type) {
        case GameEventType.PlayerDamaged:
            const health = event.payload.playerHealth;
            break;
    }
}
```

This became cumbersome because to define a new event required a new enum entry, a new interface for the event payload and to add the event to the union type. A faster way of defining events is by using function definitions. This is a sample of the function based event system used in Otherworld:

```ts
interface Events {
    onPlayerItemDropCollected: (item: Item) => void,
    onPlayerItemUsed: (item: Item) => void,
    onPlayerHealed: (amount: number) => void,
    onPlayerInventoryOpened: () => void,
    ...
}
```

In this method, the name of the function corresponds to its event type and the parameters correspond to its payload. The game uses the `FunctionEventSubscriber` utility, defined in Refunc, to emit and react to events.

```ts
const emptyEvents = {
    onPlayerItemDropCollected: (item: Item) => {},
    onPlayerItemUsed: (item: Item) => {},
    onPlayerHealed: (amount: number) => {},
    onPlayerInventoryOpened: () => {},
    ...
}

type Events = typeof emptyEvents;

const functionEvents = new FunctionEventSubscriber(emptyEvents);

functionEvents.subscribe({
    onPlayerItemUsed: (item: Item) => {
        console.log("Item was used!");
    }
});

functionEvents.subscribe({
    onPlayerItemUsed: (item: Item) => {
        console.log("Item was used 2!");
    }
});

functionEvents.actions().onPlayerItemUsed(...)

// Item was used!
// Item was used 2!
```

This is why entity components have a `getActions` function. This function provides an entity, and requests a handler for various game events. The handler can then mutate the entities state or communicate with other game systems (like rendering) depending on the action. For instance, here's a component that plays an audio when an entity is created:

```ts
const ComponentThatPlaysAudioOnCreate = (audio) => ({
    getActions: (entity: Entity<...>) => ({
        onEntityCreated: () => entity.getServiceLocator().getAudioService().play(audio)
    })
})

const entity = new Entity(state, ComponentThatPlaysAudioOnCreate(audio));
```


