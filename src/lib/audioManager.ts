class AudioManager {
  context: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  source: MediaElementAudioSourceNode | null = null;
  dataArray: Uint8Array | null = null;
  audioElement: HTMLAudioElement | null = null;
  initialized = false;

  init(audioElement: HTMLAudioElement) {
    if (this.initialized) return;
    this.audioElement = audioElement;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.context = new AudioContextClass();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 128; // lower fftSize for less data points to map to grid
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    this.source = this.context.createMediaElementSource(this.audioElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.initialized = true;
  }

  getFrequencyData() {
    if (this.analyser && this.dataArray) {
      // Cast to any to bypass strict ArrayBufferLike typing in TS 5+
      this.analyser.getByteFrequencyData(this.dataArray as any);
      return this.dataArray;
    }
    return null;
  }

  resume() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }
}

export const audioManager = new AudioManager();
