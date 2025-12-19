/**
 * Main entry point for Aqua Arcade
 */

import { GameLoop, GameStateMachine, GameState, InputHandler, ScoreManager, PowerUpManager } from './core';
import { EntityManager, EntityType, PowerUpType } from './entities';
import { Renderer, VisualEffects, EffectType, UnderwaterBackground, RetroEffects } from './rendering';
import { BehaviorController, DifficultyController, ActionResult, PlayerAnalytics, SmartSpawner } from './ai';
import { Vector2D, DEFAULT_CONFIG } from './utils';
import { SoundManager, SoundType } from './audio';

console.log('Aqua Arcade - Initializing...');

// Get canvas
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
if (!canvas) {
  throw new Error('Canvas element not found');
}

// Set canvas to fullscreen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Initialize systems
const renderer = new Renderer(canvas);
const stateMachine = new GameStateMachine(GameState.START_SCREEN);
const inputHandler = new InputHandler(canvas);
const entityManager = new EntityManager();
const scoreManager = new ScoreManager();
const visualEffects = new VisualEffects();
const behaviorController = new BehaviorController(canvas.width, canvas.height);
const difficultyController = new DifficultyController(DEFAULT_CONFIG.difficulty);
const underwaterBg = new UnderwaterBackground(canvas.width, canvas.height);
const retroEffects = new RetroEffects();
const soundManager = new SoundManager();
const playerAnalytics = new PlayerAnalytics(canvas.width, canvas.height);
const smartSpawner = new SmartSpawner(playerAnalytics, canvas.width, canvas.height);
const powerUpManager = new PowerUpManager();

let spawnTimer = 0;
let gameTime = 0;

let lives = 3;
let sessionStartTime = 0;
let lastEntitySpawnTime = 0;
let coachingTip: string | null = null;
let coachingTipTimer = 0;

// Special spawn timers
let nextGoldenFishSpawn = 15; // First golden fish after 15 seconds
let nextPowerUpSpawn = 10; // First power-up after 10 seconds
let nextTreasureSpawn = 20; // First treasure after 20 seconds
let nextSharkSpawn = 25; // First shark after 25 seconds
let nextSchoolSpawn = 18; // First school after 18 seconds
let nextBonusCreatureSpawn = 30; // First bonus creature after 30 seconds

