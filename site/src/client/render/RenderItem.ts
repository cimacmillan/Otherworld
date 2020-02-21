
export abstract class RenderItem {
    constructor(private renderId: number) {

    }
    public getRenderId = () => this.renderId;
}



