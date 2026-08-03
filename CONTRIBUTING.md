# Contributing

Thanks for helping improve the NUS ACM-W website.

## How to Contribute

1. Fork this repository to your own GitHub account.
2. Clone your fork to your computer.
3. Create a new branch for your change:

```bash
git checkout -b your-branch-name
```

4. Make your edits.

For routine website updates, edit the files in `content/` only. See [docs/content-editing-guide.md](docs/content-editing-guide.md) for the content editing workflow.

5. Preview the site locally:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
```

6. Commit and push your branch:

```bash
git add .
git commit -m "Describe your change"
git push origin your-branch-name
```

7. Open a pull request from your fork and branch back to this repository's main branch.

## Pull Request Notes

- Describe what changed and why.
- Include screenshots for visible website changes when possible.
- Keep unrelated edits out of the same pull request.
- Do not leave temporary names, links, or placeholder content in published pages.
