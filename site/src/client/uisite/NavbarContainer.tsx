import React = require("react");
import {
    TextComponent,
    TextSize,
    TextFont,
    TextColour,
} from "../ui/components/TextComponent";
import { DOM_WIDTH } from "../Config";
import { animation, sin } from "../util/animation/Animations";

export enum NavPage {
    GAME = "Game",
    ABOUT = "About",
    DEEPDIVE = "Deep Dives",
    ANNOUNCEMENTS = "Announcements",
}

interface NavbarContainerProps {
    setShowGame: (showGame: boolean) => void;
    setPage: (page: NavPage) => void;
    page: NavPage;
}

export const NavbarContainer: React.FunctionComponent<NavbarContainerProps> = (
    props
) => {
    const { page, setPage, setShowGame } = props;
    const showGame = () => setShowGame(true);
    const hideGame = () => {
        setShowGame(false);
    };
    const onSelect = (navPage: NavPage) => {
        setPage(navPage);
        if (navPage === NavPage.GAME) {
            showGame();
        } else {
            hideGame();
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                width: DOM_WIDTH,
                justifyContent: "space-between",
                alignItems: "center",
                position: "fixed",
                height: 68,
                backgroundColor: "black",
            }}
        >
            <TextComponent
                text={"Otherworld"}
                size={TextSize.MED}
                font={TextFont.REGULAR}
                colour={TextColour.LESS_LIGHT}
                style={{}}
            />

            <NavItem
                navPage={NavPage.GAME}
                selectedNavPage={page}
                onClick={onSelect}
            />
            <NavItem
                navPage={NavPage.ABOUT}
                selectedNavPage={page}
                onClick={onSelect}
            />
            <NavItem
                navPage={NavPage.DEEPDIVE}
                selectedNavPage={page}
                onClick={onSelect}
            />
            {/* <NavItem
                navPage={NavPage.GUIDE}
                selectedNavPage={page}
                onClick={onSelect}
            /> */}
            <NavItem
                navPage={NavPage.ANNOUNCEMENTS}
                selectedNavPage={page}
                onClick={onSelect}
            />
        </div>
    );
};

interface NavItemProps {
    navPage: NavPage;
    selectedNavPage: NavPage;
    onClick: (navPage: NavPage) => void;
}

const NavItem: React.FunctionComponent<NavItemProps> = (props) => {
    const selected = props.navPage === props.selectedNavPage;
    const [bounce, setBounce] = React.useState(0);

    React.useEffect(() => {
        if (selected) {
            animation(setBounce)
                .tween(sin)
                .tween((x) => 1 - x)
                .driven()
                .speed(100)
                .start();
        }
    }, [selected]);

    const scale = 1 - Math.floor(bounce * 100) / 100;

    return (
        <TextComponent
            text={props.navPage}
            size={TextSize.SMALL}
            font={TextFont.REGULAR}
            colour={selected ? TextColour.LIGHT : TextColour.LESS_LIGHT}
            style={{
                transformOrigin: "center",
                transform: `scale(${scale})`,
            }}
            clickable={() => props.onClick(props.navPage)}
        />
    );
};
