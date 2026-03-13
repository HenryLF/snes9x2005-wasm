import { InputMap, KeyBoardHandle, SNES_CONTROL } from "./inputs.js";
import { SNES9xModule } from "./snes9x_2005.js";
export interface EmulatorOption {
    wasmPath: string;
    audioOn: boolean;
}
export declare class Emulator {
    cvs: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    WASM: SNES9xModule;
    private emulationRunning;
    private emulationSpeed;
    private audioNode;
    audioOn: boolean;
    private keyInput;
    private setUint8ArrayToCMemory;
    static create(cvs: HTMLCanvasElement, options?: Partial<EmulatorOption>): Promise<Emulator>;
    destroy(): void;
    private constructor();
    private initCanvas;
    private requestNextFrame;
    private paintNewFrame;
    pauseEmulation(): boolean;
    startEmulation(): boolean;
    toggleEmulation(): boolean;
    isRunning(): boolean;
    setEmulationSpeed(n: number): number;
    saveState(): Uint8Array<ArrayBuffer> | undefined;
    loadState(state: Uint8Array): void;
    loadRom(rom: Uint8Array, start?: boolean): void;
    setVolume(k: number): number;
    createKeyboardHandles(map: InputMap, jsx: true): {
        onKeyUp: KeyBoardHandle;
        onKeyDown: KeyBoardHandle;
    };
    createKeyboardHandles(map: InputMap, jsx: false): {
        onkeyup: KeyBoardHandle;
        onkeydown: KeyBoardHandle;
    };
    inputHandle(input: SNES_CONTROL, on?: boolean): void;
}