// Handle clicks
inputHandler.addClickCallback((position) => {
  if (stateMachine.currentState === GameState.START_SCREEN) {
    soundManager.play(SoundType.MENU_SELECT);
    stateMachine.transition(GameState.PLAYING);
    lives = 3;
    sessionStartTime = Date.now();
    lastEntitySpawnTime = Date.now();
    gameTime = 0;
    scoreManager.reset();
    difficultyController.reset();
    entityManager.clear();
    playerAnalytics.reset();
    powerUpManager.clear();
    coachingTip = null;
    
    // Reset special spawn timers
    nextGoldenFishSpawn = 15;
    nextPowerUpSpawn = 10;
    nextTreasureSpawn = 20;
    nextSharkSpawn = 25;
    nextSchoolSpawn = 18;
    nextBonusCreatureSpawn = 30;
    return;
  }

  if (stateMachine.currentState === GameState.GAME_OVER) {
    soundManager.play(SoundType.MENU_SELECT);
    // Restart the game directly
    stateMachine.transition(GameState.PLAYING);
    lives = 3;
    sessionStartTime = Date.now();
    lastEntitySpawnTime = Date.now();
    gameTime = 0;
    scoreManager.reset();
    difficultyController.reset();
    entityManager.clear();
    playerAnalytics.reset();
    powerUpManager.clear();
    coachingTip = null;
    
    // Reset special spawn timers
    nextGoldenFishSpawn = 15;
    nextPowerUpSpawn = 10;
    nextTreasureSpawn = 20;
    nextSharkSpawn = 25;
    nextSchoolSpawn = 18;
    nextBonusCreatureSpawn = 30;
    return;
  }

  if (stateMachine.currentState !== GameState.PLAYING) {
    return;
  }

  const entity = entityManager.getEntityAtPoint(position);
  const clickTime = Date.now();
  const reactionTime = lastEntitySpawnTime > 0 ? clickTime - lastEntitySpawnTime : 500;
  
  if (entity) {
    const pointsMultiplier = powerUpManager.getPointsMultiplier();

    switch (entity.type) {
      case EntityType.FISH:
        // Fish popped!
        const fish = entity as any;
        scoreManager.addScore(fish.pointValue * pointsMultiplier);
        scoreManager.increaseCombo();
        visualEffects.addEffect(position, EffectType.FISH_POP);
        behaviorController.triggerFleeResponse(position, 150, entityManager.activeEntities);
        entityManager.despawn(entity.id);
        difficultyController.recordAction(ActionResult.FISH_POPPED);
        playerAnalytics.recordClick(position, true, reactionTime);
        
        if (scoreManager.combo > 1) {
          soundManager.play(SoundType.COMBO);
        } else {
          soundManager.play(SoundType.FISH_POP);
        }
        
        if (Math.random() < 0.2) {
          coachingTip = playerAnalytics.getCoachingTip();
          coachingTipTimer = 3;
        }
        break;

      case EntityType.GOLDEN_FISH:
        // Golden fish popped!
        const goldenFish = entity as any;
        scoreManager.addScore(goldenFish.pointValue * pointsMultiplier);
        scoreManager.increaseCombo();
        visualEffects.addEffect(position, EffectType.FISH_POP);
        entityManager.despawn(entity.id);
        playerAnalytics.recordClick(position, true, reactionTime);
        soundManager.play(SoundType.COMBO);
        coachingTip = '🌟 Golden Fish! +' + (goldenFish.pointValue * pointsMultiplier) + ' points!';
        coachingTipTimer = 3;
        break;

      case EntityType.POWER_UP:
        // Power-up collected!
        const powerUp = entity as any;
        powerUpManager.activate(powerUp.powerUpType, powerUp.duration);
        entityManager.despawn(entity.id);
        soundManager.play(SoundType.MENU_SELECT);
        
        const powerUpNames: Record<PowerUpType, string> = {
          [PowerUpType.SLOW_TIME]: '⏰ Slow Time!',
          [PowerUpType.SHIELD]: '🛡️ Shield Active!',
          [PowerUpType.MAGNET]: '🧲 Magnet Active!',
          [PowerUpType.DOUBLE_POINTS]: '💰 Double Points!',
        };
        coachingTip = powerUpNames[powerUp.powerUpType as PowerUpType];
        coachingTipTimer = 3;
        break;

      case EntityType.TREASURE:
        // Treasure opened!
        const treasure = entity as any;
        scoreManager.addScore(treasure.bonusPoints * pointsMultiplier);
        entityManager.despawn(entity.id);
        soundManager.play(SoundType.COMBO);
        coachingTip = '💎 Treasure! +' + (treasure.bonusPoints * pointsMultiplier) + ' points!';
        coachingTipTimer = 3;
        break;

      case EntityType.SHARK:
        // Shark clicked - penalty!
        const shark = entity as any;
        scoreManager.subtractScore(shark.penalty);
        scoreManager.resetCombo();
        visualEffects.addEffect(position, EffectType.DECOY_CLICK);
        entityManager.despawn(entity.id);
        playerAnalytics.recordClick(position, false, reactionTime);
        soundManager.play(SoundType.DECOY_HIT);
        coachingTip = '🦈 Shark! -' + shark.penalty + ' points!';
        coachingTipTimer = 3;
        break;

      case EntityType.SCHOOL:
        // Fish school clicked!
        const school = entity as any;
        scoreManager.addScore(school.pointValue * pointsMultiplier);
        scoreManager.increaseCombo();
        visualEffects.addEffect(position, EffectType.FISH_POP);
        entityManager.despawn(entity.id);
        playerAnalytics.recordClick(position, true, reactionTime);
        soundManager.play(SoundType.COMBO);
        coachingTip = '🐟 School of Fish! +' + (school.pointValue * pointsMultiplier) + ' points!';
        coachingTipTimer = 3;
        break;

      case EntityType.BONUS_CREATURE:
        // Bonus creature clicked!
        const bonusCreature = entity as any;
        scoreManager.addScore(bonusCreature.pointValue * pointsMultiplier);
        scoreManager.increaseCombo();
        visualEffects.addEffect(position, EffectType.FISH_POP);
        entityManager.despawn(entity.id);
        playerAnalytics.recordClick(position, true, reactionTime);
        soundManager.play(SoundType.COMBO);
        
        const creatureNames: Record<string, string> = {
          DOLPHIN: '🐬 Dolphin',
          WHALE: '🐋 Whale',
          TURTLE: '🐢 Turtle',
        };
        coachingTip = creatureNames[bonusCreature.creatureType] + '! +' + (bonusCreature.pointValue * pointsMultiplier) + ' points!';
        coachingTipTimer = 3;
        break;

      case EntityType.DECOY:
        // Decoy clicked!
        const decoy = entity as any;
        
        // Check if shield is active
        if (powerUpManager.hasShield()) {
          powerUpManager.consumeShield();
          entityManager.despawn(entity.id);
          soundManager.play(SoundType.MENU_SELECT);
          coachingTip = '🛡️ Shield protected you!';
          coachingTipTimer = 3;
        } else {
          scoreManager.subtractScore(decoy.penaltyValue);
          scoreManager.resetCombo();
          visualEffects.addEffect(position, EffectType.DECOY_CLICK);
          entityManager.despawn(entity.id);
          difficultyController.recordAction(ActionResult.DECOY_CLICKED);
          playerAnalytics.recordClick(position, false, reactionTime);
          soundManager.play(SoundType.DECOY_HIT);
          
          lives--;
          if (lives <= 0) {
            stateMachine.transition(GameState.GAME_OVER);
            soundManager.play(SoundType.GAME_OVER);
          }
        }
        break;
    }
  } else {
    difficultyController.recordAction(ActionResult.MISS);
    playerAnalytics.recordClick(position, false, reactionTime);
  }
});

