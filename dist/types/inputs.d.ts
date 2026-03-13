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
export declare const SNES_CONTROL_KEYS: string[];
export type InputMap = Record<SNES_CONTROL, string>;
export type KeyBoardHandle = (ev: KeyboardEvent) => void;
export declare const defaultInputMap: InputMap;
export declare function reverseInputMap(map: InputMap): Record<string, number>;
