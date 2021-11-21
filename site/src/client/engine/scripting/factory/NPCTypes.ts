
export interface NPCType {
    health: number;
    itemDropId: string;

    spriteIdle: string;
    spriteDead: string;
    spriteAttack: string[];
    spriteRun: string;

    spriteWidth: number;
    spriteHeight: number;

    moveVibration?: {
        amount: number;
    },
    boss?: boolean;
    damage: number;
    speed: number;
}

export const NPCTypes: Record<string, NPCType> = {
    ["boss"]: {
        health: 2000,
        spriteIdle: "blob",
        spriteDead: "blob_dead",
        spriteAttack: ["blob_attack"],
        spriteRun: "sprite_run",
        spriteWidth: 2,
        spriteHeight: 2,
        itemDropId: "npc_bulky_man",
        boss: true,
        damage: 10,
        speed: 1
    },
    ["jailor"]: {
        health: 5,
        itemDropId: "npc_bulky_man",
        spriteIdle: "npc_bulky_man",
        spriteDead: "dead_man",
        spriteAttack: ["npc_bulky_man_hit", "npc_bulky_man_hit2"],
        spriteRun: "npc_bulky_man_run",
        spriteWidth: 1,
        spriteHeight: 1,
        moveVibration: {
            amount: 0.3
        },
        damage: 1,
        speed: 1
    },
    ["slime"]: {
        health: 1,
        spriteIdle: "blob",
        spriteDead: "blob_dead",
        spriteAttack: ["blob_attack"],
        spriteRun: "sprite_run",
        spriteWidth: 0.4,
        spriteHeight: 0.4,
        itemDropId: "npc_bulky_man",
        damage: 1,
        speed: 1
    }
}
