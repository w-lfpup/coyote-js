import type { StepInterface, StepKind } from "../../parse_str/dist/mod.js";
import type { RulesetInterface } from "../../rulesets/dist/mod.js";
import type { TagInfoInterface } from "../../html/dist/mod.js";

import { TagInfo, from } from "../../html/dist/mod.js";
import { getTextFromStep, parseStr } from "../../parse_str/dist/mod.js";

type Router = (
	results: Node,
	stack: StackBit[],
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
	// ["EmptyElementClosed", closeElement],
	// ["TailTag", popElement],
	// ["Text", pushText],
	// ["Attr", addAttr],
	// ["AttrValue", addAttrValue],
	// ["AttrValueUnquoted", addAttrValUnquoted],
	// ["DescendantInjection", pushInjectionAddress],
	// ["CommentText", pushText],
	// ["AltText", pushText],
	// ["AltTextCloseSequence", popClosingSquence],
]);

// Need to create a document fragment to easily clone
// Need to create an address array for injections in a document fragment
// Need to copy document fragment

//

// This will be

// stack [{tag_info, element}, ...]

interface StackBit {
	tagInfo: TagInfoInterface;
	node: Node;
}

function compose(
	sieve: RulesetInterface,
	templateStr: string,
): DocumentFragment {
	let fragment = document.createDocumentFragment();
	let stack: StackBit[] = [];

	for (const step of parseStr(sieve, templateStr, "Initial")) {
		let route = htmlRoutes.get(step.kind);
		if (route) {
			route(fragment, stack, sieve, templateStr, step);
		}
	}

	return fragment;
}

export { compose };
