import { commands, Uri } from 'vscode';
import { Command, TypeText, OpenFile } from './instructions';

export const typetext = async (instruction: TypeText): Promise<void> => {};

export const command = async (instruction: Command): Promise<void> => {
  await commands.executeCommand(instruction.command, ...instruction.args);
};

export const openfile = async (instruction: OpenFile): Promise<void> => {
  const uri = Uri.file(instruction.path);
  await commands.executeCommand('vscode.open', uri);
};
