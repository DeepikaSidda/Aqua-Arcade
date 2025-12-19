/**
 * Represents a 2D vector with mathematical operations
 */
export class Vector2D {
  constructor(
    public x: number,
    public y: number
  ) {}

  /**
   * Calculates the magnitude (length) of the vector
   */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns a normalized version of the vector (length = 1)
   * Returns zero vector if magnitude is zero
   */
  normalize(): Vector2D {
    const mag = this.magnitude();
    if (mag === 0) {
      return new Vector2D(0, 0);
    }
    return new Vector2D(this.x / mag, this.y / mag);
  }

  /**
   * Adds another vector to this vector
   */
  add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtracts another vector from this vector
   */
  subtract(other: Vector2D): Vector2D {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  /**
   * Multiplies the vector by a scalar
   */
  multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  /**
   * Divides the vector by a scalar
   */
  divide(scalar: number): Vector2D {
    if (scalar === 0) {
      return new Vector2D(0, 0);
    }
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  /**
   * Calculates the dot product with another vector
   */
  dot(other: Vector2D): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Limits the magnitude of the vector to a maximum value
   */
  limit(max: number): Vector2D {
    const mag = this.magnitude();
    if (mag > max) {
      return this.normalize().multiply(max);
    }
    return new Vector2D(this.x, this.y);
  }

  /**
   * Returns a copy of the vector
   */
  clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  /**
   * Sets the vector's components
   */
  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Creates a zero vector
   */
  static zero(): Vector2D {
    return new Vector2D(0, 0);
  }

  /**
   * Creates a vector from an angle and magnitude
   */
  static fromAngle(angle: number, magnitude: number = 1): Vector2D {
    return new Vector2D(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
  }

  /**
   * Calculates the distance between two vectors
   */
  static distance(v1: Vector2D, v2: Vector2D): number {
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
