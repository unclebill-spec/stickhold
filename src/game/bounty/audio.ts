export class NightScore {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private sfx: GainNode | null = null;
  private timer = 0;
  private step = 0;
  musicVol = 0.35;
  sfxVol = 0.4;
  on = false;

  unlock() {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const ctx = new AudioContext();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    filter.connect(master);
    this.music = ctx.createGain();
    this.music.gain.value = this.musicVol;
    this.music.connect(filter);
    this.sfx = ctx.createGain();
    this.sfx.gain.value = this.sfxVol;
    this.sfx.connect(filter);
    this.master = master;
    this.on = true;
    this.loop();
  }

  private loop = () => {
    if (!this.ctx || !this.music || !this.on) return;
    const phrase = [110, 130.81, 146.83, 164.81, 196, 164.81, 146.83, 130.81, 98, 110, 123.47, 146.83];
    const n = phrase[this.step % phrase.length];
    this.tone(n / 2, 1.35, "sine", this.music, 0.05);
    this.tone(n, 1.15, "triangle", this.music, 0.035);
    if (this.step % 4 === 0) this.tone(n * 1.5, 0.9, "sine", this.music, 0.02);
    this.step++;
    this.timer = window.setTimeout(this.loop, 1280);
  };

  private tone(freq: number, dur: number, type: OscillatorType, dest: GainNode, vol: number) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    const now = this.ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + 0.18);
    g.gain.exponentialRampToValueAtTime(vol * 0.7, now + dur * 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g);
    g.connect(dest);
    o.start(now);
    o.stop(now + dur + 0.02);
  }

  blip() {
    if (!this.ctx || !this.sfx || !this.on) return;
    this.tone(220, 0.12, "sine", this.sfx, 0.06);
  }

  setMusic(v: number) {
    this.musicVol = v;
    if (this.music) this.music.gain.value = v;
  }

  setSfx(v: number) {
    this.sfxVol = v;
    if (this.sfx) this.sfx.gain.value = v;
  }

  stop() {
    this.on = false;
    if (this.timer) window.clearTimeout(this.timer);
    void this.ctx?.close();
    this.ctx = null;
  }
}
