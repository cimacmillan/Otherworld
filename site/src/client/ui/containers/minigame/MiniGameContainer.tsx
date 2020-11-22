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
            fadeInSpeed={1000}
            fadeOutSpeed={150}
        >
            <div
                style={{
                    width: DOM_WIDTH,
                    height: DOM_HEIGHT,
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <GameButtonContainer
                    width={256}
                    height={46}
                    style={{
                        marginTop: 30,
                    }}
                    childStyle={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onSelect={() => onComplete(true)}
                >
                    <TextComponent
                        text={"Finish"}
                        style={{}}
                        font={TextFont.REGULAR}
                        size={TextSize.SMALL}
                        colour={TextColour.LIGHT}
                    />
                </GameButtonContainer>
            </div>
        </FadeComponent>
    );
};
