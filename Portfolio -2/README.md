# Naveen Karasu Portfolio

A modern, responsive portfolio website built with Three.js, TypeScript, and Vite.

## Features

- Interactive 3D particle background with Three.js
- Responsive design for all devices
- Smooth scroll animations
- Content-driven architecture (single source of truth)
- Modern dark theme with gradient accents

## Tech Stack

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Three.js** - 3D graphics library
- **CSS3** - Custom properties, flexbox, grid

## Project Structure

```
my-portfolio/
├── index.html              # Main HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── ASSET_LOG.md           # Tracks copied assets from reference
├── src/
│   ├── main.ts            # Main entry point
│   ├── vite-env.d.ts      # Vite type declarations
│   ├── content/
│   │   └── profile.ts     # Your profile data (edit this!)
│   ├── three/
│   │   └── scene.ts       # Three.js background scene
│   └── styles/
│       └── main.css       # All styles
└── public/                 # Static assets
```

## Quick Start

1. **Install dependencies:**
   ```bash
   cd my-portfolio
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   This will open the site at http://localhost:3001

3. **Build for production:**
   ```bash
   npm run build
   ```
   Output will be in the `dist/` folder.

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Customization

### Edit Your Profile Data

All your personal information is stored in `src/content/profile.ts`. Edit this file to update:

- Name, headline, location
- Contact information (email, phone, social links)
- Summary/about section
- Skills by category
- Work experience
- Projects
- Certifications

### Add Social Links

In `src/content/profile.ts`, find the `contact` object and add your social links:

```typescript
contact: {
  email: "your@email.com",
  phone: "(xxx) xxx-xxxx",
  linkedin: "https://linkedin.com/in/yourname",
  github: "https://github.com/yourname",
  twitter: "https://twitter.com/yourhandle",  // Add these
  discord: "https://discord.gg/yourserver",
  instagram: "https://instagram.com/yourhandle",
  website: "https://yourdomain.com",
}
```

### Customize Colors

Edit the CSS variables in `src/styles/main.css`:

```css
:root {
  --color-primary: #6366f1;      /* Main accent color */
  --color-secondary: #22d3ee;    /* Secondary accent */
  --color-accent: #f472b6;       /* Additional accent */
  --color-bg: #0a0a0f;           /* Background color */
  /* ... more variables */
}
```

### Customize Three.js Background

Edit `src/three/scene.ts` to customize:
- Particle count and colors
- Geometric shapes
- Animation speeds
- Mouse interaction sensitivity

## Deployment

This site is deployed using **GitHub Pages**.

### GitHub Pages Setup

1. Push your code to GitHub
2. Go to your repository Settings > Pages
3. Under "Build and deployment", select:
   - **Source**: GitHub Actions
4. Create `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

5. Commit and push - your site will deploy automatically!

## License

MIT License - feel free to use this as a template for your own portfolio!
