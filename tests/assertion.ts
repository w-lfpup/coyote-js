import type { Results } from "@w-lfpup/coyote";

export function assert(
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
