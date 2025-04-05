import * as assert from 'assert';
import padEnd from 'lodash.padend';
import padStart from 'lodash.padstart';

import { createRangeFactory, parseRange } from '../src/rangeMethods';

/**
 * Find the indentation length we wish to use for a given column
 * @param {string[][]} items - an array of rows, containing columns
 * @param {number} columnIndex - which column we want to compute
 * @param {number} indentationLength - the length we want to use to represent one indentation step
 * @returns {number} the max width we want to use for that column
 */
export const getIndentationLength = (items: string[][], columnIndex: number, indentationLength: number): number => {
    return items.reduce((acc, values, i, arr) => {
        const val = values[columnIndex];
        let result = Math.max(acc, `${val}`.length);
        if (i === arr.length - 1) {
            if (result % indentationLength !== 0) {
                result += indentationLength - (result % indentationLength);
            }
        }
        return result;
    }, 0);
};

/**
 * An assertion failed for a createRangeFactory test case, and we want to report the inputs
 * that were used to generate the range in a pretty and repeatable pattern.
 *
 * Return a string to be printed with the assertion error message.
 */
export const reportCreateRangeFactoryTestCase = (inputs: { [key: string]: number }) => {
    const indentationLength = 4;
    const indentationString = padStart('', indentationLength * 4);
    const data = Object.keys(inputs).map((k) => [`${k}`, `${inputs[k]}`]);
    const keyColumnWidth = getIndentationLength(data, 0, indentationLength);
    const valueColumnWidth = getIndentationLength(data, 1, indentationLength);
    const inputsString = data
        .map(([k, v]) => padEnd(k, keyColumnWidth) + ' = ' + `${padEnd(v, valueColumnWidth)}`)
        .join('\n' + indentationString);

    return `\n${indentationString}${inputsString}`;
};

/**
 * Check if the parseRange function throws.
 * If it does not throw, then manually throw an error with
 * the return value so we can see what it returned.
 */
export const checkParseRangeThrows = (val: unknown) => {
    assert.throws(
        () => {
            const result = parseRange(val);
            // if it did not throw, then manually throw a custom error so we can see what the result was
            throw new Error(`DID NOT THROW: parseRange("${val}") = ${JSON.stringify(result)}`);
        },
        function expectThrowError(err: unknown) {
            assert.ok(err instanceof Error);
            if (err instanceof Error) {
                // check for a specific error message
                assert.ok(/./.test(err.message));

                // check if we manually threw an error
                assert.ok(!/^DID NOT THROW/.test(err.message), err.message);
            }
            return true;
        }
    );
};

/**
 * Given the start, stop, and padding arguments we want for a range, and an array of
 * the values we expect to receive, then:
 *      1. create the range
 *      2. check the range is the correct length
 *      3. check each value in the range has the correct length
 *      4. check the range matches exactly what we expect
 *      5. return the resulting range for any further testing
 *
 * @param {number} start - the value the range should start at
 * @param {number} step - how far the range should increment or decrement with each step
 * @param {number} padding - the minimum number of characters we want each value in the range to use
 * @param {number} expectedOutput - the range we expect to receive
 *
 */
export const createAndCheckRange = (start: number, step: number, padding: number, expectedOutput: string[]) => {
    const length = expectedOutput.length;
    const getRange = createRangeFactory(start, step, padding);
    const range = Array.from({ length }).map(() => getRange());

    // check the length of each value in the range
    range.forEach((val) => {
        const report = reportCreateRangeFactoryTestCase({ start, step, padding, length });
        assert.strictEqual(val.length >= padding, true, `invalid length for value "${val}" from${report}`);
    });

    // check the length of the range itself
    assert.strictEqual(
        range.length,
        length,
        `Unexpect range length for ${reportCreateRangeFactoryTestCase({ start, step, padding, length })}`
    );

    // check the range matches what we expected
    assert.deepStrictEqual(
        range,
        expectedOutput,
        `Unexpected range values for${reportCreateRangeFactoryTestCase({ start, step, padding, length })}`
    );
    return range;
};

export const checkParseWithSpacing = (inputs: (number | string)[], expected: number[]) => {
    const offset = 2;
    [
        // no extra spaces around the values
        inputs.map((v) => v.toString()).join(' '),

        // extra spaces before each of the values
        inputs
            .map((v) => v.toString())
            .map((v, i) => padStart(v, v.length + i + offset))
            .join(' '),

        // extra spaces after each of the values
        inputs
            .map((v) => v.toString())
            .map((v, i) => padEnd(v, v.length + i + offset))
            .join(' '),

        // extra spaces before and after each of the values
        inputs
            .map((v) => v.toString())
            .map((v, i) => padStart('', i + offset) + padEnd(v, v.length + i + offset))
            .join(' ')
    ].forEach((value) => {
        assert.deepStrictEqual(parseRange(value), expected);
    });
};
