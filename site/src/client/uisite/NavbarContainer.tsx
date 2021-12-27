import React = require("react");
import {
    TextComponent,
    TextSize,
    TextFont,
    TextColour,
} from "../ui/components/TextComponent";
import { DOM_WIDTH } from "../Config";
import { animation, sin } from "../util/animation/Animations";
import { useDispatchListener } from "../ui/effects/GlobalState";

export enum NavPage {
    GAME = "Game",
    ABOUT = "About",
    DEEPDIVE = "Deep Dives",
    ANNOUNCEMENTS = "Changelog",
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
    const onSelect = (navPage: NavPage, withNav: boolean) => {
        const urlParams = new URLSearchParams();
        setPage(navPage);
        if (navPage === NavPage.GAME) {
            showGame();
        } else {
            hideGame(); 
        }
        if (withNav) {
            switch (navPage) {
                case NavPage.GAME:
                    urlParams.delete("page");
                    break;
                case NavPage.DEEPDIVE:
                    urlParams.set("page", "deepdive");
                    break;
                case NavPage.ABOUT:
                    urlParams.set("page", "about");
                    break;
            }  
            history.replaceState(null, null, "?"+urlParams.toString());
        }
    };

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("page")) {
            const page = urlParams.get("page");
            switch (page) {
                case "game":
                    break;
                case "deepdive":
                    onSelect(NavPage.DEEPDIVE, false);
                    break;
                case "about":
                    onSelect(NavPage.ABOUT, false);
                    break;
            }
        }
    }, [])

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                width: DOM_WIDTH,
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
            {/* <NavItem
                navPage={NavPage.ANNOUNCEMENTS}
                selectedNavPage={page}
                onClick={onSelect}
            /> */}
        </div>
    );
};

interface NavItemProps {
    navPage: NavPage;
    selectedNavPage: NavPage;
    onClick: (navPage: NavPage, withNav: boolean) => void;
}

const NavItem: React.FunctionComponent<NavItemProps> = (props) => {
    const selected = props.navPage === props.selectedNavPage;
    const [bounce, setBounce] = React.useState(0);

    React.useEffect(() => {
        if (selected) {
            animation(setBounce)
                .tween(sin)
                .tween((x) => 1 - x)
                .driven(false)
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
                marginLeft: 16,
            }}
            clickable={() => props.onClick(props.navPage, true)}
        />
    );
};
