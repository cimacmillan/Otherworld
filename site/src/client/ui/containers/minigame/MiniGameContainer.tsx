import { ServiceLocator } from "../../../services/ServiceLocator";
import React = require("react");
import { FadeComponent } from "../../components/FadeComponent";
import { useGlobalState } from "../../effects/GlobalState";
import { DOM_WIDTH, DOM_HEIGHT } from "../../../Config";
import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
} from "../../components/TextComponent";
import { GameButtonContainer } from "../GameButtonContainer";
import { LockpickingResult } from "../../../engine/events/MiniGameEvents";
import { MiniGameUIActionType } from "../../actions/MiniGameActions";
import { LockButtonComponent } from "../../components/LockButtonComponent";
import { ShadowComponentStyle } from "../../components/ShadowComponent";
import { Colours } from "../../../resources/design/Colour";
import { LockMatrixComponent } from "../../components/LockMatrixComponent";
import { LockPickContainer } from "./LockPickContainer";

interface MiniGameContainerProps {
    // serviceLocator: ServiceLocator;
}

export const MiniGameContainer: React.FunctionComponent<MiniGameContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();

    const onComplete = (result: LockpickingResult) => {
        dispatch({
            type: MiniGameUIActionType.MINI_GAME_CLOSE,
        });
        state.minigame.onComplete(result);
    };

    return (
        <FadeComponent
            startingShown={false}
            shouldShow={state.minigame.visible}
            fadeInSpeed={200}
            fadeOutSpeed={200}
            render={(x: number) => {
                if (x === 0) return <></>;
                return (
                    <div
                        style={{
                            width: DOM_WIDTH,
                            height: DOM_HEIGHT,
                            position: "absolute",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: x,
                            ...ShadowComponentStyle(),
                        }}
                    >
                        <LockPickContainer
                            configuration={state.minigame.configuration}
                            onComplete={() => onComplete(true)}
                        />

                        <GameButtonContainer
                            width={140}
                            height={46}
                            style={{}}
                            childStyle={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onSelect={() => onComplete(false)}
                        >
                            <TextComponent
                                text={"Give Up"}
                                style={{}}
                                font={TextFont.REGULAR}
                                size={TextSize.SMALL}
                                colour={TextColour.LIGHT}
                            />
                        </GameButtonContainer>
                    </div>
                );
            }}
        />
    );
};
