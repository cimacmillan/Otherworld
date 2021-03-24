import { vec3 } from "gl-matrix";
import { GameItems } from "../../resources/manifests/Items";
import { SpriteSheets } from "../../resources/manifests/Sprites";
import { SpriteSheet } from "../../resources/SpriteSheet";
import { ColourMap } from "../../services/render/util/ReferenceMap";
import { VoxelGroupData, VoxelGroup3D } from "../../services/render/util/VoxelGroup3D";
import { getVoxelGroupFromSprite } from "../../services/render/util/VoxelGroupGenerator";
import { ServiceLocator } from "../../services/ServiceLocator";
import { map3D, create3DArray, randomIntRange, forEach3D } from "../../util/math";
import { EquipableItem, EquipmentType } from "../scripting/items/ItemTypes";

export class PlayerEquipmentRender {

    private weaponVoxelGroup?: VoxelGroup3D;

    constructor(
        private serviceLocator: ServiceLocator,
        ) {}

    public init() {
        const existingWeapon = this.serviceLocator.getScriptingService().getPlayer().getInventory().equipped[EquipmentType.WEAPON];
        if (existingWeapon) {
            this.setWeapon(existingWeapon);
        }
    }

    public update() {
        
    }

    public onEquip(item: EquipableItem) {
       this.setWeapon(item);
    }

    public onUnequip(item: EquipableItem) {
        this.destroy();
    }

    public destroy() {
        if (this.weaponVoxelGroup) {
            this.weaponVoxelGroup.destroy();
        }
    }

    private setWeapon(weapon: EquipableItem) {
        const { spriteIcon } = weapon;
        const sizePerVoxel = 0.02;
        this.weaponVoxelGroup = getVoxelGroupFromSprite(this.serviceLocator, spriteIcon, sizePerVoxel);
        const [width, height, depth] = this.weaponVoxelGroup.getDimensions();

        const x = 379.50 / 20;
        const y = (671.84 / 20) - 2;
        const h = 0.5;

        this.weaponVoxelGroup.setPosition([x, h, y]);
        this.weaponVoxelGroup.setCenter([width * sizePerVoxel / 2, height * sizePerVoxel / 2, depth * sizePerVoxel / 2]);
        this.weaponVoxelGroup.attach();
    }

}
