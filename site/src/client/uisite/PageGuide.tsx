import React = require("react");
import ReactMarkdown = require("react-markdown");
import { AsyncMarkdown } from "./components/AysncMarkdown";

export const PageGuide: React.FunctionComponent = (props) => {
    return (
        <div style={{ marginTop: 100, width: "75%" }}>
            <AsyncMarkdown className={"main_text"} url={"doc/guide.md"} />
        </div>
    );
};
