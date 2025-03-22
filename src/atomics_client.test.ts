import { tmplStr, ClientHtml } from "./mod.js";
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

	let expected = "Beasts tread softly underfoot.";

	let html = new ClientHtml();
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

	let html = new ClientHtml();
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

	let html = new ClientHtml();
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

	let expected = "<p>hello!</p>";

	let html = new ClientHtml();
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

	let html = new ClientHtml();
	let results = html.build(template);

	return assertResults(expected, results);
}

function anchorElementWithText() {
	let template = tmplStr(
		`
	<a>
		hello!    </a>
		`,
		[],
	);

	let expected = "<a>hello!</a>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assertResults(expected, results);
}

function voidElement() {
	let template = tmplStr(
		`
		<input />
		`,
		[],
	);

	let expected = "<input>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assertResults(expected, results);
}

function nonVoidElement() {
	let template = tmplStr(
		`
		<p />
		`,
		[],
	);

	let expected = "<p></p>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assertResults(expected, results);
}

function commentElement() {
	let template = tmplStr(
		`
	<!--
			Hello!
		-->
		`,
		[],
	);

	let expected = "";

	let html = new ClientHtml();
	let results = html.build(template);

	return assertResults(expected, results);
}

function altTextElement() {
	let template = tmplStr(
		`<style>#woof .bark {
    color: doggo;
}</style>`,
		[],
	);

	let expected = "";

	let html = new ClientHtml();
	let results = html.build(template);

	return assertResults(expected, results);
}

function altTextElementNoDescendants() {
	let template = tmplStr(
		`
		<script>
			{}
		</script>
		`,
		[],
	);

	let expected = "";

	let html = new ClientHtml();
	let results = html.build(template);

	return assertResults(expected, results);
}

function preservedTextElement() {
	let template = tmplStr(
		`
<pre>
	U w U
	  woof woof!
</pre>
		`,
		[],
	);

	let expected = "<pre>\n\tU w U\n\t  woof woof!\n</pre>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assertResults(expected, results);
}

export const tests = [
	textElement,
	emptyElement,
	fragment,
	elementWithText,
	inlineElementWithText,
	anchorElementWithText,
	voidElement,
	nonVoidElement,
	commentElement,
	altTextElement,
	altTextElementNoDescendants,
	preservedTextElement,
];
