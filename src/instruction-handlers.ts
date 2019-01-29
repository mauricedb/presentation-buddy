import { commands, Uri, workspace } from 'vscode';
import { join } from 'path';
import { Command, TypeText, OpenFile } from './instructions';

export const typetext = async (instruction: TypeText): Promise<void> => {};

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
};