// Update function
function update(deltaTime: number): void {
  gameTime += deltaTime;

  if (stateMachine.currentState !== GameState.PLAYING) {
    return;
  }

  // Apply time multiplier from slow-time power-up
  const timeMultiplier = powerUpManager.getTimeMultiplier();
  const adjustedDeltaTime = deltaTime * timeMultiplier;

  // Update power-ups
  powerUpManager.update();

  // Update coaching tip timer
  if (coachingTipTimer > 0) {
    coachingTipTimer -= deltaTime;
    if (coachingTipTimer <= 0) {
      coachingTip = null;
    }
  }

  // Update difficulty with real analytics data
  const metrics = {
    accuracy: playerAnalytics.getAccuracy(),
    recentActions: [],
    averageReactionTime: playerAnalytics.getAverageReactionTime(),
    comboCount: scoreManager.combo,
    flowStateScore: 0.5,
  };
  difficultyController.update(metrics, deltaTime);

  const difficulty = difficultyController.getCurrentDifficulty();

  // Update entities (with time multiplier)
  entityManager.update(adjustedDeltaTime);
  behaviorController.updateBehaviors(entityManager.activeEntities, adjustedDeltaTime, difficulty);

  // Spawn regular entities
  const spawnInterval = 1 / difficultyController.getSpawnRate();
  spawnTimer += deltaTime;
  if (spawnTimer >= spawnInterval) {
    spawnTimer = 0;
    spawnEntity();
  }

  // Spawn special entities
  spawnSpecialEntities(deltaTime);
}

// Render function
function render(): void {
  // Always render underwater background
  underwaterBg.render(renderer, 0.016); // ~60fps

  if (stateMachine.currentState === GameState.START_SCREEN) {
    renderStartScreen();
  } else if (stateMachine.currentState === GameState.PLAYING) {
    renderPlaying();
  } else if (stateMachine.currentState === GameState.GAME_OVER) {
    renderGameOver();
  }

  // Apply retro effects on top of everything
  retroEffects.applyAllEffects(renderer, 0.016, gameTime);
}

