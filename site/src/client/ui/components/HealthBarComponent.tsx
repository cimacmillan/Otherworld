import React = require("react");
import { DOM_HEIGHT, DOM_WIDTH } from "../../Config";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { animation } from "../../util/animation/Animations";
import { useDispatchListener, useGlobalState } from "../effects/GlobalState";
import { TextComponent, TextSize } from "./TextComponent";
import { ProcedureService } from "../../services/jobs/ProcedureService";

const HEALTH_BAR_BUMP_SPEED = 100;

export const HealthBarComponent: React.FunctionComponent<{}> = (
    props
) => {
    const [state, dispatch] = useGlobalState();
    const [anim, setAnim] = React.useState<GameAnimation>(null);
    const [fadeIn, setFadeIn] = React.useState<GameAnimation>(null);
    const [fadeOut, setFadeOut] = React.useState<GameAnimation>(null);
    const [y, setY] = React.useState(0);
    const [fade, setFade] = React.useState(0);
    const [timeout, setTimeout] = React.useState(undefined);

    React.useEffect(() => {
        setAnim(animation((x) => setY(-Math.sin(x * Math.PI) * 10)).speed(100).driven(false).whenDone(() => setY(0)))
        setFadeIn(animation((x) => setFade(x)).speed(100).driven(false));
        setFadeOut(animation((x) => setFade(1 - x)).speed(200).driven(false));
    }, []);

    useDispatchListener(({
        onPlayerDamaged: () => {
            anim.stop();
            anim.start();
            fadeIn.start();
            if (timeout) {
                ProcedureService.clearTimeout(timeout);
            }
            setTimeout(ProcedureService.setTimeout(() => {
                fadeOut.start();
            }, 2000));
        }
    }), [anim, fadeIn, fadeOut, timeout]);

    const WIDTH = 416;
    const INNER_WIDTH = WIDTH * state.player.health.current / state.player.health.max;
    return (
        <div style={{ 
            position: "absolute",
            width: DOM_WIDTH,
            height: DOM_HEIGHT,
            marginTop: y,
            opacity: fade
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
