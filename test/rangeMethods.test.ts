//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { range_generic, range_0toX, range_1toX, range_AtoX, range_uuid } from '../src/rangeMethods';

suite('Range Methods', () => {
	// Defines a Mocha unit test
	suite('range_generic', () => {
		test('n returns a function to generate a range', () => {
			assert.deepStrictEqual(range_generic(5)(3), ['5', '6', '7']);
		});
	});

	suite('range_0toX', () => {
		test('n returns a range', () => {
			assert.deepStrictEqual(range_0toX(5), ['0', '1', '2', '3', '4']);
		});
		test('stops before n', () => {
			assert.notStrictEqual(range_0toX(3).pop(), '3');
		});
		test('starts at 0', () => {
			assert.strictEqual(range_0toX(3)[0], '0');
		});
		test('range of 0 returns an empty array', () => {
			assert.deepStrictEqual(range_0toX(0), []);
		});
		test('range of -1 returns an empty array', () => {
			assert.deepStrictEqual(range_0toX(-1), []);
		});
	});

	suite('range_1toX', () => {
		test('n returns a range', () => {
			assert.deepStrictEqual(range_1toX(5), ['1', '2', '3', '4', '5']);
		});
		test('stops at n', () => {
			assert.strictEqual(range_1toX(3).pop(), '3');
		});
		test('starts at 0', () => {
			assert.strictEqual(range_1toX(3)[0], '1');
		});
		test('range of 0 returns an empty array', () => {
			assert.deepStrictEqual(range_1toX(0), []);
		});
		test('range of -1 returns an empty array', () => {
			assert.deepStrictEqual(range_1toX(-1), []);
		});
	});

	suite('range_AtoX', () => {
		test('range returns letters', () => {
			assert.deepStrictEqual(range_AtoX(3), ['a', 'b', 'c']);
		});
		test('range of 0 returns an empty array', () => {
			assert.deepStrictEqual(range_AtoX(0), []);
		});
		test('range of -1 returns an empty array', () => {
			assert.deepStrictEqual(range_AtoX(0), []);
		});
		test('range of 26 returns an array of the alphabet', () => {
			assert.deepStrictEqual(range_AtoX(26), [
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
			assert.deepStrictEqual(range_AtoX(27).pop(), 'a');
		});
	});

	suite('range_uuid', () => {
		const uuids3 = range_uuid(3);
		const uuids5 = range_uuid(5);
		test('range n returns n uuid', () => {
			assert.strictEqual(uuids3.length, 3);
			assert.strictEqual(uuids5.length, 5);
		});
		test('range 0 returns 0 uuid', () => {
			assert.strictEqual(range_uuid(0).length, 0);
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
});
