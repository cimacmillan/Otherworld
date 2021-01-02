
Game events are the way many of Otherworld's subsystems communicate. They represent `something` happening, and allow different parts of the game to respond to things happening in the game. Game events are a great way to manage `side effects`. When the player is hurt health is reduced, audio is played and interface updated. Side effects can also be triggered by enemies. 

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

Different game subsystems can then respond to these events in their own classes.

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

Updating any subsystems interface with side effects is incredibly straightforward, where adjustments occur in a single place and no changes to `Player` or `Enemy` need to be made.
