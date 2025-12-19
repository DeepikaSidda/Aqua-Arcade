/**
 * Configuration types and validation
 */

export interface DifficultyConfig {
  baseSpawnRate: number;
  minSpawnRate: number;
  maxSpawnRate: number;
  difficultyScalingFactor: number;
  adjustmentWindow: number;
  accuracyThresholds: {
    increase: number;
    decrease: number;
  };
}

export interface BehaviorConfig {
  schoolingRadius: number;
  fleeRadius: number;
  fleeDuration: number;
  separationWeight: number;
  alignmentWeight: number;
  cohesionWeight: number;
}

export interface AudioConfig {
  enabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

export interface VisualConfig {
  pixelScale: number;
  animationFPS: number;
  particleCount: number;
}

export interface GameConfig {
  canvas: {
    width: number;
    height: number;
    pixelScale: number;
  };
  difficulty: DifficultyConfig;
  behavior: BehaviorConfig;
  audio: AudioConfig;
  visual: VisualConfig;
}

/**
 * Default game configuration
 */
export const DEFAULT_CONFIG: GameConfig = {
  canvas: {
    width: 800,
    height: 600,
    pixelScale: 2,
  },
  difficulty: {
    baseSpawnRate: 2.5,
    minSpawnRate: 1.5,
    maxSpawnRate: 5.0,
    difficultyScalingFactor: 0.1,
    adjustmentWindow: 10,
    accuracyThresholds: {
      increase: 0.8,
      decrease: 0.5,
    },
  },
  behavior: {
    schoolingRadius: 100,
    fleeRadius: 150,
    fleeDuration: 2000,
    separationWeight: 1.5,
    alignmentWeight: 1.0,
    cohesionWeight: 1.0,
  },
  audio: {
    enabled: true,
    musicVolume: 0.5,
    sfxVolume: 0.7,
  },
  visual: {
    pixelScale: 2,
    animationFPS: 12,
    particleCount: 20,
  },
};

/**
 * Validation error class
 */
export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

/**
 * Validates a number is within a range
 */
function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): void {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ConfigValidationError(`${fieldName} must be a valid number`);
  }
  if (value < min || value > max) {
    throw new ConfigValidationError(
      `${fieldName} must be between ${min} and ${max}, got ${value}`
    );
  }
}

/**
 * Validates difficulty configuration
 */
function validateDifficultyConfig(config: DifficultyConfig): void {
  validateRange(config.baseSpawnRate, 0.1, 10, 'baseSpawnRate');
  validateRange(config.minSpawnRate, 0.1, 10, 'minSpawnRate');
  validateRange(config.maxSpawnRate, 0.1, 10, 'maxSpawnRate');
  validateRange(config.difficultyScalingFactor, 0.01, 1, 'difficultyScalingFactor');
  validateRange(config.adjustmentWindow, 1, 60, 'adjustmentWindow');
  validateRange(config.accuracyThresholds.increase, 0, 1, 'accuracyThresholds.increase');
  validateRange(config.accuracyThresholds.decrease, 0, 1, 'accuracyThresholds.decrease');

  if (config.minSpawnRate > config.maxSpawnRate) {
    throw new ConfigValidationError('minSpawnRate cannot be greater than maxSpawnRate');
  }

  if (config.accuracyThresholds.decrease >= config.accuracyThresholds.increase) {
    throw new ConfigValidationError(
      'accuracyThresholds.decrease must be less than accuracyThresholds.increase'
    );
  }
}

/**
 * Validates behavior configuration
 */
function validateBehaviorConfig(config: BehaviorConfig): void {
  validateRange(config.schoolingRadius, 10, 500, 'schoolingRadius');
  validateRange(config.fleeRadius, 10, 500, 'fleeRadius');
  validateRange(config.fleeDuration, 100, 10000, 'fleeDuration');
  validateRange(config.separationWeight, 0, 10, 'separationWeight');
  validateRange(config.alignmentWeight, 0, 10, 'alignmentWeight');
  validateRange(config.cohesionWeight, 0, 10, 'cohesionWeight');
}

/**
 * Validates audio configuration
 */
function validateAudioConfig(config: AudioConfig): void {
  if (typeof config.enabled !== 'boolean') {
    throw new ConfigValidationError('audio.enabled must be a boolean');
  }
  validateRange(config.musicVolume, 0, 1, 'musicVolume');
  validateRange(config.sfxVolume, 0, 1, 'sfxVolume');
}

/**
 * Validates visual configuration
 */
function validateVisualConfig(config: VisualConfig): void {
  validateRange(config.pixelScale, 1, 4, 'pixelScale');
  validateRange(config.animationFPS, 1, 60, 'animationFPS');
  validateRange(config.particleCount, 0, 100, 'particleCount');
}

/**
 * Validates canvas configuration
 */
function validateCanvasConfig(config: { width: number; height: number; pixelScale: number }): void {
  validateRange(config.width, 320, 3840, 'canvas.width');
  validateRange(config.height, 240, 2160, 'canvas.height');
  validateRange(config.pixelScale, 1, 4, 'canvas.pixelScale');
}

/**
 * Validates the entire game configuration
 * Throws ConfigValidationError if validation fails
 */
export function validateConfig(config: GameConfig): void {
  if (!config) {
    throw new ConfigValidationError('Configuration object is required');
  }

  validateCanvasConfig(config.canvas);
  validateDifficultyConfig(config.difficulty);
  validateBehaviorConfig(config.behavior);
  validateAudioConfig(config.audio);
  validateVisualConfig(config.visual);
}

/**
 * Loads configuration from a JSON object with validation
 */
export function loadConfig(configData: Partial<GameConfig>): GameConfig {
  // Merge with defaults
  const config: GameConfig = {
    canvas: { ...DEFAULT_CONFIG.canvas, ...configData.canvas },
    difficulty: { ...DEFAULT_CONFIG.difficulty, ...configData.difficulty },
    behavior: { ...DEFAULT_CONFIG.behavior, ...configData.behavior },
    audio: { ...DEFAULT_CONFIG.audio, ...configData.audio },
    visual: { ...DEFAULT_CONFIG.visual, ...configData.visual },
  };

  // Validate
  validateConfig(config);

  return config;
}
