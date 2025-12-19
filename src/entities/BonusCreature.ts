/**
 * Bonus creatures - Dolphins, Whales, Turtles
 */

import { Point } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';
import { Entity, EntityType, Sprite } from './Entity';

export enum BonusCreatureType {
  DOLPHIN = 'DOLPHIN',
  WHALE = 'WHALE',
  TURTLE = 'TURTLE',
}

/**
 * Bonus Creature entity class - Rare, high-value creatures
 */
export class BonusCreature extends Entity {
  public animationPhase: number = 0;

  constructor(
    id: string,
    position: Point,
    velocity: Vector2D,
    sprite: Sprite,
    public readonly pointValue: number,
    public readonly creatureType: BonusCreatureType
  ) {
    super(id, EntityType.BONUS_CREATURE, position, velocity, sprite);
    this.maxLifetime = 18000; // 18 seconds
  }

  /**
   * Updates the bonus creature
   */
  update(deltaTime: number): void {
    super.update(deltaTime);
    this.animationPhase += deltaTime * 2;
  }

  /**
   * Creates a random bonus creature
   */
  static create(id: string, position: Point, velocity: Vector2D): BonusCreature {
    const types = [BonusCreatureType.DOLPHIN, BonusCreatureType.WHALE, BonusCreatureType.TURTLE];
    const type = types[Math.floor(Math.random() * types.length)];

    let sprite: Sprite;
    let points: number;

    switch (type) {
      case BonusCreatureType.DOLPHIN:
        sprite = {
          width: 60,
          height: 35,
          color: '#708090',
          secondaryColor: '#D3D3D3',
          currentFrame: 0,
          frameCount: 4,
        };
        points = 50;
        break;
      case BonusCreatureType.WHALE:
        sprite = {
          width: 100,
          height: 50,
          color: '#2F4F4F',
          secondaryColor: '#87CEEB',
          currentFrame: 0,
          frameCount: 4,
        };
        points = 100;
        break;
      case BonusCreatureType.TURTLE:
        sprite = {
          width: 50,
          height: 40,
          color: '#228B22',
          secondaryColor: '#90EE90',
          currentFrame: 0,
          frameCount: 4,
        };
        points = 40;
        break;
    }

    return new BonusCreature(id, position, velocity, sprite, points, type);
  }
}
