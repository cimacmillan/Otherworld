import React = require("react");

declare const PR: any;

export const AsyncMarkdownRenderers = () => ({
    thematicBreak: Break,
    code: CodePrettyComponent,
});

const Break: React.FunctionComponent = (props) => {
    return <hr style={{ borderColor: "#c0cbdc", width: 128 }}></hr>;
};

interface CodeProps {
    value: string;
}

class CodePrettyComponent extends React.Component<CodeProps> {
    componentDidMount() {
        if (typeof PR !== "undefined") {
            PR.prettyPrint();
        }
    }

    render() {
        return (
            <pre className="prettyprint linenums">
                <code className="lang-js">{this.props.value}</code>
            </pre>
        );
    }
}
