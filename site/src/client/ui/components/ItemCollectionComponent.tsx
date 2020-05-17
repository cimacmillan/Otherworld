import { ShadowComponentStyle, ShadowComponentStyleSmall } from "./ShadowComponent";
import React = require("react");
import { TextComponent, TextFont, TextSize, TextColour } from "./TextComponent";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { SpriteSheets, Sprites } from "../../resources/manifests/Types";

export interface ItemCollectionComponentProps {
    serviceLocator: ServiceLocator;
    amount: number;
    sprite: number;
    name: string;
}

export const ItemCollectionComponent: React.FunctionComponent<ItemCollectionComponentProps> = props => {
    const { serviceLocator, amount, sprite, name } = props;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 4,
                    marginBottom: 4,
                    ...ShadowComponentStyleSmall(),
                }}
            >
                {amount > 1 ? AmountComponent(amount) : <></>}
                <SpriteImageComponent
                    serviceLocator={serviceLocator}
                    spriteSheet={SpriteSheets.SPRITE}
                    sprite={sprite}
                    style={{
                        width: 32,
                        height: 32,
                        marginRight: 4,
                        marginLeft: 4,
                    }}
                />
                <TextComponent
                    text={name}
                    font={TextFont.REGULAR}
                    size={TextSize.SMALL}
                    colour={TextColour.LIGHT}
                    style={{}}
                />
            </div>
        </div>
    );
}

const AmountComponent = (amount: number) => (
    <TextComponent
        text={`x${amount}`}
        font={TextFont.REGULAR}
        size={TextSize.SMALL}
        colour={TextColour.LIGHT}
        style={{}}
    />
);


