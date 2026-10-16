# Dova landing page

Static marketing site for a mobile app: a gamified daily path to learn about God. The dove mascot and the placeholder brand are both named Dova until the final name and domain are chosen.

## Change the brand

Edit [`site.config.json`](site.config.json). The public app name, the dove's name, the support email, and the store links are filled from that file when the site is built.

```json
{
  "brand": "Dova",
  "mascot": "Dova",
  "domain": "example.com",
  "supportEmail": "hello@example.com",
  "appStoreUrl": "https://apps.apple.com/",
  "playStoreUrl": "https://play.google.com/store"
}
```

`brand` is the app name. `mascot` is the dove's name. They can diverge when the app is renamed. Templates use `{{brand}}`, `{{mascot}}`, `{{domain}}`, `{{supportEmail}}`, `{{appStoreUrl}}`, `{{playStoreUrl}}`, and `{{year}}`. `domain` is `get-dova.com`. The current pages do not print it.

The App Store and Google Play buttons are placeholder links. Replace the URLs in `site.config.json` when the listings exist, and edit the placeholder sentence in `src/partials/stores.html` if you want it gone.

The terms live at `/terms` (`src/terms.html`). The footer and the note under the store buttons link there.

Then rebuild:

```bash
npm run build
```

The Worker name in [`wrangler.jsonc`](wrangler.jsonc) is the deploy name, separate from the public brand.

## Local preview

```bash
npm install
npm run preview
```

`preview` builds `dist/` and serves it with Wrangler at <http://localhost:8787>. This is a local preview of static assets. It does not publish a public Preview URL.

## Deploy to Cloudflare Workers

The site ships as [Workers static assets](https://developers.cloudflare.com/workers/static-assets/). There is no Worker script. Wrangler uploads `dist/` and serves `index.html`, with `404.html` for unknown paths.

1. Install dependencies and log in:

   ```bash
   npm install
   npx wrangler login
   ```

2. Deploy:

   ```bash
   npm run deploy
   ```

   That builds `dist/` and runs `wrangler deploy`. Cloudflare assigns a `*.workers.dev` hostname. If that subdomain is taken, change `name` in `wrangler.jsonc`.

The Worker `dova-landing` is attached to [get-dova.com](https://get-dova.com) and [www.get-dova.com](https://www.get-dova.com). Those hostnames are listed under `routes` in `wrangler.jsonc`, so a later `npm run deploy` keeps them.

`npm run check` builds the site and runs `wrangler deploy --dry-run` to confirm the asset bundle packages.

Workers Builds can later deploy pull requests with `npx wrangler preview`. Those Preview URLs are public unless you add access controls. See [Workers Previews](https://developers.cloudflare.com/workers/previews/).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run build` | Fill the templates from `site.config.json` into `dist/` |
| `npm run preview` | Build and serve locally with Wrangler |
| `npm run deploy` | Build and deploy |
| `npm run check` | Build and package with `wrangler deploy --dry-run` |

## Look

The page follows the app's coral stamp and Nunito system. The page is cream `#FFFBF5`, ink is `#2E2420`, and the main action is a sunrise-coral pill `#E8793F` with a `#C9602B` lip. Secondary copy uses `#807168`, a darker step of the app's `#8A7B72`, so small text stays readable on cream. Type is [Nunito](src/fonts/Nunito-OFL.txt) (SIL Open Font License, Latin), weights 500–900.

The app icon and the three dove poses in `src/img/` are the product art supplied for this site. The private app repository was not readable from this environment, so nothing was copied from that git history. Screenshots of the earlier journal product are not used.

## Stack

Plain HTML, CSS, and a small menu script. Wrangler is the only dependency, and it is a dev dependency used to preview and deploy. The font file covers Latin; other scripts fall back to the visitor's system fonts.
