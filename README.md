# Snes9x2005 - WASM

A TypeScript abstraction around the port of [snes9x2005](https://github.com/libretro/snes9x2005/) libretro core for WebAssembly, originally ported by kazuki-4ys.

**Version 2.0** introduces a redesigned API with better separation of concerns and additional controls.

## Installation

```bash
npm i snes9x2005-wasm
```

## Creating an emulator

```ts
import { Emulator } from 'snes9x2005-wasm';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const emulator = await Emulator.create(canvas, {
  wasmPath: 'snes9x_2005.wasm', // URL to the WASM file (absolute or relative)
  audioOn: true,                 // enable/disable audio output
});
```

The `create` method is asynchronous and returns a fully initialised emulator instance. Emulation does **not** start automatically – you must load a ROM first.

## Loading a ROM

Fetch your ROM data as a `Uint8Array` and pass it to `loadRom`:

```ts
const response = await fetch('path/to/your-rom.sfc');
const buffer = await response.arrayBuffer();
const romData = new Uint8Array(buffer);

emulator.loadRom(romData); // starts emulation immediately by default
```

By default emulation starts after loading. To prevent auto‑start, pass `false` as the second argument:

```ts
emulator.loadRom(romData, false);
```

## Controlling emulation

```ts
emulator.pauseEmulation();   // pause
emulator.startEmulation();   // resume
emulator.toggleEmulation();  // toggle pause/play
emulator.isRunning();        // boolean

emulator.setEmulationSpeed(2); // 1 = normal, up to 10
```

## Input handling

Two methods are provided to connect keyboard events to the emulator.

### 1. Using `createKeyboardHandles`

Returns pre‑bound event listeners that you can attach to the window or any DOM element.

```ts
import { defaultInputMap } from 'snes9x2005-wasm';

const handlers = emulator.createKeyboardHandles(defaultInputMap, false); // false = use 'onkeydown'/'onkeyup' names
window.addEventListener('keydown', handlers.onkeydown);
window.addEventListener('keyup', handlers.onkeyup);
```

If you prefer React/JSX style props, set the second parameter to `true`:

```ts
const jsxHandlers = emulator.createKeyboardHandles(myCustomMap, true);
// returns { onKeyDown, onKeyUp }
```

The input map defines which SNES control is triggered by which keyboard key. Note that the map is a **record of SNES_CONTROL to key string**:

```ts
import { SNES_CONTROL, type InputMap } from 'snes9x2005-wasm';

const myMap: InputMap = {
  [SNES_CONTROL.UP]: 'ArrowUp',
  [SNES_CONTROL.DOWN]: 'ArrowDown',
  [SNES_CONTROL.A]: 'a',
  // ...
};
```

### 2. Using `inputHandle`

Manually set or clear a specific SNES control:

```ts
emulator.inputHandle(SNES_CONTROL.A, true);   // press A
emulator.inputHandle(SNES_CONTROL.A, false);  // release A
```

## Audio

Volume can be changed at any time:

```ts
emulator.setVolume(50); // 0–100
```

## Save states

```ts
// Save current state to a Uint8Array
const state = emulator.saveState();
if (state) {
  // store it (e.g., localStorage, file)
}

// Load a previously saved state
emulator.loadState(state);
```

## Cleanup

When you are done, call `destroy` to stop emulation and release audio resources:

```ts
emulator.destroy();
```

## API Reference

```ts
class Emulator {
  // Read‑only properties (use with care)
  readonly cvs: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly WASM: SNES9xModule;
  readonly audioNode: EmulatorAudio;
  audioOn: boolean;

  // Creation
  static create(
    cvs: HTMLCanvasElement,
    options?: Partial<EmulatorOption>
  ): Promise<Emulator>;

  // Lifecycle
  destroy(): void;
  pauseEmulation(): boolean;
  startEmulation(): boolean;
  toggleEmulation(): boolean;
  isRunning(): boolean;

  // ROM handling
  loadRom(rom: Uint8Array, start?: boolean): void;

  // Speed
  setEmulationSpeed(n: number): number; // returns the actual speed set

  // Input
  createKeyboardHandles(
    map?: InputMap,
    jsx?: boolean
  ): { onkeydown: KeyBoardHandle; onkeyup: KeyBoardHandle } |
     { onKeyDown: KeyBoardHandle; onKeyUp: KeyBoardHandle };
  inputHandle(input: SNES_CONTROL, on?: boolean): void;

  // Save states
  saveState(): Uint8Array | undefined;
  loadState(state: Uint8Array): void;

  // Audio
  setVolume(k: number): void;
}

interface EmulatorOption {
  wasmPath: string;   // URL to the WASM file
  audioOn: boolean;   // enable/disable audio output
}

enum SNES_CONTROL {
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

type InputMap = Record<SNES_CONTROL, string>;

export const defaultInputMap: InputMap;
```

## WASM Blob

The WASM file (`snes9x_2005.wasm`) is **not** included in the npm package. You can download it from [here](https://github.com/HenryLF/snes9x2005-wasm/releases) or build it yourself using the provided `build-esm.sh` script. Place it in your public folder and provide its path via the `wasmPath` option.
