export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';
    if (path === '/' || path === '/index.html') {
      return new Response(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dova — A daily path to know God</title>
    <meta
      name="description"
      content="Christian faith, a few minutes a day. Dova is a daily path to know God."
    />
    <meta name="theme-color" content="#f3e2ce" />
    <link rel="icon" href="https://cdn.jsdelivr.net/gh/davidehoo/dova-landingpage@main/assets/icon.png" type="image/png" />
    <link rel="apple-touch-icon" href="https://cdn.jsdelivr.net/gh/davidehoo/dova-landingpage@main/assets/icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="index.html">
        <img src="https://cdn.jsdelivr.net/gh/davidehoo/dova-landingpage@main/assets/icon.png" alt="" width="64" height="64" />
        Dova
      </a>
    </header>

    <main>
      <section class="hero">
        <div class="hero-inner">
          <p class="eyebrow">Christian faith, a few minutes a day</p>
          <h1>A daily path<br />to know God.</h1>
        </div>
      </section>

      <section class="stage">
        <img
          class="mascot"
          src="https://cdn.jsdelivr.net/gh/davidehoo/dova-landingpage@main/assets/mascot.png"
          width="616"
          height="615"
          alt="Dova, a white dove with round glasses and a golden halo"
        />
        <a
          class="store"
          href="https://apps.apple.com/us/search?term=Dova"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 18 22" aria-hidden="true">
            <path
              fill="currentColor"
              d="M13.05 4.3c.7-.85 1.18-2.03 1.05-3.21-1.01.04-2.24.67-2.96 1.52-.65.75-1.22 1.95-1.07 3.1 1.13.09 2.28-.57 2.98-1.41zM14.1 6.22c-1.65-.1-3.05.94-3.84.94-.79 0-2-.91-3.3-.89-1.7.03-3.27.99-4.14 2.51-1.77 3.06-.45 7.59 1.27 10.08.84 1.22 1.84 2.58 3.16 2.53 1.26-.05 1.74-.82 3.27-.82 1.52 0 1.96.82 3.3.79 1.36-.02 2.22-1.24 3.05-2.46.96-1.4 1.36-2.76 1.38-2.83-.03-.01-2.65-1.02-2.68-4.04-.02-2.53 2.07-3.74 2.16-3.8-1.18-1.73-3.01-1.92-3.63-1.97z"
            />
          </svg>
          <span class="store-copy">
            <span class="store-kicker">Download on the</span>
            <span class="store-name">App Store</span>
          </span>
        </a>
      </section>
    </main>

    <footer class="site-footer">
      <a class="brand" href="index.html">
        <img src="https://cdn.jsdelivr.net/gh/davidehoo/dova-landingpage@main/assets/icon.png" alt="" width="64" height="64" />
        Dova
      </a>
      <p class="tagline">A daily path to learn about God.</p>
      <a class="terms-link" href="terms.html">Terms</a>
      <p class="hello-label">Say hello</p>
      <a class="email" href="mailto:admin@holy365.app">admin@holy365.app</a>
      <p class="copy">© 2026 Dova</p>
    </footer>
  </body>
</html>
`, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
    }
    if (path === '/styles.css') {
      return new Response(`:root {
  --ink: #1a1714;
  --paper: #fefbf6;
  --cream: #f3e2ce;
  --black: #000000;
  --footer: #2e2925;
  --footer-muted: #c4beb6;
  --footer-text: #f7f4f1;
  --font: "Plus Jakarta Sans", "Nunito Sans", "Segoe UI", sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--black);
  color: var(--ink);
  font-family: var(--font);
  line-height: 1.5;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
}

a:focus-visible,
button:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 4px;
}

.site-header {
  background: var(--paper);
  display: flex;
  justify-content: center;
  padding: 20px 24px;
}

.brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--ink);
  text-decoration: none;
  font-weight: 800;
  letter-spacing: -0.045em;
  font-size: 1.7rem;
  line-height: 1;
}

.brand img {
  width: 52px;
  height: 52px;
  border-radius: 22%;
}

.hero {
  background: var(--cream);
  text-align: center;
  padding: 64px 24px 128px;
  border-bottom-left-radius: 50% 96px;
  border-bottom-right-radius: 50% 96px;
}