// Helper function to draw mini fish on start screen
function drawMiniFish(ctx: CanvasRenderingContext2D, x: number, y: number, variant: string, color: string, secondaryColor: string) {
  ctx.save();
  ctx.translate(x, y);
  const scale = 0.6; // Make them smaller for the menu
  ctx.scale(scale, scale);

  switch (variant) {
    case 'TROPICAL':
      // Body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 20, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      // Stripes
      ctx.fillStyle = secondaryColor;
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(-10 + i * 8, -14, 3, 28);
      }
      // Tail
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-28, -10);
      ctx.lineTo(-28, 10);
      ctx.closePath();
      ctx.fill();
      break;

    case 'GOLDFISH':
      // Body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      // Fancy tail
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.quadraticCurveTo(-26, -13, -22, -8);
      ctx.quadraticCurveTo(-26, 13, -22, 8);
      ctx.closePath();
      ctx.fill();
      break;

    case 'CLOWNFISH':
      // Body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 19, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      // White stripes
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(-8, -13, 6, 26);
      ctx.fillRect(8, -13, 6, 26);
      break;

    case 'ANGELFISH':
      // Body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 21, 0, 0, Math.PI * 2);
      ctx.fill();
      // Top fin
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.moveTo(0, -21);
      ctx.lineTo(-12, -28);
      ctx.lineTo(12, -28);
      ctx.closePath();
      ctx.fill();
      break;

    case 'PUFFERFISH':
      // Round body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      // Spikes
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 18, Math.sin(angle) * 18);
        ctx.lineTo(Math.cos(angle) * 24, Math.sin(angle) * 24);
        ctx.stroke();
      }
      break;

    case 'SEAHORSE':
      // Body curve
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.quadraticCurveTo(12, -10, 12, 0);
      ctx.quadraticCurveTo(12, 10, 0, 20);
      ctx.quadraticCurveTo(-12, 10, -12, 0);
      ctx.quadraticCurveTo(-12, -10, 0, -20);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(0, -17, 8, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'STARFISH':
      // Star shape
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const innerAngle = ((i * 2 + 1) * Math.PI) / 5 - Math.PI / 2;
        const outerX = Math.cos(outerAngle) * 16;
        const outerY = Math.sin(outerAngle) * 16;
        const innerX = Math.cos(innerAngle) * 8;
        const innerY = Math.sin(innerAngle) * 8;
        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}

