import { Coyote } from "../dist/mod.js";
import { assert } from "./assertion.js";
import * as acs from "./atomics_component_set.js";
import * as acsl from "./atomics_component_literals_set.js";

const coyote = new Coyote();

function text_element() {
	let template = acs.text_element();
	let literal = acsl.text_element();

	let expected = "Beasts tread\nsoftly underfoot.";

	let results = coyote.render(template);
	let literal_results = coyote.render(literal);

	let assertions = [];
	let templateAssertion = assert(expected, results);
	if (templateAssertion) assertions.push(templateAssertion);
	let literalAssertion = assert(expected, literal_results);
	if (literalAssertion) assertions.push(literalAssertion);

	if (results[0] !== literal_results[0])
		assertions.push(`literal does not match string`);

	return assertions;
}


// function empty_element() {
//     let template = acs::empty_element();
//     let expected = "<p>\n</p>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function fragment() {
//     let template = acs::fragment();
//     let expected = "";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function block_element_with_text() {
//     let template = acs::block_element_with_text();
//     let expected = "<p>\n\thello!\n</p>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function block_element_with_text_for_string() {
//     let template = acs::block_element_with_text_for_string();
//     let expected = "<p>\n\thello!\n</p>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function inline_element_with_text() {
//     let template = acs::inline_element_with_text();
//     let expected = "<b> hello! </b>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function void_element() {
//     let template = acs::void_element();
//     let expected = "<input>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function void_element_with_self_closing() {
//     let template = acs::void_element_with_self_closing();
//     let expected = "<input>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function non_void_element() {
//     let template = acs::non_void_element();
//     let expected = "<p></p>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// // needs updating
// function comment_element() {
//     let template = acs::comment_element();
//     let expected = "<!-- Hello! -->";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function alt_text_element() {
//     let template = acs::alt_text_element();
//     let expected = "<style>#woof .bark {\n\tcolor: doggo;\n}</style>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function alt_element_has_no_descendants() {
//     let template = acs::alt_element_has_no_descendants();
//     let expected = "<script>\n\t{}\n</script>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function preserved_text_element_retains_spacing() {
//     let template = acs::preserved_text_element_retains_spacing();

//     let expected = "<pre>\n\tU w U\n\t  woof woof!\n</pre>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function attribute() {
//     let template = acs::attribute();
//     let expected = "<span hai>UwU</span>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function attribute_with_single_quote() {
//     let template = acs::attribute_with_single_quote();
//     let expected = "<span hai>UwU</span>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function attribute_with_double_quote() {
//     let template = acs::attribute_with_double_quote();
//     let expected = "<span hai>UwU</span>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function attribute_with_single_quote_value() {
//     let template = acs::attribute_with_single_quote_value();
//     let expected = "<span hai='hewoo'>UwU</span>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function attribute_with_double_quote_value() {
//     let template = acs::attribute_with_double_quote_value();
//     let expected = "<span hai=\"hewoo\">UwU</span>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function banned_attribute() {
//     let template = acs::banned_attribute();
//     let expected = "<span>UwU</span>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function banned_attribute_quoted() {
//     let template = acs::banned_attribute_quoted();
//     let expected = "<span>UwU</span>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

// function banned_attribute_single_quoted() {
//     let template = acs::banned_attribute_single_quoted();
//     let expected = "<span>UwU</span>";

//     let mut html = Html::new();
//     let results = html.render(&template);

//     assert_eq!(Ok(expected.to_string()), results);
// }

export const tests = [text_element];

export const options = {
	title: import.meta.url,
}
