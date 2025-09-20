declare module "src/audio" {
    export class EmulatorAudio extends AudioContext {
        constructor();
        receiveAudio(audio: Float32Array): void;
    }
}
declare module "src/emulator" {
    import { EmulatorAudio } from "src/audio";
    import { SNES9xModule } from "./snes9x_2005.js";
    export interface EmulatorOption {
        wasmPath: string;
        audioOn: boolean;
    }
    export class Emulator {
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
        pauseEmulation(): void;
        startEmulation(): void;
        toggleEmulationRun(): void;
        paintNewFrame(buffer: Uint8Array): void;
        saveState(): Uint8Array<ArrayBuffer>;
        loadState(state: Uint8Array): void;
    }
}
declare module "src/inputs" {
    import { Emulator } from "src/emulator";
    export enum SNES_CONTROL {
        A = 128,
        B = 32768,
        X = 64,
        Y = 16384,
        SELECT = 8192,
        START = 4096,
        L = 32,
        R = 16,
        RIGHT = 256,
        LEFT = 512,
        DOWN = 1024,
        UP = 2048
    }
    type InputMap = {
        [key: KeyboardEvent["key"]]: SNES_CONTROL;
    };
    export const defaultInputMap: {
        ArrowDown: SNES_CONTROL;
        ArrowUp: SNES_CONTROL;
        ArrowLeft: SNES_CONTROL;
        ArrowRight: SNES_CONTROL;
        a: SNES_CONTROL;
        b: SNES_CONTROL;
        x: SNES_CONTROL;
        y: SNES_CONTROL;
        o: SNES_CONTROL;
        p: SNES_CONTROL;
        l: SNES_CONTROL;
        r: SNES_CONTROL;
    };
    export function createKeyboardHandles(emulator: Emulator, map: InputMap): {
        keydown: (ev: KeyboardEvent) => void;
        keyup: (ev: KeyboardEvent) => void;
    };
    export function createInputHandle(emulator: Emulator): (input: SNES_CONTROL, on?: boolean) => void;
}
declare module "src/index" {
    export { Emulator } from "src/emulator";
    export { createInputHandle, createKeyboardHandles, SNES_CONTROL, } from "src/inputs";
}
