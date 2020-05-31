import React = require("react");
import ReactMarkdown = require("react-markdown");
import { AsyncMarkdown } from "./components/AysncMarkdown";
import { Dropdown } from "./components/Dropdown";

const deepdives = [
    { title: "Game Events", markdownUrl: "doc/deepdive/events.md" },
    { title: "Event Type", markdownUrl: "doc/deepdive/event_type.md" },
];

export const PageDeepDive: React.FunctionComponent = (props) => {
    return (
        <div style={{ marginTop: 100, width: "75%", textAlign: "center" }}>
            <AsyncMarkdown
                className={"deepdive_text"}
                url={"doc/deepdive_intro.md"}
            />

            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",
                }}
            >
                {deepdives.map(StandardDeepDive)}
            </div>
        </div>
    );
};

const StandardDeepDive = (args: { title: string; markdownUrl: string }) => {
    const { title, markdownUrl } = args;
    return (
        <Dropdown
            title={title}
            toDraw={() => (
                <AsyncMarkdown
                    className={"deepdive_text deepdive_item"}
                    url={markdownUrl}
                />
            )}
        />
    );
};
