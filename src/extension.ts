import * as vscode from 'vscode'

function randomHex() {
  return Math.floor(Math.random() * 16)
    .toString(16)
    .toUpperCase();
}

export function activate(context: vscode.ExtensionContext) {
  // 入口命令已经在package.json文件中定义好了，现在调用registerCommand方法
  // registerCommand中的参数必须与package.json中的command保持一致
  let disposable = vscode.commands.registerCommand('extension.genhex', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) { return; };
    const selection = editor.selection;
    const startLine = selection.start.line;
    const startCharacter = selection.start.character;
    const endLine = selection.end.line;
    const endCharacter = selection.end.character;
    // console.log('startLine', selection.start.line, selection.start.character);
    // console.log('endLine', selection.end.line, selection.end.character);
    if (startLine === endLine && startCharacter === endCharacter) {
      vscode.window.showWarningMessage('请选择内容');
    } else {
      editor.edit((editBuilder) => {
        for (let i = startLine; i <= endLine; i++) {
          const line = editor.document.lineAt(i);

          let startPosition = new vscode.Position(i, 0);
          if (i === startLine) {
            startPosition = new vscode.Position(i, startCharacter);
          }
          let endPosition = new vscode.Position(i, line.range.end.character);
          if (i === endLine) {
            endPosition = new vscode.Position(i, endCharacter);
          }
          const range = new vscode.Range(startPosition, endPosition);

          const text = line.text.substring(range.start.character, range.end.character)
          const newText = text.replace(
            /([a-fA-F\d]{2})/g,
            () => randomHex() + randomHex()
          );
          editBuilder.replace(range, newText);
        };
      });
    }
  });

  context.subscriptions.push(disposable);
}

// 停用您的扩展程序时调用此方法
export function deactivate() { }
