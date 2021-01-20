export class ActionSwitch {
    private actionPerformed: boolean = false;
    private isActionBeingPerformed: boolean = false;

    public constructor(
        private onStart?: () => void,
        private onStop?: () => void
    ) {}

    public update() {
        if (this.actionPerformed === false) {
            this.isActionBeingPerformed = false;
            this.onStop && this.onStop();
        }
        this.actionPerformed = false;
    }

    public onPerformed() {
        if (this.isActionBeingPerformed === false) {
            this.onStart && this.onStart();
        }
        this.actionPerformed = true;
        this.isActionBeingPerformed = true;
    }

    public isBeingPerformed() {
        return this.isActionBeingPerformed;
    }
}
