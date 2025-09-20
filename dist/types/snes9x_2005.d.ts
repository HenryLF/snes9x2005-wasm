export interface SNES9xModule {
  // Core emulator functions
  _setJoypadInput: (input: number) => void;
  _my_malloc: (size: number) => number;
  _my_free: (ptr: number) => void;
  _startWithRom: (romPtr: number, size: number, sampleRate: number) => void;
  _mainLoop: () => void;
  _getScreenBuffer: () => number;
  _getSoundBuffer: () => number;
  _saveSramRequest: () => void;
  _getSaveSramSize: () => number;
  _getSaveSram: () => number;
  _loadSram: (size: number, sramPtr: number) => void;
  _getStateSaveSize: () => number;
  _saveState: () => number;
  _loadState: (statePtr: number, size: number) => void;

  // Emscripten runtime functions
  onRuntimeInitialized?: () => void;
  cwrap: (
    ident: string,
    returnType: string,
    argTypes: string[],
    opts?: any
  ) => Function;

  // Memory access
  HEAP8: Int8Array;
  HEAPU8: Uint8Array;
  HEAP16: Int16Array;
  HEAPU16: Uint16Array;
  HEAP32: Int32Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
  HEAP64: BigInt64Array;
  HEAPU64: BigUint64Array;

  // Runtime status
  calledRun?: boolean;
}

type ModuleArg = { locateFile: (path: string) => string };

declare const createSnes9xModule: (arg: ModuleArg) => Promise<SNES9xModule>;

export default createSnes9xModule;
