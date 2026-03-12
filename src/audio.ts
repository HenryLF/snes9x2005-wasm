const AUDIO_SAMPLE_RATE = 36000;

export class EmulatorAudio {
  volume: GainNode;
  context: AudioContext;
  constructor() {
    this.context = new AudioContext({ sampleRate: AUDIO_SAMPLE_RATE });
    this.volume = this.context.createGain();
    this.volume.gain.setValueAtTime(0.5, this.context.currentTime);
    this.volume.connect(this.context.destination);
  }
  receiveAudio(audio: Float32Array) {
    const buffer = this.context.createBuffer(2, 2048, AUDIO_SAMPLE_RATE);
    for (let i = 0; i < 2048; i++) {
      buffer.getChannelData(0)[i] = audio[i];
      buffer.getChannelData(1)[i] = audio[i + 2048];
    }
    const source = this.context.createBufferSource();
    source.buffer = buffer;

    source.connect(this.volume);
    this.volume.connect(this.context.destination);
    source.addEventListener("ended", () => source.disconnect());
    source.start();
  }

  setVolume(k: number) {
    this.volume.gain.setValueAtTime(k / 100, this.context.currentTime);
  }
  close() {
    this.volume.disconnect();
    this.context.close();
  }
}
