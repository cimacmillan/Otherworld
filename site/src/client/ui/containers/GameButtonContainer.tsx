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

export interface GameButtonContainerState {
    isHovered: boolean;
    isDown: boolean;
}

export class GameButtonContainer extends React.PureComponent<
    GameButtonContainerProps,
    GameButtonContainerState
> {
    state = {
        isHovered: false,
        isDown: false,
    };

    constructor(props: GameButtonContainerProps) {
        super(props);
    }

    public render() {
        let panelMap = this.props.panelMapDefault;
        if (this.state.isHovered) {
            panelMap = this.props.panelMapHover;
        }
        if (this.state.isDown) {
            panelMap = this.props.panelMapPress;
        }

        return (
            <GamePanelComponent
                {...this.props}
                childStyle={{}}
                panelMap={panelMap}
            >
                <div
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    style={{
                        width: "100%",
                        height: "100%",
                        ...this.props.childStyle,
                    }}
                >
                    {this.props.children}
                </div>
            </GamePanelComponent>
        );
    }

    private onMouseEnter = () => {
        this.setState({
            isHovered: true,
        });
    };

    private onMouseLeave = () => {
        this.setState({
            isHovered: false,
        });
    };

    private onMouseDown = () => {
        this.setState({
            isDown: true,
        });
    };

    private onMouseUp = () => {
        this.setState({
            isDown: false,
        });
        this.props.onSelect();
    };
}
