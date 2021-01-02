In this example, we can have a game event system which is typed like so:

```js
interface GameEvent {
    type: string;
    payload: any;
}

function emit(event: GameEvent) {
    ...
}

function onEvent(event: GameEvent) {    
    ...
}
```

This is an alright start but prone to error. Firstly, we could make a mispelling of our type string when emitting or listening to an event. This could cause events to be missed by the listeners. Secondly, with an untyped payload, we could make mistakes with constructing the data that the listener requires.

```js
//Spot the bugs

emit({
    type: "PlayerDamage",
    payload: 10
});

function onEvent(event: GameEvent) {
    switch (event.type) {
        case "PlayerDamaged":
            uiService.updateHealth(event.payload.health);
            break;
    }
}
```

Strongly typing the `GameEvent` is necessary to avoiding these simple mistakes long-term. It also makes it much easier to find information about the event with an editor with definition viewing capabilities. We can start by changing the game event type to an enum of set values. This prevents us from making mispellings.

```js
enum GameEventType {
    PlayerDamaged,
    EnemyDamaged
}

interface GameEvent {
    type: GameEventType;
}

emit({
    type: GameEventType.PlayerDamaged
})

function onEvent(event: GameEvent) {
    switch (event.type) {
        case GameEventType.PlayerDamaged:
            ...
        case GameEventType.EnemyDamaged:
            ...
    }
}
```

Typing the payload becomes a bit more complex. With `Typescript` we could introduce a set of accepted types to the payload, but this doesn't work as we could pass a correctly structured payload to the wrong event type.

```js
interface GameEvent {
    type: GameEventType;
    payload: PlayerDamagedPayload | EnemyDamagedPayload;
}

// Compiles but not correct
emit({
    type: GameEventType.PlayerDamaged,
    payload: {
        enemyHealth: 10
    }
});

// Compiles and correct
emit({
    type: GameEventType.PlayerDamaged,
    payload: {
        playerHealth: 10
    }
});
```

Although introducing some boilerplate, we can fix this by making `GameEvent` a union type of seperate interfaces. This provides us with the most safety.

```js
interface PlayerDamagedPayload {
    playerHealth: number;
}

interface EnemyDamagedPayload {
    enemyHealth: number;
}

interface PlayerDamagedEvent {
    type: GameEventType.PlayerDamaged;
    payload: PlayerDamagedPayload;
}

interface EnemyDamagedEvent {
    type: GameEventType.EnemyDamaged;
    payload: EnemyDamagedPayload;
}

type GameEvent = PlayerDamagedEvent | EnemyDamagedEvent;

// Compiles
emit({
    type: GameEventType.PlayerDamaged,
    payload: {
        playerHealth: 10
    }
});

// Does not compile
emit({
    type: GameEventType.PlayerDamaged,
    payload: {
        enemyHealth: 10
    }
})
```

Otherworld uses this system to define many different kinds of events.

```js
//Events.ts
export type GameEvent =
    | GameIntialised
    | EntityEvents
    | BallEvents
    | TravelEvents
    | PhysicsEvents
    | InteractionEvents
    | PlayerEvents
    | EnemyEvents;

//PlayerEvents.ts
export type PlayerEvents =
    | PlayerAttack
    | PlayerDamaged
    | PlayerKilled
    | PlayerInfoChange
    | PlayerItemDropCollected
    | PlayerInventoryOpened
    | PlayerInventoryClosed;
```
