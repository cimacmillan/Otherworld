import React = require("react");
import { DOM_HEIGHT, DOM_WIDTH } from "../../Config";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { animation } from "../../util/animation/Animations";
import { useGlobalState } from "../effects/GlobalState";
import { TextComponent, TextSize } from "./TextComponent";

const HEALTH_BAR_BUMP_SPEED = 100;

export const HealthBarComponent: React.FunctionComponent<{}> = (
    props
) => {
    const [state, dispatch] = useGlobalState();
    const WIDTH = 416;
    const INNER_WIDTH = WIDTH * state.player.health.current / state.player.health.max;
    return (
        <div style={{ 
            position: "absolute",
            width: DOM_WIDTH,
            height: DOM_HEIGHT
        }}>

            <div style={{
                position: "absolute",
                marginLeft: (DOM_WIDTH - WIDTH) / 2,
                marginTop: 630,
                width: WIDTH,
                height: 27,
                backgroundColor: "#000000",
                borderColor: "#AC0000",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 8,
            }}/>

            {
                state.player.health.current ? <div style={{
                    position: "absolute",
                    marginLeft: (DOM_WIDTH - INNER_WIDTH) / 2,
                    marginTop: 630,
                    width: INNER_WIDTH,
                    height: 27,
                    backgroundColor: "#700000",
                    borderColor: "#AC0000",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderRadius: 8,
                }}/> : null
            }

            <TextComponent
                style={{
                    position: "absolute",
                    marginLeft: (DOM_WIDTH - WIDTH) / 2,
                    width: WIDTH,
                    marginTop: 630,
                    height: 27,
                    textAlign: "center"
                }}
                text={`${state.player.health.current}`}
                size={TextSize.SMALL}
            />
            
        </div>
    );
};
