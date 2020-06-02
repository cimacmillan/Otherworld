import { Audios } from "../../../../resources/manifests/Types";
import { ConsumeArgs, ItemBehaviourImplementation } from "../ItemBehaviours";
import { MakesNoiseWhenConsumed } from "../types";

export const MakesNoiseWhenConsumedComponent: ItemBehaviourImplementation<MakesNoiseWhenConsumed> = (
    item: MakesNoiseWhenConsumed
) => ({
    onConsume: (args: ConsumeArgs) => {
        args.serviceLocator
            .getAudioService()
            .play(
                args.serviceLocator.getResourceManager().manifest.audio[
                    Audios.EATING_SOGGY
                ]
            );
    },
});
