/**
 * Retro CRT and arcade effects
 */

import { Renderer } from './Renderer';

/**
 * Applies retro CRT and arcade effects
 */
export class RetroEffects {
  private scanlineOffset: number = 0;

  /**
   * Draws CRT scanlines effect
   */
  drawScanlines(renderer: Renderer, deltaTime: number): void {
    const ctx = renderer.context;
    const width = renderer.width;
    const height = renderer.height;

    this.scanlineOffset += deltaTime * 50;
    if (this.scanlineOffset > 4) this.scanlineOffset = 0;

    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#000000';

    // Draw horizontal scanlines
    for (let y = this.scanlineOffset; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }

    ctx.restore();
  }

  /**
   * Draws CRT screen curvature effect (vignette)
   */
  drawVignette(renderer: Renderer): void {
    const ctx = renderer.context;
    const width = renderer.width;
    const height = renderer.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.save();

    // Create radial gradient for vignette
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.7);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  /**
   * Draws arcade cabinet border
   */
  drawArcadeBorder(renderer: Renderer): void {
    const ctx = renderer.context;
    const width = renderer.width;
    const height = renderer.height;
    const borderSize = 20;

    ctx.save();

    // Outer border (dark wood)
    ctx.fillStyle = '#2C1810';
    ctx.fillRect(0, 0, width, borderSize); // Top
    ctx.fillRect(0, height - borderSize, width, borderSize); // Bottom
    ctx.fillRect(0, 0, borderSize, height); // Left
    ctx.fillRect(width - borderSize, 0, borderSize, height); // Right

    // Inner border (metallic edge)
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 3;
    ctx.strokeRect(borderSize, borderSize, width - borderSize * 2, height - borderSize * 2);

    // Corner screws
    const screwPositions = [
      { x: borderSize / 2, y: borderSize / 2 },
      { x: width - borderSize / 2, y: borderSize / 2 },
      { x: borderSize / 2, y: height - borderSize / 2 },
      { x: width - borderSize / 2, y: height - borderSize / 2 },
    ];

    ctx.fillStyle = '#666666';
    screwPositions.forEach((pos) => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Screw slot
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pos.x - 3, pos.y);
      ctx.lineTo(pos.x + 3, pos.y);
      ctx.stroke();
    });

    // Top label
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐠 FISH POPPER 🐠', width / 2, borderSize / 2);

    ctx.restore();
  }

  /**
   * Draws screen glare effect
   */
  drawScreenGlare(renderer: Renderer, time: number): void {
    const ctx = renderer.context;
    const width = renderer.width;
    const height = renderer.height;

    ctx.save();
    ctx.globalAlpha = 0.03;

    // Moving glare
    const glareX = (Math.sin(time * 0.5) * 0.5 + 0.5) * width;
    const gradient = ctx.createLinearGradient(glareX - 100, 0, glareX + 100, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  /**
   * Applies all retro effects
   */
  applyAllEffects(renderer: Renderer, deltaTime: number, time: number): void {
    this.drawVignette(renderer);
    this.drawScanlines(renderer, deltaTime);
    this.drawScreenGlare(renderer, time);
    this.drawArcadeBorder(renderer);
  }
}
