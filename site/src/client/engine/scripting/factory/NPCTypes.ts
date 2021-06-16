
export interface NPCType {
    health: number;
    itemDropId: string;

    spriteIdle: string;
    spriteDead: string;
    spriteAttack: string[];
    spriteRun: string;
}

export const NPCTypes: Record<string, NPCType> = {
    ["jailor"]: {
        health: 2,
        itemDropId: "npc_bulky_man",
        spriteIdle: "npc_bulky_man",
        spriteDead: "dead_man",
        spriteAttack: ["npc_bulky_man_hit", "npc_bulky_man_hit2"],
        spriteRun: "npc_bulky_man_run",
    },
    ["slime"]: {
        health: 1,
        spriteIdle: "blob",
        spriteDead: "blob_dead",
        spriteAttack: ["blob_attack"],
        spriteRun: "sprite_run",

        itemDropId: "npc_bulky_man",
    }
}