.hero-inner {
  width: min(40rem, 100%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.eyebrow {
  margin: 0 0 18px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1.4;
}

h1 {
  margin: 0;
  font-size: clamp(2.55rem, 8vw, 3.35rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--black);
  padding: 8px 24px 88px;
}

.mascot {
  width: min(88vw, 380px);
  height: auto;
}

.store {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
  min-height: 54px;
  padding: 7px 18px 7px 14px;
  border-radius: 12px;
  background: #000;
  color: #fff;
  border: 1.5px solid #fff;
  text-decoration: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  transition: transform 0.15s ease, background 0.15s ease;
}

.store:hover {
  background: #161616;
  transform: translateY(-1px);
}

.store:focus-visible {
  outline-color: #fff;
}

.store svg {
  width: 20px;
  height: 24px;
  flex: none;
}

.store-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1;
  text-align: left;
}

.store-kicker {
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.store-name {
  margin-top: 2px;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.site-footer {
  background: var(--footer);
  color: var(--footer-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 56px 24px 40px;
  margin-top: auto;
}

.site-footer .brand {
  color: var(--footer-text);
}

.tagline {
  margin: 28px 0 0;
  max-width: 22rem;
  color: var(--footer-muted);
  font-size: 1.05rem;
}

.terms-link {
  margin-top: 36px;
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
}

.hello-label {
  margin: 48px 0 0;
  color: var(--footer-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.email {
  margin-top: 8px;
  color: #fff;
  font-weight: 700;
  font-size: 1.15rem;
  text-decoration: none;
}

.terms-link:hover,
.email:hover {
  text-decoration: underline;
}

.copy {
  margin: 22px 0 0;
  color: var(--footer-muted);
  font-size: 0.95rem;
}

.legal {
  flex: 1;
  background: var(--cream);
  padding: 56px 24px 88px;
}

.legal-inner {
  width: min(40rem, 100%);
  margin: 0 auto;
}

.legal h1 {
  text-align: center;
  font-size: clamp(2.4rem, 6vw, 3.4rem);
}

.legal .updated {
  margin: 16px 0 0;
  text-align: center;
  color: #5c534c;
  font-size: 0.95rem;
}

.legal h2 {
  margin: 36px 0 8px;
  font-size: 1.2rem;
  letter-spacing: -0.03em;
}

.legal p {
  margin: 0;
}

.legal p + p {
  margin-top: 12px;
}

.legal a {
  color: var(--ink);
  font-weight: 700;
}

@media (min-width: 800px) {
  .site-header {
    padding: 28px 32px;
  }

  .brand {
    font-size: 2rem;
    gap: 14px;
  }

  .brand img {
    width: 64px;
    height: 64px;
  }

  .hero {
    padding: 104px 40px 196px;
    border-bottom-left-radius: 50% 150px;
    border-bottom-right-radius: 50% 150px;
  }

  .eyebrow {
    margin-bottom: 22px;
    font-size: 0.92rem;
    letter-spacing: 0.16em;
  }

  h1 {
    font-size: clamp(3.6rem, 5.6vw, 5.4rem);
  }

  .stage {
    padding: 12px 32px 120px;
  }

  .mascot {
    width: min(46vw, 460px);
  }

  .store {
    margin-top: 36px;
    min-height: 64px;
    padding: 8px 22px 8px 16px;
    border-radius: 14px;
  }

  .store svg {
    width: 24px;
    height: 28px;
  }

  .store-kicker {
    font-size: 0.78rem;
  }

  .store-name {
    font-size: 1.5rem;
  }

  .site-footer {
    padding: 72px 32px 48px;
  }

  .tagline {
    margin-top: 32px;
    font-size: 1.15rem;
  }

  .legal {
    padding: 88px 40px 120px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .store {
    transition: none;
  }

  .store:hover {
    transform: none;
  }
}
`, { headers: { 'content-type': 'text/css; charset=utf-8', 'cache-control': 'public, max-age=300' } });
    }
    if (path === '/terms.html' || path === '/terms') {
      return new Response(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Terms — Dova</title>
    <meta name="description" content="Terms for the Dova website and app." />
    <meta name="theme-color" content="#f3e2ce" />
    <link rel="icon" href="https://cdn.jsdelivr.net/gh/davidehoo/dova-landingpage@main/assets/icon.png" type="image/png" />
    <link rel="apple-touch-icon" href="https://cdn.jsdelivr.net/gh/davidehoo/dova-landingpage@main/assets/icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="index.html">
        <img src="https://cdn.jsdelivr.net/gh/davidehoo/dova-landingpage@main/assets/icon.png" alt="" width="64" height="64" />
        Dova
      </a>
    </header>

    <main class="legal">
      <div class="legal-inner">
        <h1>Terms</h1>
        <p class="updated">Last updated October 16, 2026</p>

        <h2>Using Dova</h2>
        <p>
          These terms cover the Dova website and the Dova app. Dova is a short
          daily practice for Christian faith. You may use it for your own
          personal practice.
        </p>
        <p>
          Please don’t misuse the app or the site, try to disrupt them, or use
          them in a way that harms someone else.
        </p>

        <h2>The service</h2>
        <p>
          Dova is offered as it is available today. Features can change. If
          these terms change, the date at the top of this page will change with
          them.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms:
          <a href="mailto:admin@holy365.app">admin@holy365.app</a>
        </p>
      </div>
    </main>

    <footer class="site-footer">
      <a class="brand" href="index.html">
        <img src="https://cdn.jsdelivr.net/gh/davidehoo/dova-landingpage@main/assets/icon.png" alt="" width="64" height="64" />
        Dova
      </a>
      <p class="tagline">A daily path to learn about God.</p>
      <a class="terms-link" href="terms.html">Terms</a>
      <p class="hello-label">Say hello</p>
      <a class="email" href="mailto:admin@holy365.app">admin@holy365.app</a>
      <p class="copy">© 2026 Dova</p>
    </footer>
  </body>
</html>
`, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
    }
    return new Response('Not found', { status: 404 });
  }
};
