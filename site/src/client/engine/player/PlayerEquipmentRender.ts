import { vec3 } from "gl-matrix";
import { GameItems } from "../../resources/manifests/Items";
import { SpriteSheets } from "../../resources/manifests/Sprites";
import { SpriteSheet } from "../../resources/SpriteSheet";
import { ColourMap } from "../../services/render/util/ReferenceMap";
import { VoxelGroupData, VoxelGroup3D } from "../../services/render/util/VoxelGroup3D";
import { getVoxelGroupFromSprite } from "../../services/render/util/VoxelGroupGenerator";
import { ServiceLocator } from "../../services/ServiceLocator";
import { map3D, create3DArray, randomIntRange, forEach3D } from "../../util/math";
import { EquipableItem } from "../scripting/items/ItemTypes";

export class PlayerEquipmentRender {

    private weaponVoxelGroup?: VoxelGroup3D;

    constructor(private serviceLocator: ServiceLocator) {
        this.setWeapon(GameItems.WEAPON_WOOD_STICK as EquipableItem);
    }

    public onEquip(item: EquipableItem) {
       
    }

    public onUnequip(item: EquipableItem) {

    }

    private setWeapon(weapon: EquipableItem) {
        const weaponColourMap = new ColourMap();
        const { spriteIcon } = weapon;

        const sizePerVoxel = 0.02;
        const voxelGroup = getVoxelGroupFromSprite(this.serviceLocator, spriteIcon, sizePerVoxel);
        const [width, height, depth] = voxelGroup.getDimensions();

        const x = 379.50 / 20;
        const y = (671.84 / 20) - 2;
        const h = 0.5;

        voxelGroup.setPosition([x, h, y]);
        voxelGroup.setCenter([width * sizePerVoxel / 2, height * sizePerVoxel / 2, depth * sizePerVoxel / 2]);
        voxelGroup.attach();
        let rads = 0;
        setInterval(() => {
            rads += 0.01;
            voxelGroup.setAngle([rads, rads, rads]);
        }, 10);
    }

}
