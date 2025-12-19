/**
 * Controls entity behaviors and movement patterns
 */

import { IEntity, EntityType } from '../entities/Entity';
import { Fish, BehaviorState } from '../entities/Fish';
import {
  MovementPattern,
  LinearPattern,
  SinusoidalPattern,
  EvasivePattern,
  BehaviorContext,
  EdgeHandler,
} from './MovementPattern';

/**
 * Manages entity behaviors and movement
 */
export class BehaviorController {
  private patterns: Map<string, MovementPattern> = new Map();
  private entityPatterns: Map<string, MovementPattern> = new Map();
  private time: number = 0;

  constructor(
    private canvasWidth: number,
    private canvasHeight: number
  ) {
    this.initializePatterns();
  }

  /**
   * Initializes available movement patterns
   */
  private initializePatterns(): void {
    this.patterns.set('linear', new LinearPattern());
    this.patterns.set('sinusoidal', new SinusoidalPattern());
    this.patterns.set('evasive', new EvasivePattern());
  }

  /**
   * Calculates schooling behavior for fish
   */
  calculateSchooling(fish: Fish[]): void {
    const schoolingRadius = 100;

    // Update nearby fish for each fish
    for (const fish1 of fish) {
      fish1.nearbyFish = [];
      
      for (const fish2 of fish) {
        if (fish1.id === fish2.id) continue;

        const dx = fish1.position.x - fish2.position.x;
        const dy = fish1.position.y - fish2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < schoolingRadius) {
          fish1.nearbyFish.push(fish2);
        }
      }

      // If fish has neighbors, set to schooling state
      if (fish1.nearbyFish.length > 0 && fish1.behaviorState !== BehaviorState.FLEEING) {
        fish1.behaviorState = BehaviorState.SCHOOLING;
      } else if (fish1.behaviorState === BehaviorState.SCHOOLING) {
        fish1.behaviorState = BehaviorState.NORMAL;
      }
    }
  }

  /**
   * Assigns a movement pattern to an entity
   */
  assignBehavior(entity: IEntity, difficulty: number): MovementPattern {
    let patternName: string;

    // Assign patterns based on entity type and difficulty
    if (entity.type === EntityType.FISH) {
      if (difficulty < 0.3) {
        patternName = 'linear';
      } else if (difficulty < 0.7) {
        patternName = Math.random() < 0.5 ? 'linear' : 'sinusoidal';
      } else {
        const rand = Math.random();
        if (rand < 0.33) {
          patternName = 'linear';
        } else if (rand < 0.66) {
          patternName = 'sinusoidal';
        } else {
          patternName = 'evasive';
        }
      }
    } else {
      // Decoys use simpler patterns
      patternName = Math.random() < 0.7 ? 'linear' : 'sinusoidal';
    }

    const pattern = this.patterns.get(patternName) || this.patterns.get('linear')!;
    this.entityPatterns.set(entity.id, pattern);
    return pattern;
  }

  /**
   * Updates all entity behaviors
   */
  updateBehaviors(entities: IEntity[], deltaTime: number, difficulty: number): void {
    this.time += deltaTime;

    const context: BehaviorContext = {
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      difficulty,
      time: this.time,
    };

    const speedMultiplier = 0.8 + difficulty * 0.3; // Reduced overall speed

    for (const entity of entities) {
      // Get or assign pattern
      let pattern = this.entityPatterns.get(entity.id);
      if (!pattern) {
        pattern = this.assignBehavior(entity, difficulty);
      }

      // Calculate new velocity
      const newVelocity = pattern.calculate(entity, deltaTime, context);
      entity.velocity = newVelocity.multiply(speedMultiplier);

      // Check if entity should be despawned (too far off screen)
      if (EdgeHandler.shouldDespawn(entity, this.canvasWidth, this.canvasHeight)) {
        entity.destroy();
        this.removeEntity(entity.id);
      }
    }
  }

  /**
   * Triggers flee response for entities near a point
   */
  triggerFleeResponse(epicenter: { x: number; y: number }, radius: number, entities: IEntity[]): void {
    for (const entity of entities) {
      if (entity.type === EntityType.FISH) {
        const fish = entity as Fish;
        const dx = fish.position.x - epicenter.x;
        const dy = fish.position.y - epicenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          fish.startFleeing(2000); // 2 seconds flee duration
          
          // Set velocity away from epicenter
          const angle = Math.atan2(dy, dx);
          const speed = 60; // Reduced from 150
          fish.velocity.x = Math.cos(angle) * speed;
          fish.velocity.y = Math.sin(angle) * speed;
        }
      }
    }
  }

  /**
   * Removes pattern assignment for an entity
   */
  removeEntity(entityId: string): void {
    this.entityPatterns.delete(entityId);
  }

  /**
   * Clears all pattern assignments
   */
  clear(): void {
    this.entityPatterns.clear();
    this.time = 0;
  }
}
