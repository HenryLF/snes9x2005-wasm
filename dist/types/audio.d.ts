export declare class EmulatorAudio extends AudioContext {
    volume: GainNode;
    constructor();
    receiveAudio(audio: Float32Array): void;
    setVolume(k: number): void;
}
