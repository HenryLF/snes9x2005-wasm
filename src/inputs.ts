import { Emulator } from "./emulator";

export enum SNES_CONTROL {
  A = 1 << 7,
  B = 1 << 15,
  X = 1 << 6,
  Y = 1 << 14,
  SELECT = 1 << 13,
  START = 1 << 12,
  L = 1 << 5,
  R = 1 << 4,
  RIGHT = 1 << 8,
  LEFT = 1 << 9,
  DOWN = 1 << 10,
  UP = 1 << 11,
}

type InputMap = {
  [key: KeyboardEvent["key"]]: SNES_CONTROL;
};

export const defaultInputMap = {
  ArrowDown: SNES_CONTROL.DOWN,
  ArrowUp: SNES_CONTROL.UP,
  ArrowLeft: SNES_CONTROL.LEFT,
  ArrowRight: SNES_CONTROL.RIGHT,
  a: SNES_CONTROL.A,
  b: SNES_CONTROL.B,
  x: SNES_CONTROL.X,
  y: SNES_CONTROL.Y,
  o: SNES_CONTROL.START,
  p: SNES_CONTROL.SELECT,
  l: SNES_CONTROL.L,
  r: SNES_CONTROL.R,
};

export function createKeyboardHandles(emulator: Emulator, map: InputMap) {
  return {
    keydown: (ev: KeyboardEvent) => {
      const key = ev.key;
      const input = map[key];
      if (input) {
        emulator.keyInput = emulator.keyInput | input;
      }
    },
    keyup: (ev: KeyboardEvent) => {
      const key = ev.key;
      const input = map[key];
      if (input) {
        emulator.keyInput = emulator.keyInput & (0xffffffff ^ input);
      }
    },
  };
}

export function createInputHandle(emulator: Emulator) {
  return (input: SNES_CONTROL, on: boolean = true) => {
    if (on) {
      emulator.keyInput = emulator.keyInput | input;
    } else {
      emulator.keyInput = emulator.keyInput & (0xffffffff ^ input);
    }
  };
}
