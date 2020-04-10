import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { GameAnimation } from "../../util/animation/Animation";
import { IntervalDriver } from "../../util/animation/AnimationIntervalDriver";
import {
    CompositeAnimation,
    CompositeAnimationType,
} from "../../util/animation/CompositeAnimation";

export interface WeaponComponentProps {
    serviceLocator: ServiceLocator;
}

const WEAPON_HEIGHT = 1;
const POS_X = 0.9;
const POS_Y = 0.5;

export class WeaponComponent extends React.Component<WeaponComponentProps> {
    private composite: CompositeAnimation;
    private posY = POS_Y;
    private rotate = 0;

    public constructor(props: WeaponComponentProps) {
        super(props);
        const swingDown = new CompositeAnimation({
            animations: [
                new GameAnimation((x: number) => {
                    this.posY = POS_Y + x / 4;
                    this.forceUpdate();
                }).speed(300),
                new GameAnimation((x: number) => {
                    this.rotate = x * 180;
                    this.forceUpdate();
                }).speed(300),
            ],
            type: CompositeAnimationType.PARALLEL,
        });
        const swingUp = new CompositeAnimation({
            animations: [
                new GameAnimation((x: number) => {
                    this.posY = POS_Y + 1 / 4 - x / 4;
                    this.forceUpdate();
                }),
                new GameAnimation((x: number) => {
                    this.rotate = (1 - x) * 180;
                    this.forceUpdate();
                }),
            ],
            type: CompositeAnimationType.PARALLEL,
        });
        this.composite = new CompositeAnimation({
            animations: [swingDown, swingUp],
            type: CompositeAnimationType.SERIAL,
            driver: new IntervalDriver(),
        });
    }

    public componentDidMount() {
        // Start listening to player events and movement info
        this.composite.start({
            loop: true,
        });
    }

    public componentWillUnmount() {
        // Un listening to player events and movement info
    }

    public render() {
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
                            this.rotate
                        )}deg) translate(-50%, -50%)`,
                    }}
                />
            </div>
        );
    }
}
