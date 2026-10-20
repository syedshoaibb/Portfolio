# Syed Madanin Shoaib: Portfolio

Personal portfolio of Syed Madanin Shoaib, a final-year Computer Science student who builds
web applications and email forensics tools.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

## Sections

- **Hero**: introduction and an at-a-glance card styled as email headers
- **About, Skills**: background, education and the tools used
- **Projects**: three projects, each with its own detail page
- **Resume**: preview, an HTML version and a downloadable PDF
- **Certificates and Contact**
- Light and dark themes, a custom 404 page and a privacy page

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Project structure

```
index.html                 Home page
404.html                   Not-found page
pages/
  project.html             Project detail page, filled from portfolio-data.js (?id=slug)
  resume.html              HTML version of the resume
  privacy.html             Privacy note
assets/
  css/                     base/, layout/, components/, animation/, utilities/, responsive/
  js/                      One small script per feature
  data/portfolio-data.js   Projects, certificates and social links
  images/                  Project illustrations and the link-preview image
  icons/                   Favicon and app icons
  resume/                  Resume PDF
.well-known/security.txt   Security contact
_headers, _redirects       Optional: read by static hosts that support them, ignored by others
```

## Edit the content

Projects and certificates are plain data in `assets/data/portfolio-data.js`. Keep commas between
items and quotes around text.

```js
{
    "id": 4,
    "slug": "my-new-project",
    "title": "My New Project",
    "short": "New Project",
    "category": "Web Application",
    "status": "Completed",
    "context": "Personal project",
    "team": "Solo",
    "role": "What I did.",
    "summary": "One line shown on the project card.",
    "description": "A sentence or two for the detail page.",
    "highlights": ["Bullet one.", "Bullet two."],
    "technologies": ["HTML", "CSS", "JavaScript"],
    "github": "https://github.com/you/repo",
    "live": "https://example.com",
    "liveLabel": "Live demo",
    "image": "assets/images/projects/my-new-project.svg",
    "imageAlt": "Describe the image for screen readers"
}
```

- `id` sets the order (lowest first). `slug` is the detail-page address.
- Use `"#"` or `""` for `github` or `live` when there is no link yet; that button is hidden.
- `"spotlight": true` makes a project the wide featured card.
- Certificates use `title`, `organization`, optional `date` and optional `link`.

The hero card, About, Skills and Resume text are written directly in `index.html` and
`pages/resume.html`.

## Theme

Colours, type sizes and spacing are CSS custom properties in `assets/css/base/variables.css`.
The light theme overrides sit in the same file under `html[data-theme="light"]`.

## Before you publish

1. Replace `https://your-domain.example` with your real address in: `index.html`,
   `404.html`, `pages/*.html`, `sitemap.xml`, `robots.txt` and `.well-known/security.txt`.
   Link-preview images need the full address to work.
2. Add GitHub links for the projects that do not have one yet.
3. Add certificate links in `assets/data/portfolio-data.js` when you have shareable URLs.
4. Renew the `Expires` date in `.well-known/security.txt` once a year.

The site sends a strict Content-Security-Policy (see `_headers`), so keep scripts in
`assets/js/` and styles in `assets/css/` rather than inline.

## Licence

Code is MIT-licensed (see `LICENSE`). Text, resume and project descriptions are personal content.
