import { commands, Position, Selection, Uri, window, workspace } from 'vscode';
import { join } from 'path';
import { Command, TypeText, OpenFile, GoTo } from './instructions';

export const typetext = async (instruction: TypeText): Promise<void> => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
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
      char = data.shift();
    });

    await wait(60);
  }
};

export const command = async (instruction: Command): Promise<void> => {
  await commands.executeCommand(instruction.command, ...instruction.args);
};

export const openfile = async (instruction: OpenFile): Promise<void> => {
  if (!workspace.workspaceFolders) {
    return;
  }

  const workspaceFolder = workspace.workspaceFolders[0].uri.fsPath;
  const uri = Uri.file(join(workspaceFolder, instruction.path));
  await commands.executeCommand('vscode.open', uri);
  await wait(60);
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
  await wait(60);
};

function wait(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}
