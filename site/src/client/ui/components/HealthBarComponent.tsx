import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { DOM_HEIGHT, DOM_WIDTH } from "../../Config";
import { getImagePropsFromSprite } from "../../util/math/UI";
// import {
//     SpriteSheets,
//     UISPRITES,
//     UIANIMATIONS,
// } from "../../resources/manifests/Types";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { IntervalDriver } from "../../util/animation/AnimationIntervalDriver";
import { AnimationImageComponent } from "./AnimationImageComponent";
import { connect } from "react-redux";
import { animation } from "../../util/animation/Animations";
import { useGlobalState } from "../effects/GlobalState";
import { Actions } from "../../Actions";

const HEALTH_BAR_WIDTH = 0.5;
const HEALTH_BAR_HEIGHT = HEALTH_BAR_WIDTH / 3;

const HEALTH_BAR_BUMP_SPEED = 100;

interface HealthBarComponentProps { }

export const HealthBarComponent: React.FunctionComponent<HealthBarComponentProps> = (
    props
) => {
    const [healthBarYOffset, setHealthBarOffset] = React.useState(0);
    const [state, dispatch] = useGlobalState();

    console.log("health bar component render", state.player.health);

    let knockAnimation: GameAnimation;
    React.useEffect(() => {
        knockAnimation = animation((x: number) => {
            setHealthBarOffset(Math.sin(x * Math.PI));
        })
            .driven(false)
            .speed(HEALTH_BAR_BUMP_SPEED);
        return () => knockAnimation.stop();
    }, []);

    const width = DOM_HEIGHT * HEALTH_BAR_WIDTH;
    const height = DOM_HEIGHT * HEALTH_BAR_HEIGHT;
    const marginLeft = 10;
    const marginTop = 10;

    const translate = Math.floor(healthBarYOffset * 10);

    return (
        <div style={{ position: "absolute" }}>
            
        </div>
    );
};
