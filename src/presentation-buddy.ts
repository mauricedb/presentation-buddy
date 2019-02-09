import { window, workspace } from 'vscode';
import { join } from 'path';
import { readFile, writeFile } from 'jsonfile';

import { Instruction, InstructionHandler } from './instructions';
import * as instructionHandlers from './instruction-handlers';
import { mkdirIfNotExists } from './utils';

export const init = async () => {
  if (!workspace.workspaceFolders) {
    return;
  }
  const workspaceFolder = workspace.workspaceFolders[0].uri.fsPath;

  const json = await readFile(
    join(__dirname, '..', 'examples', 'init', 'instructions.json')
  );

  const dir = join(workspaceFolder, '.presentation-buddy');
  const fileName = join(dir, 'instructions.json');

  await mkdirIfNotExists(dir);

  await writeFile(fileName, json, { spaces: 2 });
};

export const start = async () => {
  // const editor = window.activeTextEditor;
  // if (!editor) {
  //   return;
  // }
  if (!workspace.workspaceFolders) {
    return;
  }
  const workspaceFolder = workspace.workspaceFolders[0].uri.fsPath;

  const instructions = await loadInstructions(workspaceFolder);
  let instruction = instructions.shift();

  while (instruction) {
    const handler = instructionHandlers[instruction.type] as InstructionHandler;

    if (handler) {
      await handler(instruction);
    } else {
      window.showErrorMessage(`Unkown instruction type '${instruction.type}'`);
    }

    instruction = instructions.shift();
  }

  console.log(instructions);
};


async function loadInstructions(
  workspaceFolder: string
): Promise<(Instruction)[]> {
  const instructions: Instruction[] = await readFile(
    join(workspaceFolder, '.presentation-buddy', 'instructions.json')
  );

  return instructions.filter(instruction => !instruction.skip);
}
