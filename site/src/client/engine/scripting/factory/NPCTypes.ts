
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
    }
}

export const NPCTypes: Record<string, NPCType> = {
    ["jailor"]: {
        health: 2,
        itemDropId: "npc_bulky_man",
        spriteIdle: "npc_bulky_man",
        spriteDead: "dead_man",
        spriteAttack: ["npc_bulky_man_hit", "npc_bulky_man_hit2"],
        spriteRun: "npc_bulky_man_run",
        spriteWidth: 1,
        spriteHeight: 1,
        moveVibration: {
            amount: 0.3
        }
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
    }
}
