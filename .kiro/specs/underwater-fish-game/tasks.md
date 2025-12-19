# Implementation Plan

- [x] 1. Set up project structure and core infrastructure



  - Create TypeScript project with Vite bundler
  - Set up HTML5 Canvas and basic rendering context
  - Configure Vitest for unit testing and fast-check for property-based testing
  - Create directory structure: src/{core, entities, ai, rendering, audio, utils}


  - _Requirements: 17.1, 17.2, 17.3_

- [ ] 2. Implement core data structures and utilities
  - Create Point and Vector2D classes with mathematical operations
  - Implement utility functions for distance, angle, and collision detection
  - Create configuration loader and validator
  - _Requirements: 17.4, 17.5_

- [ ]* 2.1 Write property test for Vector2D operations
  - **Property: Vector operations maintain mathematical properties**
  - **Validates: Requirements 17.5**



- [ ]* 2.2 Write property test for configuration validation
  - **Property 49: Configuration validation**
  - **Validates: Requirements 17.5**

- [ ] 3. Implement game loop and state management
  - Create GameLoop class with 60 FPS update cycle
  - Implement GameStateMachine with states: START_SCREEN, PLAYING, PAUSED, GAME_OVER
  - Create state transition logic
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 3.1 Write property test for state transitions
  - **Property 42: State transition correctness**


  - **Validates: Requirements 8.2, 8.3, 8.5**

- [ ]* 3.2 Write property test for state reset
  - **Property 44: State reset on restart**
  - **Validates: Requirements 8.5**

- [ ] 4. Implement entity system foundation
  - Create base Entity interface and abstract class
  - Implement Fish and Decoy entity classes with sprites and properties
  - Create EntityManager for spawning, despawning, and tracking entities
  - Implement collision detection (point-in-sprite checking)
  - _Requirements: 1.1, 1.4, 2.1, 2.3_

- [ ]* 4.1 Write property test for fish pop mechanics
  - **Property 1: Fish pop removes entity and increases score**
  - **Validates: Requirements 1.1**



- [ ]* 4.2 Write property test for decoy click mechanics
  - **Property 2: Decoy click applies penalty and removes entity**
  - **Validates: Requirements 2.1, 2.3**

- [ ]* 4.3 Write property test for independent fish interaction
  - **Property 4: Independent fish interaction**
  - **Validates: Requirements 1.4**

- [-] 5. Implement input handling system

  - Create InputHandler class for mouse/touch events
  - Implement click position tracking and history
  - Connect input to entity collision detection
  - Handle empty space clicks without state changes
  - _Requirements: 1.1, 1.3, 2.1_

- [ ]* 5.1 Write property test for empty space clicks
  - **Property 3: Empty space clicks preserve game state**
  - **Validates: Requirements 1.3**

- [x] 6. Implement scoring and combo system


  - Create scoring logic with point values for fish
  - Implement combo multiplier that increases with consecutive successes
  - Add combo reset on decoy clicks
  - Display score and combo on screen
  - _Requirements: 7.1, 7.3, 7.4, 7.5_

- [ ]* 6.1 Write property test for combo accumulation
  - **Property 5: Combo multiplier accumulation**
  - **Validates: Requirements 7.3**

- [ ]* 6.2 Write property test for combo reset
  - **Property 6: Combo reset on error**
  - **Validates: Requirements 7.4**

- [x] 7. Implement basic rendering system


  - Create Renderer class with Canvas 2D context
  - Implement sprite loading and caching
  - Create pixel art scaling and rendering
  - Implement retro-style text rendering for score and UI
  - Add basic visual effects for fish pops and decoy clicks
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 1.2, 2.2_

- [x] 8. Implement movement pattern system


  - Create MovementPattern interface
  - Implement LinearPattern, SinusoidalPattern, and EvasivePattern
  - Create pattern assignment logic based on entity type and difficulty
  - Implement screen edge handling (wrap or despawn)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 8.1 Write property test for movement pattern assignment
  - **Property 7: Movement pattern assignment**
  - **Validates: Requirements 3.1**

