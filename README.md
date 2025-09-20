# Snes9x2005 - WASM

A typescript abstraction around the port of [snes9x2005](https://github.com/libretro/snes9x2005/) libretro core for wasm by kazuki-4ys.

# Usage

## Installation

```bash
npm i snes9x2005-wasm
```

## Creating an emulator

```ts
const canvasElement = document.getElementById("canvas");
const romData: Uint8Array; //this holds your rom data

const emulator = await Emulator.create(romData, canvasElement, options);
```

`options` is optional and of type `Partial<EmulatorOption>`, it defaults to :

```ts
const defaultOption: EmulatorOption = {
  wasmPath: "snes9x_2005.wasm", //URL from the wasm blob (if start with http will be absolute)
  audioOn: true, //start emulation with sound
};
```

The emulation will start as soon as the emulator object is created.

Note that `Emulator.create` is async and must be awaited.

## Binding Inputs

Two function are made available for you to easilly bind user input to the emulator controls.

```ts
type InputMap = {
  [key: KeyboardEvent["key"]]: SNES_CONTROL;
};
function createKeyboardHandles(
  emulator: Emulator,
  map?: InputMap
): {
  keydown: (ev: KeyboardEvent) => void;
  keyup: (ev: KeyboardEvent) => void;
};
```

Given an emulator and a record of keyboard keys to SNES_CONTROL object `createKeyboardHandles` will produce keydown and keyup event listener that you can directly bind to the windows object.

```ts
function createInputHandle(
  emulator: Emulator
): (input: SNES_CONTROL, on?: boolean) => void;
```

Given a emulator, return a function that let you set a specific SNES input. `on` will default to `true`.

## WASM Blob and RomData

The wasm blob is not included in the npm package, you can download it from [the GitHub repo](https://github.com/HenryLF/snes9x2005-wasm) or build it yourself using the provided build-esm.sh script.

Rom data needs to be fetched like so before being fed to the emulator.

```ts
async function fetchRomData() {
  const response = await fetch("url-to-your-rom");
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}
```

## API Reference

```ts
export declare class Emulator {
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  WASM: SNES9xModule;
  emulationRunning: boolean;
  audioNode: EmulatorAudio;
  audioOn: boolean;
  keyInput: number;
  static create(
    romData: Uint8Array,
    cvs: HTMLCanvasElement,
    options?: Partial<EmulatorOption>
  ): Promise<Emulator>;
  pauseEmulation(): void;
  startEmulation(): void;
  toggleEmulationRun(): void;
  paintNewFrame(buffer: Uint8Array): void;
  saveState(): Uint8Array<ArrayBuffer> | undefined;
  loadState(state: Uint8Array): void;
  loadRom(rom: Uint8Array): void;
}
```
