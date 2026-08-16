// IMPORTANT!
//
// Any use of exports from any other file is not supported.
// I WILL break your build. I do not care.
//
// Thanks <3
//

export type { Component } from "./components.ts";
export type { DocumentParams } from "./document_builders/flyweight.js";
export type { Results } from "./documents/compose_string.js";
export type { StepInterface } from "./template_steps/parse_str.js";
export type { StepKind } from "./template_steps/routes.ts";

export { attr, attrVal, tmpl, tmplStr } from "./components.js";
export { Coyote } from "./document_builders/coyote.js";
export {getTextFromStep} from "./template_steps/parse_str.js";
export {compose, composeTemplateArr} from "./template_steps/template_steps.js";
export * from "./document_builders/html.js";
export * from "./document_builders/html_only.js";
export * from "./document_builders/html_css_only.js";
export * from "./document_builders/xml.js";
