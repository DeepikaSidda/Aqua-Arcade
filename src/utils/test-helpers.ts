/**
 * Test helper utilities for property-based testing
 */

import * as fc from 'fast-check';

/**
 * Arbitrary for generating valid Point objects
 */
export const arbitraryPoint = (
  minX = 0,
  maxX = 800,
  minY = 0,
  maxY = 600
) => {
  return fc.record({
    x: fc.integer({ min: minX, max: maxX }),
    y: fc.integer({ min: minY, max: maxY }),
  });
};

/**
 * Arbitrary for generating valid Vector2D objects
 */
export const arbitraryVector2D = (
  minValue = -100,
  maxValue = 100
) => {
  return fc.record({
    x: fc.float({ min: minValue, max: maxValue }),
    y: fc.float({ min: minValue, max: maxValue }),
  });
};

/**
 * Arbitrary for generating non-zero vectors
 */
export const arbitraryNonZeroVector2D = () => {
  return fc
    .record({
      x: fc.float({ min: -100, max: 100 }),
      y: fc.float({ min: -100, max: 100 }),
    })
    .filter((v) => v.x !== 0 || v.y !== 0);
};
