import { tmplStr, ClientHtml, Html } from "./mod.js";
import type { Results } from "./component_string.js";

function textElement() {
	let assertions = [];

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

export const tests = [textElement];
