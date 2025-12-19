/**
 * Base entity class and types
 */

import { Point } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';

export enum EntityType {
  FISH = 'FISH',
  DECOY = 'DECOY',
  GOLDEN_FISH = 'GOLDEN_FISH',
  POWER_UP = 'POWER_UP',
  TREASURE = 'TREASURE',
  SHARK = 'SHARK',
  SCHOOL = 'SCHOOL',
  BONUS_CREATURE = 'BONUS_CREATURE',
}

export enum FishVariant {
  TROPICAL = 'TROPICAL',
  GOLDFISH = 'GOLDFISH',
  CLOWNFISH = 'CLOWNFISH',
  ANGELFISH = 'ANGELFISH',
  PUFFERFISH = 'PUFFERFISH',
  SEAHORSE = 'SEAHORSE',
  STARFISH = 'STARFISH',
}

export interface Sprite {
  width: number;
  height: number;
  color: string;
  secondaryColor?: string;
  currentFrame: number;
  frameCount: number;
  variant?: FishVariant;
}

/**
 * Base entity interface
 */
export interface IEntity {
  readonly id: string;
  readonly type: EntityType;
  position: Point;
  velocity: Vector2D;
  sprite: Sprite;
  isAlive: boolean;

  update(deltaTime: number): void;
  isClicked(point: Point): boolean;
  destroy(): void;
}

/**
 * Base entity class
 */
export abstract class Entity implements IEntity {
  public isAlive: boolean = true;
  public spawnTime: number = Date.now();
  public maxLifetime: number = 30000; // 30 seconds default

  constructor(
    public readonly id: string,
    public readonly type: EntityType,
    public position: Point,
    public velocity: Vector2D,
    public sprite: Sprite
  ) {}

  /**
   * Updates the entity
   */
  update(deltaTime: number): void {
    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Check lifetime
    if (Date.now() - this.spawnTime > this.maxLifetime) {
      this.destroy();
    }
  }

  /**
   * Checks if a point is within the entity's bounds
   */
  isClicked(point: Point): boolean {
    const halfWidth = this.sprite.width / 2;
    const halfHeight = this.sprite.height / 2;

    return (
      point.x >= this.position.x - halfWidth &&
      point.x <= this.position.x + halfWidth &&
      point.y >= this.position.y - halfHeight &&
      point.y <= this.position.y + halfHeight
    );
  }

  /**
   * Destroys the entity
   */
  destroy(): void {
    this.isAlive = false;
  }
}
