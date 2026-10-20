# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

`Vibrant with high-contrasting colours`

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- https://venngage-wordpress.s3.amazonaws.com/uploads/2022/11/virbant-color-pallette-1024x239.png
- https://colorswall.com/images/palettes/pallete-warna-571177-colorswall.png
- https://whoisaccessible.com/wp-content/uploads/2021/04/Example-of-keyboard-focus-on-Costco-website.png

Anti-references — what we are explicitly **not** trying to look like:

- https://whoisaccessible.com/wp-content/uploads/2021/04/Example-of-poor-color-contrast-on-the-PIWNICH-website.png

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#FF4121` | Header, "+" button, focus rings |
| `brand-accent` | `#D21AE8` | Highlights, hover states, links |
| `surface-page` | `#FFFFFF` | Page background |
| `surface-card` | `#FFFFFF` | Card background |
| `text-primary` | `#000000` | Body text |
| `text-muted` | `#454545` | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#10B981` | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | `#DC2626` | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#4D80B3` | More than 2 days out |
| `due-warning` | `#B3804D` | Less than 24 hours |
| `due-overdue` | `#B34D4D` | Past due |
| `due-neutral` | `#4DB380` | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | `16 point` | `Recommended large font https://service-manual.ons.gov.uk/brand-guidelines/typography/accessible-text-formatting` |
| Body | `14 point` | `Medium font size` |
| Monospace (tags, badges, code) | `12 point` | `Minimum limit https://service-manual.ons.gov.uk/brand-guidelines/typography/accessible-text-formatting` |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** `white card on white background with 1px rounded grey solid border with soft shadows` (e.g. "Light, almost weightless; the only weight is from a 1px border, no shadow except on hover.")
- **Buttons:** `rounded brand-primary fill with black text` (e.g. "Solid fill, no gradient, generous padding, rounded-md.")
- **Modal:** `50% width, 70% height, centered with full opacity ` (e.g. "Centered, max-width-md, slate-900 backdrop at 50% opacity.")
- **Empty states:** `1px grey solid border with muted text` (e.g. "Dashed border, muted text, never sad.")
- **Drag affordance (if used):** `card is lifted with 60% opacity` (e.g. "None — we use a status dropdown.")

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | `New Task` (e.g. "+ Task" or "Add task" or "New") |
| Empty column placeholder | `Nothing to display.` (e.g. "Nothing here yet — keep going.") |
| Toast after "Copy as Prompt Context" | `Context copied.` (e.g. "Copied. Now paste it into the AI.") |
| Confirm-delete message | `Confirm deletion of task.` (e.g. "Delete this task? You can't undo.") |
| Handoff toast (M7 `task-owner`) | `Task asigned to {name}` (e.g. "Handed off to {name}. They've got it.") |
s
## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `Kanban Board` (match PRD §11 team identity)
- **Wordmark style:** `A simple kanban board` (e.g. "Just the name in the heading font, brand-primary color, no icon.")

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
