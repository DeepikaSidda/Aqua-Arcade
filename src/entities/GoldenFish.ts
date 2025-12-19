/**
 * Golden Fish - Rare, high-value fish
 */

import { Point } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';
import { Entity, EntityType, Sprite } from './Entity';

/**
 * Golden Fish entity class - Worth 3x points
 */
export class GoldenFish extends Entity {
  public glowPhase: number = 0;

  constructor(id: string, position: Point, velocity: Vector2D, sprite: Sprite, public readonly pointValue: number) {
    super(id, EntityType.GOLDEN_FISH, position, velocity, sprite);
    this.maxLifetime = 15000; // Only 15 seconds to catch it!
  }

  /**
   * Updates the golden fish with glow animation
   */
  update(deltaTime: number): void {
    super.update(deltaTime);
    this.glowPhase += deltaTime * 5; // Glow animation
  }

  /**
   * Creates a golden fish
   */
  static create(id: string, position: Point, velocity: Vector2D): GoldenFish {
    const sprite: Sprite = {
      width: 45,
      height: 32,
      color: '#FFD700',
      secondaryColor: '#FFA500',
      currentFrame: 0,
      frameCount: 4,
    };

    return new GoldenFish(id, position, velocity, sprite, 30); // 3x normal fish value
  }
}
