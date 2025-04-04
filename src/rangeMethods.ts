'use strict';

import { v4 as uuid } from 'uuid';
import type { RangeResult, GetRangeFnc, RangeFactory, RangeNArgs, CreateRangeFactory } from './main';
import padStart from 'lodash.padstart';
import padEnd from 'lodash.padend';

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

export const parseRange = (rangeArg: unknown): RangeNArgs => {
	if (typeof rangeArg !== 'string') {
		throw Error(`parseRange expected a string, but received ${rangeArg}`);
	}
	let [start, step = 1, padding = 1] = [
		...rangeArg
			.split(/[^\d\.\-]+/)
			.filter(Boolean)
			.map((r) => {
				if (!/\d+/.test(r)) {
					// remove it if there are no numbers in it
					return null;
				}
				try {
					return Number(r);
				} catch {
					return null;
				}
			})
			.filter(Boolean),
		undefined,
		undefined,
		undefined
	];
	// make sure we have a start value
	if (Number.isNaN(start) || Number.isNaN(Number(start))) {
		throw Error(`parseRange received invalid range arguments '${rangeArg}'`);
	}
	// make sure we do not have a valid padding length
	if (padding < 1) {
		padding = 1;
	}
	// make sure the padding is an integer
	const roundedPadding = Math.round(padding);
	if (roundedPadding !== padding) {
		padding = roundedPadding;
	}

	return [start, step, padding];
};

// export const createRangeFactory= (start:number, step:number, padding:number): string[] => {
// 	let a: RangeResult = [];
// 	for (let i = 0; i < count; ++i) {
// 		const offset = i % 26; // only loop through lower case a-z
// 		a.push(String.fromCharCode(startCode + offset));
// 	}
// }

export const createRangeFactory: CreateRangeFactory = (start: number, step: number, padding: number) => {
	let result = start;
	let buffer: string = '';
	let usesDecimals: boolean = Math.round(start) !== start || Math.round(step) !== step;
	let paddingCharacter: string = '0';
	function pad(length: number) {
		let paddingBuffer: string = '';
		for (let i = 0; i < length; i++) {
			paddingBuffer += paddingCharacter;
		}
		return paddingBuffer;
	}
	return function getRangeItem() {
		buffer = result.toString();
		if (usesDecimals && !buffer.includes('.')) {
			buffer = buffer + '.0';
		}
		if (buffer.length < padding) {
			if (buffer.length < padding) {
				buffer = buffer.replace(
					// // named capture groups are only available in ES2018 or later
					// /^(?<decimalA>.*?)\.(?<decimalB>.*)$|^-(?<negativeNumber>.+)|^(?<anyInteger>.+)/,
					/^(.*?)\.(.*)$|^-(.+)|^(.+)/,
					(...args) => {
						const [original, decimalA, decimalB, negativeNumber, anyInteger] = args;
						// console.log(args);
						// const { decimalA, decimalB, negativeNumber, anyInteger } = args.slice(-1);
						if (typeof decimalA !== 'undefined') {
							return decimalA + '.' + padEnd(decimalB, padding - decimalA.length - 1, paddingCharacter);
						}
						if (typeof negativeNumber !== 'undefined') {
							return '-' + padStart(negativeNumber, padding - 1, paddingCharacter);
						}
						if (typeof anyInteger !== 'undefined') {
							// if (usesDecimals) {
							// 	return anyInteger + '.' + pad(padding - anyInteger.length - 1);
							// }
							return padStart(anyInteger, padding, paddingCharacter);
						}
						return original;
					}
				);
			}
		}

		result = Math.round((result + step) * 1e12) / 1e12;
		return buffer;
	};
};
