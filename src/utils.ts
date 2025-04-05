'use strict';

import lodashSortBy from 'lodash.sortby';
import { env, Selection, window } from 'vscode';

export function getCursors(): Selection[] {
    const editor = window.activeTextEditor;
    const { selections } = editor;

    return lodashSortBy(selections, ['start.line', 'start.character']);
}

export async function getClipboardLines(): Promise<string[]> {
    const val = await env.clipboard.readText();
    if (typeof val !== 'string') {
        return [];
    } else {
        return val.replace('\r\n', '\n').split('\n');
    }
}
