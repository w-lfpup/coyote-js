// IMPORTANT!
//
// Any use of exports from any other file is not supported.
// I WILL break your build. I will not care.
//
// Thanks <3
//

export type { Component } from "./components.ts";

export { attr, attrVal, tmpl, tmplStr } from "./components.js";
export { Coyote } from "./document_builders/coyote.js";
export * from "document_builders/html.js";
export * from "document_builders/html_only.js";
export * from "document_builders/html_css_only.js";
export * from "document_builders/xml.js";
