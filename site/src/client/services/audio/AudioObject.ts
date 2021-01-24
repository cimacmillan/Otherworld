export interface AudioMetadata {
    bpm: number;
}

export interface AudioObject {
    buffer: AudioBuffer;
    timeSinceLastPlayed?: number;
    metadata: AudioMetadata;
}
