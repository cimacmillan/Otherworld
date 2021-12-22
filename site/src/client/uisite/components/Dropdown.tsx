import React = require("react");
import { TextSize } from "../../ui/components/TextComponent";

export interface DropdownProps {
    title: string;
    toDraw: () => JSX.Element;
    onSelect: () => void;
    onDeselect: () => void;
    startSelected: boolean;
}

const COLOR_SELECTED = "#3a4466";
const COLOR_DEFAULT = "#2d2d2d";

export const Dropdown: React.FunctionComponent<DropdownProps> = (props) => {
    const [hover, setHover] = React.useState(false);
    const [selected, setSelected] = React.useState(props.startSelected);
    const { title, toDraw } = props;
    const onClick = () => {
        setSelected(!selected);
        !selected ? props.onSelect() : props.onDeselect()
    }
    return (
        <>
            <div
                className="deepdive_text unselectable"
                style={{
                    width: "100%",
                    backgroundColor: hover ? COLOR_SELECTED : COLOR_DEFAULT,
                    borderRadius: 8,
                    paddingLeft: 16,
                    marginTop: 8,
                    cursor: "pointer",
                    fontSize: TextSize.SMALL,
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={onClick}
            >
                {selected ? <DownArrow /> : <RightArrow />} {title}
            </div>
            <>{selected && toDraw()}</>
        </>
    );
};

const RightArrow = () => <>&rarr;</>;
const DownArrow = () => <>&darr;</>;
