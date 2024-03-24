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

export const existsAsync = async (path: string): Promise<boolean> => {
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

/** Split a string after each instance of the supplied separator,
 * and include the the separator in the resulting tokens.
 * @example
 * // returns ['ba','na','na']
 * splitAfterToken('banana', 'a')
 */
export function* splitAfterToken(text: string, separator: string) {
  let i = 0;
  let candidate = "";
  while (i++ < text.length) {
    candidate = text.substring(0, i);
    if (candidate.endsWith(separator)) {
      yield candidate;
      candidate = "";
      text = text.substring(i);
      i = 0;
    }
  }
  if (candidate) { yield candidate; };
}

/** Return a new array in which any consecutive sequence of
 * separators or elements containing only whitespace is concatenated
 * into a single string and appended to the preceding element.
 * @example returns ['a!!', 'b!?', 'c?!' ]
 * crunch(['a','!','!','b','!','?', 'c?', '!'], ['!','?'])
  */
export function* gatherSeparators(elements: string[], separators: string[]) {
  var result = '';
  for (var element of elements) {
    if (separators.includes(element) || /^\s+$/.test(element)) {
      result += element;
    } else {
      if (result !== '') { yield result; };
      result = element;
    }
  }
  if (result !== '') { yield result; }
}

/** Split the supplied text into chunks based on the specified
 * separators.
 * @param {string} text - The input text, typically a block of program code
 * @param {string[]} separatorsToConsume - Separators which should be removed from the output
 * @param {string[]} separatorsToInclude - Separators which should be included in the output
 * @param {String[]} skipTokens - tokens indicating that an entire line should be omitted from the output.
  */

export function splitTextIntoChunks(
  text: string,
  separatorsToConsume: string[] = [],
  separatorsToInclude: string[] = [],
  skipTokens: string[] = []
): string[] {

  let result = [text
    .split(/\r?\n/)
    .filter(line => !skipTokens.some(skip => line.includes(skip)))
    .join('\n')];

  for (var separator of separatorsToConsume) {
    result = result.map(r => r.split(separator)).flat();
  }

  for (var separator of separatorsToInclude) {
    result = result.map(r => [...splitAfterToken(r, separator)]).flat();
  }

  let keep = (s: string) => (s !== "" && (!skipTokens.some(t => s.includes(t))));

  result = result.filter(t => keep(t));
  result = [...gatherSeparators(result, separatorsToInclude)];
  return result;
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

export function getWaitAfterNewLine() : boolean {
  const waitAfterNewLine = workspace.getConfiguration().get<boolean>('presentation-buddy.waitAfterNewLine');
  return waitAfterNewLine ?? true;
}

function getConfigValues(key: string) {
  const values = workspace
    .getConfiguration()
    .get<string[]>(`presentation-buddy.${key}`);
  return values || [];
}

export const getWaitInsteadOfTyping = () => getConfigValues('waitInsteadOfTyping');
export const getWaitAfterTyping = () => getConfigValues('waitAfterTyping');
export const getSkipLinesContaining = () => getConfigValues('skipLinesContaining');
