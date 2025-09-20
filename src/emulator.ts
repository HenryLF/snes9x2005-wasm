import { EmulatorAudio } from "./audio.js";
import createSnes9xModule, { SNES9xModule } from "./snes9x_2005.js";

const SAMPLE_RATE = 36000;
const FRAME_BUFFER_SIZE = 917504; //512 * 448 * 4
const WIDTH = 512;
const HEIGHT = 448;

export interface EmulatorOption {
  wasmPath: string;
  audioOn: boolean;
}

const defaultOption: EmulatorOption = {
  wasmPath: "snes9x_2005.wasm",
  audioOn: true,
};

export class Emulator {
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  WASM: SNES9xModule;
  emulationRunning: boolean = true;
  audioNode: EmulatorAudio;

  audioOn: boolean = true;
  keyInput: number = 0;
  private setUint8ArrayToCMemory(src: Uint8Array) {
    var buffer = this.WASM._my_malloc(src.length);
    this.WASM.HEAP8.set(src, buffer);
    return buffer;
  }

  static async create(
    romData: Uint8Array,
    cvs: HTMLCanvasElement,
    options?: Partial<EmulatorOption>
  ): Promise<Emulator> {
    const { wasmPath, audioOn } = { ...defaultOption, ...options };
    try {
      const wasm = await createSnes9xModule({
        locateFile() {
          if (wasmPath.startsWith("http")) return wasmPath;
          return new URL(wasmPath, import.meta.url).href;
        },
      });
      const emulator = new Emulator(cvs, wasm);
      emulator.audioOn = audioOn;
      emulator.initEmulation(romData);
      return emulator;
    } catch (error) {
      throw new Error(`Snes9x_2005-WASM:: Initialization error.\n ${error}`);
    }
  }

  private constructor(cvs: HTMLCanvasElement, wasm: SNES9xModule) {
    this.cvs = cvs;
    this.WASM = wasm;
    this.initCanvas();
    this.audioNode = new EmulatorAudio();
    const ctx = cvs.getContext("2d");
    if (!ctx)
      throw new Error(
        "Snes9x_2005-WASM:: Invalid canvas element, unable to get rendering context."
      );
    this.ctx = ctx;
  }

  private initEmulation(romData: Uint8Array) {
    const romPtr = this.setUint8ArrayToCMemory(romData);
    this.WASM._startWithRom(romPtr, romData.length, SAMPLE_RATE);
    this.WASM._my_free(romPtr);
    this.requestNextFrame();
  }

  private initCanvas() {
    this.cvs.width = 256;
    this.cvs.height = 224;
  }

  private requestNextFrame() {
    this.WASM._setJoypadInput(this.keyInput);
    this.WASM._mainLoop();
    var frameBufferPtr = this.WASM._getScreenBuffer();
    var frameBufferRawData = new Uint8Array(
      this.WASM.HEAP8.buffer,
      frameBufferPtr,
      FRAME_BUFFER_SIZE
    );
    this.paintNewFrame(frameBufferRawData);
    if (this.audioOn) {
      const soundBuffer = new Float32Array(
        this.WASM.HEAPF32.buffer,
        this.WASM._getSoundBuffer(),
        2048 * 2
      );
      this.audioNode.receiveAudio(soundBuffer);
    }

    if (this.emulationRunning) {
      requestAnimationFrame(() => this.requestNextFrame());
    }
  }

  pauseEmulation() {
    this.emulationRunning = false;
  }
  startEmulation() {
    this.emulationRunning = true;
    this.requestNextFrame();
  }
  toggleEmulationRun() {
    this.emulationRunning ? this.pauseEmulation() : this.startEmulation();
  }

  private paintNewFrame(buffer: Uint8Array) {
    const imgData = new ImageData(WIDTH, HEIGHT);
    for (var i = 0; i < FRAME_BUFFER_SIZE; i++) imgData.data[i] = buffer[i];
    this.ctx.putImageData(imgData, 0, 0, 0, 0, this.cvs.width, this.cvs.height);
  }

  saveState() {
    var stateSize = this.WASM._getStateSaveSize();
    var statePtr = this.WASM._saveState();
    if (statePtr == 0) return;
    var state = new Uint8Array(
      new Uint8Array(this.WASM.HEAP8.buffer, statePtr, stateSize)
    );
    this.WASM._my_free(statePtr);
    return state;
  }

  loadState(state: Uint8Array) {
    var statePtr = this.setUint8ArrayToCMemory(state);
    this.WASM._loadState(statePtr, state.length);
    this.WASM._my_free(statePtr);
  }

  loadRom(rom: Uint8Array) {
    var romPtr = this.setUint8ArrayToCMemory(rom);
    this.WASM._startWithRom(romPtr, rom.length, SAMPLE_RATE);
    this.WASM._my_free(romPtr);
  }
}
