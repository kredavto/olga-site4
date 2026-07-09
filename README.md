# Maison Lumière — Fine Dining Website

A premium, award-winning fine-dining restaurant website with an ultra-luxury,
minimalist aesthetic inspired by Michelin-starred restaurants. Timeless,
cinematic, and immersive — built as a fast, dependency-free static site.

**Interface language: Russian (ru).**

## Highlights

- **Cinematic hero** with scroll-driven zoom, fade, and content parallax
- **Scroll-triggered animations** — staggered fade-ups, animated gold dividers,
  parallax food photography, scroll progress indicator
- **Chef's Signature Menu** — 8 filterable categories, editorial dish cards with
  hover zoom, gold border reveal, ingredients, wine pairings and
  "Chef's Recommendation" badges
- **Luxurious reservation form** — glass-morphism card, floating labels, gold
  inputs, live validation and an animated success confirmation
- **Restaurant experience** storytelling rows with parallax imagery
- **Masonry gallery** with a full-screen lightbox (keyboard + arrow navigation)
- **Testimonials** with gold quotation marks and five-star presentation
- **Minimal luxury footer** with hours, contact, socials and newsletter
- Frosted-glass sticky navigation, ambient light effects, custom loader
- Fully responsive (desktop / tablet / mobile) and
  `prefers-reduced-motion` aware

## Stack

Pure HTML, CSS and vanilla JavaScript — no build step, no framework.

- `index.html` — page structure and content
- `css/styles.css` — design tokens, layout, animations
- `js/main.js` — menu data, scroll effects, gallery/lightbox, form logic

Typography is served from Google Fonts (Cormorant Garamond + Inter) and
photography from Unsplash's CDN.

## Colour Palette

| Token | Hex |
| --- | --- |
| Deep Black | `#0D0D0D` |
| Ivory | `#F8F5F0` |
| Warm White | `#FAFAF8` |
| Champagne Gold | `#C8A96A` |
| Soft Charcoal | `#2C2C2C` |

## Running locally

No dependencies. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
