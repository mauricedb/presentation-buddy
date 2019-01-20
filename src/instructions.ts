export type Command = { type: 'command'; command: string; args: any[] };

export type TypeText = { type: 'typetext'; text: string };

export type OpenFile = { type: 'openfile'; path: string };

export type Instruction = Command | OpenFile | TypeText;

export type InstructionHandler = (instruction: Instruction) => Promise<void>;
