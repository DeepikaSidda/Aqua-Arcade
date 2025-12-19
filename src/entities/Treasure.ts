/**
 * Treasure chest entity
 */

import { Point } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';
import { Entity, EntityType, Sprite } from './Entity';

/**
 * Treasure chest entity class
 */
export class Treasure extends Entity {
  public sparklePhase: number = 0;

  constructor(id: string, position: Point, velocity: Vector2D, sprite: Sprite, public readonly bonusPoints: number) {
    super(id, EntityType.TREASURE, position, velocity, sprite);
    this.maxLifetime = 10000; // 10 seconds to open it
  }

  /**
   * Updates the treasure with sparkle animation
   */
  update(deltaTime: number): void {
    super.update(deltaTime);
    this.sparklePhase += deltaTime * 6;
  }

  /**
   * Creates a treasure chest
   */
  static create(id: string, position: Point, velocity: Vector2D): Treasure {
    const sprite: Sprite = {
      width: 40,
      height: 35,
      color: '#8B4513',
      secondaryColor: '#FFD700',
      currentFrame: 0,
      frameCount: 1,
    };

    const bonusPoints = 50 + Math.floor(Math.random() * 50); // 50-100 points
    return new Treasure(id, position, velocity, sprite, bonusPoints);
  }
}
