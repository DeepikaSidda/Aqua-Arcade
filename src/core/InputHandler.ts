/**
 * Input handling for mouse and touch events
 */

import { Point, createPoint } from '../utils/Point';

export interface ClickEvent {
  position: Point;
  timestamp: number;
}

export type ClickCallback = (position: Point) => void;

/**
 * Handles mouse and touch input
 */
export class InputHandler {
  private _clickHistory: ClickEvent[] = [];
  private _lastClickPosition: Point | null = null;
  private clickCallbacks: ClickCallback[] = [];
  private readonly maxHistorySize: number = 100;

  constructor(private canvas: HTMLCanvasElement) {
    this.setupEventListeners();
  }

  /**
   * Sets up event listeners for mouse and touch
   */
  private setupEventListeners(): void {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseDown);

    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
  }

  /**
   * Handles mouse down events
   */
  private handleMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.onPointerDown(x, y);
  };

  /**
   * Handles touch start events
   */
  private handleTouchStart = (event: TouchEvent): void => {
    event.preventDefault();
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.onPointerDown(x, y);
    }
  };

  /**
   * Handles pointer down (mouse or touch)
   */
  onPointerDown(x: number, y: number): void {
    const position = createPoint(x, y);
    this._lastClickPosition = position;

    // Add to history
    const clickEvent: ClickEvent = {
      position,
      timestamp: Date.now(),
    };

    this._clickHistory.push(clickEvent);

    // Limit history size
    if (this._clickHistory.length > this.maxHistorySize) {
      this._clickHistory.shift();
    }

    // Notify callbacks
    this.clickCallbacks.forEach((callback) => callback(position));
  }

  /**
   * Adds a click callback
   */
  addClickCallback(callback: ClickCallback): void {
    this.clickCallbacks.push(callback);
  }

  /**
   * Removes a click callback
   */
  removeClickCallback(callback: ClickCallback): void {
    const index = this.clickCallbacks.indexOf(callback);
    if (index !== -1) {
      this.clickCallbacks.splice(index, 1);
    }
  }

  /**
   * Gets the last click position
   */
  getLastClickPosition(): Point | null {
    return this._lastClickPosition;
  }

  /**
   * Gets the click history
   */
  get clickHistory(): ClickEvent[] {
    return [...this._clickHistory];
  }

  /**
   * Clears the click history
   */
  clearHistory(): void {
    this._clickHistory = [];
    this._lastClickPosition = null;
  }

  /**
   * Removes event listeners
   */
  destroy(): void {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.clickCallbacks = [];
  }
}
