import * as assert from 'assert';
import { splat, readChunks } from '../utils';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});

const empty = {
  text: "",
  consumeTokens: [],
  preserveTokens: [],
  skipTokens: [],
  expected: []
};
let inputs = [
  { ...empty },
  { ...empty, text: "baba", expected: ["baba"] },
  { ...empty, text: "baba", consumeTokens: ["a"], expected: ["b", "b"] },
  { ...empty, text: "banana", consumeTokens: ["b", "n"], expected: ["a", "a", "a"] },
  { ...empty, text: "banana", preserveTokens: ["a"], expected: ["ba", "na", "na"] },
  {
    ...empty,
    text: "var x = sqrt(5);",
    preserveTokens: [" = ", "("],
    expected: ["var x = ", "sqrt(", "5);"]
  },
  {
    ...empty,
    text: "var x = sqrt(5);\r\nvar y = Console.ReadLine();\r\nConsole.WriteLine(x + y);",
    preserveTokens: ["\n", " = ", "("],
    expected: [
      "var x = ",
      "sqrt(",
      "5);\n",
      "var y = ",
      "Console.ReadLine(", ");\n",
      "Console.WriteLine(", "x + y);"
    ]
  },
  {
    ...empty,
    text: `a,b
c
SKIPd,e,f
SKIPg
h,i,j

`,
    preserveTokens: [ "\n" ],
    consumeTokens: [","],
    skipTokens: ["SKIP"],
    expected: ["a", "b\n", "c\n", "h", "i", "j\n", "\n"]
  },
  {
    ...empty,
    text: `using System.Mail; /*SKIP*/
/*SKIP*/
var x = sqrt(5); /*SKIP*/
var y = Console.ReadLine();
Console.WriteLine(x + y);
var z = 25;

`,
    preserveTokens: ["\n", " = ", "("],
    skipTokens: [ "/*SKIP*/" ],
    expected: [
      "var y = ",
      "Console.ReadLine(", ");\n",
      "Console.WriteLine(", "x + y);\n",
      "var z = ",
      "25;\n",
      "\n"
    ]
  },
];
suite('Chunk parsing tests', () => {
  inputs.forEach((input) => {
    test(`${input.text} / ${input.consumeTokens} / ${input.preserveTokens} / ${input.skipTokens}`, () => {
      let chunks = readChunks(input.text, input.consumeTokens, input.preserveTokens, input.skipTokens);
      assert.deepEqual(chunks, input.expected);
    });
  });
});
