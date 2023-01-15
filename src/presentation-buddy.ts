import { window, workspace } from 'vscode';
import { join } from 'path';
import { jsonc } from 'jsonc';

import { Instruction, InstructionHandler } from './instructions';
import * as instructionHandlers from './instruction-handlers';
import { mkdirIfNotExists } from './utils';

export const init = async () => {
  if (!workspace.workspaceFolders) {
    return;
  }
  const workspaceFolder = workspace.workspaceFolders[0].uri.fsPath;

  const json = await jsonc.read(
    join(__dirname, '..', 'examples', 'init', 'instructions.json')
  );

  const schema = await jsonc.read(
    join(__dirname, '..', 'examples', 'init', 'schema.json')
  );

  const dir = join(workspaceFolder, '.presentation-buddy');
  const jsonFileName = join(dir, 'instructions.json');
  const schemaFileName = join(dir, 'schema.json');

  await mkdirIfNotExists(dir);

  await jsonc.write(jsonFileName, json, { space: 2 });
  await jsonc.write(schemaFileName, schema, { space: 2 });
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
): Promise<Instruction[]> {
  const path = join(
    workspaceFolder,
    '.presentation-buddy',
    'instructions.json'
  );
  const json = await jsonc.read(path);
  const instructions: Instruction[] = json?.instructions ?? json ?? [];

  return instructions.filter((instruction) => !instruction.skip);
}
