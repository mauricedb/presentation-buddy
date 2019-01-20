export type Command = { type: 'command'; command: string; args: any[] };

export type TypeText = { type: 'typetext'; text: string };

export type Instruction = Command | TypeText;

export type InstructionHandler = (instruction: Instruction) => Promise<void>;
