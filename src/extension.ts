'use strict';

import * as vscode from 'vscode';

import {
    textPastry0toX,
    textPastry1toX,
    textPastryAtoX,
    textPastryPaste,
    textPastryRange,
    textPastryRangeN,
    textPastryUuid,
    textPastryWordList
} from './commands';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "vscode-text-pastry" is now active!');

    const disposables = [
        vscode.commands.registerCommand('extension.textPastry.1toX', textPastry1toX),
        vscode.commands.registerCommand('extension.textPastry.0toX', textPastry0toX),
        vscode.commands.registerCommand('extension.textPastry.AtoX', textPastryAtoX),
        vscode.commands.registerCommand('extension.textPastry.range', textPastryRange),
        vscode.commands.registerCommand('extension.textPastry.wordList', textPastryWordList),
        vscode.commands.registerCommand('extension.textPastry.paste', textPastryPaste),
        vscode.commands.registerCommand('extension.textPastry.uuid', textPastryUuid),
        vscode.commands.registerCommand('extension.textPastry.rangeN', textPastryRangeN)
    ];

    context.subscriptions.push(...disposables);
}

// this method is called when your extension is deactivated
export function deactivate() {}
