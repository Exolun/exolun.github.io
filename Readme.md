# Michael Smith's Site

This folder contains the static site for `mikelikescoding`, now organized as a small multi-page site instead of a single resume page.

## Local Preview

Use a local static server from this folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes On PWAs

Splashman includes a manifest and service worker. For installability and offline caching, test it through `http://localhost` or `https`, not by opening files directly from disk.
