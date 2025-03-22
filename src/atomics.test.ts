import { tmplStr, ClientHtml, Html } from "./mod.js";
import type { Results } from "./component_string.js";
function assertResults(
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
${results}

`;
	}
}
function textElement() {
	let template = tmplStr(
		`

            Beasts tread
            softly underfoot.
		
		`,
		[],
	);

	let expected = "Beasts tread\nsoftly underfoot.";

	let html = new Html();
	let [doc, _err] = html.build(template);

	if (expected !== doc) {
		return "failed to parse text";
	}
}

function emptyElement() {
	let template = tmplStr(
		`

        <p>
		</p>
		
		`,
		[],
	);

	let expected = "<p></p>";

	let html = new Html();
	let [doc, _err] = html.build(template);

	if (expected !== doc) {
		return "failed to parse text";
	}
}

function fragment() {
	let template = tmplStr(
		`

        <>
		</>
		
		`,
		[],
	);

	let expected = "";

	let html = new Html();
	let [doc, _err] = html.build(template);

	if (expected !== doc) {
		return "failed to parse text";
	}
}

function elementWithText() {
	let template = tmplStr(
		`
	<p>hello!</p>
		`,
		[],
	);

	let expected = "<p>\n\thello!\n</p>";

	let html = new Html();
	let [doc, _err] = html.build(template);

	if (expected !== doc) {
		return "failed to parse text";
	}
}

function inlineElementWithText() {
	let template = tmplStr(
		`
	<b>     hello!
			</b>
		`,
		[],
	);

	let expected = "<b>hello!</b>";

	let html = new Html();
	let results = html.build(template);

	return assertResults(expected, results);
}

export const tests = [
	// textElement,
	// emptyElement,
	// fragment,
	// elementWithText,
	inlineElementWithText,
];
