import { getClipboardLines } from './utils';
import * as rangeMethods from './rangeMethods';
import type { TextPastryCommand } from './main';
import { handleRange, promptRange, promptWordList } from './editorMethods';

export const textPastry1toX: TextPastryCommand = () => handleRange(rangeMethods.range_1toX);
export const textPastry0toX: TextPastryCommand = () => handleRange(rangeMethods.range_0toX);
export const textPastryAtoX: TextPastryCommand = () => handleRange(rangeMethods.range_AtoX);

export const textPastryRange: TextPastryCommand = async () => {
	try {
		const range = await promptRange();
		return handleRange(rangeMethods.range_generic(range));
	} catch (e) {
		// Swallow errors
	}
};

export const textPastryWordList: TextPastryCommand = async () => {
	try {
		const list = await promptWordList();
		return handleRange(list);
	} catch (e) {
		// Swallow errors
	}
};

export const textPastryPaste = () =>
	getClipboardLines().then((lines) => {
		return handleRange(lines);
	});

export const textPastryUuid: TextPastryCommand = () => handleRange(rangeMethods.range_uuid);
