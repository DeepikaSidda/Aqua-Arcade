/**
 * Collision detection utilities
 */

import { Point } from './Point';

/**
 * Checks if a point is inside a rectangle
 */
export function pointInRect(
  point: Point,
  rectX: number,
  rectY: number,
  rectWidth: number,
  rectHeight: number
): boolean {
  return (
    point.x >= rectX &&
    point.x <= rectX + rectWidth &&
    point.y >= rectY &&
    point.y <= rectY + rectHeight
  );
}

/**
 * Checks if a point is inside a circle
 */
export function pointInCircle(point: Point, centerX: number, centerY: number, radius: number): boolean {
  const dx = point.x - centerX;
  const dy = point.y - centerY;
  return dx * dx + dy * dy <= radius * radius;
}

/**
 * Checks if two circles overlap
 */
export function circleOverlap(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distanceSquared = dx * dx + dy * dy;
  const radiusSum = r1 + r2;
  return distanceSquared <= radiusSum * radiusSum;
}

/**
 * Checks if two rectangles overlap
 */
export function rectOverlap(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}
