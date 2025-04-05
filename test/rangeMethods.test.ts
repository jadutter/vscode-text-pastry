import * as assert from 'assert';

import { parseRange, range0toX, range1toX, rangeAtoX, rangeGeneric, rangeUuid } from '../src/rangeMethods';
import { checkParseRangeThrows, checkParseWithSpacing, createAndCheckRange } from './utils';

suite('Range Methods', () => {
    // Defines a Mocha unit test
    suite('rangeGeneric', () => {
        test('n returns a function to generate a range', () => {
            assert.deepStrictEqual(rangeGeneric(5)(3), ['5', '6', '7']);
        });
    });

    suite('range0toX', () => {
        test('n returns a range', () => {
            assert.deepStrictEqual(range0toX(5), ['0', '1', '2', '3', '4']);
        });
        test('stops before n', () => {
            assert.notStrictEqual(range0toX(3).pop(), '3');
        });
        test('starts at 0', () => {
            assert.strictEqual(range0toX(3)[0], '0');
        });
        test('range of 0 returns an empty array', () => {
            assert.deepStrictEqual(range0toX(0), []);
        });
        test('range of -1 returns an empty array', () => {
            assert.deepStrictEqual(range0toX(-1), []);
        });
    });

    suite('range1toX', () => {
        test('n returns a range', () => {
            assert.deepStrictEqual(range1toX(5), ['1', '2', '3', '4', '5']);
        });
        test('stops at n', () => {
            assert.strictEqual(range1toX(3).pop(), '3');
        });
        test('starts at 0', () => {
            assert.strictEqual(range1toX(3)[0], '1');
        });
        test('range of 0 returns an empty array', () => {
            assert.deepStrictEqual(range1toX(0), []);
        });
        test('range of -1 returns an empty array', () => {
            assert.deepStrictEqual(range1toX(-1), []);
        });
    });

    suite('rangeAtoX', () => {
        test('range returns letters', () => {
            assert.deepStrictEqual(rangeAtoX(3), ['a', 'b', 'c']);
        });
        test('range of 0 returns an empty array', () => {
            assert.deepStrictEqual(rangeAtoX(0), []);
        });
        test('range of -1 returns an empty array', () => {
            assert.deepStrictEqual(rangeAtoX(0), []);
        });
        test('range of 26 returns an array of the alphabet', () => {
            assert.deepStrictEqual(rangeAtoX(26), [
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
                'g',
                'h',
                'i',
                'j',
                'k',
                'l',
                'm',
                'n',
                'o',
                'p',
                'q',
                'r',
                's',
                't',
                'u',
                'v',
                'w',
                'x',
                'y',
                'z'
            ]);
        });

        test('range of 27 returns loops back around', () => {
            assert.deepStrictEqual(rangeAtoX(27).pop(), 'a');
        });
    });

    suite('rangeUuid', () => {
        const uuids3 = rangeUuid(3);
        const uuids5 = rangeUuid(5);
        test('range n returns n uuid', () => {
            assert.strictEqual(uuids3.length, 3);
            assert.strictEqual(uuids5.length, 5);
        });
        test('range 0 returns 0 uuid', () => {
            assert.strictEqual(rangeUuid(0).length, 0);
        });
        test('each uuid is 36 characters long', () => {
            uuids3.forEach((uuid) => {
                // uuid v4 length
                assert.strictEqual(uuid.length, 36);
            });
            uuids5.forEach((uuid) => {
                assert.strictEqual(uuid.length, 36);
            });
        });
        test('each uuid matches the expected format', () => {
            const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            uuids3.forEach((uuid) => {
                assert.ok(pattern.test(uuid));
            });
            uuids5.forEach((uuid) => {
                assert.ok(pattern.test(uuid));
            });
        });
        test('each uuid is unique', () => {
            const combined = [...uuids3, ...uuids5];
            assert.strictEqual(combined.length, new Set(combined).size);
        });
    });
    suite('parseRange', () => {
        test('parses single integer', () => {
            checkParseWithSpacing([42], [42, 1, 1]);
        });
        test('parses double integer', () => {
            checkParseWithSpacing([17, 13], [17, 13, 1]);
        });
        test('parses triple integer', () => {
            checkParseWithSpacing([5, 10, 4], [5, 10, 4]);
        });
        test('parses triple negative integer', () => {
            checkParseWithSpacing([-5, -10, -4], [-5, -10, 1]);
        });
        test('parses triple decimal', () => {
            checkParseWithSpacing([1.2, 0.2, 0.5], [1.2, 0.2, 1]);
        });
        test('parses triple negative decimal', () => {
            checkParseWithSpacing([-1.2, -0.2, -0.5], [-1.2, -0.2, 1]);
        });
        test('refuses invalid inputs', () => {
            [
                //
                Math.PI,
                Infinity,
                NaN,
                1235,
                // although we strip out non numbers, we need at least 1 number for the start value
                'a',
                '',
                ' '
            ].forEach((vals) => {
                checkParseRangeThrows(vals);
            });
        });
        test('ignores extraneous inputs', () => {
            [
                // we strip non-numbers, and only use the first 3 numbers we find
                '1a',
                '1 a',
                '1 a b',
                '1 1 a',
                '1a 1 1',
                '1 1a 1',
                '1 1 1a',
                '1 1 1 1',
                'a 1 1 1 a',
                `1\t1\t1`,
                `1\n1\n1`,
                '1:1:1',
                '1,1,1',
                'a 1,1,1 a'
            ].forEach((vals) => {
                assert.doesNotThrow(() => {
                    parseRange(vals);
                });
            });
            assert.deepStrictEqual(parseRange('2a'), [2, 1, 1]);
            assert.deepStrictEqual(parseRange('2a 3b'), [2, 3, 1]);
            assert.deepStrictEqual(parseRange('1a 2 3 4 5'), [1, 2, 3]);
            assert.deepStrictEqual(parseRange('1 2a 3 4 5'), [1, 2, 3]);
            assert.deepStrictEqual(parseRange('1 2 3a 4 5'), [1, 2, 3]);
        });
    });
    suite('createRangeFactory', () => {
        test('outputs a range starting at 0', () => {
            createAndCheckRange(0, 1, 1, ['0', '1', '2', '3']);
        });
        test('outputs a range starting at 1', () => {
            createAndCheckRange(1, 1, 1, ['1', '2', '3']);
        });
        test('outputs a range starting at -5', () => {
            createAndCheckRange(-5, 1, 1, ['-5', '-4', '-3']);
        });
        test('outputs a range of decimals', () => {
            const range = createAndCheckRange(1.2, 0.2, 1, ['1.2', '1.4', '1.6', '1.8', '2.0', '2.2']);
            const pattern = /^\d+\.\d+$/;
            // every value has a decimal point
            range.forEach((v) => {
                assert.strictEqual(pattern.test(v), true);
            });
        });
        test('can decrement a range', () => {
            createAndCheckRange(10, -2, 1, ['10', '8', '6']);
        });
        test('can decrement decimals into negative', () => {
            createAndCheckRange(0.6, -0.3, 1, ['0.6', '0.3', '0.0', '-0.3', '-0.6', '-0.9']);
        });
        test('pads numbers', () => {
            createAndCheckRange(10, 5, 4, ['0010', '0015', '0020', '0025', '0030']);
        });
        test('pads negative numbers', () => {
            createAndCheckRange(-10, -5, 4, ['-010', '-015', '-020', '-025', '-030']);
        });
        test('pads decimals', () => {
            createAndCheckRange(2, -0.4, 5, ['2.000', '1.600', '1.200', '0.800', '0.400']);
        });
        test('pads negative decimals', () => {
            createAndCheckRange(1, -0.5, 8, ['1.000000', '0.500000', '0.000000', '-0.50000', '-1.00000', '-1.50000']);
        });
        test('pads negative and positive numbers', () => {
            createAndCheckRange(-10, 5, 4, ['-010', '-005', '0000', '0005', '0010', '0015']);
        });
    });
});
