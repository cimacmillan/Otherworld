import React = require("react");
import { CanvasComponent } from "./services/render";
import { Game } from "./Game";
import { UIContainer } from "./ui/UIContainer";
import { DOM_WIDTH, DOM_HEIGHT, WIDTH, HEIGHT, RES_DIV } from "./Config";
import { Actions } from "./Actions";
import { SiteContainer } from "./SiteContainer";
import { useGame } from "./ui/effects/GameEffect";

export interface GameComponentProps {
    uiListener: Partial<Actions>;
    shouldShow: boolean;
}

export const GameComponent: React.FunctionComponent<GameComponentProps> = (
    props
) => {
    const canvas = React.useRef<CanvasComponent>();
    const game = useGame();
    React.useEffect(() => {
        game.init(
            (canvas.current as CanvasComponent).getOpenGL(),
            props.uiListener
        );
    }, []);
    React.useEffect(() => {
        game.setIsHidden(!props.shouldShow);
    }, [props.shouldShow]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 68,
                position: "absolute",
                width: "100%",
            }}
        >
            <div>
                {!props.shouldShow && (
                    <div
                        style={{
                            position: "absolute",
                            width: DOM_WIDTH,
                            height: DOM_HEIGHT,
                            backgroundColor: "#000000",
                            color: "#000000",
                            zIndex: 1,
                        }}
                    />
                )}
                <UIContainer />
                <CanvasComponent
                    ref={canvas}
                    id={"main_canvas"}
                    dom_width={DOM_WIDTH}
                    dom_height={DOM_HEIGHT}
                    width={WIDTH}
                    height={HEIGHT}
                    resolution={RES_DIV}
                />
            </div>
        </div>
    );
};
