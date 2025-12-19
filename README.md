# 🐠 AQUA ARCADE - Retro Ocean Adventure 🐠

A retro revival underwater arcade game where players must pop fish while avoiding decoys! Experience classic arcade gameplay with modern AI, stunning underwater visuals, and authentic retro effects.

## 🎮 Retro Features

### Authentic Arcade Experience
- **CRT Screen Effects** - Scanlines and screen curvature for that classic CRT monitor feel
- **Arcade Cabinet Border** - Wooden frame with metallic edges and corner screws
- **Screen Glare** - Subtle moving glare effect like real arcade screens
- **Vignette Effect** - Darkened edges for authentic CRT look
- **Pixelated Rendering** - Crisp retro graphics

### 8-Bit Sound Effects
All sounds generated using Web Audio API for authentic retro feel:
- **Fish Pop** - Upward chirp sound
- **Decoy Hit** - Downward buzz
- **Combo** - Ascending arpeggio
- **Game Over** - Sad trombone
- **Menu Select** - Quick blip

### Classic Arcade Gameplay
- **Lives System** - Traditional 3-lives mechanic
- **Score & Combos** - Build combos for higher scores
- **Progressive Difficulty** - Gets harder as you play
- **High Score Focus** - Beat your personal best!

## 🐟 Game Features

### Modern AI Systems
- **Adaptive AI Difficulty**: Game adjusts challenge based on your performance
- **Intelligent Fish Behavior**: Fish exhibit schooling, fleeing, and evasive behaviors
- **Flow State Detection**: Maintains optimal challenge-skill balance
- **Dynamic Spawn Rates**: More fish appear as difficulty increases

### Rich Underwater World
- **7 Fish Types**: Tropical, Goldfish, Clownfish, Angelfish, Pufferfish, Seahorse, Starfish
- **3 Decoy Types**: Jellyfish, Octopus, Sea Urchin
- **Animated Scuba Divers**: Background characters swimming through the scene
- **Beautiful Ocean Floor**: Rocks, coral, shells, and swaying seaweed
- **Dynamic Lighting**: Light rays and bubbles for atmosphere

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### How to Play

1. **Click to Start** - Click anywhere on the start screen to begin
2. **Pop the Fish** - Click on orange fish to score points
3. **Avoid Decoys** - Don't click on purple jellyfish, gray mines, or trash
4. **Build Combos** - Pop fish consecutively without errors to increase your multiplier
5. **Watch Your Lives** - You have 3 lives. Clicking a decoy costs one life
6. **Adaptive Difficulty** - The game adjusts to your skill level automatically

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Build

```bash
npm run build
```

## 🚀 Deploy & Share Your Game

Want to share your game with friends? Deploy it online in minutes!

### Quick Deploy (Easiest!)

1. **Build the game:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify (Drag & Drop):**
   - Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag your `dist` folder onto the page
   - Get instant shareable link!

### Other Options

- **Netlify CLI**: `netlify deploy --prod`
- **Vercel**: `vercel --prod`
- **GitHub Pages**: See `DEPLOYMENT_GUIDE.md`
- **Surge**: `cd dist && surge`

📖 **Full deployment guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions!

## Project Structure

```
src/
├── core/        # Game loop, state management, input handling
├── entities/    # Fish, decoys, entity manager
├── ai/          # Difficulty, behavior, player modeling, feedback
├── rendering/   # Renderer, sprites, visual effects
├── audio/       # Audio manager, sound effects, music
└── utils/       # Utilities, math, configuration
```

## Technology Stack

- **TypeScript**: Type-safe game logic
- **Vite**: Fast development and optimized builds
- **HTML5 Canvas**: Retro pixel art rendering
- **Vitest**: Unit testing framework
- **fast-check**: Property-based testing

## License

MIT
