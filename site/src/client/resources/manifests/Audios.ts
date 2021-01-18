import { ResourceManifestBuilder } from "../ResourceManifestBuilder";

export enum Audios {
    FOOTSTEP = "FOOTSTEP",
}

export const audios = new ResourceManifestBuilder();

audios.Audio(Audios.FOOTSTEP, "./audio/oneshot/footstep.mp3");
