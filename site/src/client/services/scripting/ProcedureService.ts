import { ServiceLocator } from "../ServiceLocator";

type Callback = () => void;
export type ProcedureID = number;

export class ProcedureService {
    private serviceLocator: ServiceLocator;

    public constructor() {}

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    public update() {}

    public setTimeout(callback: Callback, time: number): ProcedureID {
        return 0;
    }

    public setGameTimeout(callback: Callback, time: number): ProcedureID {
        return 0;
    }
}
