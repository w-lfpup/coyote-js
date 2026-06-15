import { Coyote, HtmlRules, tmpl, tmplStr } from "../dist/mod.js";
import { assert } from "./assertion.js";
import * as hcs from "./html_component_set.js";
// import * as acsl from "./html_component_set.js_literals_set.js";
import { compose } from "../dist/template_steps/template_steps.js";

let html = new Coyote(new HtmlRules());

function empty_element_retains_spacing() {
	let template = hcs.empty_element_retains_spacing();
	let expected = "<p></p>\n<p> </p><p>\n</p>";

	let results = html.render(template);

	return assert(expected, results);
}

function fragments_dont_exist() {
	let template = hcs.fragments_dont_exist();
	let expected = "";

	let results = html.render(template);

	return assert(expected, results);
}

function block_element_with_text_retains_spacing() {
	let template = hcs.block_element_with_text_retains_spacing();
	let expected =
		"<p>hello!</p>\n<p> hello! </p>\n<p>\n\thello\n</p><p>\n\thello\n</p>\n<p>hello\n</p>\n<p>\n\thello</p>";

	let results = html.render(template);

	return assert(expected, results);
}

function inline_element_with_text_retains_spacing() {
	let template = hcs.inline_element_with_text_retains_spacing();
	let expected =
		"<b>hello!</b>\n<b> hello! </b>\n<b> hello\n</b>\n<b>\nhello </b>\n<b>\nhello\n</b>\n<b>\nhello\n</b>\n<b>hello\n</b>\n<b>\nhello</b>";

	let results = html.render(template);

	return assert(expected, results);
}

function comment_element_retains_spacing() {
	let template = hcs.comment_element_retains_spacing();
	let expected =
		"<!---->\n<!--Hello!-->\n<!-- Hello! -->\n<!--Hello! -->\n<!-- Hello!-->\n<!--Hello!\n-->\n<!--\nHello!-->\n<!--\n\n\tHello!\n\n-->";

	let results = html.render(template);

	return assert(expected, results);
}

function empty_element_stays_empty() {
	let template = hcs.empty_element_stays_empty();
	let expected = "<html></html>";

	let results = html.render(template);

	return assert(expected, results);
}

function unbalanced_empty_elemen_errors_out() {
	let template = hcs.unbalanced_empty_elemen_errors_out();

	let [, error] = html.render(template);

	if (undefined !== error) return;

	return "unbalanced template failed to error";
}

function forbidden_attribute_injection_glyph_errors_out() {
	let template = hcs.forbidden_attribute_injection_glyph_errors_out();

	let results = html.render(template);

	if (undefined === results[1]) return;

	return "forbidden attribute glyph failed to error";
}

function mozilla_spacing_example_passes() {
	let template = hcs.mozilla_spacing_example_passes();

	let expected = "<h1> Hello\n\t<span> World!</span> </h1>";

	let results = html.render(template);

	return assert(expected, results);
}

function attribute_value_retains_spacing() {
	let template = hcs.attribute_value_retains_spacing();

	let expected =
		"<h1\n\toh\n\tyikes='woah!'\n\toh-no='\n\t\tit goes bye bye\n\t'\n\twow='People use\n\t\tattributes in some very\n\twild ways but thats okay'\n> Hello\n\t<span> World!</span> </h1>\n<h1 oh yikes='woah!' oh-no='\n\t\tit goes bye bye\n\t' wow='\n\n\t\tPeople use attributes in some very\n\n\t\twild ways but thats okay\n\n\t'>\n\tHello! <span> World!</span>\n</h1>";

	let results = html.render(template);
	// console.log(results);
	return assert(expected, results);
}

function void_elements_retain_spacing() {
	let template = hcs.void_elements_retain_spacing();

	let expected = "<input> <input>\n<input><input>";

	let results = html.render(template);

	return assert(expected, results);
}

function text_with_inline_elements_retain_spacing() {
	let template = hcs.text_with_inline_elements_retain_spacing();

	let expected =
		"beasts <span> tread </span> softly <span> underfoot </span> .";

	let results = html.render(template);

	return assert(expected, results);
}

