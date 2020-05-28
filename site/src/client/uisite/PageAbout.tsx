import React = require("react");
import ReactMarkdown = require("react-markdown");

const about = `
## What is Otherworld?

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

export const PageAbout: React.FunctionComponent = (props) => {
    return (
        <div style={{ marginTop: 100, textAlign: "center", width: "75%" }}>
            <ReactMarkdown className={"main_text"} source={about} />
        </div>
    );
};
