import { commands } from 'vscode';
import { Command, TypeText } from './instructions';

export const typetext = async (instruction: TypeText): Promise<void> => {};

export const command = async (instruction: Command): Promise<void> => {
  await commands.executeCommand(instruction.command, ...instruction.args);
};
