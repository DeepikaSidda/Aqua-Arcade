# 🚀 How to Run Aqua Arcade

Complete guide to get the game running on your local machine.

---

## 📋 Prerequisites

Before you start, make sure you have these installed:

### Required Software

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Check version: `node --version`
   - Should show: v16.x.x or higher

2. **npm** (comes with Node.js)
   - Check version: `npm --version`
   - Should show: 8.x.x or higher

3. **Git** (for cloning the repository)
   - Download: https://git-scm.com/
   - Check version: `git --version`

---

## 🎮 Quick Start (3 Steps)

### Step 1: Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/DeepikaSidda/Aqua-Arcade.git

# Navigate into the project folder
cd Aqua-Arcade
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

This will install:
- Vite (build tool)
- TypeScript (programming language)
- Vitest (testing framework)
- fast-check (property-based testing)

### Step 3: Run the Game

```bash
# Start the development server
npm run dev
```

The game will open automatically in your browser at:
**http://localhost:5173**

---

## 🎯 Available Commands

### Development

```bash
# Start development server with hot reload
npm run dev
```
- Opens at http://localhost:5173
- Auto-reloads when you make changes
- Shows errors in the browser console

### Build for Production

```bash
# Create optimized production build
npm run build
```
- Creates `dist/` folder with optimized files
- Minifies code for faster loading
- Ready to deploy

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```
- Tests the production build before deploying
- Opens at http://localhost:4173

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Type Checking

```bash
# Check TypeScript types without building
npm run type-check
```

---

## 📁 Project Structure

```
Aqua-Arcade/
├── src/                    # Source code
│   ├── main.ts            # Entry point
│   ├── ai/                # AI systems
│   ├── audio/             # Sound manager
│   ├── core/              # Game loop, state, input
│   ├── entities/          # Fish, sharks, power-ups
│   ├── rendering/         # Graphics and effects
│   └── utils/             # Helper functions
├── index.html             # Main HTML file
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
└── README.md              # Documentation
```

---

## 🎮 How to Play

Once the game is running:

1. **Start Screen**: Click anywhere to start
2. **Gameplay**:
   - Click on **fish** to pop them (+10 points)
   - Avoid **decoys** (jellyfish, octopus, sea urchin) (-5 points, -1 life)
   - Collect **power-ups** (slow time, shield, magnet, double points)
   - Catch **golden fish** (+30 points)
   - Open **treasure chests** (+50-100 points)
   - Avoid **sharks** (-20 points)
3. **Game Over**: Click to restart

---

## 🔧 Troubleshooting

### Problem: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: Port 5173 is already in use

**Solution:**
```bash
# Kill the process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or use a different port
npm run dev -- --port 3000
```

### Problem: TypeScript errors

**Solution:**
```bash
# Check for type errors
npm run type-check

# If errors persist, try:
npm install --save-dev typescript@latest
```

### Problem: Game doesn't load in browser

**Solution:**
1. Check browser console for errors (F12)
2. Try a different browser (Chrome, Firefox, Edge)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart the dev server

### Problem: Black screen or no graphics

**Solution:**
1. Check if canvas element exists in index.html
2. Open browser console (F12) and look for errors
3. Try disabling browser extensions
4. Update your graphics drivers

---

## 🌐 Browser Compatibility

Aqua Arcade works best on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

**Note:** Internet Explorer is not supported.

---

## 📱 Mobile/Touch Support

The game supports touch controls:
- Tap on fish to pop them
- Works on tablets and smartphones
- Best experience on tablets (larger screen)

---

## 🎨 Customization

### Change Game Settings

Edit `src/utils/config.ts`:

```typescript
export const DEFAULT_CONFIG = {
  difficulty: {
    baseSpawnRate: 1.0,      // Fish spawn frequency
    maxDifficulty: 2.0,      // Maximum difficulty
    // ... more settings
  }
};
```

### Modify Colors

Edit `src/rendering/Renderer.ts` or `src/rendering/UnderwaterBackground.ts`

### Add New Fish Types

1. Edit `src/entities/Fish.ts`
2. Add new variant in `FishVariant` enum
3. Add rendering logic in `src/rendering/Renderer.ts`

---

## 🚀 Deployment

### Deploy to Netlify (Free)

```bash
# Build the project
npm run build

# Deploy to Netlify
# 1. Sign up at netlify.com
# 2. Drag and drop the 'dist' folder
# 3. Your game is live!
```

### Deploy to AWS S3

```bash
# Build the project
npm run build

# Use the provided script
.\deploy-to-s3.ps1
```

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 📚 Additional Resources

- **README.md** - Project overview and features
- **NEW_FEATURES.md** - List of all special entities
- **ADVANCED_AI_FEATURES.md** - AI systems documentation
- **RETRO_FEATURES.md** - Retro arcade effects
- **IMPLEMENTATION_STATUS.md** - Development progress
- **DEPLOYMENT_GUIDE.md** - Deployment instructions

---

## 🐛 Found a Bug?

1. Check if it's already reported in GitHub Issues
2. Create a new issue with:
   - Description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information

---

## 💡 Need Help?

- **GitHub Issues**: https://github.com/DeepikaSidda/Aqua-Arcade/issues
- **Live Demo**: http://underwater-fish-game-2024-dec.s3-website-us-east-1.amazonaws.com

---

## 🎉 You're Ready!

Run `npm run dev` and start playing Aqua Arcade!

**Happy Gaming! 🐟🎮✨**
