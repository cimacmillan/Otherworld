import { ResourceManifestBuilder } from "../ResourceManifestBuilder";

export enum Audios {
    FOOTSTEP = "FOOTSTEP",
    DOOR_OPEN = "DOOR_OPEN",
    BUTTON_PRESS = "BUTTON_PRESS",
    DOOR_UNLOCK = "DOOR_UNLOCK",
    LOCK_BREAK = "LOCK_BREAK",
    LOCK_CLICK = "LOCK_CLICK",

    SONG_BIT_STEP = "SONG_BIT_STEP",
    SONG_CURIOUS_NOISES = "SONG_CURIOUS_NOISES",
}

export const audios = new ResourceManifestBuilder();

audios.Audio(Audios.FOOTSTEP, "./audio/oneshot/footstep.mp3");
audios.Audio(Audios.DOOR_OPEN, "./audio/effect/door_open.mp3");
audios.Audio(Audios.BUTTON_PRESS, "./audio/oneshot/button_press.mp3");
audios.Audio(Audios.DOOR_UNLOCK, "./audio/oneshot/door_unlock.mp3");
audios.Audio(Audios.LOCK_BREAK, "./audio/oneshot/lock_break.mp3");
audios.Audio(Audios.LOCK_CLICK, "./audio/oneshot/lock_click.mp3");

audios.Audio(Audios.SONG_BIT_STEP, "./audio/background/bit_step.mp3", {
    bpm: 70,
});
audios.Audio(
    Audios.SONG_CURIOUS_NOISES,
    "./audio/background/curious_noises.mp3",
    { bpm: 70 }
);
