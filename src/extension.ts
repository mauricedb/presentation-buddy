// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { init, start } from './presentation-buddy';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "presentation-buddy" is now active!'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('presentationBuddy.init', async () => {
      try {
        await init();
        vscode.window.showInformationMessage('Presentation Buddy: Init');
      } catch (e) {
        vscode.window.showErrorMessage(e.message);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('presentationBuddy.start', async () => {
      try {
        await start();
      } catch (e) {
        vscode.window.showErrorMessage(e.message);
      }
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
