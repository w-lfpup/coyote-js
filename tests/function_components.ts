import { Coyote, HtmlRules, tmpl, tmplStr } from "../dist/mod.js";
import { assert } from "./assertion.js";
import * as fcs from "./function_component_set.js";
// import * as acsl from "./html_component_set.js_literals_set.js";
import { compose } from "../dist/template_steps/template_steps.js";

let html = new Coyote(new HtmlRules());

function form_component_retains_spacing() {
	let template = fcs.form_component_retains_spacing();
	let expected =
		'<form action="/uwu" method="post">\n\tyou\'re a boy kisser aren\'t you >:3\n\t<input type=submit value="yus -_-">\n</form>';

	let results = html.render(template);

	assert(expected, results);
}

function elememt_and_text_components_retains_spacing() {
	let template = fcs.elememt_and_text_components_retains_spacing();
	let expected =
		"<div>hai :3hai :3</div>\n<div>\n\thai :3hai :3\n</div>\n<div>hai :3 hai :3</div>\n<div>\n\thai :3 hai :3\n</div>\n<div>\n\thai :3\n\thai :3\n</div>\n<div>\n\thai :3\n\thai :3\n</div>";

	let results = html.render(template);

	assert(expected, results);
}

function element_and_text_components_retain_extra_spacey_spacing() {
	let template =
		fcs.element_and_text_components_retain_extra_spacey_spacing();
	let expected =
		"<div>\n\thai :3\n\n\thai :3\n</div>\n<div>\n\n\thai :3\n\n\thai :3\n\n</div>\n<div>\n\thai :3\n\n\thai :3\n</div>\n<div>\n\n\thai :3\n\n\thai :3\n\n</div>\n<div>\n\n\thai :3\n\n\n\thai :3\n\n</div>\n<div>\n\n\thai :3\n\n\n\thai :3\n\n</div>";

	let results = html.render(template);

	assert(expected, results);
}

function element_components_retain_spacing() {
	let template = fcs.element_components_retain_spacing();
	let expected =
		"<div><span> hai :3 </span><span> hai :3 </span></div>\n<div>\n\t<span> hai :3 </span><span> hai :3 </span>\n</div>\n<div><span> hai :3 </span> <span> hai :3 </span></div>\n<div>\n\t<span> hai :3 </span> <span> hai :3 </span>\n</div>\n<div>\n\t<span> hai :3 </span>\n\t<span> hai :3 </span>\n</div>\n<div>\n\t<span> hai :3 </span>\n\t<span> hai :3 </span>\n</div>";

	let results = html.render(template);

	assert(expected, results);
}

function element_components_retain_extra_spacey_spacing() {
	let template = fcs.element_components_retain_extra_spacey_spacing();
	let expected =
		"<div>\n\t<span> hai :3 </span>\n\t<span> hai :3 </span>\n</div>\n<div>\n\t<span> hai :3 </span>\n\t<span> hai :3 </span>\n</div>\n<div>\n\t<span> hai :3 </span>\n\t<span> hai :3 </span>\n</div>\n<div>\n\t<span> hai :3 </span>\n\t<span> hai :3 </span>\n</div>\n<div>\n\t<span> hai :3 </span>\n\t<span> hai :3 </span>\n</div>\n<div>\n\t<span> hai :3 </span>\n\t<span> hai :3 </span>\n</div>";

	let results = html.render(template);

	assert(expected, results);
}

function attributes_retain_spacing() {
	let template = fcs.attributes_retain_spacing();
	let expected =
		"<p hai></p>\n<p hai\n></p>\n<p\n\thai></p>\n<p\n\thai\n>\n</p>";

	let results = html.render(template);

	assert(expected, results);
}

function attribute_component_injections_retain_spacing() {
	let template = fcs.attribute_component_injections_retain_spacing();
	let expected =
		'<p hai hello yo="what\'s good!" hey="\n\t\thowdy!\n\n\t\thowdy!\n\n\t\thurray!\n\t">\n</p>\n<p\n\thai\n\thello\n\tyo="what\'s good!"\n\they="\n\t\thowdy!\n\n\t\thowdy!\n\n\t\thurray!\n\t">\n</p>\n<span hai hello yo="what\'s good!" hey="\nhowdy!\n\nhowdy!\n\nhurray!\n"></span>\n<span hai hello yo="what\'s good!" hey="\nhowdy!\n\nhowdy!\n\nhurray!\n"></span>';
	let results = html.render(template);

	assert(expected, results);
}

export const tests = [
	form_component_retains_spacing,
	elememt_and_text_components_retains_spacing,
	element_and_text_components_retain_extra_spacey_spacing,
	element_components_retain_spacing,
	element_components_retain_extra_spacey_spacing,
	attributes_retain_spacing,
	attribute_component_injections_retain_spacing,
];

export const options = {
	title: import.meta.url,
};
