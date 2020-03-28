import * as React from "react";
import * as ReactDOM from "react-dom";
import { GameComponent } from "./GameComponent";
import { Game } from "./Game";
import { createStore } from "redux";
import { reducers } from "./ui/reducers/UIReducer";
import { Provider } from "react-redux";

const game = new Game();
const store = createStore(reducers);

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <GameComponent game={game} />
    </Provider>,
    document.getElementById("root")
  );
};

store.subscribe(render);
render();
