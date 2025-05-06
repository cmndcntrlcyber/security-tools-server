/**
 * Basic tests for utility functions
 * 
 * To run these tests, you can add a test script to package.json:
 * "test": "node test/utils.test.js"
 */

import { sanitizeInput, formatOutput } from '../build/utils.js';
import assert from 'assert';

// Test sanitizeInput function
console.log('Testing sanitizeInput function...');

// Test case 1: Should remove shell special characters
const testInput1 = 'example.com; rm -rf /';
const expectedOutput1 = 'example.com rm -rf ';
const actualOutput1 = sanitizeInput(testInput1);
assert.strictEqual(actualOutput1, expectedOutput1, 'Failed to sanitize shell special characters');
console.log('✓ Sanitizes shell special characters');

// Test case 2: Should escape quotes
const testInput2 = 'example.com" --option="value\'s"';
const expectedOutput2 = 'example.com\\" --option=\\\"value\\\'s\\\"';
const actualOutput2 = sanitizeInput(testInput2);
assert.strictEqual(actualOutput2, expectedOutput2, 'Failed to escape quotes');
console.log('✓ Escapes quotes properly');

// Test formatOutput function
console.log('\nTesting formatOutput function...');

// Test case 1: Should remove ANSI color codes
const testOutput1 = '\x1B[32mSuccess\x1B[0m: Operation completed';
const expectedFormattedOutput1 = 'Success: Operation completed';
const actualFormattedOutput1 = formatOutput(testOutput1);
assert.strictEqual(actualFormattedOutput1, expectedFormattedOutput1, 'Failed to remove ANSI color codes');
console.log('✓ Removes ANSI color codes');

// Test case 2: Should trim whitespace
const testOutput2 = '  \n  Result: 42\n\n';
const expectedFormattedOutput2 = 'Result: 42';
const actualFormattedOutput2 = formatOutput(testOutput2);
assert.strictEqual(actualFormattedOutput2, expectedFormattedOutput2, 'Failed to trim whitespace');
console.log('✓ Trims whitespace');

console.log('\nAll tests passed!');
