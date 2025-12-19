# Deployment Guide - GitHub Pages with gh-pages

This project is configured to deploy to GitHub Pages using the `gh-pages` npm package.

## Quick Deploy

Simply run:

```bash
npm run deploy
```

This will:
1. Build the project (`npm run build`)
2. Deploy the `dist` folder to the `gh-pages` branch on GitHub

## Configuration

- **Base Path**: `/Nexus/` (configured in `vite.config.ts`)
- **Homepage**: `https://burulemirhan.github.io/Nexus` (configured in `package.json`)
- **Deploy Script**: Uses `gh-pages -d dist` to deploy the build folder

## First Time Setup

1. Make sure your GitHub repository is set up:
   ```bash
   git remote -v  # Should show your GitHub repo
   ```

2. Enable GitHub Pages in your repository:
   - Go to repository **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Select **gh-pages** branch and **/ (root)** folder
   - Click **Save**

3. Deploy:
   ```bash
   npm run deploy
   ```

## After Deployment

Your site will be live at: **https://burulemirhan.github.io/Nexus**

## Troubleshooting

- If deployment fails, make sure you're authenticated with GitHub (check `git remote -v`)
- The `gh-pages` branch will be created automatically on first deploy
- If assets don't load, verify the base path is `/Nexus/` in `vite.config.ts`