- [ ]* 8.2 Write property test for position updates
  - **Property 8: Position updates follow patterns**
  - **Validates: Requirements 3.2**

- [ ]* 8.3 Write property test for screen edge handling
  - **Property 9: Screen edge handling**
  - **Validates: Requirements 3.3**

- [ ]* 8.4 Write property test for difficulty affecting speed
  - **Property 10: Difficulty affects movement speed**
  - **Validates: Requirements 3.5**

- [x] 9. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement steering behaviors for fish


  - Create SteeringBehaviors class with seek, flee, separate, align, cohere
  - Implement SchoolingPattern using steering behaviors
  - Add neighbor detection for schooling (spatial queries)
  - Implement flee response when fish are popped
  - Add attraction behavior toward decoys
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ]* 10.1 Write property test for schooling convergence
  - **Property 11: Schooling behavior convergence**
  - **Validates: Requirements 14.1, 14.4**

- [ ]* 10.2 Write property test for flee response
  - **Property 12: Flee response activation**
  - **Validates: Requirements 14.2**

- [ ]* 10.3 Write property test for decoy attraction
  - **Property 13: Decoy attraction behavior**
  - **Validates: Requirements 14.3**

- [x] 11. Implement AI difficulty system


  - Create DifficultyController with configurable parameters
  - Implement performance metrics tracking (accuracy, reaction time)
  - Add difficulty adjustment logic based on player success/failure
  - Implement smooth difficulty transitions over time window
  - Create difficulty level indicator display
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 7.5_

- [ ]* 11.1 Write property test for difficulty increase on success
  - **Property 14: Difficulty increases with success**
  - **Validates: Requirements 4.2**

- [ ]* 11.2 Write property test for difficulty decrease on errors
  - **Property 15: Difficulty decreases with errors**
  - **Validates: Requirements 4.3**

- [ ]* 11.3 Write property test for smooth adjustment
  - **Property 16: Smooth difficulty adjustment**
  - **Validates: Requirements 4.5**

- [ ] 12. Implement flow state detection
  - Add flow state indicator calculation (accuracy, engagement, hesitation)
  - Implement flow state maintenance (stable difficulty when optimal)
  - Add boredom detection and complexity increase
  - Add frustration detection and difficulty reduction
  - Log flow state transitions for analysis
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 12.1 Write property test for flow state maintenance
  - **Property 17: Flow state maintenance**
  - **Validates: Requirements 12.2**

- [ ]* 12.2 Write property test for boredom response
  - **Property 18: Boredom response**
  - **Validates: Requirements 12.3**

- [ ]* 12.3 Write property test for frustration response
  - **Property 19: Frustration response**
  - **Validates: Requirements 12.4**

- [ ] 13. Implement player modeling and predictive AI
  - Create PlayerModel class to track click patterns and preferences
  - Implement reaction time distribution tracking
  - Add attention heatmap construction from click history
  - Create strategy signature detection
  - Implement prediction logic for player behavior
  - Add strategy shift detection (within 15 actions)
  - _Requirements: 10.1, 10.4, 10.5_

- [ ]* 13.1 Write property test for player model construction
  - **Property 20: Player model construction**
  - **Validates: Requirements 10.1**

- [ ]* 13.2 Write property test for strategy shift detection
  - **Property 22: Strategy shift detection**
  - **Validates: Requirements 10.5**

- [ ]* 13.3 Write property test for prediction accuracy tracking
  - **Property 23: Prediction accuracy tracking**
  - **Validates: Requirements 10.4**

- [ ] 14. Implement adaptive spawn system
  - Create spawn location suggestion based on player model
  - Implement spawn adaptation to encourage exploration
  - Add high-value target spawning in neglected areas
  - Connect spawn system to predictive AI
  - _Requirements: 10.2, 10.3_

