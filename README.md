## cursorignore-helper

A small helper to manage a `.cursorignore` file, keep it tidy, and optionally align it with your `.gitignore`. Useful for speeding up AI/code tools by excluding large or irrelevant paths.

### Features
- Keep `.cursorignore` organized and readable
- Suggest common ignores for typical projects
- Sync ideas with `.gitignore` without affecting Git

### Installation
Option A: Install the packaged VSIX
1. Open Cursor/VS Code → Extensions view
2. Click the ⋯ menu → "Install from VSIX..."
3. Select `cursorignore-helper-1.0.0.vsix`

Option B: Run from source (for development)
1. `npm ci`
2. `npm run compile`
3. Press F5 (Run Extension) in VS Code to start an Extension Host

### Usage
Explorer context menu (recommended):
1. In the Explorer, select one or more files/folders
2. Right‑click → "Add to .cursorignore" or "Remove from .cursorignore"

Command Palette:
1. Open the file in the editor (or select in Explorer)
2. Run "Add to .cursorignore" or "Remove from .cursorignore"

Notes:
- Works with multi‑select in the Explorer
- If nothing is selected, the active editor file is used
- Only items inside a workspace folder are processed
- A `.cursorignore` file is created at the workspace root if missing

### Typical `.cursorignore` entries
```
node_modules/
dist/
build/
.next/
.venv/
*.log
coverage/
tmp/
.cache/
```

### How it works
- Resolves selected URIs and groups them by workspace folder
- Reads the workspace `.cursorignore` (creates it if missing)
- Normalizes entries to paths relative to the workspace root using forward slashes
- Add: appends entry if it does not already exist
- Remove: deletes an exact matching entry
- Writes the updated file with a trailing newline

Commands contributed:
- `cursorignore.add` – Add to `.cursorignore`
- `cursorignore.remove` – Remove from `.cursorignore`

### Contributing
Issues and PRs are welcome. Please ensure changes are well-scoped and documented.

### License
MIT


