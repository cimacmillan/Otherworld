"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const GameComponent_1 = require("./GameComponent");
const Sound_1 = require("./Sound");
console.log("!!");
const sound = new Sound_1.Sound();
const render = () => ReactDOM.render(React.createElement(GameComponent_1.GameComponent, { sound: sound }), document.getElementById("root"));
render();
//# sourceMappingURL=Index.js.map