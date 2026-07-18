# Noam Sky Levy — Website

This is the complete website: 4 pages (Home, Bio, Upcoming Work, Merch), fully responsive for desktop and mobile. No build tools, no installs — it's plain HTML, CSS, and JavaScript, so it will work forever and any developer can pick it up easily.

## What's in this folder

```
noam-levy-music/
├── index.html      → Home page
├── bio.html         → Bio page
├── upcoming.html    → Upcoming Work page
├── merch.html       → Merch page
├── css/
│   └── styles.css   → all colors, fonts, spacing, layout
├── js/
│   └── main.js       → mobile menu, scroll animations
└── README.md         → this file
```

## Previewing it on your computer

Double-clicking `index.html` will open it in your browser, but the navigation links between pages won't work correctly that way (browsers block some things when opening files directly). For an accurate preview:

1. Open Terminal
2. Run: `cd "/Users/ofirlevy/Downloads/noam-levy-music"`
3. Run: `python3 -m http.server 8000`
4. Open your browser to `http://localhost:8000`
5. Press Control+C in Terminal when you're done

## Editing content (no coding needed)

Each page is a single `.html` file. Open it in any text editor (TextEdit, VS Code, even Notepad-style apps) and change the text between tags. For example, in `index.html` you'll find:

```html
<h1 class="display-xl">NOAM SKY<br>LEVY</h1>
```

Just change the words — leave the `<...>` tags alone. The same goes for track names, dates, prices, bio text, etc. Search (Cmd+F) for the text you want to change to find it quickly.

**Real links:** Right now Spotify/YouTube/Instagram links point to placeholder URLs and the "Get In Touch" button points to a placeholder email. Search each HTML file for `open.spotify.com`, `youtube.com`, `instagram.com`, and `mailto:hello@noamskylevy.com` and replace with the real ones.

**Real photos:** The purple gradient boxes (hero portrait, track artwork, product photos) are placeholders. To swap in a real photo:
1. Save your image into the `assets` folder (e.g. `assets/portrait.jpg`)
2. Find the matching element in the HTML, e.g. `<div class="bio-hero__portrait"></div>`
3. Change it to `<div class="bio-hero__portrait" style="background-image:url('assets/portrait.jpg'); background-size:cover; background-position:center;"></div>`

## Changing colors or fonts

Everything lives at the top of `css/styles.css` under `:root`. Change a value once and it updates the whole site:

```css
--bg-base: #0A0A0A;        /* main background */
--accent-primary: #7C5CFF;  /* violet accent/glow */
--accent-volt: #C6FF3D;     /* lime accent (tags) */
```

## Publishing it to the web (free)

The easiest option — **Netlify Drop** — needs no account for a quick test, or a free account for a permanent link:

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Drag the entire `noam-levy-music` folder onto the page
3. Netlify gives you a live URL immediately (like `random-name-123.netlify.app`)
4. Sign up free to keep the site permanently and get a stable link

Alternatives that work the same way:
- **Vercel** (vercel.com) — drag-and-drop or connect a GitHub repo
- **GitHub Pages** — free if you're open to using GitHub; good if you want version history

## Adding your own domain (e.g. noamskylevy.com)

1. Buy a domain from a registrar (Namecheap, Google Domains, GoDaddy — roughly $10–15/year)
2. In Netlify (or Vercel): Site settings → Domain management → Add custom domain
3. They'll give you DNS records to add at your registrar — follow their instructions (usually takes a few minutes to set up, up to 24–48 hours to fully activate)

## If you want a developer to take it further later

This is standard HTML/CSS/JS — any web developer can open it and understand it immediately, no special tools required.
