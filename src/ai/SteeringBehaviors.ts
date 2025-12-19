/**
 * Steering behaviors for realistic entity movement
 */

import { IEntity } from '../entities/Entity';
import { Point } from '../utils/Point';
import { Vector2D } from '../utils/Vector2D';

/**
 * Implements steering behaviors for entities
 */
export class SteeringBehaviors {
  /**
   * Seek behavior - move towards a target
   */
  static seek(entity: IEntity, target: Point, maxSpeed: number = 100): Vector2D {
    const desired = new Vector2D(
      target.x - entity.position.x,
      target.y - entity.position.y
    );

    const distance = desired.magnitude();
    if (distance === 0) {
      return Vector2D.zero();
    }

    desired.set(desired.x / distance * maxSpeed, desired.y / distance * maxSpeed);
    
    const steer = desired.subtract(entity.velocity);
    return steer.limit(maxSpeed * 0.1);
  }

  /**
   * Flee behavior - move away from a threat
   */
  static flee(entity: IEntity, threat: Point, maxSpeed: number = 150): Vector2D {
    const desired = new Vector2D(
      entity.position.x - threat.x,
      entity.position.y - threat.y
    );

    const distance = desired.magnitude();
    if (distance === 0) {
      return Vector2D.zero();
    }

    desired.set(desired.x / distance * maxSpeed, desired.y / distance * maxSpeed);
    
    const steer = desired.subtract(entity.velocity);
    return steer.limit(maxSpeed * 0.2);
  }

  /**
   * Separation - avoid crowding neighbors
   */
  static separate(entity: IEntity, neighbors: IEntity[], desiredSeparation: number = 50): Vector2D {
    const steer = Vector2D.zero();
    let count = 0;

    for (const other of neighbors) {
      if (other.id === entity.id) continue;

      const dx = entity.position.x - other.position.x;
      const dy = entity.position.y - other.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0 && distance < desiredSeparation) {
        const diff = new Vector2D(dx, dy).normalize().divide(distance);
        steer.x += diff.x;
        steer.y += diff.y;
        count++;
      }
    }

    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
    }

    return steer;
  }

  /**
   * Alignment - steer towards average heading of neighbors
   */
  static align(entity: IEntity, neighbors: IEntity[], neighborDist: number = 100): Vector2D {
    const sum = Vector2D.zero();
    let count = 0;

    for (const other of neighbors) {
      if (other.id === entity.id) continue;

      const dx = entity.position.x - other.position.x;
      const dy = entity.position.y - other.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0 && distance < neighborDist) {
        sum.x += other.velocity.x;
        sum.y += other.velocity.y;
        count++;
      }
    }

    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      
      const steer = sum.subtract(entity.velocity);
      return steer.limit(1);
    }

    return Vector2D.zero();
  }

  /**
   * Cohesion - steer towards average position of neighbors
   */
  static cohere(entity: IEntity, neighbors: IEntity[], neighborDist: number = 100): Vector2D {
    const sum = { x: 0, y: 0 };
    let count = 0;

    for (const other of neighbors) {
      if (other.id === entity.id) continue;

      const dx = entity.position.x - other.position.x;
      const dy = entity.position.y - other.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0 && distance < neighborDist) {
        sum.x += other.position.x;
        sum.y += other.position.y;
        count++;
      }
    }

    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      return this.seek(entity, sum, 50);
    }

    return Vector2D.zero();
  }
}
