import { FastTexture, Texture } from "../types";
import {
  convertToFastTexture,
  loadTexture,
  loadTextureFromURL,
} from "../util/loader/TextureLoader";
import { loadSound } from "../util/sound/AudioService";

export class ResourceManager {
  public sprite: WebGLTexture;
  public wall: WebGLTexture;
  public floor: WebGLTexture;
  public glorp: WebGLTexture;

  public intro: AudioBuffer;
  public boing: AudioBuffer;

  public async load(gl: WebGLRenderingContext, audio: AudioContext) {
    // this.sprite = await loadTexture(gl, "img/sprite.png");
    this.wall = await loadTexture(gl, "img/wall.png");
    this.floor = await loadTexture(gl, "img/floor.png");
    this.sprite = await loadTexture(gl, "img/glorp.png");

    this.intro = await loadSound("audio/intro.mp3", audio);
    this.boing = await loadSound("audio/boing.mp3", audio);
  }
}
