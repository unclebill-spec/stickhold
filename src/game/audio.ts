const MUSIC_BUS = 1.35;
const BEAT = 60 / 46;
const LOOP = BEAT * 16;
const MELODY = [
  { at: 0, n: 64 },
  { at: 4, n: 67 },
  { at: 8, n: 65 },
  { at: 12, n: 62 },
];

function midi(n: number) {
  return 440 * 2 ** ((n - 69) / 12);
}

export class Score {
  sfxVol = 0.75;
  musicVol = 0.5;
  private ac: AudioContext | null = null;
  private music: GainNode | null = null;
  private sfx: GainNode | null = null;
  private drones: OscillatorNode[] = [];
  private beds: { osc: OscillatorNode; gain: GainNode }[] = [];
  private noiseBuf: AudioBuffer | null = null;
  private nextAt = 0;
  private step = 0;
  private scheduledUntil = 0;
  private lead: OscillatorNode | null = null;
  private bass: OscillatorNode | null = null;
  private mid: OscillatorNode | null = null;
  private running = false;
  private menuMode = false;
  private voices: { osc: OscillatorNode; gain: GainNode }[] = [];
  private comp: DynamicsCompressorNode | null = null;
  private workAt = 0;
  private hitAt = 0;
  private crackleAt = 0;

  attach(ac: AudioContext) {
    if (this.ac === ac) return;
    this.ac = ac;
    const music = ac.createGain();
    const low = ac.createBiquadFilter();
    low.type = "highpass";
    low.frequency.value = 130;
    low.Q.value = 0.7;
    const roll = ac.createBiquadFilter();
    roll.type = "lowpass";
    roll.frequency.value = 2400;
    roll.Q.value = 0.5;
    music.gain.value = this.musicVol * MUSIC_BUS;
    music.connect(low);
    low.connect(roll);
    const limit = ac.createDynamicsCompressor();
    limit.threshold.value = -8;
    limit.knee.value = 8;
    limit.ratio.value = 3;
    limit.attack.value = 0.02;
    limit.release.value = 0.28;
    const ceiling = ac.createGain();
    ceiling.gain.value = 0.62;
    roll.connect(limit);
    limit.connect(ceiling);
    ceiling.connect(ac.destination);
    const sfx = ac.createGain();
    sfx.gain.value = 13.2;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -6;
    comp.knee.value = 6;
    comp.ratio.value = 20;
    comp.attack.value = 0.002;
    comp.release.value = 0.08;
    const hold = ac.createGain();
    hold.gain.value = 0.77;
    sfx.connect(comp);
    comp.connect(hold);
    hold.connect(ac.destination);
    this.sfx = sfx;
    this.music = music;
    this.comp = comp;
    this.loadHits();
  }

  start() {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    this.menuMode = false;
    if (this.running) {
      this.nextAt = ac.currentTime + 0.3;
      return;
    }
    this.running = true;
    this.nextAt = ac.currentTime + 0.2;
  }

  startMenu() {
    const ac = this.ac;
    if (!ac || !this.music || this.running) return;
    this.menuMode = true;
    this.running = true;
    this.nextAt = ac.currentTime + 0.2;
  }

  stop() {
    for (const o of this.drones) {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    }
    this.drones = [];
    this.beds = [];
    this.lead = null;
    this.bass = null;
    this.mid = null;
    this.scheduledUntil = 0;
    this.voices = [];
    this.running = false;
    this.menuMode = false;
    this.nextAt = 0;
    this.stopBuild();
  }

  setSfx(v: number) {
    this.sfxVol = Math.min(1, Math.max(0, v));
    if (this.sfxVol <= 0.001) this.stopBuild();
    else if (this.buildOn && this.buildGain && this.ac) {
      this.buildGain.gain.setTargetAtTime(this.buildLevel(), this.ac.currentTime, 0.05);
    }
  }

  setMusic(v: number) {
    this.musicVol = Math.min(1, Math.max(0, v));
    if (this.music && this.ac) {
      this.music.gain.setTargetAtTime(this.musicVol * MUSIC_BUS, this.ac.currentTime, 0.08);
    }
    if (this.musicVol <= 0.001) this.nextAt = 0;
  }

