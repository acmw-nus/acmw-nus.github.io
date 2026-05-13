# ACM-W NUS Website

This is a website for the ACM-W NUS Chapter.

For routine updates, edit the content files in `content/` instead of changing the page templates or renderer.

- Content editing instructions: [docs/content-editing-guide.md](docs/content-editing-guide.md)
- Contribution instructions: [CONTRIBUTING.md](CONTRIBUTING.md)
- Shared site settings: `content/site.js`
- Page content: `content/home.js`, `content/about.js`, `content/events-page.js`, `content/team-page.js`, `content/join-page.js`

## Run Locally

Start a local static server from the project root:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
```
