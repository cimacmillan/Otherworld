import { ProcedureService } from "../../services/jobs/ProcedureService";

export class ActionDelay {
    private delay: number;
    private canPerform: boolean = true;
    public constructor(delay: number) {
        this.delay = delay;
    }

    public setDelay(delay: number) {
        this.delay = delay;
    }

    public canAction(): boolean {
        return this.canPerform;
    }

    public onAction() {
        this.canPerform = false;
        ProcedureService.setGameTimeout(() => {
            this.canPerform = true;
        }, this.delay);
    }

    public updateDelay(delay: number) {
        this.delay = delay;
    }
}