- [ ]* 14.1 Write property test for spawn location adaptation
  - **Property 21: Spawn location adaptation**
  - **Validates: Requirements 10.2, 10.3**

- [ ] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Implement procedural generation system
  - Create ProceduralGenerator with seed-based generation
  - Implement environment generation with varied backgrounds
  - Add parallax scrolling background layers
  - Create spawn sequence generation with challenge curves
  - Implement entity composition with fish-to-decoy ratios
  - Add themed wave generation
  - Implement milestone-based content introduction
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 6.2_

- [ ]* 16.1 Write property test for environment uniqueness
  - **Property 24: Environment uniqueness**
  - **Validates: Requirements 11.1**

- [ ]* 16.2 Write property test for entity composition ratios
  - **Property 25: Entity composition ratios**
  - **Validates: Requirements 11.3**

- [ ]* 16.3 Write property test for challenge curve adherence
  - **Property 26: Challenge curve adherence**
  - **Validates: Requirements 11.2**

- [ ]* 16.4 Write property test for milestone content
  - **Property 27: Milestone content introduction**
  - **Validates: Requirements 11.5**

- [ ] 17. Implement parallax background rendering
  - Create multiple background layers with different scroll speeds
  - Add underwater visual elements (bubbles, light rays)
  - Implement parallax effect based on game progression
  - _Requirements: 6.2, 6.5_

- [ ]* 17.1 Write property test for parallax layer movement
  - **Property: Parallax layers move at different rates**
  - **Validates: Requirements 6.2**

- [ ] 18. Implement performance feedback system
  - Create FeedbackAnalyzer for session analysis
  - Implement session statistics calculation (accuracy, score, fish count)
  - Add insight generation (minimum 2 insights per session)
  - Implement error type identification for low accuracy
  - Create specific feedback rules (high accuracy/low score, low accuracy)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 18.1 Write property test for session statistics
  - **Property 29: Session statistics calculation**
  - **Validates: Requirements 5.1**

- [ ]* 18.2 Write property test for minimum insights
  - **Property 30: Minimum insight generation**
  - **Validates: Requirements 5.2**

- [ ]* 18.3 Write property test for error identification
  - **Property 31: Error type identification**
  - **Validates: Requirements 5.4**

- [ ] 19. Implement attention heatmap and analytics
  - Create heatmap generation from click history
  - Implement blind spot detection and overlay
  - Add reaction time statistics calculation (avg, min, max)
  - Implement performance trend calculation for multiple sessions
  - Add strategy identification from success patterns
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ]* 19.1 Write property test for heatmap generation
  - **Property 32: Heatmap generation**
  - **Validates: Requirements 13.1**

- [ ]* 19.2 Write property test for blind spot overlay
  - **Property 33: Blind spot overlay**
  - **Validates: Requirements 13.2**

- [ ]* 19.3 Write property test for reaction time statistics
  - **Property 34: Reaction time statistics**
  - **Validates: Requirements 13.3**

- [ ]* 19.4 Write property test for performance trends
  - **Property 35: Performance trend calculation**
  - **Validates: Requirements 13.4**

- [ ]* 19.5 Write property test for strategy identification
  - **Property 36: Strategy identification**
  - **Validates: Requirements 13.5**

- [ ] 20. Implement coaching system
  - Create coaching tip generation for suboptimal patterns
  - Implement rate limiting (one tip per 30 seconds)
  - Add specific coaching rules (missed fish in regions, reaction time degradation)
  - Display coaching tips non-intrusively during gameplay
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ]* 20.1 Write property test for coaching tip generation
  - **Property 37: Coaching tip generation**
  - **Validates: Requirements 15.1**

- [ ]* 20.2 Write property test for coaching rate limiting
  - **Property 38: Coaching rate limiting**
  - **Validates: Requirements 15.4**

