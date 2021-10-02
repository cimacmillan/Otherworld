import { GameItem } from "../../../resources/manifests/Items"

export type ItemDropDistribution = [GameItem, number | [number, number], number][]

export const ITEM_DROPS_NONE: ItemDropDistribution = [];

export const ITEM_DROP_MAP: Record<string, ItemDropDistribution> = {
    ["npc_bulky_man"]: [
        [GameItem.GOLD_COIN, [0, 0.1], 5],
        [GameItem.GOLD_COIN, [0.1, 0.2], 4],
        [GameItem.GOLD_COIN, [0.2, 0.3], 3],
        [GameItem.GOLD_COIN, [0.3, 0.4], 2],
        [GameItem.GOLD_COIN, [0.4, 1], 1],
    ]
}