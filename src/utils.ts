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
export function* splat(text: string, token: string) {
  let i = 0;
  let candidate = "";
  while (i++ < text.length) {
    candidate = text.substring(0, i);
    if (candidate.endsWith(token)) {
      yield candidate;
      candidate = "";
      text = text.substring(i);
      i = 0;
    }
  }
  if (candidate) { yield candidate };
}
export function readChunks(
  text: string,
  consumeTokens: string[] = [],
  preserveTokens: string[] = [],
  skipTokens: string[] = []
): string[] {

  let result = [ text
    .split(/\r?\n/)
    .filter(line => !skipTokens.some(skip => line.includes(skip)))
    .join('\n') ];

  for (var token of consumeTokens) {
    result = result.map(r => r.split(token)).flat();
  }
  for (var token of preserveTokens) {
    result = result.map(r => [...splat(r, token)]).flat();
  }
  let keep = (s: string) => (s !== "" && (!skipTokens.some(t => s.includes(t))));
  return result.filter(t => keep(t));
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

