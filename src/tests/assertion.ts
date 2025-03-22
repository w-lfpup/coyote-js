import type { Results } from "../component_string.js";

export { assert };

function assert(
	expected: string,
	results: Results,
): { toString: Object["toString"] } {
	let [document, error] = results;
	if (error) {
		return error;
	}

	if (expected !== document) {
		return `
Expected:
${expected}

Results:
${document}

`;
	}
}
