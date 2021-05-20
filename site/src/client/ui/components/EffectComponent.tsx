import React = require("react");
import { Effect, EffectType } from "../../engine/scripting/effects/Effects";
import { TextColour, TextComponent, TextFont, TextSize } from "./TextComponent";

interface EffectComponentProps {
    effect: Effect
}

export const EffectComponent: React.FunctionComponent<EffectComponentProps> = (props: EffectComponentProps) => {
    const { effect } = props;
    switch (effect.type) {
        case EffectType.HEALS_SELF:
            return row([
                text("Heals", TextColour.RED),
                text(`self ${effect.points} pts`),
            ]);
        case EffectType.DAMAGES_TARGET:
            return row([
                text("Damages", TextColour.RED),
                text(`target ${effect.points} pts`),
            ]);
        case EffectType.DAMAGES_TARGET_IN_RANGE:
            return row([
                text("Damages", TextColour.RED),
                text(`target between ${effect.a} and ${effect.b} pts`),
            ]);
        case EffectType.HEALTH_INCREASE:
            return row([
                text(`Increase`),
                text("Health", TextColour.RED),
                text(`${effect.points} pts`),
            ]); 
    }
    return <></>;
}

const row = (elements: JSX.Element[]) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
            }}
        >
            {elements}
        </div>
    );
};
const text = (text: string, colour: TextColour = TextColour.LIGHT) => {
    const word = (w: string) => <TextComponent
        text={w}
        font={TextFont.REGULAR}
        colour={colour}
        size={TextSize.VSMALL}
        style={{
            marginRight: 8,
            wordWrap: "break-word"
        }}
    />;
    return (<>
        { text.split(" ").map(word) }
    </>);
};
