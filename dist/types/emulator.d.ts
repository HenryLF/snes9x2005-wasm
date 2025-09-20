import { EmulatorAudio } from "./audio.js";
import { SNES9xModule } from "./snes9x_2005.js";
export interface EmulatorOption {
    wasmPath: string;
    audioOn: boolean;
}
export declare class Emulator {
    cvs: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    WASM: SNES9xModule;
    emulationRunning: boolean;
    audioNode: EmulatorAudio;
    audioOn: boolean;
    keyInput: number;
    private setUint8ArrayToCMemory;
    static create(romData: Uint8Array, cvs: HTMLCanvasElement, options?: Partial<EmulatorOption>): Promise<Emulator>;
    private constructor();
    private initEmulation;
    private initCanvas;
    private requestNextFrame;
    private paintNewFrame;
    pauseEmulation(): void;
    startEmulation(): void;
    toggleEmulationRun(): void;
    saveState(): Uint8Array<ArrayBuffer> | undefined;
    loadState(state: Uint8Array): void;
    loadRom(rom: Uint8Array): void;
}
