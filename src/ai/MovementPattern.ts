/**
 * Movement patterns for entities
 */

import { IEntity } from '../entities/Entity';
import { Vector2D } from '../utils/Vector2D';

export interface BehaviorContext {
  canvasWidth: number;
  canvasHeight: number;
  difficulty: number;
  time: number;
}

/**
 * Base movement pattern interface
 */
export interface MovementPattern {
  readonly name: string;
  calculate(entity: IEntity, deltaTime: number, context: BehaviorContext): Vector2D;
}

/**
 * Linear movement pattern - straight line movement
 */
export class LinearPattern implements MovementPattern {
  readonly name = 'Linear';

  calculate(entity: IEntity, _deltaTime: number, _context: BehaviorContext): Vector2D {
    // Continue in current direction
    return entity.velocity.clone();
  }
}

/**
 * Sinusoidal movement pattern - wave-like movement
 */
export class SinusoidalPattern implements MovementPattern {
  readonly name = 'Sinusoidal';
  private frequency: number = 2;
  private amplitude: number = 50;

  calculate(entity: IEntity, deltaTime: number, context: BehaviorContext): Vector2D {
    const baseVelocity = entity.velocity.clone();
    const time = context.time;
    
    // Add sinusoidal component perpendicular to movement direction
    const angle = Math.atan2(baseVelocity.y, baseVelocity.x);
    const perpAngle = angle + Math.PI / 2;
    
    const waveOffset = Math.sin(time * this.frequency) * this.amplitude;
    const perpX = Math.cos(perpAngle) * waveOffset * deltaTime;
    const perpY = Math.sin(perpAngle) * waveOffset * deltaTime;
    
    return new Vector2D(
      baseVelocity.x + perpX,
      baseVelocity.y + perpY
    );
  }
}

/**
 * Evasive movement pattern - unpredictable zigzag movement
 */
export class EvasivePattern implements MovementPattern {
  readonly name = 'Evasive';
  private changeInterval: number = 0.5; // seconds
  private lastChangeTime: number = 0;
  private currentDirection: Vector2D;

  constructor() {
    this.currentDirection = new Vector2D(1, 0);
  }

  calculate(entity: IEntity, _deltaTime: number, context: BehaviorContext): Vector2D {
    const time = context.time;
    
    // Change direction periodically
    if (time - this.lastChangeTime > this.changeInterval) {
      const angle = (Math.random() - 0.5) * Math.PI / 2; // Random angle within 90 degrees
      const currentAngle = Math.atan2(entity.velocity.y, entity.velocity.x);
      const newAngle = currentAngle + angle;
      
      const speed = entity.velocity.magnitude();
      this.currentDirection = Vector2D.fromAngle(newAngle, speed);
      this.lastChangeTime = time;
    }
    
    return this.currentDirection;
  }
}

/**
 * Handles screen edge wrapping or despawning
 */
export class EdgeHandler {
  /**
   * Wraps entity position to opposite edge
   */
  static wrap(entity: IEntity, canvasWidth: number, canvasHeight: number): void {
    const margin = 50;
    
    if (entity.position.x < -margin) {
      entity.position.x = canvasWidth + margin;
    } else if (entity.position.x > canvasWidth + margin) {
      entity.position.x = -margin;
    }
    
    if (entity.position.y < -margin) {
      entity.position.y = canvasHeight + margin;
    } else if (entity.position.y > canvasHeight + margin) {
      entity.position.y = -margin;
    }
  }

  /**
   * Checks if entity should be despawned (off screen)
   */
  static shouldDespawn(entity: IEntity, canvasWidth: number, canvasHeight: number): boolean {
    const margin = 100;
    
    return (
      entity.position.x < -margin ||
      entity.position.x > canvasWidth + margin ||
      entity.position.y < -margin ||
      entity.position.y > canvasHeight + margin
    );
  }
}
