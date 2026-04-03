# Resume Site

This workspace now contains a dependency-free static resume site that can be hosted on GitHub Pages.

## Files

- `index.html`: page structure
- `styles.css`: layout and visual styling
- `app.js`: client-side renderer
- `resume-data.js`: the resume content source you will edit most often

## Local iteration

For content-only changes, edit `resume-data.js` and refresh the page.

You can preview the site in either of these ways:

1. Open `index.html` directly in a browser.
2. Run a local static server from this folder, for example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages setup

For a personal GitHub Pages site:

1. Create a repository named `YOUR_GITHUB_USERNAME.github.io`.
2. Copy these files into that repository.
3. Push to the `main` branch.
4. In GitHub, open `Settings` -> `Pages`.
5. Set the source to `Deploy from a branch`.
6. Choose `main` and `/ (root)`.
7. Save, then wait for GitHub to publish the site.

Your resume will then be available at:

`https://YOUR_GITHUB_USERNAME.github.io/`

## How we should iterate

The intended workflow is:

1. Keep layout changes in `styles.css` and `index.html`.
2. Keep wording changes in `resume-data.js`.
3. Update the data structure first whenever you want to revise bullets, projects, skills, or education.

If you want, the next step can be either:

- converting this into a more formal one-page resume presentation
- adding a printable PDF-oriented variant
- adding sections for contact links, certifications, or selected achievements
