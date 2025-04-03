'use strict';

import { v4 as uuid } from 'uuid';
import type { RangeResult, GetRangeFnc, RangeFactory } from './main';

export const range_generic: RangeFactory = (start) => {
	return (count) => {
		let a: RangeResult = [];
		let end = count + start;
		for (let i = start; i < end; ++i) {
			a.push(String(i));
		}
		return a;
	};
};

export const range_0toX: GetRangeFnc = (count) => {
	return range_generic(0)(count);
};

export const range_1toX: GetRangeFnc = (count) => {
	return range_generic(1)(count);
};

export const range_AtoX: GetRangeFnc = (count) => {
	let a: RangeResult = [];
	let startCode = 'a'.charCodeAt(0);
	for (let i = 0; i < count; ++i) {
		const offset = i % 26; // only loop through lower case a-z
		a.push(String.fromCharCode(startCode + offset));
	}
	return a;
};

export const range_uuid: GetRangeFnc = (count) => {
	let a: RangeResult = [];
	for (let i = 0; i < count; ++i) {
		a.push(uuid().toLowerCase());
	}
	return a;
};
