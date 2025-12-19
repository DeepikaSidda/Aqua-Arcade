/**
 * Represents a 2D point in space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Creates a new Point
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Calculates the distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the angle between two points in radians
 */
export function angleBetween(from: Point, to: Point): number {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

/**
 * Checks if a point is within a rectangular bounds
 */
export function isPointInBounds(
  point: Point,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
): boolean {
  return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
}

/**
 * Checks if a point is within a circle
 */
export function isPointInCircle(point: Point, center: Point, radius: number): boolean {
  return distance(point, center) <= radius;
}
