import { Subject } from "rxjs";
import { PlayerEventType } from "../../engine/events/PlayerEvents";
import { Actions } from "../actions/Actions";
import { GameStartActionType } from "../actions/GameStartActions";
import { dispatch } from "../State";

export const onPlayerKilledSaga = new Subject<Actions>();

onPlayerKilledSaga.subscribe((event: Actions) => {
    switch (event.type) {
        case PlayerEventType.PLAYER_KILLED:
            dispatch.next({
                type: GameStartActionType.FADE_BACKGROUND,
            });
            setTimeout(
                () =>
                    dispatch.next({
                        type: GameStartActionType.FADE_MENU,
                    }),
                1000
            );
            break;
    }
});
