/**
 * Power-up manager for handling active power-ups
 */

import { PowerUpType } from '../entities/PowerUp';

interface ActivePowerUp {
  type: PowerUpType;
  endTime: number;
}

/**
 * Manages active power-ups and their effects
 */
export class PowerUpManager {
  private activePowerUps: Map<PowerUpType, ActivePowerUp> = new Map();

  /**
   * Activates a power-up
   */
  activate(type: PowerUpType, duration: number): void {
    this.activePowerUps.set(type, {
      type,
      endTime: Date.now() + duration,
    });
  }

  /**
   * Updates power-ups and removes expired ones
   */
  update(): void {
    const now = Date.now();
    const toRemove: PowerUpType[] = [];

    this.activePowerUps.forEach((powerUp, type) => {
      if (now >= powerUp.endTime) {
        toRemove.push(type);
      }
    });

    toRemove.forEach((type) => this.activePowerUps.delete(type));
  }

  /**
   * Checks if a power-up is active
   */
  isActive(type: PowerUpType): boolean {
    return this.activePowerUps.has(type);
  }

  /**
   * Gets remaining time for a power-up
   */
  getRemainingTime(type: PowerUpType): number {
    const powerUp = this.activePowerUps.get(type);
    if (!powerUp) return 0;
    return Math.max(0, powerUp.endTime - Date.now());
  }

  /**
   * Gets all active power-ups
   */
  getActivePowerUps(): PowerUpType[] {
    return Array.from(this.activePowerUps.keys());
  }

  /**
   * Clears all power-ups
   */
  clear(): void {
    this.activePowerUps.clear();
  }

  /**
   * Gets the time multiplier (for slow-time effect)
   */
  getTimeMultiplier(): number {
    return this.isActive(PowerUpType.SLOW_TIME) ? 0.5 : 1.0;
  }

  /**
   * Gets the points multiplier
   */
  getPointsMultiplier(): number {
    return this.isActive(PowerUpType.DOUBLE_POINTS) ? 2 : 1;
  }

  /**
   * Checks if shield is active
   */
  hasShield(): boolean {
    return this.isActive(PowerUpType.SHIELD);
  }

  /**
   * Consumes shield (when hit by decoy)
   */
  consumeShield(): void {
    this.activePowerUps.delete(PowerUpType.SHIELD);
  }

  /**
   * Checks if magnet is active
   */
  hasMagnet(): boolean {
    return this.isActive(PowerUpType.MAGNET);
  }
}
