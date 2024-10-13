import type { StepInterface, StepKind } from "../../parse/dist/mod.ts";
import type { SieveInterface } from "../../sieve/dist/mod.ts";
import type { TagInfo } from "./tag_info.ts";

import { getTextFromStep, parseStr } from "../../parse/dist/mod.js";

type Router = (
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) => void;

const htmlRoutes = new Map<StepKind, Router>([
	["Tag", pushElement],
	["ElementClosed", closeElement],
	["EmptyElementClosed", closeEmptyElement],
	["TailTag", popElement],
	["Text", pushText],
	["Attr", addAttr],
	["AttrValue", addAttrValue],
	["AttrValueUnquoted", addAttrValUnquoted],
	["DescendantInjection", pushInjectionKind],
	["InjectionSpace", pushInjectionKind],
	["InjectionConfirmed", pushInjectionKind],
	["CommentText", pushText],
	["AltText", pushText],
	["AltTextCloseSequence", popClosingSquence],
]);

function compose(sieve: SieveInterface, templateStr: string): string {
	let results = "";
	let stack: TagInfo[] = [];

	for (const step of parseStr(sieve, templateStr, "Initial")) {
		let route = htmlRoutes.get(step.kind);
		if (route) {
			route(
				results,
				stack,
				sieve,
				templateStr,
				step,
			)
		}
	}

	return results;
}

function pushElement(
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) {}

function closeElement(
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) {}

function closeEmptyElement(
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) {}

function popElement(
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) {}

function addAttr(
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) {}

function addAttrValue(
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) {}

function addAttrValUnquoted(
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) {}

function pushInjectionKind(
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) {}

function pushText(
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) {}

function popClosingSquence(
	results: string,
    stack: TagInfo[],
    sieve: SieveInterface,
    template_str: string,
    step: StepInterface,
) {}

export { compose }