// Helper function to draw mini decoys on start screen
function drawMiniDecoy(ctx: CanvasRenderingContext2D, x: number, y: number, type: string, color: string) {
  ctx.save();
  ctx.translate(x, y);
  const scale = 0.6;
  ctx.scale(scale, scale);

  if (type === 'JELLYFISH') {
    // Jellyfish dome
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -8, 14, 0, Math.PI, true);
    ctx.fill();
    // Tentacles
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 8, 0);
      ctx.quadraticCurveTo(i * 8 + 3, 12, i * 8, 16);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  } else if (type === 'OCTOPUS') {
    // Octopus body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    // Tentacles (8 of them)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const startX = Math.cos(angle) * 16;
      const startY = Math.sin(angle) * 16;
      const endX = Math.cos(angle) * 24;
      const endY = Math.sin(angle) * 24;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  } else {
    // Sea urchin
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    // Spikes
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 11, Math.sin(angle) * 11);
      ctx.lineTo(Math.cos(angle) * 20, Math.sin(angle) * 20);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function renderStartScreen(): void {
  const centerX = canvas.width / 2;
  const startY = Math.max(80, canvas.height / 2 - 250);
  const ctx = renderer.context;

  renderer.drawText('AQUA ARCADE', { x: centerX, y: startY }, {
    font: '48px monospace',
    color: '#00FFFF',
    align: 'center',
    baseline: 'middle',
  });

  // Instructions
  renderer.drawText('HOW TO PLAY:', { x: centerX, y: startY + 60 }, {
    font: '20px monospace',
    color: '#FFFF00',
    align: 'center',
    baseline: 'middle',
  });

  renderer.drawText('Click to POP the fish! (+10 points)', { x: centerX, y: startY + 95 }, {
    font: '16px monospace',
    color: '#00FF00',
    align: 'center',
    baseline: 'middle',
  });

  // Show fish types
  renderer.drawText('FISH TO POP (Good!):', { x: centerX, y: startY + 130 }, {
    font: '14px monospace',
    color: '#00FFAA',
    align: 'center',
    baseline: 'middle',
  });

  const fishTypes = [
    { name: 'Tropical', variant: 'TROPICAL', color: '#FF6B35', secondaryColor: '#FFD700' },
    { name: 'Goldfish', variant: 'GOLDFISH', color: '#FFD700', secondaryColor: '#FFA500' },
    { name: 'Clownfish', variant: 'CLOWNFISH', color: '#FF6B35', secondaryColor: '#FFFFFF' },
    { name: 'Angelfish', variant: 'ANGELFISH', color: '#4169E1', secondaryColor: '#87CEEB' },
    { name: 'Pufferfish', variant: 'PUFFERFISH', color: '#F0E68C', secondaryColor: '#8B4513' },
    { name: 'Seahorse', variant: 'SEAHORSE', color: '#FF69B4', secondaryColor: '#FFB6C1' },
    { name: 'Starfish', variant: 'STARFISH', color: '#FF4500', secondaryColor: '#FF6347' },
  ];

  const fishStartX = centerX - 300;
  for (let i = 0; i < fishTypes.length; i++) {
    const x = fishStartX + (i * 90);
    const y = startY + 165;
    
    // Draw actual fish shape
    drawMiniFish(ctx, x, y, fishTypes[i].variant, fishTypes[i].color, fishTypes[i].secondaryColor);
    
    renderer.drawText(fishTypes[i].name, { x, y: y + 30 }, {
      font: '10px monospace',
      color: '#FFFFFF',
      align: 'center',
      baseline: 'middle',
    });
  }

  // Show decoy types
  renderer.drawText('Avoid clicking decoys! (-5 points, -1 life)', { x: centerX, y: startY + 220 }, {
    font: '16px monospace',
    color: '#FF3333',
    align: 'center',
    baseline: 'middle',
  });

  renderer.drawText('DECOYS TO AVOID (Bad!):', { x: centerX, y: startY + 255 }, {
    font: '14px monospace',
    color: '#FF3333',
    align: 'center',
    baseline: 'middle',
  });

  const decoyTypes = [
    { name: 'Jellyfish', type: 'JELLYFISH', color: '#9B59B6' },
    { name: 'Octopus', type: 'OCTOPUS', color: '#8B4789' },
    { name: 'Sea Urchin', type: 'SEA_URCHIN', color: '#4A4A4A' },
  ];

  const decoyStartX = centerX - 120;
  for (let i = 0; i < decoyTypes.length; i++) {
    const x = decoyStartX + (i * 120);
    const y = startY + 290;
    
    // Draw actual decoy shape
    drawMiniDecoy(ctx, x, y, decoyTypes[i].type, decoyTypes[i].color);
    
    renderer.drawText(decoyTypes[i].name, { x, y: y + 30 }, {
      font: '10px monospace',
      color: '#FFFFFF',
      align: 'center',
      baseline: 'middle',
    });
  }

  renderer.drawText('You have 3 lives. Good luck!', { x: centerX, y: startY + 350 }, {
    font: '14px monospace',
    color: '#DDDDDD',
    align: 'center',
    baseline: 'middle',
  });

  renderer.drawText('Click anywhere to Start', { x: centerX, y: startY + 390 }, {
    font: '18px monospace',
    color: '#FFFFFF',
    align: 'center',
    baseline: 'middle',
  });
}

