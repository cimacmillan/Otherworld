import React = require("react");
import ReactMarkdown = require("react-markdown");
import { NavbarContainer, NavPage } from "./NavbarContainer";
import { PageAbout } from "./PageAbout";
import { PageGuide } from "./PageGuide";
import { PageAnnouncements } from "./PageAnnouncements";
import { PageDeepDive } from "./PageDeepDive";

export interface WebContentContainerProps {
    setShowGame: (showGame: boolean) => void;
    isGameShowing: boolean;
}

export const WebContentContainer: React.FunctionComponent<WebContentContainerProps> = (
    props
) => {
    const [page, setPage] = React.useState(NavPage.GAME);
    const { setShowGame, isGameShowing } = props;

    return (
        <div
            style={{
                position: "absolute",
                zIndex: 2,
                width: "100%",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <NavbarContainer
                setShowGame={setShowGame}
                page={page}
                setPage={setPage}
            />
            {PageContentSwitch(page)}
        </div>
    );
};

const PageContentSwitch = (page: NavPage) => {
    switch (page) {
        case NavPage.ABOUT:
            return <PageAbout />;
        case NavPage.DEEPDIVE:
            return <PageDeepDive />;
        case NavPage.ANNOUNCEMENTS:
            return <PageAnnouncements />;
    }
};