- [ ] 21. Implement dynamic challenge system
  - Create mini-objective generation (time-based, accuracy-based, avoidance)
  - Implement challenge triggering on mastery detection
  - Add progress indicator and timer display for active challenges
  - Implement completion detection and bonus rewards
  - Add achievability validation based on player model
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ]* 21.1 Write property test for challenge generation
  - **Property 39: Challenge generation on mastery**
  - **Validates: Requirements 16.1**

- [ ]* 21.2 Write property test for objective variety
  - **Property 40: Mini-objective variety**
  - **Validates: Requirements 16.2**

- [ ]* 21.3 Write property test for completion rewards
  - **Property 41: Objective completion rewards**
  - **Validates: Requirements 16.4**

- [ ]* 21.4 Write property test for achievable objectives
  - **Property 28: Achievable objectives**
  - **Validates: Requirements 16.5**

- [ ] 22. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 23. Implement audio system
  - Set up Web Audio API integration
  - Load and cache sound effects (fish pop, decoy click, difficulty increase)
  - Implement background music with looping
  - Add audio trigger differentiation for fish vs decoys
  - Create volume controls and mute option
  - Add graceful degradation if audio unavailable
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 23.1 Write property test for audio differentiation
  - **Property 45: Audio trigger differentiation**
  - **Validates: Requirements 9.1, 9.2**

- [ ]* 23.2 Write property test for background music continuity
  - **Property 46: Background music continuity**
  - **Validates: Requirements 9.3**

- [ ]* 23.3 Write property test for difficulty audio cues
  - **Property 47: Difficulty audio cues**
  - **Validates: Requirements 9.4**

- [x] 24. Implement game over and restart flow


  - Create game over screen with final statistics
  - Display performance feedback and heatmap visualization
  - Add restart button and state reset logic
  - Ensure spawn cessation on game over
  - _Requirements: 8.3, 8.4, 8.5_

- [ ]* 24.1 Write property test for spawn cessation
  - **Property 43: Spawn cessation on game over**
  - **Validates: Requirements 8.3**

- [x] 25. Implement start screen and instructions

  - Create start screen UI with game title
  - Add instructions explaining gameplay mechanics
  - Implement play button to transition to playing state
  - Add visual polish with retro aesthetic
  - _Requirements: 8.1_

- [ ] 26. Create sprite assets and animations
  - Design pixel art sprites for fish (multiple types)
  - Design pixel art sprites for decoys (jellyfish, mines, trash)
  - Create animation frames for entity movement
  - Design visual effects for pops and errors
  - Create background elements and layers
  - Ensure 12 FPS animation for retro feel
  - _Requirements: 6.1, 6.3, 6.4, 6.5, 1.2, 2.2_

- [ ] 27. Implement configuration system
  - Create JSON configuration files for all AI parameters
  - Implement configuration hot-reloading
  - Add parameter validation with error messages
  - Expose difficulty, behavior, and feedback configurations
  - Document all configuration options
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ]* 27.1 Write property test for configuration application
  - **Property 48: Configuration application**
  - **Validates: Requirements 17.4**

- [ ] 28. Implement localStorage persistence
  - Save player statistics across sessions
  - Store performance history for trend analysis
  - Implement data serialization and deserialization
  - Add data migration for version updates
  - _Requirements: 13.4_

- [ ] 29. Polish visual effects and animations
  - Enhance fish pop effects with particles
  - Add screen shake for decoy clicks
  - Implement smooth transitions between game states
  - Add combo celebration effects
  - Polish UI elements with retro styling
  - _Requirements: 1.2, 2.2, 6.1, 6.3_

- [ ] 30. Optimize performance
  - Implement object pooling for entities
  - Add spatial partitioning for collision detection
  - Optimize rendering with layered canvases
  - Profile and optimize AI system update times
  - Ensure 60 FPS with 50+ entities
  - _Requirements: 1.5, 3.2_

- [x] 31. Final checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

- [ ] 32. Create build and deployment configuration
  - Configure Vite for production builds
  - Set up asset optimization and minification
  - Generate source maps for debugging
  - Create deployment documentation
  - Test in multiple browsers
  - _Requirements: All_