function renderPlaying(): void {
  // Render entities
  for (const entity of entityManager.activeEntities) {
    renderer.drawEntity(entity);
  }

  // Render effects
  visualEffects.update(renderer);

  // Render UI
  renderer.drawText(`Score: ${scoreManager.score}`, { x: 20, y: 30 }, {
    font: '20px monospace',
    color: '#00FFFF',
    align: 'left',
    baseline: 'top',
  });

  if (scoreManager.combo > 1) {
    renderer.drawText(`Combo: x${scoreManager.combo}`, { x: 20, y: 60 }, {
      font: '18px monospace',
      color: '#FFFF00',
      align: 'left',
      baseline: 'top',
    });
  }

  const difficulty = difficultyController.getCurrentDifficulty();
  renderer.drawText(`Difficulty: ${Math.floor(difficulty * 100)}%`, { x: canvas.width - 20, y: 30 }, {
    font: '16px monospace',
    color: '#FFFFFF',
    align: 'right',
    baseline: 'top',
  });

  // Draw lives
  renderer.drawText(`Lives: ${lives}`, { x: canvas.width - 20, y: 60 }, {
    font: '16px monospace',
    color: lives <= 1 ? '#FF0000' : '#FFFFFF',
    align: 'right',
    baseline: 'top',
  });

  // Draw AI stats
  const accuracy = playerAnalytics.getAccuracy();
  if (accuracy > 0) {
    renderer.drawText(`Accuracy: ${Math.floor(accuracy * 100)}%`, { x: canvas.width - 20, y: 90 }, {
      font: '14px monospace',
      color: accuracy > 0.7 ? '#00FF00' : accuracy > 0.5 ? '#FFFF00' : '#FF6666',
      align: 'right',
      baseline: 'top',
    });
  }

  // Draw active power-ups
  const activePowerUps = powerUpManager.getActivePowerUps();
  if (activePowerUps.length > 0) {
    let yOffset = 120;
    for (const powerUp of activePowerUps) {
      const remaining = Math.ceil(powerUpManager.getRemainingTime(powerUp) / 1000);
      const powerUpIcons: Record<PowerUpType, string> = {
        [PowerUpType.SLOW_TIME]: '⏰',
        [PowerUpType.SHIELD]: '🛡️',
        [PowerUpType.MAGNET]: '🧲',
        [PowerUpType.DOUBLE_POINTS]: '💰',
      };
      
      renderer.drawText(`${powerUpIcons[powerUp]} ${remaining}s`, { x: canvas.width - 20, y: yOffset }, {
        font: '14px monospace',
        color: '#00FF00',
        align: 'right',
        baseline: 'top',
      });
      yOffset += 25;
    }
  }

  // Draw coaching tip
  if (coachingTip) {
    const tipY = canvas.height - 40;
    renderer.drawText(coachingTip, { x: canvas.width / 2, y: tipY }, {
      font: '16px monospace',
      color: '#FFD700',
      align: 'center',
      baseline: 'middle',
    });
  }
}

function renderGameOver(): void {
  renderer.drawText('GAME OVER', { x: canvas.width / 2, y: canvas.height / 2 - 80 }, {
    font: '48px monospace',
    color: '#FF0000',
    align: 'center',
    baseline: 'middle',
  });

  renderer.drawText(`Final Score: ${scoreManager.score}`, { x: canvas.width / 2, y: canvas.height / 2 - 20 }, {
    font: '24px monospace',
    color: '#00FFFF',
    align: 'center',
    baseline: 'middle',
  });

  renderer.drawText(`Max Combo: x${scoreManager.maxCombo}`, { x: canvas.width / 2, y: canvas.height / 2 + 20 }, {
    font: '20px monospace',
    color: '#FFFF00',
    align: 'center',
    baseline: 'middle',
  });

  const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
  renderer.drawText(`Time: ${sessionTime}s`, { x: canvas.width / 2, y: canvas.height / 2 + 50 }, {
    font: '18px monospace',
    color: '#FFFFFF',
    align: 'center',
    baseline: 'middle',
  });

  renderer.drawText('Click to Restart', { x: canvas.width / 2, y: canvas.height / 2 + 100 }, {
    font: '18px monospace',
    color: '#00FF00',
    align: 'center',
    baseline: 'middle',
  });
}

function spawnEntity(): void {
  lastEntitySpawnTime = Date.now();
  
  const isFish = Math.random() < 0.7; // 70% fish, 30% decoys
  const type = isFish ? EntityType.FISH : EntityType.DECOY;

  let x = 0, y = 0;
  let vx = 0, vy = 0;
  let useSmartSpawn = false;

  // Try smart spawning based on player analytics
  if (type === EntityType.DECOY) {
    const smartPos = smartSpawner.suggestDecoyPosition();
    if (smartPos) {
      x = smartPos.x;
      y = smartPos.y;
      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const speed = 15 + Math.random() * 15;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;
      useSmartSpawn = true;
    }
  } else if (type === EntityType.FISH) {
    // Check if we should spawn a challenging fish
    if (smartSpawner.shouldSpawnChallengingFish()) {
      const challengePos = smartSpawner.getChallengingFishPosition();
      x = challengePos.x;
      y = challengePos.y;
      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 15; // Faster challenging fish
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;
      useSmartSpawn = true;
    } else {
      const smartPos = smartSpawner.suggestFishPosition();
      if (smartPos) {
        x = smartPos.x;
        y = smartPos.y;
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = 20 + Math.random() * 20;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        useSmartSpawn = true;
      }
    }
  }

  // Fallback to traditional spawning if smart spawn didn't trigger
  if (!useSmartSpawn) {
    // 60% chance to spawn from edges, 40% chance to spawn in middle area
    if (Math.random() < 0.6) {
      // Spawn from edges
      const edge = Math.floor(Math.random() * 4);

      switch (edge) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = -20;
          vx = (Math.random() - 0.5) * 30;
          vy = 20 + Math.random() * 20;
          break;
        case 1: // Right
          x = canvas.width + 20;
          y = Math.random() * canvas.height;
          vx = -(20 + Math.random() * 20);
          vy = (Math.random() - 0.5) * 30;
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height + 20;
          vx = (Math.random() - 0.5) * 30;
          vy = -(20 + Math.random() * 20);
          break;
        case 3: // Left
          x = -20;
          y = Math.random() * canvas.height;
          vx = 20 + Math.random() * 20;
          vy = (Math.random() - 0.5) * 30;
          break;
      }
    } else {
      // Spawn in middle area with random direction
      x = 100 + Math.random() * (canvas.width - 200);
      y = 100 + Math.random() * (canvas.height - 200);
      
      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 20;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;
    }
  }

  const entity = entityManager.spawn(type, { x, y }, new Vector2D(vx, vy));
  const difficulty = difficultyController.getCurrentDifficulty();
  behaviorController.assignBehavior(entity, difficulty);
}

