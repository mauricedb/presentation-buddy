# Presentation Buddy

![Demo](./images/demo.gif)

## Features

Automatically type code during presentations

### Initializing with Presentation Buddy: Init

Initialize Presentation Buddy to create the required `.presentation-buddy\instructions.json` file with some demo instructions.
You can do this using the Command Palette (Ctrl+Shift+P) and selecting the `Presentation Buddy: Init` command.

![Presentation Buddy: Init](./images/pb-init.png)

### Starting with Presentation Buddy: Start

Once Presentation Buddy is initialized and you have updated the instructions you can start Presentation Buddy using the Command Palette (Ctrl+Shift+P) and selecting the `Presentation Buddy: Start` command.

![Presentation Buddy: Start](./images/pb-start.png)

## Extension Settings

This extension contributes the following settings:

- `presentation-buddy.delay`: Delay (in ms) between keys entered. Defaults to 100ms.

## Example instructions

See `.presentation-buddy\instructions.json`

```json
[
  {
    "type": "createFile",
    "path": "src/calculator.js"
  },
  {
    "type": "typeText",
    "text": [
      "// This code is typed by Presentation Buddy",
      "",
      "class Calculator {",
      "  add(x, y) {",
      "    return x + y;",
      "  }",
      "}"
    ]
  },
  {
    "type": "goto",
    "line": 4,
    "column": 1
  },
  {
    "type": "command",
    "command": "workbench.action.files.save"
  },
  {
    "type": "command",
    "command": "workbench.action.closeActiveEditor"
  },
  {
    "type": "createFile",
    "path": "src/demo.js"
  },
  {
    "type": "typeText",
    "text": [
      "// This code is typed by Presentation Buddy",
      "",
      "const Calculator = require('./calculator');",
      "",
      "const calc = new Calculator();",
      "const sum = calc.add(1, 2)",
      "console.log(`The sum of 1 + 2 = ${sum}`);"
    ]
  },
  {
    "type": "openFile",
    "path": "src/calculator.js"
  },
  {
    "type": "command",
    "command": "cursorBottom"
  },
  {
    "type": "typeText",
    "text": ["", "module.exports = Calculator;"]
  }
]
```

## Known Issues

This is still in the experimental preview stage. Use at your own risk.

## Release Notes

### 1.0.0

- ToDo