function text_with_block_elements_retain_spacing() {
	let template = hcs.text_with_block_elements_retain_spacing();

	let expected = "beasts <p> tread </p> softly <p> underfoot </p> .";

	let results = html.render(template);

	return assert(expected, results);
}

function void_elements_can_have_attributes() {
	let template = hcs.void_elements_can_have_attributes();
	let expected =
		'<!DOCTYPE html><input type=checkbox> <input woof="bark">\n<input grrr><input>';

	let results = html.render(template);

	return assert(expected, results);
}

function void_element_with_sibling() {
	let template = hcs.void_element_with_sibling();
	let expected = "<input><p>hai :3</p>";

	let results = html.render(template);

	return assert(expected, results);
}

function nested_void_element_with_siblings_retains_spacing() {
	let template = hcs.nested_void_element_with_siblings_retains_spacing();

	let expected = "<section>\n\t<input><p>hai :3</p>\n</section>";

	let results = html.render(template);

	return assert(expected, results);
}

function nested_elements_and_text_retain_spacing() {
	let template = hcs.nested_elements_and_text_retain_spacing();
	let expected = "<a><label><input type=woofer>bark!</label><img></a>";

	let results = html.render(template);

	return assert(expected, results);
}

function document_retains_spacing() {
	let template = hcs.document_retains_spacing();

	let expected =
		"<!DOCTYPE>\n<html>\n\t<head>\n\t</head>\n\t<body>\n\t\t<article>\n\t\t\tYou're a <span>boy kisser</span> aren't you?\n\t\t\tClick <a>here</a> and go somewhere else.\n\t\t</article>\n\t\t<footer></footer>\n\t</body>\n</html>";

	let results = html.render(template);

	return assert(expected, results);
}

function document_with_alt_text_elements_retains_spacing() {
	let template = hcs.document_with_alt_text_elements_retains_spacing();

	let expected =
		"<!DOCTYPE>\n<html>\n\t<head>\n\t\t<style>\n\t\t\t#woof .bark {\n\t\t\t\tcolor: doggo;\n\t\t\t}\n\t\t</style>\n\t\t<script>\n\t\t\tif 2 < 3 {\n\t\t\t\tconsole.log();\n\t\t\t}\n\t\t</script>\n\t</head>\n\t<body>\n\t\t<article></article>\n\t\t<footer></footer>\n\t</body>\n</html>";

	let results = html.render(template);

	return assert(expected, results);
}

function banned_attributes() {
	let template = hcs.banned_attributes();
	let expected = "<span\nbowow click>UwU</span>";
	let results = html.render(template);

	return assert(expected, results);
}

function banned_attributes_quoted() {
	let template = hcs.banned_attributes_quoted();
	let expected = "<span bark bark>UwU</span>";
	let results = html.render(template);

	return assert(expected, results);
}

function banned_attributes_single_quoted() {
	let template = hcs.banned_attributes_single_quoted();
	let expected = "<span\ndash='chase'\nup=down>UwU</span>";
	let results = html.render(template);

	return assert(expected, results);
}

export const tests = [
	empty_element_retains_spacing,
	fragments_dont_exist,
	block_element_with_text_retains_spacing,
	inline_element_with_text_retains_spacing,
	comment_element_retains_spacing,
	empty_element_stays_empty,
	unbalanced_empty_elemen_errors_out,
	forbidden_attribute_injection_glyph_errors_out,
	mozilla_spacing_example_passes,
	attribute_value_retains_spacing,
	void_elements_retain_spacing,
	text_with_inline_elements_retain_spacing,
	text_with_block_elements_retain_spacing,
	void_elements_can_have_attributes,
	void_element_with_sibling,
	nested_void_element_with_siblings_retains_spacing,
	nested_elements_and_text_retain_spacing,
	document_retains_spacing,
	document_with_alt_text_elements_retains_spacing,
	banned_attributes,
	banned_attributes_quoted,
	banned_attributes_single_quoted,
];

export const options = {
	title: import.meta.url,
};
