'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    class BrowserContentProvider implements vscode.TextDocumentContentProvider {
        provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
            var html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <style>
                    body, html
                    {
                        margin: 0; padding: 0; height: 100%; overflow: hidden;
                    }
                </style>
            </head>
            <body>
                <iframe width="100%" height="100%" src="${uri}" frameborder="0">
                    <p>can't display ${uri}</p>
                </iframe>
            </body>
            </html>
            `
            return html;
        }
    }

    let provider = new BrowserContentProvider();
    let registrationHTTPS = vscode.workspace.registerTextDocumentContentProvider('https', provider);

    let disposable = vscode.commands.registerCommand('extension.openPythonDocs', () => {
        let opts = ['3.7', '3.6', '3.5', '3.4', '3.3', '2.7']
        vscode.window.showQuickPick(opts).then(
            (version) => {
                let uri = vscode.Uri.parse("https://docs.python.org/" + version);

                // Determine column to place browser in.
                let col: vscode.ViewColumn;
                let ae = vscode.window.activeTextEditor;
                if (ae != undefined) {
                    col = ae.viewColumn || vscode.ViewColumn.One;
                } else {
                    col = vscode.ViewColumn.One;
                }

                return vscode.commands.executeCommand('vscode.previewHtml', uri, col).then((success) => {
                }, (reason) => {
                    vscode.window.showErrorMessage(reason);
                }
                );
            }
        );
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
