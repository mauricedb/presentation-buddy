type Skipable = { skip?: boolean };

export type Command = {
  type: "command";
  command: string;
  args: any[];
  repeat: number;
};

export type Wait = { type: "wait"; delay: number | "manual"; save?: boolean };

export type TypeText = { type: "typeText"; text: string[]; delay?: number };

export type TypeTextFromFile = {
  type: "typeTextFromFile";
  path: string;
  delay?: number;
};

export type TypeChunksFromFile = {
  type: "typeChunksFromFile";
  path: string;
  delay?: number;
  waitInsteadOf: string[];
  waitAfter: string[];
  skipLinesContaining: string[];
};

export type OpenFile = { type: "openFile"; path: string };

export type CreateFile = { type: "createFile"; path: string };

export type GoTo = { type: "goto"; line: number; column: number };

export type Select = { type: "select"; line: number; column: number };

export type Instruction = (
  | Command
  | CreateFile
  | OpenFile
  | TypeText
  | TypeTextFromFile
  | TypeChunksFromFile
  | Wait
) &
  Skipable;

export type InstructionHandler = (instruction: Instruction) => Promise<void>;