  tick() {
    const ac = this.ac;
    if (!ac || !this.running || this.musicVol <= 0.001) return;
    const span = LOOP;
    if (this.nextAt < ac.currentTime + 0.05) this.nextAt = ac.currentTime + 0.08;
    let guard = 0;
    while (this.nextAt < ac.currentTime + span && guard++ < 2) {
      this.playTune(this.nextAt);
      this.nextAt += span;
    }
  }

  private playTune(time: number) {
    for (const note of MELODY) {
      const at = time + note.at * BEAT;
      this.toneOut(midi(note.n), at, BEAT * 3.4, 0.03, "sine", 1200, 0, 0.55);
      this.toneOut(midi(note.n - 7), at, BEAT * 3.8, 0.012, "sine", 640, 0, 0.6);
    }
  }

  private playWar(time: number) {
    this.playTune(time);
  }

  private toneOut(
    freq: number,
    time: number,
    dur: number,
    gain: number,
    type: OscillatorType,
    cut: number,
    fall = 0,
    attack = 0,
  ) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const o = ac.createOscillator();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, time);
    if (fall > 0) o.frequency.exponentialRampToValueAtTime(Math.max(28, freq * fall), time + dur);
    f.type = "lowpass";
    f.frequency.setValueAtTime(cut, time);
    const gap = 0.03;
    g.gain.setValueAtTime(0, time);
    g.gain.setValueAtTime(0, time + gap);
    const rise = attack > 0 ? attack : Math.min(0.08, dur * 0.35);
    g.gain.linearRampToValueAtTime(gain, time + gap + rise);
    g.gain.linearRampToValueAtTime(0, time + gap + dur);
    o.connect(f);
    f.connect(g);
    g.connect(music);
    o.start(time);
    o.stop(time + gap + dur + 0.04);
    this.drones.push(o);
  }

  private hurdy(freq: number, time: number, dur: number, gain: number) {
    this.toneOut(freq, time, dur, gain, "sine", 1400, 0, 0.28);
  }

  private classical(freq: number, time: number) {
    this.toneOut(freq, time, BEAT * 1.5, 0.014, "sine", 1600, 0, 0.16);
  }

  private upright(freq: number, time: number, dur: number, gain: number) {
    this.toneOut(freq, time, dur, gain, "sine", 220);
  }

  private bongo(time: number, high: boolean) {
    this.toneOut(high ? 148 : 96, time, 0.26, high ? 0.016 : 0.022, "sine", 160, 0.72, 0.07);
  }

  private hold(time: number, _fadeIn: boolean) {
    this.playTune(time);
  }

  private wobble(freq: number, time: number, dur: number, gain: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const o = ac.createOscillator();
    const lfo = ac.createOscillator();
    const depth = ac.createGain();
    const g = ac.createGain();
    const filter = ac.createBiquadFilter();
    o.type = "sine";
    lfo.type = "sine";
    o.frequency.setValueAtTime(freq, time);
    lfo.frequency.setValueAtTime(1.3, time);
    filter.type = "lowpass";
    filter.frequency.value = 120;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    depth.gain.setValueAtTime(0, time);
    depth.gain.linearRampToValueAtTime(gain * 0.62, time + 0.16);
    depth.gain.linearRampToValueAtTime(0, time + dur);
    lfo.connect(depth);
    depth.connect(g.gain);
    o.connect(filter);
    filter.connect(g);
    g.connect(music);
    o.start(time);
    lfo.start(time);
    o.stop(time + dur + 0.02);
    lfo.stop(time + dur + 0.02);
  }

  private guitar(freq: number, time: number, dur: number, gain: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1600, time);
    filter.frequency.exponentialRampToValueAtTime(640, time + dur);
    const partials: [OscillatorType, number, number][] = [
      ["triangle", freq, 0.75],
      ["sine", freq * 2.003, 0.22],
      ["sine", freq * 3, 0.06],
    ];
    for (const [type, f, mix] of partials) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, time);
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(gain * mix, time + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      o.connect(g);
      g.connect(filter);
      o.start(time);
      o.stop(time + dur + 0.02);
    }
    filter.connect(music);
  }

  private bassGuitar(freq: number, time: number, dur: number, gain: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(520, time);
    const partials: [OscillatorType, number, number][] = [
      ["sine", freq, 0.32],
      ["sine", freq * 2, 0.5],
    ];
    for (const [type, f, mix] of partials) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, time);
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(gain * mix, time + 0.14);
      g.gain.linearRampToValueAtTime(0, time + dur);
      o.connect(g);
      g.connect(filter);
      o.start(time);
      o.stop(time + dur + 0.04);
      this.drones.push(o);
    }
    filter.connect(music);
  }

  private cello(freq: number, time: number, dur: number, gain: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 480;
    const o = ac.createOscillator();
    const o2 = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o2.type = "sine";
    o.frequency.setValueAtTime(freq, time);
    o2.frequency.setValueAtTime(freq * 2.002, time);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.22);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    const quiet = ac.createGain();
    quiet.gain.value = 0.35;
    o.connect(filter);
    o2.connect(quiet);
    quiet.connect(filter);
    filter.connect(g);
    g.connect(music);
    o.start(time);
    o2.start(time);
    o.stop(time + dur + 0.02);
    o2.stop(time + dur + 0.02);
  }

  private mellow(freq: number, time: number, dur: number, gain: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const o = ac.createOscillator();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, time);
    f.type = "lowpass";
    f.frequency.value = 280;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(f);
    f.connect(g);
    g.connect(music);
    o.start(time);
    o.stop(time + dur + 0.02);
  }

  private envelope(g: GainNode, t: number, peak: number, dur: number) {
    const gap = 0.05;
    const rise = 0.05;
    const body = Math.max(0.09, dur);
    const end = t + gap + body;
    g.gain.setValueAtTime(0, t);
    g.gain.setValueAtTime(0, t + gap);
    g.gain.linearRampToValueAtTime(peak, t + gap + rise);
    g.gain.linearRampToValueAtTime(0, end);
    g.gain.setValueAtTime(0, end + gap);
    return end + gap;
  }

  tone(_freq: number, _dur: number, _gain: number, _type: OscillatorType = "triangle") {}

  private voiceAt = 0;

  private chopAt = -10000;
  private pickAt = -10000;
  private chopBuf: AudioBuffer | null = null;
  private pickBuf: AudioBuffer | null = null;
  private buildBuf: AudioBuffer | null = null;
  private buildSrc: AudioBufferSourceNode | null = null;
  private buildGain: GainNode | null = null;
  private buildOn = false;
  private hitsReady: Promise<void> | null = null;

  axeStart() {
    this.tool("axe");
  }

  axeTick() {
    this.tool("axe");
  }

  pickStart() {
    this.tool("pick");
  }

  pickTick() {
    this.tool("pick");
  }

  private tool(kind: "axe" | "pick") {
    if (kind === "axe" && !this.chopBuf) {
      this.loadHits();
      return;
    }
    if (kind === "pick" && !this.pickBuf) {
      this.loadHits();
      return;
    }
    const now = performance.now();
    const last = kind === "axe" ? this.chopAt : this.pickAt;
    if (now - last < 2000) return;
    if (kind === "axe") this.chopAt = now;
    else this.pickAt = now;
    if (kind === "axe") this.playHit(this.chopBuf, 0.16);
    else this.playHit(this.pickBuf, 0.07);
  }

  private loadHits() {
    const ac = this.ac;
    if (!ac || this.hitsReady) return;
    this.hitsReady = (async () => {
      const [chop, pick, build] = await Promise.all([
        fetch("/sfx/chop.mp3").then((r) => r.arrayBuffer()),
        fetch("/sfx/pick.mp3").then((r) => r.arrayBuffer()),
        fetch("/sfx/build.mp3").then((r) => r.arrayBuffer()),
      ]);
      const chopBuf = await ac.decodeAudioData(chop);
      const pickBuf = await ac.decodeAudioData(pick);
      const buildBuf = await ac.decodeAudioData(build);
      this.chopBuf = this.sliceHit(chopBuf, 0.205, 0.46);
      this.pickBuf = this.sliceHit(pickBuf, 0.065, 0.26);
      this.buildBuf = this.prepareBuild(buildBuf);
    })();
  }

  private sliceHit(buf: AudioBuffer, from: number, to: number) {
    const ac = this.ac;
    if (!ac) return buf;
    const rate = buf.sampleRate;
    const start = Math.max(0, Math.floor(from * rate));
    const end = Math.min(buf.length, Math.floor(to * rate));
    const length = Math.max(1, end - start);
    const out = ac.createBuffer(buf.numberOfChannels, length, rate);
    const fadeIn = Math.floor(0.008 * rate);
    const fadeOut = Math.floor(0.02 * rate);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const src = buf.getChannelData(c);
      const dst = out.getChannelData(c);
      for (let i = 0; i < length; i++) {
        let g = 1;
        if (i < fadeIn) g = i / fadeIn;
        else if (i > length - fadeOut) g = Math.max(0, (length - i) / fadeOut);
        dst[i] = src[start + i] * g;
      }
    }
    return out;
  }

  private playHit(buf: AudioBuffer | null, gain: number) {
    const ac = this.ac;
    const sfx = this.sfx;
    if (!ac || !sfx || !buf || this.sfxVol <= 0.001) return;
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = false;
    const g = ac.createGain();
    g.gain.value = gain * this.sfxVol;
    src.connect(g);
    g.connect(sfx);
    const t = ac.currentTime;
    src.start(t);
    src.stop(t + buf.duration);
  }

  setBuilding(on: boolean) {
    if (on && !this.buildBuf) {
      this.loadHits();
      return;
    }
    if (on && this.sfxVol > 0.001) this.startBuild();
    else this.stopBuild();
  }

  private buildLevel() {
    return 0.07 * this.sfxVol;
  }

  private prepareBuild(buf: AudioBuffer) {
    const ac = this.ac;
    if (!ac) return buf;
    const rate = buf.sampleRate;
    const fade = Math.floor(0.07 * rate);
    const length = Math.max(buf.length, Math.ceil(5.16 * rate));
    const out = ac.createBuffer(buf.numberOfChannels, length, rate);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const src = buf.getChannelData(c);
      const dst = out.getChannelData(c);
      const n = Math.min(src.length, dst.length);
      for (let i = 0; i < n; i++) dst[i] = src[i];
      const fadeStart = Math.max(0, n - fade);
      for (let i = fadeStart; i < n; i++) dst[i] *= Math.max(0, (n - 1 - i) / fade);
    }
    return out;
  }

  private startBuild() {
    if (this.buildOn) return;
    const ac = this.ac;
    const sfx = this.sfx;
    const buf = this.buildBuf;
    if (!ac || !sfx || !buf) return;
    const src = ac.createBufferSource();
    const g = ac.createGain();
    src.buffer = buf;
    src.loop = true;
    const t = ac.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(this.buildLevel(), t + 0.03);
    src.connect(g);
    g.connect(sfx);
    src.start(t);
    this.buildSrc = src;
    this.buildGain = g;
    this.buildOn = true;
  }

  private stopBuild() {
    const src = this.buildSrc;
    const g = this.buildGain;
    const ac = this.ac;
    this.buildOn = false;
    this.buildSrc = null;
    this.buildGain = null;
    if (!src || !g || !ac) return;
    const t = ac.currentTime;
    const now = g.gain.value;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(now, t);
    g.gain.linearRampToValueAtTime(0, t + 0.04);
    src.stop(t + 0.05);
  }

  private clankAt = -10000;
  private splashAt = -10000;
  private zapAt = -10000;

  clank() {
    const now = performance.now();
    if (now - this.clankAt < 2000) return;
    this.clankAt = now;
    this.knock(560, 0.09, 0.12, 800, 0.4, 0.03, 0.1);
    this.knock(170, 0.14, 0.1, 260, 0.45, 0.035, 0.1);
  }

  splash() {
    const now = performance.now();
    if (now - this.splashAt < 2000) return;
    this.splashAt = now;
    this.knock(200, 0.12, 0.11, 360, 0.35, 0.03, 0.1);
    this.knock(90, 0.18, 0.09, 160, 0.4, 0.04, 0.1);
  }

  lightning() {
    const now = performance.now();
    if (now - this.zapAt < 900) return;
    this.zapAt = now;
    this.knock(480, 0.1, 0.11, 720, 0.32, 0.03, 0.1);
    this.knock(130, 0.22, 0.13, 220, 0.36, 0.04, 0.1);
  }

  bell() {
    const ac = this.ac;
    if (!ac || this.sfxVol <= 0.001) return;
    const t0 = ac.currentTime + 0.05;
    const tones = [
      [523, 0.2, 1.15],
      [784, 0.09, 0.9],
      [1046, 0.045, 0.62],
    ];
    for (const [freq, gain, dur] of tones) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, t0);
      const peak = Math.max(0.0001, gain * this.sfxVol);
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(peak, t0 + 0.018);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g);
      g.connect(this.sfx ?? ac.destination);
      o.start(t0);
      o.stop(t0 + dur + 0.04);
    }
  }

  private knock(freq: number, dur: number, gain: number, cut: number, fall: number, rise = 0.06, pad = 0.09) {
    const ac = this.ac;
    if (!ac || this.sfxVol <= 0.001) return;
    const t = ac.currentTime;
    const body = Math.max(0.08, dur);
    const riseUsed = Math.max(0.03, rise);
    const start = t + pad;
    const stop = start + body + pad;
    const o = ac.createOscillator();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, start);
    o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * fall), start + body);
    f.type = "lowpass";
    f.frequency.setValueAtTime(cut, start);
    const peak = Math.max(0.0001, gain * this.sfxVol);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(peak, start + riseUsed);
    g.gain.linearRampToValueAtTime(0, start + body);
    g.gain.linearRampToValueAtTime(0, stop);
    o.connect(f);
    f.connect(g);
    g.connect(this.sfx ?? ac.destination);
    o.start(t);
    o.stop(stop + 0.03);
  }

  work(_kind: string) {}

  hammer() {}

  goman() {}

  bleat() {}

  arrow() {}

  hit() {}

  thud() {}

  crackle() {}

  private spark(delay: number) {
    const ac = this.ac;
    if (!ac) return;
    const t = ac.currentTime + delay;
    const src = ac.createBufferSource();
    src.buffer = this.noise(ac);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 700 + Math.random() * 1600;
    bp.Q.value = 0.6;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(Math.max(0.0001, 0.04 * this.sfxVol), t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.sfx ?? ac.destination);
    src.start(t);
    src.stop(t + 0.08);
  }

  private harpsichord(freq: number, time: number, gain: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const o = ac.createOscillator();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(freq, time);
    f.type = "lowpass";
    f.frequency.setValueAtTime(900, time);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.28);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 3.2);
    o.connect(f);
    f.connect(g);
    g.connect(music);
    o.start(time);
    o.stop(time + 3.3);
  }

  private stringBass(freq: number, time: number, dur: number, gain: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const o = ac.createOscillator();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(freq, time);
    f.type = "lowpass";
    f.frequency.value = 260;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(f);
    f.connect(g);
    g.connect(music);
    o.start(time);
    o.stop(time + dur + 0.02);
  }

  private violin(freq: number, time: number, dur: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const o = ac.createOscillator();
    const o2 = ac.createOscillator();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    o.type = "sawtooth";
    o2.type = "triangle";
    o.frequency.setValueAtTime(freq, time);
    o.frequency.linearRampToValueAtTime(freq * 1.008, time + dur * 0.5);
    o.frequency.linearRampToValueAtTime(freq, time + dur);
    o2.frequency.setValueAtTime(freq * 1.004, time);
    f.type = "lowpass";
    f.frequency.value = 1600;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.018, time + 0.28);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(f);
    o2.connect(f);
    f.connect(g);
    g.connect(music);
    o.start(time);
    o2.start(time);
    o.stop(time + dur + 0.02);
    o2.stop(time + dur + 0.02);
  }

  private bassDrum(time: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(128, time);
    o.frequency.exponentialRampToValueAtTime(86, time + 0.28);
    g.gain.setValueAtTime(0, time);
    g.gain.setValueAtTime(0, time + 0.03);
    g.gain.linearRampToValueAtTime(0.028, time + 0.12);
    g.gain.linearRampToValueAtTime(0, time + 0.42);
    o.connect(g);
    g.connect(music);
    o.start(time);
    o.stop(time + 0.46);
    this.drones.push(o);
  }

  private tuba(freq: number, time: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const o = ac.createOscillator();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(freq, time);
    f.type = "lowpass";
    f.frequency.value = 240;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.04, time + 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 4.2);
    o.connect(f);
    f.connect(g);
    g.connect(music);
    o.start(time);
    o.stop(time + 4.3);
  }

  private pluck(freq: number, time: number, dur: number, gain: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(freq, time);
    g.gain.setValueAtTime(gain, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g);
    g.connect(music);
    o.start(time);
    o.stop(time + dur + 0.02);
  }

  private flute(freq: number, time: number, dur: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, time);
    o.frequency.linearRampToValueAtTime(freq * 1.012, time + dur * 0.45);
    o.frequency.linearRampToValueAtTime(freq, time + dur);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.026, time + 0.28);
    g.gain.setValueAtTime(0.02, time + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g);
    g.connect(music);
    o.start(time);
    o.stop(time + dur + 0.02);
  }

  private drum(time: number, gain: number) {
    const ac = this.ac;
    const music = this.music;
    if (!ac || !music) return;
    const src = ac.createBufferSource();
    src.buffer = this.noise(ac);
    const bp = ac.createBiquadFilter();
    bp.type = "lowpass";
    bp.frequency.value = 240;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.02);
    g.gain.linearRampToValueAtTime(0, time + 0.12);
    src.connect(bp);
    bp.connect(g);
    g.connect(music);
    src.start(time);
    src.stop(time + 0.14);
  }

  private burst(freq: number, dur: number, gain: number) {
    const ac = this.ac;
    if (!ac || this.sfxVol <= 0.001) return;
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = this.noise(ac);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain * this.sfxVol, t + 0.03);
    g.gain.linearRampToValueAtTime(0, t + Math.max(0.08, dur));
    src.connect(bp);
    bp.connect(g);
    g.connect(this.sfx ?? ac.destination);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  private noise(ac: AudioContext) {
    if (this.noiseBuf) return this.noiseBuf;
    const len = Math.floor(ac.sampleRate * 0.3);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    const fade = Math.min(128, Math.floor(len / 8));
    for (let i = 0; i < len; i++) {
      const edge = Math.min(1, i / fade, (len - 1 - i) / fade);
      data[i] = (Math.random() * 2 - 1) * edge;
    }
    this.noiseBuf = buf;
    return buf;
  }
}

export type AudioPrefs = { speed: number; sfx: number; music: number };

export function loadPrefs(): AudioPrefs {
  const base = { speed: 1, sfx: 0.75, music: 0.5 };
  try {
    if (typeof localStorage === "undefined") return base;
    const raw = localStorage.getItem("stickhold-audio");
    if (!raw) return base;
    const p = JSON.parse(raw) as Partial<AudioPrefs>;
    return {
      speed: clamp(p.speed ?? 1, 0.5, 3),
      sfx: clamp(p.sfx ?? 0.75, 0, 1),
      music: clamp(p.music ?? 0.5, 0, 1),
    };
  } catch {
    return base;
  }
}

export function savePrefs(p: AudioPrefs) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("stickhold-audio", JSON.stringify(p));
  } catch {
    /* private mode */
  }
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}
