import { ResourceManifestBuilder } from "../ResourceManifestBuilder";

export enum Audios {
    FOOTSTEP_0 = "FOOTSTEP_0",
    FOOTSTEP_1 = "FOOTSTEP_1",
    FOOTSTEP_2 = "FOOTSTEP_2",
    FOOTSTEP_3 = "FOOTSTEP_3",
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
    ENEMY_HURT = "ENEMY_HURT",
    ENEMY_KILLED = "ENEMY_KILLED",
    ENEMY_RESIST = "ENEMY_RESIST",
    CHEST_APPEAR = "CHEST_APPEAR",
    CHEST_DISAPPEAR = "CHEST_DISAPPEAR",
    EATING = "EATING",



    START = "START",
    END = "END",
    WON = "WON",
    CHEST_STAGE = "CHEST_STAGE",
    FIGHT = "FIGHT",
    BEAT_ENEMIES = "BEAT_ENEMIES"
}

export const audios = new ResourceManifestBuilder();

audios.Audio(Audios.FOOTSTEP_0, "./audio/kenney_rpgaudio/footstep00.mp3");
audios.Audio(Audios.FOOTSTEP_1, "./audio/kenney_rpgaudio/footstep01.mp3");
audios.Audio(Audios.FOOTSTEP_2, "./audio/kenney_rpgaudio/footstep02.mp3");
audios.Audio(Audios.FOOTSTEP_3, "./audio/kenney_rpgaudio/footstep03.mp3");
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
audios.Audio(Audios.ENEMY_HURT, "./audio/slam.mp3");
audios.Audio(Audios.ENEMY_KILLED, "./audio/point.mp3");
audios.Audio(Audios.ENEMY_RESIST, "./audio/kenney_rpgaudio/handleSmallLeather.mp3");
audios.Audio(Audios.CHEST_APPEAR, "./audio/kenney_rpgaudio/doorClose_4.mp3");
audios.Audio(Audios.CHEST_DISAPPEAR, "./audio/kenney_rpgaudio/cloth3.mp3");
audios.Audio(Audios.EATING, "./audio/kenney_rpgaudio/drawKnife3.mp3");

audios.Audio(Audios.CHEST_STAGE, "./audio/fadeaway.mp3");
audios.Audio(Audios.FIGHT, "./audio/fight.mp3");
audios.Audio(Audios.BEAT_ENEMIES, "./audio/beat.mp3");


audios.Audio(Audios.SONG_BIT_STEP, "./audio/background/bit_step.mp3", {
    bpm: 70,
});
audios.Audio(
    Audios.SONG_CURIOUS_NOISES,
    "./audio/background/curious_noises.mp3",
    { bpm: 70 }
);
