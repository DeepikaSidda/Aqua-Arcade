/**
 * Intelligent spawn system that uses player analytics
 */

import { Point } from '../utils/Point';
import { PlayerAnalytics } from './PlayerAnalytics';

/**
 * Smart spawning system that adapts to player behavior
 */
export class SmartSpawner {
  constructor(
    private analytics: PlayerAnalytics,
    private canvasWidth: number,
    private canvasHeight: number
  ) {}

  /**
   * Suggests optimal position for a decoy based on player weaknesses
   */
  suggestDecoyPosition(): Point | null {
    // 70% chance to use smart placement, 30% random
    if (Math.random() < 0.7) {
      const weakAreas = this.analytics.getWeakAreas();
      if (weakAreas.length > 0) {
        // Pick a random weak area
        return weakAreas[Math.floor(Math.random() * weakAreas.length)];
      }

      // If no weak areas, place near predicted click location
      const predicted = this.analytics.predictNextClick();
      if (predicted) {
        // Place decoy near but not exactly at predicted location
        const offset = 50 + Math.random() * 100;
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.max(50, Math.min(this.canvasWidth - 50, predicted.x + Math.cos(angle) * offset)),
          y: Math.max(50, Math.min(this.canvasHeight - 50, predicted.y + Math.sin(angle) * offset)),
        };
      }
    }

    // Fallback to random position
    return null;
  }

  /**
   * Suggests optimal position for a fish (away from player's focus)
   */
  suggestFishPosition(): Point | null {
    // 50% chance to use smart placement
    if (Math.random() < 0.5) {
      const hotspot = this.analytics.getMostClickedArea();
      if (hotspot) {
        // Place fish away from hotspot
        const distance = 200 + Math.random() * 200;
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.max(50, Math.min(this.canvasWidth - 50, hotspot.x + Math.cos(angle) * distance)),
          y: Math.max(50, Math.min(this.canvasHeight - 50, hotspot.y + Math.sin(angle) * distance)),
        };
      }
    }

    return null;
  }

  /**
   * Determines if we should spawn a challenging fish based on player pattern
   */
  shouldSpawnChallengingFish(): boolean {
    const pattern = this.analytics.getClickingPattern();
    const accuracy = this.analytics.getAccuracy();

    // If player is doing well and has a pattern, spawn challenging fish
    return accuracy > 0.7 && pattern !== 'balanced' && Math.random() < 0.3;
  }

  /**
   * Gets position for challenging fish (in player's weak zone)
   */
  getChallengingFishPosition(): Point {
    const pattern = this.analytics.getClickingPattern();
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;

    // Spawn in opposite area of player's preference
    switch (pattern) {
      case 'left':
        return {
          x: centerX + this.canvasWidth / 4 + Math.random() * (this.canvasWidth / 4 - 50),
          y: centerY + (Math.random() - 0.5) * this.canvasHeight * 0.6,
        };
      case 'right':
        return {
          x: 50 + Math.random() * (this.canvasWidth / 4),
          y: centerY + (Math.random() - 0.5) * this.canvasHeight * 0.6,
        };
      case 'center':
        // Spawn at edges
        const side = Math.random() < 0.5 ? 0 : 1;
        return {
          x: side === 0 ? 50 + Math.random() * 100 : this.canvasWidth - 150 + Math.random() * 100,
          y: 50 + Math.random() * (this.canvasHeight - 100),
        };
      default:
        return {
          x: 50 + Math.random() * (this.canvasWidth - 100),
          y: 50 + Math.random() * (this.canvasHeight - 100),
        };
    }
  }
}
