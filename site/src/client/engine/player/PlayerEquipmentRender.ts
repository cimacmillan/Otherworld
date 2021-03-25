import { vec3 } from "gl-matrix";
import { GameItems } from "../../resources/manifests/Items";
import { SpriteSheets } from "../../resources/manifests/Sprites";
import { SpriteSheet } from "../../resources/SpriteSheet";
import { ColourMap } from "../../services/render/util/ReferenceMap";
import { VoxelGroupData, VoxelGroup3D } from "../../services/render/util/VoxelGroup3D";
import { getVoxelGroupFromSprite } from "../../services/render/util/VoxelGroupGenerator";
import { ServiceLocator } from "../../services/ServiceLocator";
import { map3D, create3DArray, randomIntRange, forEach3D, toRadians } from "../../util/math";
import { EquipableItem, EquipmentType } from "../scripting/items/ItemTypes";

const PLAYER_WEAPON_SPRITE_ANGLE = toRadians(45);
const PLAYER_WEAPON_ARM_ANGLE = toRadians(30);
const PLAYER_WEAPON_ARM_TILT_ANGLE = toRadians(90);
// const PLAYER_WEAPON_ANGLE = 0;
const PLAYER_WEAPON_DISTANCE = 1;
const PLAYER_WEAPON_HEIGHT = 0.4;
const PLAYER_WEAPON_SIZE = 0.08;
const PLAYER_WEAPON_MOVE_TWEEN = 0.5;

export class PlayerEquipmentRender {
    private weaponVoxelGroup?: VoxelGroup3D;
    private targetPosition = vec3.create();
    private actualPosition?: vec3 = undefined;

    constructor(
        private serviceLocator: ServiceLocator,
        private getPlayerPosition: () => vec3,
        private getPlayerAngle: () => number,
        ) {}

    public init() {
        const existingWeapon = this.serviceLocator.getScriptingService().getPlayer().getInventory().equipped[EquipmentType.WEAPON];
        if (existingWeapon) {
            this.setWeapon(existingWeapon);
        }
    }

    public update() {
        if (this.weaponVoxelGroup) {
            const playerPosition = this.getPlayerPosition();
            const playerAngle = this.getPlayerAngle();

            const diff: vec3 = [
                PLAYER_WEAPON_DISTANCE * Math.sin(PLAYER_WEAPON_ARM_ANGLE + playerAngle),
                PLAYER_WEAPON_HEIGHT,
                -PLAYER_WEAPON_DISTANCE * Math.cos(PLAYER_WEAPON_ARM_ANGLE + playerAngle)
            ];

            vec3.add(this.targetPosition, playerPosition, diff);

            if (!this.actualPosition) {
                this.actualPosition = vec3.create();
                vec3.copy(this.actualPosition, this.targetPosition);
            }

            const positionDiff = vec3.sub(vec3.create(), this.targetPosition, this.actualPosition);
            const positionDiffScalar = vec3.scale(positionDiff, positionDiff, PLAYER_WEAPON_MOVE_TWEEN);
            vec3.add(this.actualPosition, this.actualPosition, positionDiffScalar);

            this.weaponVoxelGroup.setPosition(this.actualPosition);
            this.weaponVoxelGroup.setAngle([0, - PLAYER_WEAPON_ARM_TILT_ANGLE - playerAngle, PLAYER_WEAPON_SPRITE_ANGLE]);
        }
    }

    public onEquip(item: EquipableItem) {
        if (item.equipmentType === EquipmentType.WEAPON) {
            this.setWeapon(item);
        }
    }

    public onUnequip(item: EquipableItem) {
        if (item.equipmentType === EquipmentType.WEAPON) {
            this.destroy();
        }
    }

    public destroy() {
        if (this.weaponVoxelGroup) {
            this.weaponVoxelGroup.destroy();
            this.actualPosition = undefined;
        }
    }

    private setWeapon(weapon: EquipableItem) {
        const { spriteIcon } = weapon;
        const sizePerVoxel = PLAYER_WEAPON_SIZE;
        this.weaponVoxelGroup = getVoxelGroupFromSprite(this.serviceLocator, spriteIcon, sizePerVoxel);
        const [width, height, depth] = this.weaponVoxelGroup.getDimensions();
        this.weaponVoxelGroup.setCenter([width * sizePerVoxel / 2, height * sizePerVoxel / 2, depth * sizePerVoxel / 2]);
        this.weaponVoxelGroup.attach();

        // Update once so that the position is set when equipping on paused menu
        this.update();
    }

}
