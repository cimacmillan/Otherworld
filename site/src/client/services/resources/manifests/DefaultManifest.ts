import { ResourceManifest } from "../Types";

export enum Animations {
    CRABLET_BROWN = "CRABLET_BROWN",
    CRABLET_GREEN = "CRABLET_GREEN",
    CRABLET_BLUE = "CRABLET_BLUE",
    CRABLET_BROWN_ATTACK = "CRABLET_BROWN_ATTACK",
    CRABLET_GREEN_ATTACK = "CRABLET_GREEN_ATTACK",
    CRABLET_BLUE_ATTACK = "CRABLET_BLUE_ATTACK",
}

export enum Sprites {
    SWORD = "SWORD",
    MACATOR_DAMAGED = "MACATOR_DAMAGED",
    MACATOR_DEAD_BROWN = "MACATOR_DEAD_BROWN",
    MACATOR_DEAD_GREEN = "MACATOR_DEAD_GREEN",
    MACATOR_DEAD_BLUE = "MACATOR_DEAD_BLUE",
}

const defaultManifest: ResourceManifest = {
    spritesheets: {
        sprite: {
            url: "img/sprite.png",
            animations: {
                [Animations.CRABLET_BROWN]: {
                    width: 16,
                    height: 16,
                    x: 0,
                    y: 64,
                    frames: 8
                },
                [Animations.CRABLET_GREEN]: {
                    width: 16,
                    height: 16,
                    x: 0,
                    y: 80,
                    frames: 8
                },
                [Animations.CRABLET_BLUE]: {
                    width: 16,
                    height: 16,
                    x: 0,
                    y: 96,
                    frames: 8
                },
                [Animations.CRABLET_BROWN_ATTACK]: {
                    width: 16,
                    height: 16,
                    x: 128,
                    y: 64,
                    frames: 8
                },
                [Animations.CRABLET_GREEN_ATTACK]: {
                    width: 16,
                    height: 16,
                    x: 128,
                    y: 80,
                    frames: 8
                },
                [Animations.CRABLET_BLUE_ATTACK]: {
                    width: 16,
                    height: 16,
                    x: 128,
                    y: 96,
                    frames: 8
                }
            },
            sprites: {
                this.sprite.registerSprite(Sprites.SWORD, 16, 32, 128, 32);
                this.sprite.registerSprite(Sprites.MACATOR_DAMAGED, 16, 16, 0, 112);
                this.sprite.registerSprite(Sprites.MACATOR_DEAD_BROWN, 16, 16, 16, 112);
                this.sprite.registerSprite(Sprites.MACATOR_DEAD_GREEN, 16, 16, 32, 112);
                this.sprite.registerSprite(Sprites.MACATOR_DEAD_BLUE, 16, 16, 48, 112);
        
            },
        }
    },
    audio: {
        this.intro = await loadSound("audio/intro.mp3", audio);
        this.boing = await loadSound("audio/boing.mp3", audio);
        this.point = await loadSound("audio/point.mp3", audio);
        this.slam = await loadSound("audio/slam.mp3", audio);
        this.whoosh = await loadSound("audio/whoosh.mp3", audio);
        this.playerHit = await loadSound("audio/player_hit.mp3", audio);
        this.end = await loadSound("audio/end.mp3", audio);
        this.hiss = await loadSound("audio/hiss.mp3", audio);

    }
}