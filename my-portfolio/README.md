# Cosmic Portfolio Template

A stunning, modern portfolio website featuring an immersive 3D Milky Way galaxy background built with Three.js, TypeScript, and Vite. Perfect for developers, designers, and professionals who want to showcase their work with a unique cosmic aesthetic.

![Portfolio Preview](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## Features

- **Immersive 3D Background** - Interactive Milky Way galaxy panorama that responds to mouse movement and scroll
- **Responsive Design** - Looks great on all devices from mobile to desktop
- **Smooth Animations** - Scroll-triggered section animations and smooth navigation
- **Content-Driven Architecture** - Single TypeScript file to customize all your data
- **Warm Cosmic Theme** - Amber/gold accents with glassmorphism effects
- **Loading Screen** - Professional loading animation while assets load
- **3D Navbar Logo** - Animated 3D logo in the navigation bar
- **Easy Customization** - Well-organized code structure for easy modifications

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vite** | Lightning-fast build tool and dev server |
| **TypeScript** | Type-safe JavaScript for maintainable code |
| **Three.js** | 3D graphics for the galaxy background and logo |
| **CSS3** | Custom properties, flexbox, grid, glassmorphism |

## Project Structure

```
my-portfolio/
├── index.html                 # Main HTML entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── public/                    # Static assets
│   ├── favicon.svg            # Browser favicon
│   ├── logo.glb               # 3D logo model (navbar)
│   └── milkyway.glb           # 3D Milky Way panorama
├── src/
│   ├── main.ts                # Main entry point & content rendering
│   ├── vite-env.d.ts          # Vite type declarations
│   ├── content/
│   │   └── profile.ts         # ⭐ YOUR DATA GOES HERE
│   ├── loader/
│   │   └── LoadingScreen.ts   # Loading animation
│   ├── three/
│   │   ├── scene.ts           # Milky Way background scene
│   │   └── NavbarLogo.ts      # 3D navbar logo
│   └── styles/
│       └── main.css           # All styles
```

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/cosmic-portfolio.git
   cd cosmic-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The site will open automatically at `http://localhost:3001`

4. **Build for production:**
   ```bash
   npm run build
   ```
   Output will be in the `dist/` folder.

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## Deployment with GitHub Actions

This template includes automatic deployment to GitHub Pages using GitHub Actions. The workflow file is already included at `.github/workflows/deploy.yml`.

### Setup Instructions

1. **Update `vite.config.ts`** with your repository name:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',  // Replace with your GitHub repo name
     // ...
   })
   ```

2. **Enable GitHub Pages** in your repository:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment", select **GitHub Actions** as the source

3. **Push your code** to the `main` branch:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Your site will be live** at: `https://yourusername.github.io/your-repo-name/`

### How It Works

- Every push to the `main` branch triggers the workflow
- GitHub Actions builds the project using Vite
- The `dist/` folder is deployed to GitHub Pages
- Your portfolio is automatically updated

## Data Types Reference

Here are all the TypeScript interfaces you can use in `profile.ts`:

```typescript
interface Profile {
  name: string;
  headline: string;
  location: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github?: string;
    twitter?: string;
    discord?: string;
    instagram?: string;
    website?: string;
  };
  summary: string;
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
}

interface SkillCategory {
  category: string;
  items: string[];
}

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  coursework?: string[];
}

interface Project {
  name: string;
  year: string;
  description: string;
  tech: string[];
  highlights: string[];
  link?: string;
}

interface Certification {
  name: string;
  issuer: string;
}
```

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests


---

**Made with ❤️ and Three.js**

If you found this template helpful, please consider giving it a ⭐ on GitHub!
