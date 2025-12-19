/**
 * School of tiny fish that move together
 */

import { Point } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';
import { Entity, EntityType, Sprite } from './Entity';

interface TinyFish {
  offsetX: number;
  offsetY: number;
  phase: number;
}

/**
 * Fish School entity class - Multiple small fish moving together
 */
export class FishSchool extends Entity {
  public tinyFish: TinyFish[] = [];
  public schoolSize: number;

  constructor(id: string, position: Point, velocity: Vector2D, sprite: Sprite, public readonly pointValue: number) {
    super(id, EntityType.SCHOOL, position, velocity, sprite);
    this.maxLifetime = 25000; // 25 seconds

    // Create 5-10 tiny fish in the school
    this.schoolSize = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < this.schoolSize; i++) {
      this.tinyFish.push({
        offsetX: (Math.random() - 0.5) * 60,
        offsetY: (Math.random() - 0.5) * 40,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  /**
   * Updates the fish school
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    // Update each tiny fish's swimming animation
    for (const fish of this.tinyFish) {
      fish.phase += deltaTime * 4;
    }
  }

  /**
   * Creates a fish school
   */
  static create(id: string, position: Point, velocity: Vector2D): FishSchool {
    const sprite: Sprite = {
      width: 80,
      height: 60,
      color: '#87CEEB',
      secondaryColor: '#4682B4',
      currentFrame: 0,
      frameCount: 1,
    };

    return new FishSchool(id, position, velocity, sprite, 25); // Worth 25 points
  }
}
