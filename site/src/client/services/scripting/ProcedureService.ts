import { TARGET_MILLIS } from "../../Config";
import { ConsistentArray } from "../../util/array/ConsistentArray";

type Callback = () => void;

export type ProcedureID = number;

interface ProcedureTimeoutReference {
    id: number;
    callback: Callback;
    startTime: number;
    endTime: number;
    length: number;
    gameTime: boolean;
}

class ProcedureServiceImpl {
    private static id = 0;

    private realtime: number;
    private gametime: number;

    private timeoutArray: ConsistentArray<
        ProcedureTimeoutReference
    > = new ConsistentArray();
    private intervalArray: ConsistentArray<
        ProcedureTimeoutReference
    > = new ConsistentArray();

    public constructor() {
        this.realtime = Date.now();
        this.gametime = Date.now();
    }

    public gameUpdate() {
        this.gametime += TARGET_MILLIS;
    }

    public update() {
        this.realtime += TARGET_MILLIS;

        this.checkTimers();

        this.timeoutArray.sync();
        this.intervalArray.sync();
    }

    public setTimeout(callback: Callback, time: number): ProcedureID {
        this.timeoutArray.add(
            this.constructTimeoutReference(callback, time, false)
        );
        ProcedureServiceImpl.id++;
        return ProcedureServiceImpl.id - 1;
    }

    public setInterval(callback: Callback, time: number): ProcedureID {
        this.intervalArray.add(
            this.constructTimeoutReference(callback, time, false)
        );
        ProcedureServiceImpl.id++;
        return ProcedureServiceImpl.id - 1;
    }

    public setGameTimeout(callback: Callback, time: number): ProcedureID {
        this.timeoutArray.add(
            this.constructTimeoutReference(callback, time, true)
        );
        ProcedureServiceImpl.id++;
        return ProcedureServiceImpl.id - 1;
    }

    public setGameInterval(callback: Callback, time: number): ProcedureID {
        this.intervalArray.add(
            this.constructTimeoutReference(callback, time, true)
        );
        ProcedureServiceImpl.id++;
        return ProcedureServiceImpl.id - 1;
    }

    public clearTimeout(id: ProcedureID) {
        const toRemove = this.timeoutArray
            .getArray()
            .find((ref) => ref.id === id);
        if (toRemove) {
            this.timeoutArray.remove(toRemove);
        }
    }

    public clearInterval(id: ProcedureID) {
        const toRemove = this.intervalArray
            .getArray()
            .find((ref) => ref.id === id);
        if (toRemove) {
            this.intervalArray.remove(toRemove);
        }
    }

    private checkTimers() {
        for (const timeout of this.timeoutArray.getArray()) {
            const shouldRemove = this.shouldRemoveTimer(timeout);
            if (shouldRemove) {
                timeout.callback();
                this.timeoutArray.remove(timeout);
            }
        }

        for (const interval of this.intervalArray.getArray()) {
            const shouldRemove = this.shouldRemoveTimer(interval);
            if (shouldRemove) {
                interval.callback();
                interval.startTime = interval.gameTime
                    ? this.gametime
                    : this.realtime;
                interval.endTime = interval.startTime + interval.length;
            }
        }
    }

    private shouldRemoveTimer(reference: ProcedureTimeoutReference) {
        const { endTime, gameTime } = reference;

        if (gameTime) {
            return this.gametime >= endTime;
        } else {
            return this.realtime >= endTime;
        }
    }

    private constructTimeoutReference(
        callback: Callback,
        time: number,
        game: boolean
    ): ProcedureTimeoutReference {
        return {
            id: ProcedureServiceImpl.id,
            callback,
            startTime: game ? this.gametime : this.realtime,
            endTime: (game ? this.gametime : this.realtime) + time,
            length: time,
            gameTime: game,
        };
    }
}

export const ProcedureService = new ProcedureServiceImpl();
