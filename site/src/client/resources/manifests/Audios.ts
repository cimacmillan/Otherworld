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

    CHEST_OPEN_0 = "CHEST_OPEN_0",
    CHEST_OPEN_1 = "CHEST_OPEN_1",
    EQUIP_0 = "EQUIP_0",
    EQUIP_1 = "EQUIP_1",
    COLLECT_0 = "COLLECT_0",
    ATTACK_0 = "ATTACK_0",
    MENU_0 = "MENU_0",
    BUTTON_0 = "BUTTON_0",
    DAMAGE_0 = "DAMAGE_0",

    START = "START",
    END = "END",
    WON = "WON",
}

export const audios = new ResourceManifestBuilder();

audios.Audio(Audios.FOOTSTEP, "./audio/oneshot/footstep.mp3");
audios.Audio(Audios.DOOR_OPEN, "./audio/effect/door_open.mp3");
audios.Audio(Audios.BUTTON_PRESS, "./audio/oneshot/button_press.mp3");
audios.Audio(Audios.DOOR_UNLOCK, "./audio/oneshot/door_unlock.mp3");
audios.Audio(Audios.LOCK_BREAK, "./audio/oneshot/lock_break.mp3");
audios.Audio(Audios.LOCK_CLICK, "./audio/oneshot/lock_click.mp3");

audios.Audio(Audios.CHEST_OPEN_0, "./audio/kenney_rpgaudio/doorClose_2.mp3");
audios.Audio(Audios.CHEST_OPEN_1, "./audio/kenney_rpgaudio/doorOpen_1.mp3");
audios.Audio(Audios.EQUIP_0, "./audio/kenney_rpgaudio/cloth1.mp3");
audios.Audio(Audios.EQUIP_1, "./audio/kenney_rpgaudio/cloth2.mp3");
audios.Audio(Audios.COLLECT_0, "./audio/kenney_rpgaudio/handleCoins2.mp3");
audios.Audio(Audios.ATTACK_0, "./audio/whoosh.mp3");
audios.Audio(Audios.MENU_0, "./audio/kenney_rpgaudio/bookFlip2.mp3");
audios.Audio(Audios.BUTTON_0, "./audio/kenney_rpgaudio/metalClick.mp3");
audios.Audio(Audios.DAMAGE_0, "./audio/player_hit.mp3");
audios.Audio(Audios.START, "./audio/incoming.mp3");
audios.Audio(Audios.END, "./audio/end.mp3");
audios.Audio(Audios.WON, "./audio/grunt_yay.mp3");



audios.Audio(Audios.SONG_BIT_STEP, "./audio/background/bit_step.mp3", {
    bpm: 70,
});
audios.Audio(
    Audios.SONG_CURIOUS_NOISES,
    "./audio/background/curious_noises.mp3",
    { bpm: 70 }
);
