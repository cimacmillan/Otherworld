import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { AnimationDriver } from "../../util/animation/AnimationDriver";

export interface WeaponComponentProps {
    serviceLocator: ServiceLocator;
}

const WEAPON_HEIGHT = 1;
const POS_X = 0.9;
const POS_Y = 0.5;

export class WeaponComponent extends React.Component<WeaponComponentProps> {
    private driver: AnimationDriver;
    private posY = POS_Y;

    public componentDidMount() {
        // Start listening to player events and movement info
    }

    public componentWillUnmount() {
        // Un listening to player events and movement info
    }

    public render() {
        if (!this.driver) {
            this.driver = new AnimationDriver((x: number) => {
                this.posY = POS_Y + x;
                this.forceUpdate();
            });
            this.driver.speed(600).start(0, true);
            setInterval(() => this.driver.tick(), 16);
        }

        return (
            <div
                style={{
                    maxWidth: DOM_WIDTH,
                    maxHeight: DOM_HEIGHT,
                    width: DOM_WIDTH,
                    height: DOM_HEIGHT,
                    overflow: "hidden",
                }}
            >
                <img
                    src={this.props.serviceLocator.getResourceManager().uiSword}
                    style={{
                        marginLeft: DOM_WIDTH * POS_X,
                        marginTop: DOM_HEIGHT * this.posY,
                        width: "auto",
                        height: DOM_HEIGHT * WEAPON_HEIGHT,
                        overflow: "hidden",
                        transform: `rotate(-${Math.floor(
                            this.posY * 60
                        )}deg) translate(-50%, -50%)`,
                    }}
                />
            </div>
        );
    }
}
