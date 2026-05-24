import { Coyote } from "../dist/mod.js";
import { assert } from "./assertion.js";
import * as acs from "./atomics_component_set.js";
import * as acsl from "./atomics_component_literals_set.js";
const coyote = new Coyote();
function text_element() {
    let expected = "Beasts tread\nsoftly underfoot.";
    let assertions = [];
    let results = coyote.render(acs.text_element());
    let templateAssertion = assert(expected, results);
    if (templateAssertion)
        assertions.push(templateAssertion);
    // let literal_results = coyote.render(acsl.text_element());
    // let literalAssertion = assert(expected, literal_results);
    // if (literalAssertion) assertions.push(literalAssertion);
    // if (results[0] !== literal_results[0])
    // 	assertions.push(`literal does not match string`);
    return assertions;
}
function empty_element() {
    let expected = "<p>\n</p>";
    let assertions = [];
    let results = coyote.render(acs.empty_element());
    let templateAssertion = assert(expected, results);
    if (templateAssertion)
        assertions.push(templateAssertion);
    // let literal_results = coyote.render(acsl.empty_element());
    // let literalAssertion = assert(expected, literal_results);
    // if (literalAssertion) assertions.push(literalAssertion);
    // if (results[0] !== literal_results[0])
    // 	assertions.push(`literal does not match string`);
    return assertions;
}
function fragment() {
    let expected = "";
    let assertions = [];
    let results = coyote.render(acs.fragment());
    let templateAssertion = assert(expected, results);
    if (templateAssertion)
        assertions.push(templateAssertion);
    // let literal_results = coyote.render(acsl.fragment());
    // let literalAssertion = assert(expected, literal_results);
    // if (literalAssertion) assertions.push(literalAssertion);
    // if (results[0] !== literal_results[0])
    // 	assertions.push(`literal does not match string`);
    return assertions;
}
function block_element_with_text() {
    let expected = "<p>\n\thello!\n</p>";
    let assertions = [];
    let results = coyote.render(acs.block_element_with_text());
    let templateAssertion = assert(expected, results);
    if (templateAssertion)
        assertions.push(templateAssertion);
    // let literal_results = coyote.render(acsl.block_element_with_text());
    // let literalAssertion = assert(expected, literal_results);
    // if (literalAssertion) assertions.push(literalAssertion);
    // if (results[0] !== literal_results[0])
    // 	assertions.push(`literal does not match string`);
    return assertions;
}
function inline_element_with_text() {
    let expected = "<b> hello! </b>";
    let assertions = [];
    let results = coyote.render(acs.inline_element_with_text());
    let templateAssertion = assert(expected, results);
    if (templateAssertion)
        assertions.push(templateAssertion);
    // let literal_results = coyote.render(acsl.inline_element_with_text());
    // let literalAssertion = assert(expected, literal_results);
    // if (literalAssertion) assertions.push(literalAssertion);
    // if (results[0] !== literal_results[0])
    // 	assertions.push(`literal does not match string`);
    return assertions;
}
function void_element() {
    let expected = "<input>";
    let assertions = [];
    let results = coyote.render(acs.void_element());
    let templateAssertion = assert(expected, results);
    if (templateAssertion)
        assertions.push(templateAssertion);
    // let literal_results = coyote.render(acsl.void_element());
    // let literalAssertion = assert(expected, literal_results);
    // if (literalAssertion) assertions.push(literalAssertion);
    // if (results[0] !== literal_results[0])
    // 	assertions.push(`literal does not match string`);
    return assertions;
}
function void_element_with_self_closing() {
    let expected = "<input>";
    let assertions = [];
    let results = coyote.render(acs.void_element_with_self_closing());
    let templateAssertion = assert(expected, results);
    if (templateAssertion)
        assertions.push(templateAssertion);
    // let literal_results = coyote.render(acsl.void_element_with_self_closing());
    // let literalAssertion = assert(expected, literal_results);
    // if (literalAssertion) assertions.push(literalAssertion);
    // if (results[0] !== literal_results[0])
    // 	assertions.push(`literal does not match string`);
    return assertions;
}
function non_void_element() {
    let expected = "<p></p>";
    let assertions = [];
    let results = coyote.render(acs.non_void_element());
    let templateAssertion = assert(expected, results);
    if (templateAssertion)
        assertions.push(templateAssertion);
    // let literal_results = coyote.render(acsl.non_void_element());
    // let literalAssertion = assert(expected, literal_results);
    // if (literalAssertion) assertions.push(literalAssertion);
    // if (results[0] !== literal_results[0])
    // 	assertions.push(`literal does not match string`);
    return assertions;
}
function comment_element() {
    let expected = "<!-- Hello! -->";
    let assertions = [];
    let results = coyote.render(acs.comment_element());
    let templateAssertion = assert(expected, results);
    if (templateAssertion)
        assertions.push(templateAssertion);
    let literal_results = coyote.render(acsl.comment_element());
    // let literalAssertion = assert(expected, literal_results);
    // if (literalAssertion) assertions.push(literalAssertion);
    // if (results[0] !== literal_results[0])
    // 	assertions.push(`literal does not match string`);
    return assertions;
}
export const tests = [
    text_element,
    empty_element,
    fragment,
    block_element_with_text,
    inline_element_with_text,
    void_element,
    void_element_with_self_closing,
    non_void_element,
    comment_element,
];
export const options = {
    title: import.meta.url,
};
