# Benjamin James | Academic Command Center

A multi-page student portfolio and academic management website built with **HTML, CSS and JavaScript** (no frameworks) for a Level 100 web development assignment at Miva Open University.

**Student:** Benjamin James, B.Sc. Cyber Security
**Focus:** securing the connected systems that keep buildings running, bridging cyber security and facility management.

- **Live site:** _add your GitHub Pages link here_ (e.g. `https://renabtz.github.io/your-repo-name/`)
- **Repository:** _add your repository link here_ (e.g. `https://github.com/Renabtz/your-repo-name`)

---

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Hero with photo, typing-effect tagline, welcome message, biography, animated stats |
| About | `about.html` | Education timeline, career aspirations, animated skill bars, hobbies, academic record table with calculated GPA, audio player |
| Projects | `projects.html` | Three project cards with screenshots, filter buttons, detail pop-ups and a live password-strength demo |
| Academic Planner | `planner.html` | Add, complete and delete tasks; filter; progress bar; tasks saved in the browser |
| Contact | `contact.html` | Form (name, email, phone, message) with JavaScript validation and a success message |
| 404 | `404.html` | Friendly "page not found" page |

## Assignment requirements and where to find them

| Requirement | Where it is met |
|---|---|
| Semantic HTML | `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` across the site, plus `dialog` (Projects), `details` (Contact FAQ), `template` (Planner) and `table` (About) |
| Forms | Contact form (`contact.html`), add-task form (`planner.html`) |
| Tables | Academic record table with `caption`, `thead`, `tbody`, `tfoot` (`about.html`) |
| Images | Portrait photo, three project mockups (`assets/images/`), all with `alt` text |
| Hyperlinks | Navigation, buttons, footer, GitHub and email links |
| Lists | `ul` and `ol` for navigation, timeline, features and tasks |
| Multimedia | Audio player with original beat (`assets/media/beat-sample.wav`) |
| External CSS | `css/style.css` (one stylesheet, organised by numbered sections) |
| Responsive design | Breakpoints at 900px and 560px; tested at 390px, 820px and 1366px wide |
| Flexbox and Grid | Flexbox for navbar, buttons, filters; Grid for hero, cards, planner layout, footer |
| Navigation styling | Fixed glass navbar, active-page highlight, animated mobile hamburger menu |
| Animations and transitions | Scroll reveal, rotating photo ring, skill bars, hover lifts, typing effect, count-up numbers, modal |
| Consistent colour scheme | CSS variables for navy, electric blue, white and red, plus a light theme |
| Event handling | Clicks, form submit, `input`, `blur`, `change`, `keydown`, scroll, plus Intersection Observers for scroll-triggered animations |
| DOM manipulation | Task list rendering, modal content, validation messages, theme switching |
| Form validation | `js/contact.js` (see below) |
| Dynamic content updates | Live stats, progress bar, character counter, password meter, GPA |
| Arrays and functions | `tasks` array in `planner.js`, `projects` array in `projects.js`, validator functions in `contact.js` |
| Interactive task manager | `js/planner.js` |

### Contact form validation rules
1. No field may be empty.
2. Email must match the pattern `name@domain.tld`.
3. Phone number must contain **digits only** (7 to 15 digits).
4. Message must be at least 10 characters.

Errors appear under each field, the first invalid field receives focus, and fields re-check live as the user types.

> The form is a **demonstration**: it validates and shows a confirmation but does not send the data anywhere.

## Project structure

```
benjamin-portfolio/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── 404.html
├── README.md
├── css/
│   └── style.css        # all styles, organised in numbered sections
├── js/
│   ├── main.js          # every page: theme, menu, scroll reveal, typing, counters
│   ├── about.js         # skill bars + GPA calculation
│   ├── projects.js      # filters, modal, password demo
│   ├── planner.js       # task manager
│   └── contact.js       # form validation
└── assets/
    ├── images/          # portrait + project mockups
    └── media/           # audio sample
```

## Accessibility
- Skip-to-content link and visible keyboard focus outlines
- Descriptive `alt` text, `aria-label`s, `aria-live` announcements and `aria-current` on the active link
- Form fields have labels; errors are linked with `aria-describedby`
- The pop-up uses the native `<dialog>` element (focus handling and Escape to close)
- Respects `prefers-reduced-motion`
- Colour is never the only signal (priority badges include text)

## Security practices
- Content-Security-Policy on every page: no inline scripts or styles
- User text is inserted with `textContent`, never `innerHTML`, so injected HTML cannot run
- Data read back from `localStorage` is validated and cleaned before use
- External links use `rel="noopener noreferrer"`
- Honeypot field on the contact form to catch simple spam bots
- No third-party scripts; the only external resource is Google Fonts (CSS and font files)

## Run it locally
No build step is needed. Download or clone the repository and open `index.html` in a browser.

## Deploy to GitHub Pages
1. Make sure `index.html` is at the **root** of the repository (not inside a sub-folder).
2. On GitHub open **Settings, then Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute the live link appears at the top of that page.

## Content to personalise
- `about.html`: secondary school name, skill percentages, third hobby, academic record (sample data)
- `projects.html` and `js/projects.js`: replace the profile GitHub links with the real repository for each project
- `assets/media/beat-sample.wav`: replace with your own track (keep the file name, or edit `about.html`)

## Credits
Designed and developed by Benjamin James. Fonts: Space Grotesk, Inter and JetBrains Mono via Google Fonts. All graphics and the audio sample were created for this project.
