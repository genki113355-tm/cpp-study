/**
 * Web Audio API を用いたレトロゲーム風効果音シンセサイザー & グローバル音量・ミュート管理
 * 
 * 外部音声ファイルへの依存ゼロ（超軽量・ゼロレイテンシ）で動作します。
 * 電車内・オフィスでの意図しない発音を防ぐため、初期状態はデフォルトで「ミュート（Mute: ON）」になっています。
 */

export type SfxType = 'shoot' | 'hit' | 'explosion' | 'powerup' | 'clear' | 'ufo';

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private volume: number = 0.5;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMuted = localStorage.getItem('cpp_global_audio_muted');
        // 保存値があればそれを尊重、初回アクセス時は安全のためミュートON(true)
        this.isMuted = savedMuted !== null ? savedMuted === 'true' : true;

        const savedVol = localStorage.getItem('cpp_global_volume');
        if (savedVol !== null) {
          this.volume = Math.max(0, Math.min(1, parseFloat(savedVol) || 0.5));
        }
      } catch {
        this.isMuted = true;
        this.volume = 0.5;
      }
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('cpp_global_audio_muted', String(this.isMuted));
    } catch (e) {
      console.error(e);
    }
    this.notify();
    return this.isMuted;
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    try {
      localStorage.setItem('cpp_global_volume', String(this.volume));
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(): void {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error(e);
      }
    });
  }

  /**
   * レトロ効果音を生成・発音
   */
  public play(type: SfxType): void {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.35, now);
      masterGain.connect(ctx.destination);

      switch (type) {
        case 'shoot': {
          // レーザー射撃音（周波数高速下降の矩形波）
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

          gain.gain.setValueAtTime(0.8, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 0.13);
          break;
        }

        case 'hit': {
          // 被弾・ヒット音（短時間の三角波パルス）
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.linearRampToValueAtTime(220, now + 0.08);

          gain.gain.setValueAtTime(1, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.08);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        case 'explosion': {
          // 爆発音（ホワイトノイズ ＋ ローパスフィルタ）
          const bufferSize = Math.floor(ctx.sampleRate * 0.25);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);
          filter.frequency.linearRampToValueAtTime(80, now + 0.25);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(1, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          noise.start(now);
          noise.stop(now + 0.26);
          break;
        }

        case 'ufo': {
          // UFO出現音（うねる高周波）
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.linearRampToValueAtTime(900, now + 0.1);
          osc.frequency.linearRampToValueAtTime(600, now + 0.2);

          gain.gain.setValueAtTime(0.5, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 0.21);
          break;
        }

        case 'powerup': {
          // アイテム取得音（上昇アルペジオ）
          const freqs = [330, 440, 550, 660];
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noteTime = now + idx * 0.05;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, noteTime);

            gain.gain.setValueAtTime(0.6, noteTime);
            gain.gain.linearRampToValueAtTime(0.01, noteTime + 0.08);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(noteTime);
            osc.stop(noteTime + 0.09);
          });
          break;
        }

        case 'clear': {
          // ゲームクリア・ファンファーレ（ド・ミ・ソ・高ド）
          const notes = [
            { f: 523.25, t: 0.0 }, // C5
            { f: 659.25, t: 0.12 }, // E5
            { f: 783.99, t: 0.24 }, // G5
            { f: 1046.50, t: 0.36 }, // C6
          ];

          notes.forEach(({ f, t }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noteTime = now + t;

            osc.type = 'square';
            osc.frequency.setValueAtTime(f, noteTime);

            gain.gain.setValueAtTime(0.5, noteTime);
            gain.gain.linearRampToValueAtTime(0.01, noteTime + (t === 0.36 ? 0.4 : 0.15));

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(noteTime);
            osc.stop(noteTime + (t === 0.36 ? 0.45 : 0.18));
          });
          break;
        }
      }
    } catch (e) {
      console.error('Audio play error:', e);
    }
  }
}

export const audioManager = new AudioManager();
