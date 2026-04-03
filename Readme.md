# Michael Smith Resume Site

This repository contains the source for my GitHub Pages resume site.

If you landed here while browsing the repo, the live site is intended as a compact presentation of my background, experience, and current technical focus across AI systems, developer tooling, and full-stack engineering.

## About This Site

The site is a small dependency-free static project designed to be easy to host, easy to read, and easy to revise over time.

Its main pieces are:

- `index.html`: page structure
- `styles.css`: layout and visual styling
- `app.js`: client-side rendering logic
- `resume-data.js`: the content source for experience, projects, skills, and education

## Reuse

If you want to use this as a starting point for your own resume site, feel free to copy it and adapt it for your own `username.github.io` page.

The easiest way to customize it is:

1. Update the content in `resume-data.js`
2. Adjust layout or visual design in `styles.css`
3. Change structure only if needed in `index.html`

## Local Preview

You can preview the site in either of these ways:

1. Open `index.html` directly in a browser.
2. Run a local static server from this folder, for example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages Setup

If you want to host your own version on GitHub Pages:

1. Create a repository named `YOUR_GITHUB_USERNAME.github.io`
2. Copy these files into that repository
3. Push to the `main` branch
4. In GitHub, open `Settings` -> `Pages`
5. Set the source to `Deploy from a branch`
6. Choose `main` and `/ (root)`
7. Save and wait for GitHub to publish the site

Your site will then be available at:

`https://YOUR_GITHUB_USERNAME.github.io/`

## Updating The Content

For most revisions, `resume-data.js` is the only file you need to edit.

That file controls:

- summary/profile text
- experience entries
- project entries
- skill groups
- education

## Notes

This repo is intentionally simple. There is no build step, framework, or dependency chain required to host it on GitHub Pages.
