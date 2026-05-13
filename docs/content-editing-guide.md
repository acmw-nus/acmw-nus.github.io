# Content Editing Guide

This site is data-driven. Visible page copy, buttons, links, metadata, empty states, and shared labels should be edited in the `content/*.js` files only.

The HTML files define the page shells, `scripts/site.js` renders the layout, and `styles/site.css` controls visual design. Do not edit those files for routine content updates.

## Where to Edit

- `content/site.js`: chapter identity, logo, favicon, navigation, footer/social links, shared labels, and the not-found message.
- `content/home.js`: home hero content, hero buttons, hero image, and the home events preview settings.
- `content/about.js`: About page heading, intro, ACM-W Asia Pacific affiliation text/logo, and pillar cards.
- `content/events-page.js`: Events page heading, intro, empty state, and event list.
- `content/team-page.js`: Team page heading, intro, empty state, member cards, and volunteer callout.
- `content/join-page.js`: Join page heading, tab labels, tab panel copy, application form link/button, contact notes, and FAQs.

## Conditional Rendering

The renderer hides empty content automatically:

- Empty strings are not shown.
- Empty arrays such as `events: []`, `members: []`, `socialLinks: []`, or `items: []` remove that list from the page.
- Cards with no `title` and no `text` are skipped.
- Buttons are shown only when both `label` and `href` or `page` are present.
- Sections are shown only when they have a heading, intro, cards, events, a callout, or an empty-state message.

This means you can publish the site before every section is ready. Remove sample objects instead of leaving temporary names, contacts, or links.

## Common Updates

### Chapter Identity

Edit `content/site.js`.

- `chapter.name`: full chapter name used in the header.
- `chapter.shortName`: compact name used in the footer and image alt text.
- `chapter.location`: header eyebrow and footer location.
- `chapter.logo`: header logo path.
- `chapter.favicon`: browser tab icon path.
- `socialLinks`: footer links. Keep this as `[]` until real links are ready.

### Home Page

Edit `content/home.js`.

- `hero.heading` and `hero.intro` control the hero copy.
- `hero.actions` controls the hero buttons.
- `hero.image` controls the hero image.
- `eventsPreview.limit` controls how many events from `content/events-page.js` appear on the home page.

### Events

Edit `content/events-page.js`.

Each event can include:

```js
{
  date: "12 Aug 2026",
  title: "Workshop title",
  summary: "Short event description.",
  tags: ["Workshop", "Beginner-friendly"],
}
```

Leave `events: []` when there are no published events.

### Team

Edit `content/team-page.js`.

Each member can include:

```js
{
  name: "Member name",
  role: "Role title",
  initials: "MN",
  summary: "Short role or bio summary.",
}
```

Leave `members: []` until real team details are ready.

### Join Tabs, Form, and FAQs

Edit `content/join-page.js`.

- `tabs`: the options shown under the Join page heading.
- `tabs[].label`: the tab label, such as `Member` or `Faculty/Sponsor`.
- `tabs[].heading` and `tabs[].intro`: the main copy inside each tab.
- `tabs[].cards`: cards inside the tab panel.
- `tabs[].application.formUrl`: application form URL for tabs that need a form.
- `tabs[].application.formButtonLabel`: button text for the form.
- `tabs[].faq.items`: FAQ cards for tabs that need FAQs.

Tabs without an `application` or `faq` block still render normally with their heading, intro, and cards.

## Workflow

1. Edit the relevant file in `content/`.
2. Refresh the site in the browser.
3. Check the affected page and any page that reuses that data, especially home events.
4. Remove empty objects or leave arrays empty when content is not ready.

## Adding New Content Types

Add the new data to an existing `content/*.js` file when it belongs to an existing page. Only update `scripts/site.js` when a new layout section or new rendering pattern is required.
