/**
 * Shark - Dangerous hazard entity
 */

import { Point } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';
import { Entity, EntityType, Sprite } from './Entity';

/**
 * Shark entity class - Clicking it causes penalty
 */
export class Shark extends Entity {
  public swimCycle: number = 0;

  constructor(id: string, position: Point, velocity: Vector2D, sprite: Sprite, public readonly penalty: number) {
    super(id, EntityType.SHARK, position, velocity, sprite);
    this.maxLifetime = 20000; // 20 seconds
  }

  /**
   * Updates the shark with swim animation
   */
  update(deltaTime: number): void {
    super.update(deltaTime);
    this.swimCycle += deltaTime * 3;
  }

  /**
   * Creates a shark
   */
  static create(id: string, position: Point, velocity: Vector2D): Shark {
    const sprite: Sprite = {
      width: 80,
      height: 40,
      color: '#4A5568',
      secondaryColor: '#FFFFFF',
      currentFrame: 0,
      frameCount: 4,
    };

    return new Shark(id, position, velocity, sprite, 20); // -20 points penalty
  }
}
