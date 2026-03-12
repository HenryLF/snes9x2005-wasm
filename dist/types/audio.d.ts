export declare class EmulatorAudio {
    volume: GainNode;
    context: AudioContext;
    constructor();
    receiveAudio(audio: Float32Array): void;
    setVolume(k: number): void;
    close(): void;
}
