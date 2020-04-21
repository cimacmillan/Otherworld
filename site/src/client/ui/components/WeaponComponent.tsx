import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { GameAnimation } from "../../util/animation/Animation";
import { IntervalDriver } from "../../util/animation/AnimationIntervalDriver";
import {
    CompositeAnimation,
    CompositeAnimationType,
} from "../../util/animation/CompositeAnimation";
import { Subscription } from "rxjs";
import { vec_distance } from "../../util/math";
import { getImagePropsFromSprite } from "../../util/math/UI";
import { ViewportComponent } from "./ViewportComponent";
import {
    SpriteSheets,
    Sprites,
} from "../../services/resources/manifests/Types";
import { GameEventSubject } from "../reducers/UIReducer";
import { PlayerEventType } from "../../engine/events/PlayerEvents";
import { SpriteImageComponent } from "./SpriteImageComponent";

export interface WeaponComponentProps {
    serviceLocator: ServiceLocator;
}

const WEAPON_HEIGHT = 1;
const WEAPON_WIDTH = WEAPON_HEIGHT / 2;
const POS_X = 1;
const POS_Y = 0.55;
const DEFAULT_ROTATION = 10;

export class WeaponComponent extends React.Component<WeaponComponentProps> {
    private composite: CompositeAnimation;
    private headBob: GameAnimation;
    private posY = POS_Y;
    private rotate = 0;

    private subscription: Subscription;

    public constructor(props: WeaponComponentProps) {
        super(props);
        const swingDown = new CompositeAnimation({
            animations: [
                new GameAnimation((x: number) => {
                    this.posY = POS_Y + x / 4;
                    this.forceUpdate();
                }).speed(100),
                new GameAnimation((x: number) => {
                    this.rotate = x * 180;
                    this.forceUpdate();
                }).speed(100),
            ],
            type: CompositeAnimationType.PARALLEL,
        });
        const swingUp = new CompositeAnimation({
            animations: [
                new GameAnimation((x: number) => {
                    this.posY = POS_Y + 1 / 4 - x / 4;
                    this.forceUpdate();
                }).speed(200),
                new GameAnimation((x: number) => {
                    this.rotate = (1 - x) * 180;
                    this.forceUpdate();
                }).speed(200),
                ,
            ],
            type: CompositeAnimationType.PARALLEL,
        });
        this.composite = new CompositeAnimation({
            animations: [swingDown, swingUp],
            type: CompositeAnimationType.SERIAL,
            driver: new IntervalDriver(),
        });

        this.headBob = new GameAnimation((x: number) => {
            this.onHeadBobAnimation(x);
            this.forceUpdate();
        }, new IntervalDriver()).speed(400);
    }

    public componentDidMount() {
        this.subscription = GameEventSubject.subscribe((event) => {
            if (event.type === PlayerEventType.PLAYER_ATTACK) {
                this.composite.start({});
            }
        });

        this.headBob.start({
            loop: true,
        });
    }

    private onHeadBobAnimation = (x: number) => {
        const velocity = this.props.serviceLocator
            .getScriptingService()
            .getPlayer()
            .getState().velocity;
        const speed = vec_distance(velocity);
        this.posY = POS_Y + Math.sin(x * Math.PI * 2) * speed;
    };

    public componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    public render() {
        const width = DOM_HEIGHT * WEAPON_WIDTH;
        const height = DOM_HEIGHT * WEAPON_HEIGHT;
        const marginLeft = DOM_WIDTH * POS_X;
        const marginTop = DOM_HEIGHT * this.posY;

        return (
            <ViewportComponent
                x={0}
                y={0}
                width={DOM_WIDTH}
                height={DOM_HEIGHT}
                style={{}}
            >
                <SpriteImageComponent
                    serviceLocator={this.props.serviceLocator}
                    spriteSheet={SpriteSheets.SPRITE}
                    sprite={Sprites.SWORD}
                    style={{
                        marginLeft,
                        marginTop,
                        width,
                        height,
                        transform: `rotate(-${
                            Math.floor(this.rotate) + DEFAULT_ROTATION
                        }deg) translate(-50%, -50%)`,
                    }}
                />
            </ViewportComponent>
        );
    }
}
