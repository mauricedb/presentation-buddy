type Skipable = { skip?: boolean };

export type Command = {
  type: 'command';
  command: string;
  args: any[];
};

export type Wait = { type: 'wait', delay: number | 'manual' };

export type TypeText = { type: 'typeText'; text: string[], delay?: number };

export type OpenFile = { type: 'openFile'; path: string };

export type CreateFile = { type: 'createFile'; path: string };

export type GoTo = { type: 'goto'; line: number; column: number };

export type Instruction = (Command | CreateFile | OpenFile | TypeText | Wait) &
  Skipable;

export type InstructionHandler = (instruction: Instruction) => Promise<void>;
