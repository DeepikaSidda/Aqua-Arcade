/**
 * Power-up entities
 */

import { Point } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';
import { Entity, EntityType, Sprite } from './Entity';

export enum PowerUpType {
  SLOW_TIME = 'SLOW_TIME',
  SHIELD = 'SHIELD',
  MAGNET = 'MAGNET',
  DOUBLE_POINTS = 'DOUBLE_POINTS',
}

/**
 * Power-up entity class
 */
export class PowerUp extends Entity {
  public pulsePhase: number = 0;

  constructor(
    id: string,
    position: Point,
    velocity: Vector2D,
    sprite: Sprite,
    public readonly powerUpType: PowerUpType,
    public readonly duration: number
  ) {
    super(id, EntityType.POWER_UP, position, velocity, sprite);
    this.maxLifetime = 12000; // 12 seconds to collect
  }

  /**
   * Updates the power-up with pulse animation
   */
  update(deltaTime: number): void {
    super.update(deltaTime);
    this.pulsePhase += deltaTime * 4;
  }

  /**
   * Creates a random power-up
   */
  static create(id: string, position: Point, velocity: Vector2D): PowerUp {
    const types = [PowerUpType.SLOW_TIME, PowerUpType.SHIELD, PowerUpType.MAGNET, PowerUpType.DOUBLE_POINTS];
    const type = types[Math.floor(Math.random() * types.length)];

    const colors: Record<PowerUpType, string> = {
      [PowerUpType.SLOW_TIME]: '#00FFFF',
      [PowerUpType.SHIELD]: '#00FF00',
      [PowerUpType.MAGNET]: '#FF00FF',
      [PowerUpType.DOUBLE_POINTS]: '#FFD700',
    };

    const sprite: Sprite = {
      width: 30,
      height: 30,
      color: colors[type],
      currentFrame: 0,
      frameCount: 1,
    };

    return new PowerUp(id, position, velocity, sprite, type, 5000); // 5 second duration
  }
}
