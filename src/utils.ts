import { workspace, window, Uri } from 'vscode';
import { join, posix } from 'path';
import { TextDecoder } from 'util';

const pathToUri = (path: string): Uri => {
  path = path.replace(/\\/g, posix.sep);

  if (window.activeTextEditor) {
    const tsUri = window.activeTextEditor.document.uri;
    if (tsUri) {
      const jsUri = tsUri.with({ path });

      return jsUri;
    }
  }
  throw new Error('No window.activeTextEditor.document.uri?');
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

export function multiSplit(text: string, tokens: string[]): string[] {
  if (tokens.length) {
    tokens.sort((a, b) => b.length - a.length);
    let token = tokens[0];
    for (var i = 1; i < tokens.length; i++) {
      text = text.split(tokens[i]).join(token);
    }
    return text.split(token);
  }
  return [text];
}

export async function mkdirIfNotExists(dir: string) {
  const parts = dir.split(/[\/\\]/);

  if (parts.length) {
    let currentPath = parts.shift() || '';
    for (const part of parts) {
      currentPath = join(currentPath, part);
      if (!(await existsAsync(currentPath))) {
        await mkdirAsync(currentPath);
      }
    }
  }
}

export const writeFileAsync = async (
  path: string,
  data: string = ''
): Promise<void> => {
  const uri = pathToUri(path);
  const content = Buffer.from(data, 'utf8');
  await workspace.fs.writeFile(uri, content);
};

export const readFileAsync = async (
  path: string,
  encoding: string = 'utf8'
): Promise<string> => {
  const uri = pathToUri(path);
  const content = await workspace.fs.readFile(uri);
  const data = new TextDecoder(encoding).decode(content);
  return data;
};

export function timeout(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function getDelay() {
  const pause = workspace
    .getConfiguration()
    .get<number>('presentation-buddy.delay');

  return pause || 100;
}

export function getRandomness() {
  const pause = workspace
    .getConfiguration()
    .get<number>('presentation-buddy.randomness');

  return pause || 0;
}
