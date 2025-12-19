/**
 * Rendering system for the game
 */

import { Point } from '../utils/Point';
import { IEntity } from '../entities/Entity';

export interface TextStyle {
  font: string;
  color: string;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
}

/**
 * Handles all rendering operations
 */
export class Renderer {
  private ctx: CanvasRenderingContext2D;
  // private pixelScale: number = 2;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D rendering context');
    }
    this.ctx = ctx;
    this.setupPixelArt();
  }

  /**
   * Sets up pixel art rendering
   */
  private setupPixelArt(): void {
    this.ctx.imageSmoothingEnabled = false;
  }

  /**
   * Clears the canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Fills the canvas with a color
   */
  fillBackground(color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws an entity as a fish or decoy shape
   */
  drawEntity(entity: IEntity): void {
    const { position, sprite, type } = entity;
    
    this.ctx.save();
    this.ctx.translate(position.x, position.y);
    
    // Determine direction based on velocity
    if (entity.velocity.x < 0) {
      this.ctx.scale(-1, 1);
    }

    switch (type) {
      case 'FISH':
        this.drawFish(sprite);
        break;
      case 'DECOY':
        const decoyEntity = entity as any;
        const spriteWithType = { ...sprite, decoyType: decoyEntity.decoyType };
        this.drawDecoy(spriteWithType);
        break;
      case 'GOLDEN_FISH':
        this.drawGoldenFish(entity as any);
        break;
      case 'POWER_UP':
        this.drawPowerUp(entity as any);
        break;
      case 'TREASURE':
        this.drawTreasure(entity as any);
        break;
      case 'SHARK':
        this.drawShark(entity as any);
        break;
      case 'SCHOOL':
        this.drawFishSchool(entity as any);
        break;
      case 'BONUS_CREATURE':
        this.drawBonusCreature(entity as any);
        break;
      default:
        this.drawFish(sprite);
    }
    
    this.ctx.restore();
  }

  /**
   * Draws a fish shape based on variant
   */
  private drawFish(sprite: any): void {
    const variant = sprite.variant;

    switch (variant) {
      case 'TROPICAL':
        this.drawTropicalFish(sprite);
        break;
      case 'GOLDFISH':
        this.drawGoldfish(sprite);
        break;
      case 'CLOWNFISH':
        this.drawClownfish(sprite);
        break;
      case 'ANGELFISH':
        this.drawAngelfish(sprite);
        break;
      case 'PUFFERFISH':
        this.drawPufferfish(sprite);
        break;
      case 'SEAHORSE':
        this.drawSeahorse(sprite);
        break;
      case 'STARFISH':
        this.drawStarfish(sprite);
        break;
      default:
        this.drawTropicalFish(sprite);
    }
  }

  private drawTropicalFish(sprite: any): void {
    const w = sprite.width;
    const h = sprite.height;
    
    // Body
    this.ctx.fillStyle = sprite.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Stripes
    this.ctx.fillStyle = sprite.secondaryColor;
    for (let i = 0; i < 3; i++) {
      this.ctx.fillRect(-w / 4 + i * 8, -h / 2, 3, h);
    }
    
    // Tail
    this.ctx.fillStyle = sprite.color;
    this.ctx.beginPath();
    this.ctx.moveTo(-w / 2, 0);
    this.ctx.lineTo(-w / 2 - 10, -h / 3);
    this.ctx.lineTo(-w / 2 - 10, h / 3);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Eye
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, -h / 6, 4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, -h / 6, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawGoldfish(sprite: any): void {
    const w = sprite.width;
    const h = sprite.height;
    
    // Body
    this.ctx.fillStyle = sprite.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Fancy tail
    this.ctx.fillStyle = sprite.secondaryColor;
    this.ctx.beginPath();
    this.ctx.moveTo(-w / 2, 0);
    this.ctx.quadraticCurveTo(-w / 2 - 15, -h / 2, -w / 2 - 8, -h / 4);
    this.ctx.quadraticCurveTo(-w / 2 - 15, h / 2, -w / 2 - 8, h / 4);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Eye
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, -h / 6, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawClownfish(sprite: any): void {
    const w = sprite.width;
    const h = sprite.height;
    
    // Body
    this.ctx.fillStyle = sprite.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // White stripes
    this.ctx.fillStyle = sprite.secondaryColor;
    this.ctx.fillRect(-w / 6, -h / 2, 6, h);
    this.ctx.fillRect(w / 6, -h / 2, 6, h);
    
    // Black outline on stripes
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(-w / 6, -h / 2, 6, h);
    this.ctx.strokeRect(w / 6, -h / 2, 6, h);
    
    // Tail
    this.ctx.fillStyle = sprite.color;
    this.ctx.beginPath();
    this.ctx.moveTo(-w / 2, 0);
    this.ctx.lineTo(-w / 2 - 8, -h / 4);
    this.ctx.lineTo(-w / 2 - 8, h / 4);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Eye
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, -h / 6, 4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, -h / 6, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawAngelfish(sprite: any): void {
    const w = sprite.width;
    const h = sprite.height;
    
    // Tall body
    this.ctx.fillStyle = sprite.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Top fin
    this.ctx.fillStyle = sprite.secondaryColor;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -h / 2);
    this.ctx.lineTo(-w / 4, -h / 2 - 10);
    this.ctx.lineTo(w / 4, -h / 2 - 10);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Bottom fin
    this.ctx.beginPath();
    this.ctx.moveTo(0, h / 2);
    this.ctx.lineTo(-w / 4, h / 2 + 10);
    this.ctx.lineTo(w / 4, h / 2 + 10);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Eye
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, 0, 4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, 0, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawPufferfish(sprite: any): void {
    const w = sprite.width;
    const h = sprite.height;
    
    // Round body
    this.ctx.fillStyle = sprite.color;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Spikes
    this.ctx.strokeStyle = sprite.secondaryColor;
    this.ctx.lineWidth = 2;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      const x1 = Math.cos(angle) * (w / 2);
      const y1 = Math.sin(angle) * (w / 2);
      const x2 = Math.cos(angle) * (w / 2 + 6);
      const y2 = Math.sin(angle) * (w / 2 + 6);
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
    
    // Eye
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, -h / 6, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawSeahorse(sprite: any): void {
    const w = sprite.width;
    const h = sprite.height;
    
    // Body curve
    this.ctx.fillStyle = sprite.color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -h / 2);
    this.ctx.quadraticCurveTo(w / 4, -h / 4, w / 4, 0);
    this.ctx.quadraticCurveTo(w / 4, h / 4, 0, h / 2);
    this.ctx.quadraticCurveTo(-w / 4, h / 4, -w / 4, 0);
    this.ctx.quadraticCurveTo(-w / 4, -h / 4, 0, -h / 2);
    this.ctx.fill();
    
    // Head
    this.ctx.beginPath();
    this.ctx.arc(0, -h / 2 + 6, 8, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Snout
    this.ctx.fillRect(6, -h / 2 + 4, 6, 4);
    
    // Eye
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(2, -h / 2 + 6, 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Fin
    this.ctx.fillStyle = sprite.secondaryColor;
    this.ctx.beginPath();
    this.ctx.moveTo(w / 4, -h / 8);
    this.ctx.lineTo(w / 4 + 8, -h / 8 - 6);
    this.ctx.lineTo(w / 4 + 8, -h / 8 + 6);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawStarfish(sprite: any): void {
    const w = sprite.width;
    const outerRadius = w / 2;
    const innerRadius = w / 4;
    
    // Star shape
    this.ctx.fillStyle = sprite.color;
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const innerAngle = ((i * 2 + 1) * Math.PI) / 5 - Math.PI / 2;
      
      const outerX = Math.cos(outerAngle) * outerRadius;
      const outerY = Math.sin(outerAngle) * outerRadius;
      const innerX = Math.cos(innerAngle) * innerRadius;
      const innerY = Math.sin(innerAngle) * innerRadius;
      
      if (i === 0) {
        this.ctx.moveTo(outerX, outerY);
      } else {
        this.ctx.lineTo(outerX, outerY);
      }
      this.ctx.lineTo(innerX, innerY);
    }
    this.ctx.closePath();
    this.ctx.fill();
    
    // Spots
    this.ctx.fillStyle = sprite.secondaryColor;
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = Math.cos(angle) * (outerRadius / 2);
      const y = Math.sin(angle) * (outerRadius / 2);
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Draws a decoy shape based on entity's decoy type
   */
  private drawDecoy(sprite: any): void {
    const w = sprite.width;
    const h = sprite.height;
    
    // Get decoy type from entity (passed through rendering)
    const decoyType = (sprite as any).decoyType || 'JELLYFISH';
    
    if (decoyType === 'JELLYFISH') {
      // Jellyfish
      this.ctx.fillStyle = sprite.color;
      this.ctx.beginPath();
      this.ctx.arc(0, -h / 4, w / 2, 0, Math.PI, true);
      this.ctx.fill();
      
      // Tentacles
      for (let i = -1; i <= 1; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(i * w / 4, 0);
        this.ctx.quadraticCurveTo(i * w / 4 + 3, h / 4, i * w / 4, h / 2);
        this.ctx.strokeStyle = sprite.color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
      }
      
      // Spots
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.beginPath();
      this.ctx.arc(-w / 6, -h / 4, 3, 0, Math.PI * 2);
      this.ctx.arc(w / 6, -h / 4, 3, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (decoyType === 'OCTOPUS') {
      // Octopus
      this.ctx.fillStyle = sprite.color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Tentacles (8 of them)
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const startX = Math.cos(angle) * (w / 2);
        const startY = Math.sin(angle) * (w / 2);
        const endX = Math.cos(angle) * (w / 2 + 12);
        const endY = Math.sin(angle) * (w / 2 + 12);
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.quadraticCurveTo(
          startX + Math.cos(angle + 0.3) * 8,
          startY + Math.sin(angle + 0.3) * 8,
          endX,
          endY
        );
        this.ctx.strokeStyle = sprite.color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
      }
      
      // Eyes
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(-w / 6, -h / 8, 4, 0, Math.PI * 2);
      this.ctx.arc(w / 6, -h / 8, 4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#000000';
      this.ctx.beginPath();
      this.ctx.arc(-w / 6, -h / 8, 2, 0, Math.PI * 2);
      this.ctx.arc(w / 6, -h / 8, 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      // Sea urchin
      this.ctx.fillStyle = sprite.color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, w / 3, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Spikes
      this.ctx.strokeStyle = sprite.color;
      this.ctx.lineWidth = 2;
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI * 2) / 16;
        const startX = Math.cos(angle) * (w / 3);
        const startY = Math.sin(angle) * (w / 3);
        const endX = Math.cos(angle) * (w / 2 + 8);
        const endY = Math.sin(angle) * (w / 2 + 8);
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
      }
    }
  }

  /**
   * Draws text on the canvas
   */
  drawText(text: string, position: Point, style: TextStyle): void {
    this.ctx.font = style.font;
    this.ctx.fillStyle = style.color;
    this.ctx.textAlign = style.align;
    this.ctx.textBaseline = style.baseline;
    this.ctx.fillText(text, position.x, position.y);
  }

  /**
   * Draws a visual effect (simple circle for now)
   */
  drawEffect(position: Point, radius: number, color: string, alpha: number = 1): void {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  /**
   * Draws a circle outline
   */
  drawCircle(position: Point, radius: number, color: string, lineWidth: number = 2): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  /**
   * Draws a rectangle
   */
  drawRect(x: number, y: number, width: number, height: number, color: string, filled: boolean = true): void {
    if (filled) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, height);
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(x, y, width, height);
    }
  }

  /**
   * Sets the pixel scale for retro rendering
   */
  setPixelScale(_scale: number): void {
    // Pixel scale setting - currently not used but kept for API compatibility
  }

  /**
   * Gets the canvas width
   */
  get width(): number {
    return this.canvas.width;
  }

  /**
   * Gets the canvas height
   */
  get height(): number {
    return this.canvas.height;
  }

  /**
   * Gets the rendering context
   */
  get context(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Draws a golden fish with glow effect
   */
  private drawGoldenFish(entity: any): void {
    const w = entity.sprite.width;
    const h = entity.sprite.height;
    const glowIntensity = 0.5 + Math.sin(entity.glowPhase) * 0.3;

    // Glow effect
    this.ctx.shadowColor = '#FFD700';
    this.ctx.shadowBlur = 15 * glowIntensity;

    // Body
    this.ctx.fillStyle = entity.sprite.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Scales pattern
    this.ctx.fillStyle = entity.sprite.secondaryColor;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        this.ctx.beginPath();
        this.ctx.arc(-w / 4 + i * 10, -h / 4 + j * 8, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Tail
    this.ctx.fillStyle = entity.sprite.color;
    this.ctx.beginPath();
    this.ctx.moveTo(-w / 2, 0);
    this.ctx.lineTo(-w / 2 - 12, -h / 3);
    this.ctx.lineTo(-w / 2 - 12, h / 3);
    this.ctx.closePath();
    this.ctx.fill();

    // Eye
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, -h / 6, 5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, -h / 6, 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Crown (to show it's special)
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.moveTo(-5, -h / 2);
    this.ctx.lineTo(-3, -h / 2 - 8);
    this.ctx.lineTo(0, -h / 2 - 5);
    this.ctx.lineTo(3, -h / 2 - 8);
    this.ctx.lineTo(5, -h / 2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Draws a power-up bubble
   */
  private drawPowerUp(entity: any): void {
    const size = entity.sprite.width;
    const pulse = 1 + Math.sin(entity.pulsePhase) * 0.2;

    // Outer glow
    this.ctx.shadowColor = entity.sprite.color;
    this.ctx.shadowBlur = 20;

    // Bubble
    this.ctx.fillStyle = entity.sprite.color;
    this.ctx.globalAlpha = 0.6;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, (size / 2) * pulse, 0, Math.PI * 2);
    this.ctx.fill();

    // Inner circle
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = entity.sprite.color;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Icon based on type
    this.ctx.shadowBlur = 0;
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#FFFFFF';

    switch (entity.powerUpType) {
      case 'SLOW_TIME':
        // Clock icon
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, -6);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(4, 0);
        this.ctx.stroke();
        break;
      case 'SHIELD':
        // Shield icon
        this.ctx.beginPath();
        this.ctx.moveTo(0, -8);
        this.ctx.lineTo(6, -4);
        this.ctx.lineTo(6, 4);
        this.ctx.lineTo(0, 8);
        this.ctx.lineTo(-6, 4);
        this.ctx.lineTo(-6, -4);
        this.ctx.closePath();
        this.ctx.stroke();
        break;
      case 'MAGNET':
        // Magnet icon
        this.ctx.beginPath();
        this.ctx.arc(-3, 0, 6, Math.PI / 2, (Math.PI * 3) / 2, false);
        this.ctx.arc(3, 0, 6, (Math.PI * 3) / 2, Math.PI / 2, false);
        this.ctx.stroke();
        break;
      case 'DOUBLE_POINTS':
        // 2x text
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('2x', 0, 0);
        break;
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Draws a treasure chest
   */
  private drawTreasure(entity: any): void {
    const w = entity.sprite.width;
    const h = entity.sprite.height;

    // Chest body
    this.ctx.fillStyle = entity.sprite.color;
    this.ctx.fillRect(-w / 2, -h / 4, w, h / 2);

    // Chest lid
    this.ctx.fillStyle = '#654321';
    this.ctx.fillRect(-w / 2, -h / 2, w, h / 4);

    // Gold trim
    this.ctx.fillStyle = entity.sprite.secondaryColor;
    this.ctx.fillRect(-w / 2, -h / 4 - 2, w, 4);
    this.ctx.fillRect(-w / 2 + w / 3, -h / 2, 4, h);

    // Lock
    this.ctx.fillStyle = '#FFD700';
    this.ctx.fillRect(-4, -h / 8, 8, 10);
    this.ctx.beginPath();
    this.ctx.arc(0, -h / 8, 4, 0, Math.PI, true);
    this.ctx.fill();

    // Sparkles
    const sparkles = [
      { x: -w / 3, y: -h / 2 - 5 },
      { x: w / 3, y: -h / 2 - 8 },
      { x: 0, y: -h / 2 - 10 },
    ];

    this.ctx.fillStyle = '#FFD700';
    for (const sparkle of sparkles) {
      const sparklePhase = entity.sparklePhase + sparkle.x;
      const alpha = 0.5 + Math.sin(sparklePhase) * 0.5;
      this.ctx.globalAlpha = alpha;
      this.ctx.beginPath();
      this.ctx.moveTo(sparkle.x, sparkle.y);
      this.ctx.lineTo(sparkle.x - 2, sparkle.y + 2);
      this.ctx.lineTo(sparkle.x, sparkle.y + 4);
      this.ctx.lineTo(sparkle.x + 2, sparkle.y + 2);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Draws a shark
   */
  private drawShark(entity: any): void {
    const w = entity.sprite.width;
    const h = entity.sprite.height;

    // Body
    this.ctx.fillStyle = entity.sprite.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Dorsal fin
    this.ctx.beginPath();
    this.ctx.moveTo(-w / 6, -h / 2);
    this.ctx.lineTo(-w / 6 - 8, -h / 2 - 15);
    this.ctx.lineTo(-w / 6 + 8, -h / 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Tail
    this.ctx.beginPath();
    this.ctx.moveTo(-w / 2, 0);
    this.ctx.lineTo(-w / 2 - 20, -h / 3);
    this.ctx.lineTo(-w / 2 - 15, 0);
    this.ctx.lineTo(-w / 2 - 20, h / 4);
    this.ctx.closePath();
    this.ctx.fill();

    // Belly (white)
    this.ctx.fillStyle = entity.sprite.secondaryColor;
    this.ctx.beginPath();
    this.ctx.ellipse(0, h / 6, w / 3, h / 4, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Eye
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, -h / 6, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Teeth
    this.ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 6; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(w / 6 + i * 6, h / 4);
      this.ctx.lineTo(w / 6 + i * 6 + 3, h / 4 + 5);
      this.ctx.lineTo(w / 6 + i * 6 + 6, h / 4);
      this.ctx.closePath();
      this.ctx.fill();
    }

    // Gills
    this.ctx.strokeStyle = '#2D3748';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(-w / 6 + i * 8, -h / 6);
      this.ctx.lineTo(-w / 6 + i * 8, h / 6);
      this.ctx.stroke();
    }
  }

  /**
   * Draws a school of tiny fish
   */
  private drawFishSchool(entity: any): void {
    for (const fish of entity.tinyFish) {
      const x = fish.offsetX + Math.sin(fish.phase) * 5;
      const y = fish.offsetY + Math.cos(fish.phase) * 3;

      // Tiny fish body
      this.ctx.fillStyle = entity.sprite.color;
      this.ctx.beginPath();
      this.ctx.ellipse(x, y, 6, 4, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Tiny tail
      this.ctx.fillStyle = entity.sprite.secondaryColor;
      this.ctx.beginPath();
      this.ctx.moveTo(x - 6, y);
      this.ctx.lineTo(x - 9, y - 3);
      this.ctx.lineTo(x - 9, y + 3);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  /**
   * Draws a bonus creature (dolphin, whale, or turtle)
   */
  private drawBonusCreature(entity: any): void {
    const w = entity.sprite.width;
    const h = entity.sprite.height;

    switch (entity.creatureType) {
      case 'DOLPHIN':
        this.drawDolphin(w, h, entity.sprite.color, entity.sprite.secondaryColor);
        break;
      case 'WHALE':
        this.drawWhale(w, h, entity.sprite.color, entity.sprite.secondaryColor);
        break;
      case 'TURTLE':
        this.drawTurtle(w, h, entity.sprite.color, entity.sprite.secondaryColor);
        break;
    }
  }

  private drawDolphin(w: number, h: number, color: string, secondaryColor: string): void {
    // Body
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Belly
    this.ctx.fillStyle = secondaryColor;
    this.ctx.beginPath();
    this.ctx.ellipse(0, h / 6, w / 3, h / 4, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Snout
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(w / 2 + 10, 0, 12, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Dorsal fin
    this.ctx.beginPath();
    this.ctx.moveTo(-w / 6, -h / 2);
    this.ctx.lineTo(-w / 6 - 5, -h / 2 - 12);
    this.ctx.lineTo(-w / 6 + 8, -h / 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Tail
    this.ctx.beginPath();
    this.ctx.moveTo(-w / 2, 0);
    this.ctx.lineTo(-w / 2 - 15, -h / 4);
    this.ctx.lineTo(-w / 2 - 10, 0);
    this.ctx.lineTo(-w / 2 - 15, h / 4);
    this.ctx.closePath();
    this.ctx.fill();

    // Eye
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(w / 4, -h / 6, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Smile
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(w / 3, h / 8, 8, 0, Math.PI, false);
    this.ctx.stroke();
  }

  private drawWhale(w: number, h: number, color: string, secondaryColor: string): void {
    // Body
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Belly
    this.ctx.fillStyle = secondaryColor;
    this.ctx.beginPath();
    this.ctx.ellipse(0, h / 4, w / 2.5, h / 3, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Tail
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(-w / 2, 0);
    this.ctx.lineTo(-w / 2 - 20, -h / 3);
    this.ctx.lineTo(-w / 2 - 15, 0);
    this.ctx.lineTo(-w / 2 - 20, h / 3);
    this.ctx.closePath();
    this.ctx.fill();

    // Fin
    this.ctx.beginPath();
    this.ctx.moveTo(-w / 6, -h / 2);
    this.ctx.lineTo(-w / 6 - 8, -h / 2 - 10);
    this.ctx.lineTo(-w / 6 + 10, -h / 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Eye
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(w / 3, -h / 6, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Blowhole spray
    this.ctx.strokeStyle = secondaryColor;
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(-w / 8, -h / 2);
      this.ctx.lineTo(-w / 8 + (i - 1) * 5, -h / 2 - 15);
      this.ctx.stroke();
    }
  }

  private drawTurtle(w: number, h: number, color: string, secondaryColor: string): void {
    // Shell
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Shell pattern
    this.ctx.strokeStyle = '#654321';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        this.ctx.beginPath();
        this.ctx.arc(-w / 4 + i * w / 4, -h / 4 + j * h / 4, 6, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    }

    // Head
    this.ctx.fillStyle = secondaryColor;
    this.ctx.beginPath();
    this.ctx.ellipse(w / 2 + 8, 0, 10, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Flippers
    this.ctx.fillStyle = secondaryColor;
    // Front flippers
    this.ctx.beginPath();
    this.ctx.ellipse(w / 4, h / 2 + 5, 8, 12, Math.PI / 4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(w / 4, -h / 2 - 5, 8, 12, -Math.PI / 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Back flippers
    this.ctx.beginPath();
    this.ctx.ellipse(-w / 4, h / 2 + 5, 6, 10, Math.PI / 4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(-w / 4, -h / 2 - 5, 6, 10, -Math.PI / 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Eye
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(w / 2 + 10, -2, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
