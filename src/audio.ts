const AUDIO_SAMPLE_RATE = 36000;

export class EmulatorAudio extends AudioContext {
  constructor() {
    super({ sampleRate: AUDIO_SAMPLE_RATE });
  }
  receiveAudio(audio: Float32Array) {
    const buffer = this.createBuffer(2, 2048, AUDIO_SAMPLE_RATE);
    for (let i = 0; i < 2048; i++) {
      buffer.getChannelData(0)[i] = audio[i];
      buffer.getChannelData(1)[i] = audio[i + 2048];
    }
    const source = this.createBufferSource();
    source.buffer = buffer;

    source.connect(this.destination);
    source.start();
  }
}
