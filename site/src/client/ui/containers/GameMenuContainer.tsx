import React = require("react");
import { connect } from "react-redux";
import { GamePanelComponent } from "../components/GamePanelComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { DARK_PANEL } from "../../services/resources/manifests/DarkPanel";
import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
} from "../components/TextComponent";
import { GameButtonContainer } from "./GameButtonContainer";
import { BUTTON_DEFAULT } from "../../services/resources/manifests/ButtonDefault";
import { BUTTON_HOVER } from "../../services/resources/manifests/ButtonHover";
import { BUTTON_PRESS } from "../../services/resources/manifests/ButtonPress";
import { Subscription } from "rxjs";
import { FadeComponent } from "../components/FadeComponent";
import { useGlobalState } from "../effects/GlobalState";
import { startGame } from "../actions/GameStartActions";
import { KeyComponent } from "../components/KeyComponent";
import { KeyHintComponent } from "../components/KeyHintComponent";

interface GameMenuContainerProps {
    serviceLocator: ServiceLocator;
}

export const GameMenuContainer: React.FunctionComponent<GameMenuContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();

    const onStartPress = () => {
        dispatch(startGame());
        props.serviceLocator.getScriptingService().startGame();
    };

    const showBestScore = state.gameStart.bestScore !== undefined;

    return (
        <FadeComponent
            startingShown={false}
            shouldShow={state.gameStart.showingMenu}
            fadeInSpeed={1000}
            fadeOutSpeed={150}
        >
            <GamePanelComponent
                serviceLocator={props.serviceLocator}
                width={500}
                height={showBestScore ? 300 : 200}
                style={{
                    marginLeft: 400,
                    marginTop: 200,
                    position: "absolute",
                }}
                childStyle={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
                panelMap={DARK_PANEL}
            >
                <TextComponent
                    text={"Otherworld"}
                    style={{
                        // position: "absolute",
                        width: "100%",
                        textAlign: "center",
                        marginTop: 10,
                    }}
                    font={TextFont.REGULAR}
                    size={TextSize.BIG}
                    colour={TextColour.LIGHT}
                />
                <>
                    <TextComponent
                        text={`Score: ${state.gameStart.currentScore}`}
                        style={{}}
                        font={TextFont.REGULAR}
                        size={TextSize.SMALL}
                        colour={TextColour.LIGHT}
                    />

                    {showBestScore ? (
                        <TextComponent
                            text={`Best: ${state.gameStart.bestScore}`}
                            style={{}}
                            font={TextFont.REGULAR}
                            size={TextSize.SMALL}
                            colour={TextColour.LIGHT}
                        />
                    ) : undefined}
                </>

                <GameButtonContainer
                    serviceLocator={props.serviceLocator}
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
                    panelMapDefault={BUTTON_DEFAULT}
                    panelMapHover={BUTTON_HOVER}
                    panelMapPress={BUTTON_PRESS}
                    onSelect={onStartPress}
                >
                    <TextComponent
                        text={"New Game"}
                        style={{}}
                        font={TextFont.REGULAR}
                        size={TextSize.SMALL}
                        colour={TextColour.LIGHT}
                    />
                </GameButtonContainer>
            </GamePanelComponent>
        </FadeComponent>
    );
};
