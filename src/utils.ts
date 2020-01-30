import { workspace, window, Uri } from "vscode";
import { join, posix } from "path";

import { promisify } from "util";
import { writeFile } from "fs";

const pathToUri = (path: string): Uri => {
  path = path.replace(/\\/g, posix.sep);

  if (window.activeTextEditor) {
    const tsUri = window.activeTextEditor.document.uri;
    if (tsUri) {
      const jsUri = tsUri.with({ path });

      return jsUri;
    }
  }
  throw new Error("No window.activeTextEditor.document.uri?");
};

const existsAsync = async (path: string): Promise<boolean> => {
  try {
    const uri = pathToUri(path);
    await workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
};

const mkdirAsync = async (path: string): Promise<void> => {
  const uri = pathToUri(path);
  try {
    await workspace.fs.createDirectory(uri);
  } catch (err) {
    console.log(err);
  }
};

export async function mkdirIfNotExists(dir: string) {
  const parts = dir.split(/[\/\\]/);

  if (parts.length) {
    let currentPath = parts.shift() || "";
    for (const part of parts) {
      currentPath = join(currentPath, part);
      if (!(await existsAsync(currentPath))) {
        await mkdirAsync(currentPath);
      }
    }
  }
}

export const writeFileAsync = promisify(writeFile);

export function timeout(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function getDelay() {
  const pause = workspace
    .getConfiguration()
    .get<number>("presentation-buddy.delay");

  return pause || 100;
}
