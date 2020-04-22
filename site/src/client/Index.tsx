import * as React from "react";
import * as ReactDOM from "react-dom";
import { GameComponent } from "./GameComponent";
import { Game } from "./Game";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { GameEvent } from "./engine/events/Event";
import { reducers, GameEventSubject } from "./ui/State";
import { Subject } from "rxjs";

const game = new Game();
const store = createStore(
    reducers,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

GameEventSubject.subscribe((event: GameEvent) => {
    store.dispatch(event);
});

const uiListener = (event: GameEvent) => GameEventSubject.next(event);

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <GameComponent game={game} uiListener={uiListener} />
        </Provider>,
        document.getElementById("root")
    );
};

store.subscribe(render);
render();
