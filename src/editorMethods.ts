'use strict';

import { getCursors } from './utils';
import { window as vscodeWindow, Position } from 'vscode';
import type { RangeResult, GetRangeFnc } from './main';

/**
 * Given an array of strings, or a function to get those strings,
 * handle inserting those strings into the correct locations within the editor.
 */
export const handleRange = (rangeMethod: RangeResult | GetRangeFnc) => {
	const editor = vscodeWindow.activeTextEditor;

	editor.edit((editBuilder) => {
		let cursors = getCursors(editBuilder);
		let itemsToInsert;
		if (typeof rangeMethod === 'function') {
			itemsToInsert = rangeMethod(cursors.length);
		} else {
			itemsToInsert = rangeMethod;
		}
		cursors.forEach((selection, index) => {
			let range = new Position(selection.start.line, selection.start.character);
			editBuilder.insert(range, itemsToInsert[index]);
			editBuilder.delete(selection);
		});
	});
};

/**
 * Prompt the user where the range should start
 */
export async function promptRange(prompt: string = 'Where should the range start?'): Promise<number> {
	const result = await vscodeWindow.showInputBox({ prompt });
	if (result === null || result === undefined) {
		// User cancelled
		throw new Error();
	}
	let num: number = +result;
	if (isNaN(num)) {
		return promptRange(`"${result}" is an invalid number. Enter a number.`);
	}
	return num;
}

/**
 * Prompt the user which words should be used
 */
export async function promptWordList(prompt: string = 'List of words (space separated)'): Promise<string[]> {
	const result = await vscodeWindow.showInputBox({ prompt });

	if (result === null || result === undefined) {
		// User cancelled
		throw new Error();
	}
	const words = result.split(/\s+/);
	return words;
}
