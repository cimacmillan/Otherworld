import { GameItem } from "../../../resources/manifests/Items"

export type ItemDropDistribution = {
    [key in GameItem]?: [number, number]
}

export const ITEM_DROPS_NONE: ItemDropDistribution = {

}


export const ITEM_DROP_MAP: Record<string, ItemDropDistribution> = {
    ["npc_bulky_man"]: {
        [GameItem.GOLD_COIN]: [1, 5]
    }
}