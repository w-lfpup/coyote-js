import type { Results } from "../dist/mod.js";

export function assert(
	expected: string,
	results: Results,
) {
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
