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

export const SNES_CONTROL_KEYS = [
  "A",
  "B",
  "X",
  "Y",
  "SELECT",
  "START",
  "L",
  "R",
  "RIGHT",
  "LEFT",
  "DOWN",
  "UP",
];

export type InputMap = Record<SNES_CONTROL, string>;

export type KeyBoardHandle = (ev: KeyboardEvent) => void;

export const defaultInputMap : InputMap = {
  [SNES_CONTROL.DOWN]: "ArrowDown",
  [SNES_CONTROL.UP]: "ArrowUp",
  [SNES_CONTROL.LEFT]: "ArrowLeft",
  [SNES_CONTROL.RIGHT]: "ArrowRight",
  [SNES_CONTROL.A]: "a",
  [SNES_CONTROL.B]: "b",
  [SNES_CONTROL.X]: "x",
  [SNES_CONTROL.Y]: "y",
  [SNES_CONTROL.START]: "s",
  [SNES_CONTROL.SELECT]: "d",
  [SNES_CONTROL.L]: "l",
  [SNES_CONTROL.R]: "r",
};

export function reverseInputMap(map: InputMap) {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(map)) {
    out[value] = parseInt(key);
  }
  return out;
}
