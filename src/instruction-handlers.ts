import { commands, Position, Selection, Uri, window, workspace } from 'vscode';
import { join, dirname } from 'path';

import { Command, TypeText, OpenFile, GoTo, CreateFile, Wait } from './instructions';
import { mkdirIfNotExists, writeFileAsync } from './utils';
import { setAwaiter } from './wait-for-input';

const getPause = () => 100;

export const typeText = async (instruction: TypeText): Promise<void> => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  if (!editor.selection.isEmpty) {
    await editor.edit(editorBuilder => editorBuilder.delete(editor.selection));
  }

  const data = Array.from(instruction.text.join('\n'));
  let char = data.shift();
  let pos = editor.selection.start;

  while (char) {
    await editor.edit(editBuilder => {
      editor.selection = new Selection(pos, pos);

      editBuilder.insert(editor.selection.active, char!);
      if (char === '\n') {
        pos = new Position(pos.line + 1, pos.character);
      } else {
        pos = new Position(pos.line, pos.character + 1);
      }
    });

    char = data.shift();
    instruction.delay === 0 ? void(0) : await timeout(instruction.delay || getPause());
  }
};

export const command = async (instruction: Command): Promise<void> => {
  const { args = [] } = instruction;
  await commands.executeCommand(instruction.command, ...args);
  await timeout(getPause());
};

export const openFile = async (instruction: OpenFile): Promise<void> => {
  if (!workspace.workspaceFolders) {
    return;
  }

  const workspaceFolder = workspace.workspaceFolders[0].uri.fsPath;
  const uri = Uri.file(join(workspaceFolder, instruction.path));
  await commands.executeCommand('vscode.open', uri);
  await timeout(getPause());
};

export const createFile = async (instruction: CreateFile): Promise<void> => {
  if (!workspace.workspaceFolders) {
    return;
  }

  const workspaceFolder = workspace.workspaceFolders[0].uri.fsPath;
  const path = join(workspaceFolder, instruction.path);

  await mkdirIfNotExists(dirname(path));
  await writeFileAsync(path, '', 'utf8');
  const uri = Uri.file(join(workspaceFolder, instruction.path));
  await commands.executeCommand('vscode.open', uri);
  await timeout(getPause());
};

export const goto = async (instruction: GoTo): Promise<void> => {
  const { line = 1, column = 1 } = instruction;
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const position = new Position(line - 1, column - 1);
  editor.selection = new Selection(position, position);
  editor.revealRange(editor.selection);
  await timeout(getPause());
};

export const wait = (instruction: Wait): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (typeof instruction.length === 'number') {
      await timeout(instruction.length);
      await timeout(getPause());
      resolve();
    }
    else if (instruction.length === 'manual') {
      setAwaiter(() => {
        resolve();
      });
    }
    else {
      reject();
    }
  })
}

function timeout(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}
