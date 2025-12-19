/**
 * Underwater background with plants and atmosphere
 */

import { Renderer } from './Renderer';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
}

interface Plant {
  x: number;
  height: number;
  width: number;
  color: string;
  swayOffset: number;
}

interface Rock {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  shape: 'round' | 'angular';
}

interface Coral {
  x: number;
  y: number;
  size: number;
  color: string;
  type: 'branch' | 'fan' | 'brain';
}

interface Shell {
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
}

interface ScubaDiver {
  x: number;
  y: number;
  speed: number;
  direction: number; // 1 for right, -1 for left
  swimCycle: number;
}

interface Mermaid {
  x: number;
  y: number;
  rockX: number;
  rockY: number;
  rockWidth: number;
  rockHeight: number;
  hairColor: string;
  tailColor: string;
  skinColor: string;
  animationOffset: number;
}

/**
 * Renders underwater background elements
 */
export class UnderwaterBackground {
  private bubbles: Bubble[] = [];
  private plants: Plant[] = [];
  private mermaids: Mermaid[] = [];
  private rocks: Rock[] = [];
  private corals: Coral[] = [];
  private shells: Shell[] = [];
  private scubaDivers: ScubaDiver[] = [];
  private time: number = 0;
  private nextDiverSpawn: number = 5; // Spawn first diver after 5 seconds

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.initializeBubbles();
    this.initializePlants();
    this.initializeRocks();
    this.initializeCorals();
    this.initializeShells();
    this.initializeMermaids();
  }

  /**
   * Initializes bubbles
   */
  private initializeBubbles(): void {
    for (let i = 0; i < 15; i++) {
      this.bubbles.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        radius: 2 + Math.random() * 4,
        speed: 10 + Math.random() * 20,
      });
    }
  }

  /**
   * Initializes seaweed plants
   */
  private initializePlants(): void {
    // Calculate plant count based on screen width (more plants for wider screens)
    const plantCount = Math.floor(this.canvasWidth / 40); // ~1 plant every 40px
    const spacing = this.canvasWidth / plantCount;

    for (let i = 0; i < plantCount; i++) {
      const colors = ['#2D5016', '#3D6B1F', '#4A7C2C', '#1F4D0F', '#2E7D32', '#388E3C'];
      this.plants.push({
        x: spacing * i + Math.random() * spacing,
        height: 60 + Math.random() * 120,
        width: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        swayOffset: Math.random() * Math.PI * 2,
      });
    }

    // Add some taller background plants
    const bgPlantCount = Math.floor(plantCount / 2);
    for (let i = 0; i < bgPlantCount; i++) {
      const colors = ['#1F4D0F', '#2D5016', '#234A1F'];
      this.plants.push({
        x: Math.random() * this.canvasWidth,
        height: 100 + Math.random() * 150,
        width: 10 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        swayOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  /**
   * Initializes rocks
   */
  private initializeRocks(): void {
    const rockCount = Math.floor(this.canvasWidth / 100); // Scale with screen width
    for (let i = 0; i < rockCount; i++) {
      const shapes: ('round' | 'angular')[] = ['round', 'angular'];
      this.rocks.push({
        x: Math.random() * this.canvasWidth,
        y: this.canvasHeight - 60 - Math.random() * 40,
        width: 40 + Math.random() * 60,
        height: 30 + Math.random() * 40,
        color: ['#5D5D5D', '#707070', '#4A4A4A', '#666666', '#808080'][Math.floor(Math.random() * 5)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
  }

  /**
   * Initializes coral
   */
  private initializeCorals(): void {
    const coralCount = Math.floor(this.canvasWidth / 120); // Scale with screen width
    for (let i = 0; i < coralCount; i++) {
      const types: ('branch' | 'fan' | 'brain')[] = ['branch', 'fan', 'brain'];
      this.corals.push({
        x: Math.random() * this.canvasWidth,
        y: this.canvasHeight - 50 - Math.random() * 30,
        size: 20 + Math.random() * 35,
        color: ['#FF6B9D', '#FFA07A', '#FFB347', '#FF69B4', '#FF8C69', '#FF1493', '#FFD700'][
          Math.floor(Math.random() * 7)
        ],
        type: types[Math.floor(Math.random() * types.length)],
      });
    }
  }

  /**
   * Initializes shells
   */
  private initializeShells(): void {
    const shellCount = Math.floor(this.canvasWidth / 150); // Scale with screen width
    for (let i = 0; i < shellCount; i++) {
      this.shells.push({
        x: Math.random() * this.canvasWidth,
        y: this.canvasHeight - 20 - Math.random() * 15,
        size: 12 + Math.random() * 18,
        rotation: Math.random() * Math.PI * 2,
        color: ['#F5DEB3', '#FFE4B5', '#FFDAB9', '#EEE8AA', '#DEB887'][Math.floor(Math.random() * 5)],
      });
    }
  }

  /**
   * Initializes mermaids sitting on rocks
   */
  private initializeMermaids(): void {
    const mermaidCount = Math.floor(this.canvasWidth / 400); // ~1 mermaid every 400px
    for (let i = 0; i < mermaidCount; i++) {
      const rockWidth = 60 + Math.random() * 40;
      const rockHeight = 40 + Math.random() * 30;
      const rockX = 100 + i * (this.canvasWidth / mermaidCount) + Math.random() * 100;
      const rockY = this.canvasHeight - 80 - Math.random() * 20;

      this.mermaids.push({
        x: rockX,
        y: rockY - rockHeight / 2 - 30, // Sit on top of rock
        rockX,
        rockY,
        rockWidth,
        rockHeight,
        hairColor: ['#8B4513', '#FFD700', '#FF6347', '#4B0082', '#00CED1'][Math.floor(Math.random() * 5)],
        tailColor: ['#00CED1', '#FF69B4', '#9370DB', '#20B2AA', '#FF1493'][Math.floor(Math.random() * 5)],
        skinColor: ['#FFD7A8', '#F5CBA7', '#FADADD'][Math.floor(Math.random() * 3)],
        animationOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  /**
   * Updates and renders the background
   */
  render(renderer: Renderer, deltaTime: number): void {
    this.time += deltaTime;

    // Draw gradient background
    this.drawGradientBackground(renderer);

    // Draw light rays
    this.drawLightRays(renderer);

    // Draw sand/ocean floor
    this.drawOceanFloor(renderer);

    // Draw rocks (behind plants)
    this.drawRocks(renderer);

    // Draw mermaids on rocks
    this.drawMermaids(renderer);

    // Draw shells
    this.drawShells(renderer);

    // Draw coral
    this.drawCorals(renderer);

    // Draw plants
    this.drawPlants(renderer);

    // Update and draw scuba divers
    this.updateScubaDivers(deltaTime);
    this.drawScubaDivers(renderer);

    // Update and draw bubbles
    this.updateBubbles(deltaTime);
    this.drawBubbles(renderer);

    // Draw particles in water
    this.drawWaterParticles(renderer);
  }

  /**
   * Draws gradient background
   */
  private drawGradientBackground(renderer: Renderer): void {
    const ctx = renderer.context;
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
    gradient.addColorStop(0, '#4A90E2');
    gradient.addColorStop(0.5, '#5BA3E8');
    gradient.addColorStop(1, '#6BB6FF');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  /**
   * Draws light rays from above
   */
  private drawLightRays(renderer: Renderer): void {
    const ctx = renderer.context;
    ctx.save();
    ctx.globalAlpha = 0.2;

    for (let i = 0; i < 5; i++) {
      const x = (i * this.canvasWidth) / 4 + Math.sin(this.time + i) * 20;
      const gradient = ctx.createLinearGradient(x, 0, x + 50, this.canvasHeight);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, 0, 50, this.canvasHeight);
    }

    ctx.restore();
  }

  /**
   * Draws seaweed plants
   */
  private drawPlants(renderer: Renderer): void {
    const ctx = renderer.context;

    for (const plant of this.plants) {
      ctx.save();
      ctx.translate(plant.x, this.canvasHeight);

      // Draw swaying plant
      const segments = 8;
      const segmentHeight = plant.height / segments;

      ctx.fillStyle = plant.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);

      for (let i = 0; i <= segments; i++) {
        const y = -i * segmentHeight;
        const sway = Math.sin(this.time * 2 + plant.swayOffset + i * 0.5) * (i * 2);
        const width = plant.width * (1 - i / segments);

        if (i === 0) {
          ctx.lineTo(sway - width / 2, y);
        } else {
          ctx.lineTo(sway - width / 2, y);
        }
      }

      for (let i = segments; i >= 0; i--) {
        const y = -i * segmentHeight;
        const sway = Math.sin(this.time * 2 + plant.swayOffset + i * 0.5) * (i * 2);
        const width = plant.width * (1 - i / segments);
        ctx.lineTo(sway + width / 2, y);
      }

      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  /**
   * Updates bubble positions
   */
  private updateBubbles(deltaTime: number): void {
    for (const bubble of this.bubbles) {
      bubble.y -= bubble.speed * deltaTime;
      bubble.x += Math.sin(this.time * 2 + bubble.y * 0.01) * 0.5;

      // Reset bubble when it reaches the top
      if (bubble.y < -10) {
        bubble.y = this.canvasHeight + 10;
        bubble.x = Math.random() * this.canvasWidth;
      }
    }
  }

  /**
   * Draws bubbles
   */
  private drawBubbles(renderer: Renderer): void {
    const ctx = renderer.context;

    for (const bubble of this.bubbles) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bubble.x - bubble.radius / 3, bubble.y - bubble.radius / 3, bubble.radius / 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  /**
   * Draws ocean floor
   */
  private drawOceanFloor(renderer: Renderer): void {
    const ctx = renderer.context;
    const floorHeight = 80;

    // Sand gradient
    const gradient = ctx.createLinearGradient(0, this.canvasHeight - floorHeight, 0, this.canvasHeight);
    gradient.addColorStop(0, '#C2B280');
    gradient.addColorStop(0.5, '#D4C5A9');
    gradient.addColorStop(1, '#E6D7B8');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, this.canvasHeight - floorHeight, this.canvasWidth, floorHeight);

    // Sand texture (small dots)
    ctx.fillStyle = 'rgba(139, 119, 101, 0.3)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * this.canvasWidth;
      const y = this.canvasHeight - floorHeight + Math.random() * floorHeight;
      ctx.fillRect(x, y, 2, 2);
    }
  }

  /**
   * Draws rocks
   */
  private drawRocks(renderer: Renderer): void {
    const ctx = renderer.context;

    for (const rock of this.rocks) {
      ctx.save();
      ctx.fillStyle = rock.color;

      if (rock.shape === 'round') {
        // Round rock
        ctx.beginPath();
        ctx.ellipse(rock.x, rock.y, rock.width / 2, rock.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Shading
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(rock.x + 5, rock.y + 5, rock.width / 2, rock.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Angular rock
        ctx.beginPath();
        ctx.moveTo(rock.x, rock.y - rock.height / 2);
        ctx.lineTo(rock.x + rock.width / 2, rock.y);
        ctx.lineTo(rock.x + rock.width / 3, rock.y + rock.height / 2);
        ctx.lineTo(rock.x - rock.width / 3, rock.y + rock.height / 2);
        ctx.lineTo(rock.x - rock.width / 2, rock.y);
        ctx.closePath();
        ctx.fill();

        // Shading
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(rock.x, rock.y);
        ctx.lineTo(rock.x + rock.width / 2, rock.y);
        ctx.lineTo(rock.x + rock.width / 3, rock.y + rock.height / 2);
        ctx.lineTo(rock.x - rock.width / 3, rock.y + rock.height / 2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  /**
   * Draws coral
   */
  private drawCorals(renderer: Renderer): void {
    const ctx = renderer.context;

    for (const coral of this.corals) {
      ctx.save();
      ctx.translate(coral.x, coral.y);
      ctx.fillStyle = coral.color;

      if (coral.type === 'branch') {
        // Branching coral
        this.drawBranchCoral(ctx, 0, 0, coral.size, 0);
      } else if (coral.type === 'fan') {
        // Fan coral
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let angle = -Math.PI / 3; angle <= Math.PI / 3; angle += 0.2) {
          const x = Math.cos(angle) * coral.size;
          const y = Math.sin(angle) * coral.size - coral.size;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(0, 0);
        ctx.fill();
      } else {
        // Brain coral
        ctx.beginPath();
        ctx.arc(0, 0, coral.size / 2, 0, Math.PI, true);
        ctx.fill();

        // Texture lines
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        for (let i = -coral.size / 2; i < coral.size / 2; i += 8) {
          ctx.beginPath();
          ctx.arc(i, 0, 6, 0, Math.PI, true);
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  }

  /**
   * Draws branching coral recursively
   */
  private drawBranchCoral(ctx: CanvasRenderingContext2D, x: number, y: number, length: number, angle: number): void {
    if (length < 3) return;

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = length / 3;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.stroke();

    // Branch
    this.drawBranchCoral(ctx, endX, endY, length * 0.7, angle - 0.5);
    this.drawBranchCoral(ctx, endX, endY, length * 0.7, angle + 0.5);
  }

  /**
   * Draws shells
   */
  private drawShells(renderer: Renderer): void {
    const ctx = renderer.context;

    for (const shell of this.shells) {
      ctx.save();
      ctx.translate(shell.x, shell.y);
      ctx.rotate(shell.rotation);
      ctx.fillStyle = shell.color;

      // Shell shape
      ctx.beginPath();
      ctx.ellipse(0, 0, shell.size, shell.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shell lines
      ctx.strokeStyle = 'rgba(139, 119, 101, 0.5)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const angle = (i * Math.PI * 2) / 5;
        ctx.lineTo(Math.cos(angle) * shell.size, Math.sin(angle) * shell.size * 0.8);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  /**
   * Draws floating particles in water
   */
  private drawWaterParticles(renderer: Renderer): void {
    const ctx = renderer.context;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

    for (let i = 0; i < 30; i++) {
      const x = (Math.sin(this.time + i) * 50 + i * 30) % this.canvasWidth;
      const y = (Math.cos(this.time * 0.5 + i) * 100 + i * 20) % this.canvasHeight;
      ctx.fillRect(x, y, 1, 1);
    }

    ctx.restore();
  }

  /**
   * Updates scuba diver positions
   */
  private updateScubaDivers(deltaTime: number): void {
    // Check if it's time to spawn a new diver
    if (this.time >= this.nextDiverSpawn) {
      this.spawnScubaDiver();
      this.nextDiverSpawn = this.time + 8 + Math.random() * 12; // Next diver in 8-20 seconds
    }

    // Update existing divers
    for (let i = this.scubaDivers.length - 1; i >= 0; i--) {
      const diver = this.scubaDivers[i];
      diver.x += diver.speed * diver.direction * deltaTime;
      diver.swimCycle += deltaTime * 3;

      // Remove divers that have left the screen
      if (diver.direction > 0 && diver.x > this.canvasWidth + 100) {
        this.scubaDivers.splice(i, 1);
      } else if (diver.direction < 0 && diver.x < -100) {
        this.scubaDivers.splice(i, 1);
      }
    }
  }

  /**
   * Spawns a new scuba diver
   */
  private spawnScubaDiver(): void {
    const direction = Math.random() < 0.5 ? 1 : -1;
    const x = direction > 0 ? -80 : this.canvasWidth + 80;
    const y = 100 + Math.random() * (this.canvasHeight - 300); // Middle area

    this.scubaDivers.push({
      x,
      y,
      speed: 30 + Math.random() * 20,
      direction,
      swimCycle: Math.random() * Math.PI * 2,
    });
  }

  /**
   * Draws scuba divers
   */
  private drawScubaDivers(renderer: Renderer): void {
    const ctx = renderer.context;

    for (const diver of this.scubaDivers) {
      ctx.save();
      ctx.translate(diver.x, diver.y);

      // Flip if going left
      if (diver.direction < 0) {
        ctx.scale(-1, 1);
      }

      // Body (wetsuit)
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head (with mask)
      ctx.fillStyle = '#FFD7A8';
      ctx.beginPath();
      ctx.arc(0, -30, 12, 0, Math.PI * 2);
      ctx.fill();

      // Diving mask
      ctx.fillStyle = '#00BFFF';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.ellipse(0, -30, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Oxygen tank
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(-8, -5, 16, 20);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(-6, -3, 12, 3);

      // Arms (animated swimming)
      const armSwing = Math.sin(diver.swimCycle) * 15;
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 6;

      // Left arm
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.lineTo(-20, armSwing);
      ctx.stroke();

      // Right arm
      ctx.beginPath();
      ctx.moveTo(10, -10);
      ctx.lineTo(20, -armSwing);
      ctx.stroke();

      // Legs (animated swimming)
      const legKick = Math.sin(diver.swimCycle + Math.PI) * 10;

      // Left leg
      ctx.beginPath();
      ctx.moveTo(-8, 20);
      ctx.lineTo(-12, 35 + legKick);
      ctx.stroke();

      // Right leg
      ctx.beginPath();
      ctx.moveTo(8, 20);
      ctx.lineTo(12, 35 - legKick);
      ctx.stroke();

      // Flippers
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(-18, 35 + legKick, 12, 6);
      ctx.fillRect(6, 35 - legKick, 12, 6);

      // Bubbles from diver
      if (Math.random() < 0.3) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        const bubbleX = -5 + Math.random() * 10;
        const bubbleY = -25 + Math.random() * 5;
        ctx.beginPath();
        ctx.arc(bubbleX, bubbleY, 2 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  /**
   * Draws mermaids sitting on rocks
   */
  private drawMermaids(renderer: Renderer): void {
    const ctx = renderer.context;

    for (const mermaid of this.mermaids) {
      ctx.save();

      // Draw the rock first
      ctx.fillStyle = '#808080';
      ctx.beginPath();
      ctx.ellipse(mermaid.rockX, mermaid.rockY, mermaid.rockWidth / 2, mermaid.rockHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shading on rock
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(
        mermaid.rockX + 5,
        mermaid.rockY + 5,
        mermaid.rockWidth / 2,
        mermaid.rockHeight / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Now draw the mermaid sitting on the rock
      ctx.translate(mermaid.x, mermaid.y);

      // Animated tail sway
      const tailSway = Math.sin(this.time * 2 + mermaid.animationOffset) * 5;

      // Tail (fish tail)
      ctx.fillStyle = mermaid.tailColor;
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.quadraticCurveTo(-5 + tailSway, 35, -8 + tailSway, 45);
      ctx.quadraticCurveTo(-3 + tailSway, 50, 0 + tailSway, 48);
      ctx.quadraticCurveTo(3 + tailSway, 50, 8 + tailSway, 45);
      ctx.quadraticCurveTo(5 + tailSway, 35, 0, 20);
      ctx.fill();

      // Tail scales pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 25 + i * 8, 6, 0, Math.PI, false);
        ctx.stroke();
      }

      // Tail fin
      ctx.fillStyle = mermaid.tailColor;
      ctx.beginPath();
      ctx.moveTo(0 + tailSway, 48);
      ctx.lineTo(-12 + tailSway, 58);
      ctx.lineTo(0 + tailSway, 55);
      ctx.lineTo(12 + tailSway, 58);
      ctx.closePath();
      ctx.fill();

      // Body (torso)
      ctx.fillStyle = mermaid.skinColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Seashell bra
      ctx.fillStyle = '#FFB6C1';
      ctx.beginPath();
      ctx.arc(-6, -5, 5, 0, Math.PI * 2);
      ctx.arc(6, -5, 5, 0, Math.PI * 2);
      ctx.fill();

      // Arms
      const armWave = Math.sin(this.time * 1.5 + mermaid.animationOffset) * 10;
      ctx.strokeStyle = mermaid.skinColor;
      ctx.lineWidth = 4;

      // Left arm
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-15, 10 + armWave);
      ctx.stroke();

      // Right arm
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(15, 10 - armWave);
      ctx.stroke();

      // Head
      ctx.fillStyle = mermaid.skinColor;
      ctx.beginPath();
      ctx.arc(0, -22, 10, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = mermaid.hairColor;
      ctx.beginPath();
      ctx.arc(0, -25, 11, 0, Math.PI, true);
      ctx.fill();

      // Long flowing hair
      ctx.beginPath();
      ctx.moveTo(-11, -22);
      ctx.quadraticCurveTo(-15, -10, -12, 5);
      ctx.lineTo(-8, 5);
      ctx.quadraticCurveTo(-10, -10, -9, -22);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(11, -22);
      ctx.quadraticCurveTo(15, -10, 12, 5);
      ctx.lineTo(8, 5);
      ctx.quadraticCurveTo(10, -10, 9, -22);
      ctx.closePath();
      ctx.fill();

      // Face details
      // Eyes
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-3, -23, 2, 0, Math.PI * 2);
      ctx.arc(3, -23, 2, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = '#FF69B4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -20, 4, 0, Math.PI, false);
      ctx.stroke();

      // Bubbles from mermaid (occasionally)
      if (Math.random() < 0.1) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        const bubbleX = -5 + Math.random() * 10;
        const bubbleY = -30 + Math.random() * 5;
        ctx.beginPath();
        ctx.arc(bubbleX, bubbleY, 2 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }
}
