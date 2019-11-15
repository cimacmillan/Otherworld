
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GameComponent } from "./GameComponent";
import { Sound } from "./Sound";

console.log("!!");

const sound = new Sound();


const render = () => ReactDOM.render(<GameComponent sound={sound}/>, document.getElementById("root"))
render();

