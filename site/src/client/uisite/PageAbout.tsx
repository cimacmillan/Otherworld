import React = require("react");
import ReactMarkdown = require("react-markdown");
import { AsyncMarkdown } from "./components/AysncMarkdown";

export const PageAbout: React.FunctionComponent = (props) => {
    return (
        <div style={{ marginTop: 100, textAlign: "center", width: "75%" }}>
            <AsyncMarkdown className={"main_text"} url={"doc/about.md"} />
        </div>
    );
};
