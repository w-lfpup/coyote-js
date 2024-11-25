import type { StepInterface, StepKind } from "../../parse_str/dist/mod.ts";
import type { RulesetInterface } from "../../rulesets/dist/mod.ts";
import type { TagInfoInterface } from "../../html/dist/mod.ts";

import { TagInfo, from } from "../../html/dist/mod.js";
import { getTextFromStep, parseStr } from "../../parse_str/dist/mod.js";

type Router = (
	results: string[],
	stack: TagInfoInterface[],
	sieve: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) => void;

const spaceCharCodes = new Set([
	0x0009, 0x000b, 0x000c, 0xfeff,

	// whitespace chars
	0x0020, 0x00a0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005,
	0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x202f, 0x205f, 0x3000,
]);

const htmlRoutes = new Map<StepKind, Router>([
	// ["Tag", pushElement],
	// ["ElementClosed", closeElement],
	// ["EmptyElementClosed", closeEmptyElement],
	// ["TailTag", popElement],
	// ["Text", pushText],
	// ["Attr", addAttr],
	// ["AttrValue", addAttrValue],
	// ["AttrValueUnquoted", addAttrValUnquoted],
	// ["DescendantInjection", pushInjectionKind],
	// ["InjectionSpace", pushInjectionKind],
	// ["InjectionConfirmed", pushInjectionKind],
	// ["CommentText", pushText],
	// ["AltText", pushText],
	// ["AltTextCloseSequence", popClosingSquence],
]);

function compose(sieve: RulesetInterface, templateStr: string): string {
	let results = [];
	let stack: TagInfo[] = [];

	for (const step of parseStr(sieve, templateStr, "Initial")) {
		let route = htmlRoutes.get(step.kind);
		if (route) {
			route(results, stack, sieve, templateStr, step);
		}
	}

	return results.join("");
}

export { compose };