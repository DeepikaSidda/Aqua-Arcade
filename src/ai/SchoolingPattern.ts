/**
 * Schooling movement pattern using steering behaviors
 */

import { IEntity, EntityType } from '../entities/Entity';
import { Fish, BehaviorState } from '../entities/Fish';
import { Vector2D } from '../utils/Vector2D';
import { MovementPattern, BehaviorContext } from './MovementPattern';
import { SteeringBehaviors } from './SteeringBehaviors';

/**
 * Schooling pattern - fish move in coordinated groups
 */
export class SchoolingPattern implements MovementPattern {
  readonly name = 'Schooling';

  constructor(
    private separationWeight: number = 1.5,
    private alignmentWeight: number = 1.0,
    private cohesionWeight: number = 1.0,
    private schoolingRadius: number = 100
  ) {}

  calculate(entity: IEntity, _deltaTime: number, _context: BehaviorContext): Vector2D {
    if (entity.type !== EntityType.FISH) {
      return entity.velocity.clone();
    }

    const fish = entity as Fish;

    // If fleeing, don't school
    if (fish.behaviorState === BehaviorState.FLEEING) {
      return entity.velocity.clone();
    }

    // Get nearby fish
    const neighbors = fish.nearbyFish;

    if (neighbors.length === 0) {
      return entity.velocity.clone();
    }

    // Calculate steering forces
    const separation = SteeringBehaviors.separate(entity, neighbors, 50);
    const alignment = SteeringBehaviors.align(entity, neighbors, this.schoolingRadius);
    const cohesion = SteeringBehaviors.cohere(entity, neighbors, this.schoolingRadius);

    // Apply weights
    separation.x *= this.separationWeight;
    separation.y *= this.separationWeight;
    alignment.x *= this.alignmentWeight;
    alignment.y *= this.alignmentWeight;
    cohesion.x *= this.cohesionWeight;
    cohesion.y *= this.cohesionWeight;

    // Combine forces
    const acceleration = separation.add(alignment).add(cohesion);
    const newVelocity = entity.velocity.add(acceleration);

    return newVelocity.limit(60); // Reduced from 150
  }
}
