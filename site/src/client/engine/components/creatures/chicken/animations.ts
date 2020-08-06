import {
    Animations,
    SpriteSheets,
} from "../../../../resources/manifests/Types";
import { animation } from "../../../../util/animation/Animations";
import { setEntityTexture } from "../../../../util/animation/helpers";
import { Entity } from "../../../Entity";
import { ChickenStateType } from "./ChickenState";

const WALKING_ANIMATION_LENGTH = 1000;
const SITTING_ANIMATION_LENGTH = 1000;
const JUMPING_ANIMATION_LENGTH = 1000;
const EATING_ANIMATION_LENGTH = 1000;

export const getChickenAnimations = (entity: Entity<ChickenStateType>) => {
    const resourceManager = entity.getServiceLocator().getResourceManager();
    const spritesheet =
        resourceManager.manifest.spritesheets[SpriteSheets.SPRITE];

    const walkingAnimation = animation(
        setEntityTexture(entity, spritesheet, Animations.CHICKEN_WALKING)
    )
        .speed(WALKING_ANIMATION_LENGTH)
        .withOffset(Math.random())
        .looping();
    const sittingAnimation = animation(
        setEntityTexture(entity, spritesheet, Animations.CHICKEN_SITTING)
    )
        .speed(SITTING_ANIMATION_LENGTH)
        .withOffset(Math.random())
        .looping();
    const jumpingAnimation = animation(
        setEntityTexture(entity, spritesheet, Animations.CHICKEN_JUMPING)
    )
        .speed(JUMPING_ANIMATION_LENGTH)
        .withOffset(Math.random())
        .looping();
    const eatingAnimation = animation(
        setEntityTexture(entity, spritesheet, Animations.CHICKEN_EATING)
    )
        .speed(EATING_ANIMATION_LENGTH)
        .withOffset(Math.random())
        .looping();

    return {
        walkingAnimation,
        sittingAnimation,
        jumpingAnimation,
        eatingAnimation,
    };
};
