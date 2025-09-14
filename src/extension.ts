import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

function updateCursorIgnore(inputUris: vscode.Uri[] | undefined, remove = false) {
  const resolvedUris: vscode.Uri[] = (inputUris ?? [])
    .filter((u): u is vscode.Uri => Boolean(u));

  if (resolvedUris.length === 0) {
    const activeUri = vscode.window.activeTextEditor?.document.uri;
    if (activeUri) {
      resolvedUris.push(activeUri);
    } else {
      vscode.window.showErrorMessage(
        `No selection detected. Use from Explorer context menu or open a file.`
      );
      return;
    }
  }

  const rootToUris = new Map<string, vscode.Uri[]>();
  for (const uri of resolvedUris) {
    const folder = vscode.workspace.getWorkspaceFolder(uri);
    if (!folder) {
      continue;
    }
    const root = folder.uri.fsPath;
    const list = rootToUris.get(root) ?? [];
    list.push(uri);
    rootToUris.set(root, list);
  }

  if (rootToUris.size === 0) {
    vscode.window.showErrorMessage(`No workspace folder found for selected items.`);
    return;
  }

  for (const [root, uris] of rootToUris) {
    const ignorePath = path.join(root, ".cursorignore");
    let lines: string[] = [];

    if (fs.existsSync(ignorePath)) {
      lines = fs.readFileSync(ignorePath, "utf8")
        .split("\n")
        .map(l => l.trim())
        .filter(l => l !== "");
    }

    for (const uri of uris) {
      const relRaw = path.relative(root, uri.fsPath);
      const rel = relRaw.replace(/\\\\/g, "/");
      if (remove) {
        lines = lines.filter(l => l !== rel);
      } else if (!lines.includes(rel)) {
        lines.push(rel);
      }
    }

    fs.writeFileSync(ignorePath, lines.join("\n") + "\n");
  }

  vscode.window.showInformationMessage(
    `${remove ? "Removed from" : "Added to"} .cursorignore`
  );
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("cursorignore.add", (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
      updateCursorIgnore(uris ?? (uri ? [uri] : undefined), false);
    }),
    vscode.commands.registerCommand("cursorignore.remove", (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
      updateCursorIgnore(uris ?? (uri ? [uri] : undefined), true);
    })
  );
}

export function deactivate() {}
