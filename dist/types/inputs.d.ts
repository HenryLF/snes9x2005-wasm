import { Emulator } from "./emulator";
export declare enum SNES_CONTROL {
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
export declare const defaultInputMap: {
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
export declare function createKeyboardHandles(emulator: Emulator, map?: InputMap): {
    keydown: (ev: KeyboardEvent) => void;
    keyup: (ev: KeyboardEvent) => void;
};
export declare function createInputHandle(emulator: Emulator): (input: SNES_CONTROL, on?: boolean) => void;
export {};
