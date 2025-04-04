'use strict';

import * as vscode from 'vscode';
import {
	textPastry1toX,
	textPastry0toX,
	textPastryAtoX,
	textPastryRange,
	textPastryWordList,
	textPastryPaste,
	textPastryUuid,
	textPastryRangeN
} from './commands';

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "vscode-text-pastry" is now active!');

	let disposables = [
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
