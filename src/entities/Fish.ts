/**
 * Fish entity implementation
 */

import { Point } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';
import { Entity, EntityType, Sprite, FishVariant } from './Entity';

export enum BehaviorState {
  NORMAL = 'NORMAL',
  SCHOOLING = 'SCHOOLING',
  FLEEING = 'FLEEING',
}

/**
 * Fish entity class
 */
export class Fish extends Entity {
  public behaviorState: BehaviorState = BehaviorState.NORMAL;
  public nearbyFish: Fish[] = [];
  public fleeEndTime: number = 0;

  constructor(
    id: string,
    position: Point,
    velocity: Vector2D,
    sprite: Sprite,
    public readonly pointValue: number
  ) {
    super(id, EntityType.FISH, position, velocity, sprite);
  }

  /**
   * Updates the fish
   */
  update(deltaTime: number): void {
    // Check if flee behavior should end
    if (this.behaviorState === BehaviorState.FLEEING && Date.now() > this.fleeEndTime) {
      this.behaviorState = BehaviorState.NORMAL;
    }

    super.update(deltaTime);
  }

  /**
   * Triggers flee behavior
   */
  startFleeing(duration: number): void {
    this.behaviorState = BehaviorState.FLEEING;
    this.fleeEndTime = Date.now() + duration;
  }

  /**
   * Creates a fish with random variant
   */
  static create(id: string, position: Point, velocity: Vector2D): Fish {
    const variants = [
      FishVariant.TROPICAL,
      FishVariant.GOLDFISH,
      FishVariant.CLOWNFISH,
      FishVariant.ANGELFISH,
      FishVariant.PUFFERFISH,
      FishVariant.SEAHORSE,
      FishVariant.STARFISH,
    ];

    const variant = variants[Math.floor(Math.random() * variants.length)];
    return Fish.createWithVariant(id, position, velocity, variant);
  }

  /**
   * Creates a fish with specific variant
   */
  static createWithVariant(id: string, position: Point, velocity: Vector2D, variant: FishVariant): Fish {
    let sprite: Sprite;

    switch (variant) {
      case FishVariant.TROPICAL:
        sprite = {
          width: 40,
          height: 28,
          color: '#FF6B35',
          secondaryColor: '#FFD700',
          currentFrame: 0,
          frameCount: 4,
          variant,
        };
        break;
      case FishVariant.GOLDFISH:
        sprite = {
          width: 35,
          height: 25,
          color: '#FFD700',
          secondaryColor: '#FFA500',
          currentFrame: 0,
          frameCount: 4,
          variant,
        };
        break;
      case FishVariant.CLOWNFISH:
        sprite = {
          width: 38,
          height: 26,
          color: '#FF6B35',
          secondaryColor: '#FFFFFF',
          currentFrame: 0,
          frameCount: 4,
          variant,
        };
        break;
      case FishVariant.ANGELFISH:
        sprite = {
          width: 32,
          height: 42,
          color: '#4169E1',
          secondaryColor: '#87CEEB',
          currentFrame: 0,
          frameCount: 4,
          variant,
        };
        break;
      case FishVariant.PUFFERFISH:
        sprite = {
          width: 36,
          height: 36,
          color: '#F0E68C',
          secondaryColor: '#8B4513',
          currentFrame: 0,
          frameCount: 4,
          variant,
        };
        break;
      case FishVariant.SEAHORSE:
        sprite = {
          width: 24,
          height: 40,
          color: '#FF69B4',
          secondaryColor: '#FFB6C1',
          currentFrame: 0,
          frameCount: 4,
          variant,
        };
        break;
      case FishVariant.STARFISH:
        sprite = {
          width: 32,
          height: 32,
          color: '#FF4500',
          secondaryColor: '#FF6347',
          currentFrame: 0,
          frameCount: 4,
          variant,
        };
        break;
    }

    return new Fish(id, position, velocity, sprite, 10);
  }
}
