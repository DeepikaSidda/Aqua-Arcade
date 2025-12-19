/**
 * Retro sound effects manager using Web Audio API
 */

export enum SoundType {
  FISH_POP = 'FISH_POP',
  DECOY_HIT = 'DECOY_HIT',
  COMBO = 'COMBO',
  GAME_OVER = 'GAME_OVER',
  MENU_SELECT = 'MENU_SELECT',
}

/**
 * Manages retro-style sound effects
 */
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  /**
   * Plays a retro sound effect
   */
  play(type: SoundType): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    switch (type) {
      case SoundType.FISH_POP:
        this.playFishPop(ctx, now);
        break;
      case SoundType.DECOY_HIT:
        this.playDecoyHit(ctx, now);
        break;
      case SoundType.COMBO:
        this.playCombo(ctx, now);
        break;
      case SoundType.GAME_OVER:
        this.playGameOver(ctx, now);
        break;
      case SoundType.MENU_SELECT:
        this.playMenuSelect(ctx, now);
        break;
    }
  }

  /**
   * Fish pop sound - upward chirp
   */
  private playFishPop(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

    gain.gain.setValueAtTime(this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Decoy hit sound - downward buzz
   */
  private playDecoyHit(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);

    gain.gain.setValueAtTime(this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Combo sound - ascending arpeggio
   */
  private playCombo(ctx: AudioContext, now: number): void {
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(this.volume * 0.5, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.1);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.1);
    });
  }

  /**
   * Game over sound - descending sad trombone
   */
  private playGameOver(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);

    gain.gain.setValueAtTime(this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  /**
   * Menu select sound - quick blip
   */
  private playMenuSelect(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Sets the volume
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Enables or disables sound
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}
