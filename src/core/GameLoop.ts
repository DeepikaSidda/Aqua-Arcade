/**
 * Game loop implementation with fixed timestep
 */

export type UpdateCallback = (deltaTime: number) => void;
export type RenderCallback = () => void;

/**
 * Manages the game loop at 60 FPS
 */
export class GameLoop {
  private _isRunning: boolean = false;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly targetFPS: number = 60;
  private readonly fixedDeltaTime: number;
  private animationFrameId: number | null = null;
  private _fps: number = 60;
  private fpsUpdateTime: number = 0;
  private frameCount: number = 0;

  private updateCallback: UpdateCallback;
  private renderCallback: RenderCallback;

  constructor(updateCallback: UpdateCallback, renderCallback: RenderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
    this.fixedDeltaTime = 1000 / this.targetFPS; // milliseconds per frame
  }

  /**
   * Starts the game loop
   */
  start(): void {
    if (this._isRunning) {
      return;
    }

    this._isRunning = true;
    this.lastTime = performance.now();
    this.fpsUpdateTime = this.lastTime;
    this.frameCount = 0;
    this.loop(this.lastTime);
  }

  /**
   * Stops the game loop
   */
  stop(): void {
    this._isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main loop function
   */
  private loop = (currentTime: number): void => {
    if (!this._isRunning) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(this.loop);

    // Calculate delta time
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update FPS counter
    this.frameCount++;
    if (currentTime - this.fpsUpdateTime >= 1000) {
      this._fps = this.frameCount;
      this.frameCount = 0;
      this.fpsUpdateTime = currentTime;
    }

    // Accumulate time
    this.accumulator += deltaTime;

    // Fixed timestep updates
    while (this.accumulator >= this.fixedDeltaTime) {
      this.updateCallback(this.fixedDeltaTime / 1000); // Convert to seconds
      this.accumulator -= this.fixedDeltaTime;
    }

    // Render
    this.renderCallback();
  };

  /**
   * Gets the current FPS
   */
  get fps(): number {
    return this._fps;
  }

  /**
   * Checks if the loop is running
   */
  get isRunning(): boolean {
    return this._isRunning;
  }
}
