/**
 * Entity manager for spawning and managing entities
 */

import { Point, distance } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';
import { IEntity, EntityType } from './Entity';
import { Fish } from './Fish';
import { Decoy, DecoyType } from './Decoy';
import { GoldenFish } from './GoldenFish';
import { PowerUp } from './PowerUp';
import { Treasure } from './Treasure';
import { Shark } from './Shark';
import { FishSchool } from './FishSchool';
import { BonusCreature } from './BonusCreature';

/**
 * Manages all game entities
 */
export class EntityManager {
  private entities: Map<string, IEntity> = new Map();
  private nextId: number = 0;

  /**
   * Spawns a new entity
   */
  spawn(entityType: EntityType, position: Point, velocity?: Vector2D): IEntity {
    const id = this.generateId();
    const vel = velocity || new Vector2D(0, 0);

    let entity: IEntity;

    switch (entityType) {
      case EntityType.FISH:
        entity = Fish.create(id, position, vel);
        break;
      case EntityType.DECOY:
        const types = [DecoyType.JELLYFISH, DecoyType.OCTOPUS, DecoyType.SEA_URCHIN];
        const randomType = types[Math.floor(Math.random() * types.length)];
        entity = Decoy.create(id, position, vel, randomType);
        break;
      case EntityType.GOLDEN_FISH:
        entity = GoldenFish.create(id, position, vel);
        break;
      case EntityType.POWER_UP:
        entity = PowerUp.create(id, position, vel);
        break;
      case EntityType.TREASURE:
        entity = Treasure.create(id, position, vel);
        break;
      case EntityType.SHARK:
        entity = Shark.create(id, position, vel);
        break;
      case EntityType.SCHOOL:
        entity = FishSchool.create(id, position, vel);
        break;
      case EntityType.BONUS_CREATURE:
        entity = BonusCreature.create(id, position, vel);
        break;
      default:
        entity = Fish.create(id, position, vel);
    }

    this.entities.set(id, entity);
    return entity;
  }

  /**
   * Despawns an entity by ID
   */
  despawn(entityId: string): void {
    const entity = this.entities.get(entityId);
    if (entity) {
      entity.destroy();
      this.entities.delete(entityId);
    }
  }

  /**
   * Updates all entities
   */
  update(deltaTime: number): void {
    const toRemove: string[] = [];

    this.entities.forEach((entity) => {
      if (!entity.isAlive) {
        toRemove.push(entity.id);
        return;
      }

      entity.update(deltaTime);
    });

    // Remove dead entities
    toRemove.forEach((id) => this.entities.delete(id));
  }

  /**
   * Gets all entities within a radius of a center point
   */
  getEntitiesInRadius(center: Point, radius: number): IEntity[] {
    const result: IEntity[] = [];

    this.entities.forEach((entity) => {
      if (distance(center, entity.position) <= radius) {
        result.push(entity);
      }
    });

    return result;
  }

  /**
   * Gets all active entities
   */
  get activeEntities(): IEntity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Gets entities by type
   */
  getEntitiesByType(type: EntityType): IEntity[] {
    return this.activeEntities.filter((e) => e.type === type);
  }

  /**
   * Gets an entity by ID
   */
  getEntityById(id: string): IEntity | undefined {
    return this.entities.get(id);
  }

  /**
   * Finds the entity at a given point
   */
  getEntityAtPoint(point: Point): IEntity | null {
    for (const entity of this.entities.values()) {
      if (entity.isClicked(point)) {
        return entity;
      }
    }
    return null;
  }

  /**
   * Clears all entities
   */
  clear(): void {
    this.entities.clear();
  }

  /**
   * Gets the count of active entities
   */
  get count(): number {
    return this.entities.size;
  }

  /**
   * Generates a unique entity ID
   */
  private generateId(): string {
    return `entity_${this.nextId++}`;
  }
}
