import { commands, Position, Selection, Uri, window, workspace } from 'vscode';
import { writeFile } from 'fs';

import { join } from 'path';
import { promisify } from 'util';

import { Command, TypeText, OpenFile, GoTo, CreateFile } from './instructions';

const writeFileAsync = promisify(writeFile);

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
    await wait(getPause());
  }
};

export const command = async (instruction: Command): Promise<void> => {
  const { args = [] } = instruction;
  await commands.executeCommand(instruction.command, ...args);
  await wait(getPause());
};

export const openFile = async (instruction: OpenFile): Promise<void> => {
  if (!workspace.workspaceFolders) {
    return;
  }

  const workspaceFolder = workspace.workspaceFolders[0].uri.fsPath;
  const uri = Uri.file(join(workspaceFolder, instruction.path));
  await commands.executeCommand('vscode.open', uri);
  await wait(getPause());
};

export const createFile = async (instruction: CreateFile): Promise<void> => {
  if (!workspace.workspaceFolders) {
    return;
  }

  const workspaceFolder = workspace.workspaceFolders[0].uri.fsPath;
  const path = join(workspaceFolder, instruction.path);

  await writeFileAsync(path, '', 'utf8');
  const uri = Uri.file(join(workspaceFolder, instruction.path));
  await commands.executeCommand('vscode.open', uri);
  await wait(getPause());
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
  await wait(getPause());
};

function wait(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}
