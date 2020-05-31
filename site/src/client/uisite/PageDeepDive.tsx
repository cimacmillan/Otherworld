import React = require("react");
import ReactMarkdown = require("react-markdown");
import { AsyncMarkdown } from "./components/AysncMarkdown";

export const PageDeepDive: React.FunctionComponent = (props) => {
    return (
        <div style={{ marginTop: 100, width: "75%", textAlign: "center" }}>
            <AsyncMarkdown
                className={"main_text"}
                url={"doc/deepdive_intro.md"}
            />
        </div>
    );
};
