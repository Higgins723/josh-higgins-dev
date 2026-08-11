# joshhiggins.dev — Career Quest

Interactive side-scrolling portfolio for **Joshua Higgins**. Walk through education, experience, skills, and contact in a game-inspired world.

**Live:** [https://joshhiggins.dev](https://joshhiggins.dev)

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Framer Motion
- GitHub Pages (Actions deploy) + custom domain

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Controls

| Input | Action |
|-------|--------|
| ← → / A D | Move |
| Space / W / ↑ | Jump |
| E / Enter | Inspect landmark |
| Esc | Close panel |

On mobile, on-screen pads appear at the bottom.

## Deploy

Pushes to `master` / `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

In the GitHub repo:

1. **Settings → Pages → Source:** GitHub Actions  
2. Custom domain: `joshhiggins.dev` (CNAME is in `public/CNAME`)

## Content

Edit [`src/content/portfolio.ts`](src/content/portfolio.ts) for roles, skills, metrics, and world layout. Resume PDF lives at `public/Joshua-Higgins-Resume-2026.pdf`.
