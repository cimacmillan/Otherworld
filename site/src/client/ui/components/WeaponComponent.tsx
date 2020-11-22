import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { IntervalDriver } from "../../util/animation/AnimationIntervalDriver";
import {
    CompositeAnimation,
    CompositeAnimationType,
} from "../../util/animation/CompositeAnimation";
import { Subscription } from "rxjs";
import { vec } from "../../util/math";
import { getImagePropsFromSprite } from "../../util/math/UI";
import { ViewportComponent } from "./ViewportComponent";
// import { SpriteSheets, Sprites } from "../../resources/manifests/Types";
import { PlayerEventType } from "../../engine/events/PlayerEvents";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { connect } from "react-redux";
import { sequence, animation, parallel } from "../../util/animation/Animations";
import { useGlobalState, useDispatchListener } from "../effects/GlobalState";
import { Actions } from "../actions/Actions";

interface WeaponComponentProps {
    serviceLocator: ServiceLocator;
}

const WEAPON_HEIGHT = 1;
const WEAPON_WIDTH = WEAPON_HEIGHT / 2;
const POS_X = 1;
const POS_Y = 0.55;
const DEFAULT_ROTATION = 10;

export const WeaponComponent: React.FunctionComponent<WeaponComponentProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();

    const [posY, setPosY] = React.useState(POS_Y);
    const [rotate, setRotate] = React.useState(0);

    let composite: CompositeAnimation;
    let headBob: GameAnimation;

    React.useEffect(() => {
        const swingDown = parallel(
            animation((x: number) => setPosY(POS_Y + x / 4)).speed(100),
            animation((x: number) => setRotate(x * 180)).speed(100)
        );
        const swingUp = parallel(
            animation((x: number) => setPosY(POS_Y + 1 / 4 - x / 4)).speed(100),
            animation((x: number) => setRotate((1 - x) * 180)).speed(100)
        );
        composite = sequence(swingDown, swingUp).driven(false);

        headBob = animation((x: number) => {
            // const velocity = props.serviceLocator
            //     .getScriptingService()
            //     .getPlayer()
            //     .getState().velocity;
            // const speed = vec.vec_distance(velocity);
            // setPosY(POS_Y + Math.sin(x * Math.PI * 2) * speed);
        })
            .driven(true)
            .speed(400)
            .looping()
            .start();

        return () => {
            composite.stop();
            headBob.stop();
        };
    }, []);

    useDispatchListener((event: Actions) => {
        if (event.type === PlayerEventType.PLAYER_ATTACK) {
            composite.start();
        }
    });

    const width = DOM_HEIGHT * WEAPON_WIDTH;
    const height = DOM_HEIGHT * WEAPON_HEIGHT;
    const marginLeft = DOM_WIDTH * POS_X;
    const marginTop = DOM_HEIGHT * posY;

    if (!state.weaponState.showing) {
        return <></>;
    }

    return (
        <ViewportComponent
            x={0}
            y={0}
            width={DOM_WIDTH}
            height={DOM_HEIGHT}
            style={{}}
        >
            {/* <SpriteImageComponent
                serviceLocator={props.serviceLocator}
                spriteSheet={SpriteSheets.SPRITE}
                sprite={Sprites.SWORD}
                style={{
                    marginLeft,
                    marginTop,
                    width,
                    height,
                    transform: `rotate(-${
                        Math.floor(rotate) + DEFAULT_ROTATION
                    }deg) translate(-50%, -50%)`,
                }}
            /> */}
        </ViewportComponent>
    );
};
