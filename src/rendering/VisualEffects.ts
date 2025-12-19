/**
 * Visual effects system
 */

import { Point } from '../utils/Point';
import { Renderer } from './Renderer';

export enum EffectType {
  FISH_POP = 'FISH_POP',
  DECOY_CLICK = 'DECOY_CLICK',
  COMBO = 'COMBO',
}

interface Effect {
  position: Point;
  type: EffectType;
  startTime: number;
  duration: number;
}

/**
 * Manages visual effects
 */
export class VisualEffects {
  private effects: Effect[] = [];

  /**
   * Adds a new effect
   */
  addEffect(position: Point, type: EffectType): void {
    const duration = type === EffectType.COMBO ? 500 : 300;
    
    this.effects.push({
      position: { ...position },
      type,
      startTime: Date.now(),
      duration,
    });
  }

  /**
   * Updates and renders all effects
   */
  update(renderer: Renderer): void {
    const now = Date.now();
    const activeEffects: Effect[] = [];

    for (const effect of this.effects) {
      const elapsed = now - effect.startTime;
      
      if (elapsed < effect.duration) {
        activeEffects.push(effect);
        this.renderEffect(renderer, effect, elapsed / effect.duration);
      }
    }

    this.effects = activeEffects;
  }

  /**
   * Renders a single effect
   */
  private renderEffect(renderer: Renderer, effect: Effect, progress: number): void {
    const alpha = 1 - progress;
    const radius = 20 + progress * 30;

    switch (effect.type) {
      case EffectType.FISH_POP:
        renderer.drawEffect(effect.position, radius, '#00FF00', alpha);
        break;
      case EffectType.DECOY_CLICK:
        renderer.drawEffect(effect.position, radius, '#FF0000', alpha);
        break;
      case EffectType.COMBO:
        renderer.drawEffect(effect.position, radius * 0.8, '#FFD700', alpha);
        break;
    }
  }

  /**
   * Clears all effects
   */
  clear(): void {
    this.effects = [];
  }
}
