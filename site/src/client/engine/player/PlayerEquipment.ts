import { vec2, vec3 } from "gl-matrix";
import { GameItems } from "../../resources/manifests/Items";
import { SpriteSheets } from "../../resources/manifests/Sprites";
import { SpriteSheet } from "../../resources/SpriteSheet";
import { InteractionSourceType, InteractionType } from "../../services/interaction/InteractionType";
import { ColourMap } from "../../services/render/util/ReferenceMap";
import { VoxelGroupData, VoxelGroup3D } from "../../services/render/util/VoxelGroup3D";
import { getVoxelGroupFromSprite } from "../../services/render/util/VoxelGroupGenerator";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Vector2D } from "../../types";
import { animation } from "../../util/animation/Animations";
import { map3D, create3DArray, randomIntRange, forEach3D, toRadians } from "../../util/math";
import { ActionDelay } from "../../util/time/ActionDelay";
import { setFPSProportion } from "../../util/time/GlobalFPSController";
import { EffectContext, getEffect } from "../scripting/effects/Effects";
import { EquipableItem, EquipmentType } from "../scripting/items/ItemTypes";
import { Player } from "./Player";

const PLAYER_WEAPON_SPRITE_ANGLE = toRadians(45);
const PLAYER_WEAPON_ARM_ANGLE = toRadians(30);
const PLAYER_WEAPON_ARM_TILT_ANGLE = toRadians(90);
// const PLAYER_WEAPON_ANGLE = 0;
const PLAYER_WEAPON_DISTANCE = 1;
const PLAYER_WEAPON_HEIGHT = 0.4;
const PLAYER_WEAPON_SIZE = 0.08;
const PLAYER_WEAPON_MOVE_TWEEN = 0.5;
const PLAYER_ATTACK_SPEED = 300;
const PLAYER_BREATH_FREQUENCY = 0.01;
const PLAYER_BREATH_MAGNITUDE = 0.03;

const createWeaponAnimation = (
    setSwing: (x: number) => void,
    setPosition: (v: vec2) => void
) => {
    const angleArc = toRadians(90);
    const drop = -0.5;
    const push = 1;
    return animation((x: number) => {
        const tween = (1 - x*x);
        setSwing(tween * angleArc);
        setPosition([tween * push, tween * drop])
    }).whenDone(() => {
        setSwing(0);
        setPosition([0, 0]);
    }).speed(PLAYER_ATTACK_SPEED);
}

export class PlayerEquipment {

    private weapon?: [VoxelGroup3D, EquipableItem];
    private targetPosition = vec3.create();
    private actualPosition?: vec3 = undefined;
    private attackDelay: ActionDelay = new ActionDelay(PLAYER_ATTACK_SPEED);
    private swingOffset = 0;
    private swingPosOffset: vec2 = [0, 0];
    private weaponAnimation = createWeaponAnimation(
        x => this.setWeaponAnimationSwingOffset(x),
        v => this.setWeaponAnimationSwingPosOffset(v)
    );
    private breath = 0;

    constructor(
        private serviceLocator: ServiceLocator,
        private getPlayer: () => Player,
        private getPlayerPosition: () => vec3,
        private getPlayerAngle: () => number,
        ) {}

    public init() {
        const existingWeapon = this.serviceLocator.getScriptingService().getPlayer().getInventory().equipped[EquipmentType.WEAPON];
        if (existingWeapon) {
            this.setWeapon(existingWeapon);
        }
        // this.setWeapon(GameItems.WEAPON_WOOD_STICK as EquipableItem);
    }

    public update() {
        if (this.weapon) {
            this.breath += PLAYER_BREATH_FREQUENCY;
            const playerPosition = this.getPlayerPosition();
            const playerAngle = this.getPlayerAngle();
            const breathOffset = (Math.sin(this.breath) + 1) * PLAYER_BREATH_MAGNITUDE; 

            const diff: vec3 = [
                (PLAYER_WEAPON_DISTANCE) * Math.sin(PLAYER_WEAPON_ARM_ANGLE + playerAngle) + (this.swingPosOffset[0] * Math.sin(playerAngle)),
                PLAYER_WEAPON_HEIGHT + this.swingPosOffset[1] + breathOffset,
                -(PLAYER_WEAPON_DISTANCE) * Math.cos(PLAYER_WEAPON_ARM_ANGLE + playerAngle) + (-this.swingPosOffset[0] * Math.cos(playerAngle))
            ];

            vec3.add(this.targetPosition, playerPosition, diff);

            if (!this.actualPosition) {
                this.actualPosition = vec3.create();
                vec3.copy(this.actualPosition, this.targetPosition);
            }

            const positionDiff = vec3.sub(vec3.create(), this.targetPosition, this.actualPosition);
            const positionDiffScalar = vec3.scale(positionDiff, positionDiff, PLAYER_WEAPON_MOVE_TWEEN);
            vec3.add(this.actualPosition, this.actualPosition, positionDiffScalar);

            const xSwingOffset = -Math.cos(playerAngle) * this.swingOffset;
            // Why Math.abs??
            const zSwingOffset = Math.abs(Math.sin(playerAngle) * this.swingOffset); 

            this.weapon[0].setPosition(this.actualPosition);
            this.weapon[0].setAngle([xSwingOffset, - PLAYER_WEAPON_ARM_TILT_ANGLE - playerAngle, PLAYER_WEAPON_SPRITE_ANGLE + zSwingOffset]);
        }
        this.weaponAnimation.tick();
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
        if (this.weapon) {
            this.weapon[0].destroy();
            this.actualPosition = undefined;
        }
    }

    public attack() {
        if (this.weapon && this.attackDelay.canAction()) {
            this.attackDelay.onAction();
            this.weaponAnimation.stop();
            this.weaponAnimation.start();
            const effectContext: EffectContext = {
                type: "PLAYER",
                player: this.getPlayer(),
                serviceLocator: this.serviceLocator
            };
            const equipment = Object.entries(this.getPlayer().getInventory().equipped);
            equipment.forEach(([key, value]) => {
                const onAttack = (value && value.onAttack) || [];
                onAttack.map(getEffect).forEach((effect) => {
                    effect.onTrigger(effectContext);
                })
            })
        }
    }

    private setWeaponAnimationSwingOffset = (x: number) => {
        this.swingOffset = x;
    }

    private setWeaponAnimationSwingPosOffset = (v: vec2) => {
        this.swingPosOffset = v;
    }

    private setWeapon(weapon: EquipableItem) {
        const { spriteIcon } = weapon;
        const sizePerVoxel = PLAYER_WEAPON_SIZE;
        this.weapon = [getVoxelGroupFromSprite(this.serviceLocator, spriteIcon, sizePerVoxel), weapon];
        const [width, height, depth] = this.weapon[0].getDimensions();
        this.weapon[0].setCenter([width * sizePerVoxel / 2, height * sizePerVoxel / 2, depth * sizePerVoxel / 2]);
        this.weapon[0].attach();

        // Update once so that the position is set when equipping on paused menu
        this.update();
    }

}