function spawnSpecialEntities(_deltaTime: number): void {
  // Spawn golden fish
  if (gameTime >= nextGoldenFishSpawn) {
    spawnSpecialEntity(EntityType.GOLDEN_FISH);
    nextGoldenFishSpawn = gameTime + 20 + Math.random() * 15; // Every 20-35 seconds
  }

  // Spawn power-ups
  if (gameTime >= nextPowerUpSpawn) {
    spawnSpecialEntity(EntityType.POWER_UP);
    nextPowerUpSpawn = gameTime + 15 + Math.random() * 10; // Every 15-25 seconds
  }

  // Spawn treasure
  if (gameTime >= nextTreasureSpawn) {
    spawnSpecialEntity(EntityType.TREASURE);
    nextTreasureSpawn = gameTime + 25 + Math.random() * 15; // Every 25-40 seconds
  }

  // Spawn shark
  if (gameTime >= nextSharkSpawn) {
    spawnSpecialEntity(EntityType.SHARK);
    nextSharkSpawn = gameTime + 30 + Math.random() * 20; // Every 30-50 seconds
  }

  // Spawn fish school
  if (gameTime >= nextSchoolSpawn) {
    spawnSpecialEntity(EntityType.SCHOOL);
    nextSchoolSpawn = gameTime + 22 + Math.random() * 13; // Every 22-35 seconds
  }

  // Spawn bonus creature
  if (gameTime >= nextBonusCreatureSpawn) {
    spawnSpecialEntity(EntityType.BONUS_CREATURE);
    nextBonusCreatureSpawn = gameTime + 35 + Math.random() * 25; // Every 35-60 seconds
  }
}

function spawnSpecialEntity(type: EntityType): void {
  // Random spawn position from edges
  const edge = Math.floor(Math.random() * 4);
  let x = 0, y = 0, vx = 0, vy = 0;

  switch (edge) {
    case 0: // Top
      x = Math.random() * canvas.width;
      y = -50;
      vx = (Math.random() - 0.5) * 30;
      vy = 15 + Math.random() * 15;
      break;
    case 1: // Right
      x = canvas.width + 50;
      y = Math.random() * canvas.height;
      vx = -(15 + Math.random() * 15);
      vy = (Math.random() - 0.5) * 30;
      break;
    case 2: // Bottom
      x = Math.random() * canvas.width;
      y = canvas.height + 50;
      vx = (Math.random() - 0.5) * 30;
      vy = -(15 + Math.random() * 15);
      break;
    case 3: // Left
      x = -50;
      y = Math.random() * canvas.height;
      vx = 15 + Math.random() * 15;
      vy = (Math.random() - 0.5) * 30;
      break;
  }

  const entity = entityManager.spawn(type, { x, y }, new Vector2D(vx, vy));
  const difficulty = difficultyController.getCurrentDifficulty();
  behaviorController.assignBehavior(entity, difficulty);
}

// Create and start game loop
const gameLoop = new GameLoop(update, render);
gameLoop.start();

console.log('Game started!');
