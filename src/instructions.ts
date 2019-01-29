export type Command = {
  type: 'command';
  command: string;
  args: any[];
  skip?: boolean;
};

export type TypeText = { type: 'typetext'; text: string[]; skip?: boolean };

export type OpenFile = { type: 'openfile'; path: string; skip?: boolean };

export type Instruction = Command | OpenFile | TypeText;

export type InstructionHandler = (instruction: Instruction) => Promise<void>;
