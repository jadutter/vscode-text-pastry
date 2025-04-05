import { handleRange, handleRangeN, promptRange, promptRangeN, promptWordList } from './editorMethods';
import type { TextPastryCommand } from './main';
import * as rangeMethods from './rangeMethods';
import { getClipboardLines } from './utils';

export const textPastry1toX: TextPastryCommand = () => handleRange(rangeMethods.range1toX);
export const textPastry0toX: TextPastryCommand = () => handleRange(rangeMethods.range0toX);
export const textPastryAtoX: TextPastryCommand = () => handleRange(rangeMethods.rangeAtoX);

export const textPastryRange: TextPastryCommand = async () => {
    try {
        const range = await promptRange();
        return handleRange(rangeMethods.rangeGeneric(range));
    } catch {
        // Swallow errors
    }
};

export const textPastryWordList: TextPastryCommand = async () => {
    try {
        const list = await promptWordList();
        return handleRange(list);
    } catch {
        // Swallow errors
    }
};

export const textPastryPaste = () =>
    getClipboardLines().then((lines) => {
        return handleRange(lines);
    });

export const textPastryUuid: TextPastryCommand = () => handleRange(rangeMethods.rangeUuid);

export const textPastryRangeN: TextPastryCommand = async () => {
    try {
        const [start, step, padding] = await promptRangeN();
        const list = rangeMethods.createRangeFactory(start, step, padding);
        return handleRangeN(list);
    } catch {
        // Swallow errors
    }
};
