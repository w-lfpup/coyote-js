import type { Results } from "../../dist/mod.js";

export function assert(expected: string, results: Results) {
	let [doc, error] = results;
	if (error) {
		return error;
	}

	if (expected !== doc) {
		return `
Expected:
${expected}

Found:
${doc}

`;
	}
}
