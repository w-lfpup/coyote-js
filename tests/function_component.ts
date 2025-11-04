import type { Component } from "../dist/mod.js";

import { assert } from "./assertion.js";
import { tmplStr, attrVal, Html } from "../dist/mod.js";

function submitButton(): Component {
	return tmplStr('<input type=submit value="yus -_-">', []);
}

function woofForm(): Component {
	let attributes = [attrVal("action", "/uwu"), attrVal("method", "post")];

	let descendants: Component[] = [];
	descendants.push("you're a boy kisser aren't you >:3");
	descendants.push(submitButton());

	return tmplStr("<form {}>{}</form>", [attributes, descendants]);
}

function coyote_api() {
	let template = woofForm();

	let expected =
		'<form action="/uwu" method="post">\n\tyou\'re a boy kisser aren\'t you >:3\n\t<input type=submit value="yus -_-">\n</form>';

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

export const tests = [coyote_api];

export const options = {
	title: import.meta.url,
};
