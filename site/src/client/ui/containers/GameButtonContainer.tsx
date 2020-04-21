import React = require("react");
import { PanelImageMap } from "../../services/resources/Types";
import { ServiceLocator } from "../../services/ServiceLocator";
import { GamePanelComponent } from "../components/GamePanelComponent";

export interface GameButtonContainerProps {
    serviceLocator: ServiceLocator;
    width: number;
    height: number;
    style: React.CSSProperties;
    childStyle: React.CSSProperties;

    panelMapDefault: PanelImageMap;
    panelMapHover: PanelImageMap;
    panelMapPress: PanelImageMap;

    onSelect: () => void;
}

export class GameButtonContainer extends React.PureComponent<
    GameButtonContainerProps
> {
    constructor(props: GameButtonContainerProps) {
        super(props);
    }

    public render() {
        return (
            <GamePanelComponent
                {...this.props}
                panelMap={this.props.panelMapDefault}
            ></GamePanelComponent>
        );
    }
}
