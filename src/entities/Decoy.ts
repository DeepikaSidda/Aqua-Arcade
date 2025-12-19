/**
 * Decoy entity implementation
 */

import { Point } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';
import { Entity, EntityType, Sprite } from './Entity';

export enum DecoyType {
  JELLYFISH = 'JELLYFISH',
  OCTOPUS = 'OCTOPUS',
  SEA_URCHIN = 'SEA_URCHIN',
}

/**
 * Decoy entity class
 */
export class Decoy extends Entity {
  constructor(
    id: string,
    position: Point,
    velocity: Vector2D,
    sprite: Sprite,
    public readonly penaltyValue: number,
    public readonly decoyType: DecoyType
  ) {
    super(id, EntityType.DECOY, position, velocity, sprite);
  }

  /**
   * Creates a basic decoy with default values
   */
  static create(id: string, position: Point, velocity: Vector2D, type?: DecoyType): Decoy {
    // Random type if not specified
    if (!type) {
      const types = [DecoyType.JELLYFISH, DecoyType.OCTOPUS, DecoyType.SEA_URCHIN];
      type = types[Math.floor(Math.random() * types.length)];
    }

    const sprites: Record<DecoyType, { width: number; height: number; color: string }> = {
      [DecoyType.JELLYFISH]: { width: 28, height: 32, color: '#9B59B6' },
      [DecoyType.OCTOPUS]: { width: 32, height: 32, color: '#8B4789' },
      [DecoyType.SEA_URCHIN]: { width: 28, height: 28, color: '#4A4A4A' },
    };

    const spriteData = sprites[type];
    const sprite: Sprite = {
      ...spriteData,
      currentFrame: 0,
      frameCount: 4,
    };

    return new Decoy(id, position, velocity, sprite, 5, type);
  }
}
