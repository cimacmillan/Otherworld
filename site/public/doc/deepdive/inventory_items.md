There are only two item types in Otherworld, `EquipableItem` and `ConsumableItem`. Items like food and potions are consumables, whereas swords are equipables. I wanted to keep the item behaviours open-ended, like a food that can hurt or heal the player, or cause some other custom behaviour. The behaviour is defined by the item effect. Depending on the item type, the effects are triggered by consuming from inventory, equipping 

```ts
export interface ConsumableItem extends BaseItem {
    type: ItemType.CONSUMABLE;
    onConsume?: Effect[];
}

export interface EquipableItem extends BaseItem {
    type: ItemType.EQUIPMENT;
    onAttack?: Effect[];
    onEquip?: Effect[];
    onUnEquip?: Effect[];
    equipmentType: EquipmentType;
    stackable: false;
}

export type Item = EquipableItem | ConsumableItem;
```

Item type and lists

item effects

Item weapon

inventory

effect heals player


