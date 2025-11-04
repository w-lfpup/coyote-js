import { assert } from "./assertion.js";
import { tmpl, attrVal, Html } from "../dist/mod.js";
function submitButton() {
    return tmpl `<input type=submit value="yus -_-">`;
}
function form() {
    let attributes = [attrVal("action", "/uwu"), attrVal("method", "post")];
    let descendants = [];
    descendants.push("you're a boy kisser aren't you >:3");
    descendants.push(submitButton());
    return tmpl `<form ${attributes}>${descendants}</form>`;
}
function coyote_api_literal() {
    let template = form();
    let expected = '<form action="/uwu" method="post">\n\tyou\'re a boy kisser aren\'t you >:3\n\t<input type=submit value="yus -_-">\n</form>';
    let html = new Html();
    let results = html.build(template);
    return assert(expected, results);
}
export const tests = [coyote_api_literal];
export const options = {
    title: import.meta.url,
};
