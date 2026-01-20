import type { StepKind } from "../template_steps/routes.ts";
import type { StepInterface } from "../template_steps/parse_str.ts";
import type { RulesetInterface } from "../template_steps/rulesets.ts";
import type { TagInfoInterface } from "./tag_info.ts";

import { getTagInfoFrom } from "./tag_info.js";
import { pushMultilineAttribtue, spaceCharCodes } from "./text_component.js";

import { getTextFromStep } from "../template_steps/parse_str.js";

type Router = (
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) => void;

const htmlRoutes = new Map<StepKind, Router>([
	["Attr", pushAttr],
	["AttrValueDoubleQuoted", pushAttrValueDoubleQuoted],
	["AttrValueSingleQuoted", pushAttrValueSingleQuoted],
	["AttrValueUnquoted", pushAttrValueUnquoted],
	["BreakingSpace", pushTextSpace],
	["NonBreakingSpace", pushTextSpace],
	["Tag", pushElement],
	["TagBreakingSpace", pushElementSpace],
	["TagClosed", closeElement],
	["TagClosedEmpty", closeEmptyElement],
	["TagNonBreakingSpace", pushElementSpace],
	["TailTag", popElement],
	["TailTagClosed", closeTailTag],
	["TailTagSpace", pushElementSpace],
	["Text", pushText],
	["TextAlt", pushAltText],
]);

export function composeSteps(
	rules: RulesetInterface,
	results: string[],
	tagInfoStack: TagInfoInterface[],
	templateStr: string,
	steps: StepInterface[],
) {
	for (const step of steps) {
		let route = htmlRoutes.get(step.kind);
		if (route) {
			route(results, tagInfoStack, rules, templateStr, step);
		}
	}
}

export function pushFormattedSpace(
	results: string[],
	tagInfo: TagInfoInterface,
) {
	if ("NonBreakingSpace" === tagInfo.textFormat) {
		results.push(" ");
		return;
	}

	if ("BreakingSpace" === tagInfo.textFormat) {
		results.push("\n");
		results.push("\t".repeat(tagInfo.indentCount));
	}
}

function pushAttr(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (tagInfo.bannedPath) return;

	let attr = getTextFromStep(templateStr, step);

	if (rules.attrIsBanned(attr)) {
		tagInfo.bannedAttr = true;
		tagInfo.textFormat = "Text";
		return;
	}

	tagInfo.bannedAttr = false;

	pushFormattedSpace(results, tagInfo);
	results.push(attr);

	tagInfo.textFormat = "Text";
}

function pushAttrValueDoubleQuoted(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (tagInfo.bannedPath || tagInfo.bannedAttr) return;

	let text = getTextFromStep(templateStr, step);
	results.push('="');
	pushMultilineAttribtue(results, rules, text, tagInfo);
	results.push('"');
}

function pushAttrValueSingleQuoted(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (tagInfo.bannedPath || tagInfo.bannedAttr) return;

	let text = getTextFromStep(templateStr, step);
	results.push("='");
	pushMultilineAttribtue(results, rules, text, tagInfo);
	results.push("'");
}

function pushAttrValueUnquoted(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (tagInfo.bannedPath || tagInfo.bannedAttr) return;

	let text = getTextFromStep(templateStr, step);
	results.push("=");
	results.push(text);
}

function pushTextSpace(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (tagInfo.bannedPath) return;

	if (tagInfo.preformattedTextPath) {
		let text = getTextFromStep(templateStr, step);
		results.push(text);
	}

	if (
		"Initial" === tagInfo.textFormat ||
		"BreakingSpace" === tagInfo.textFormat
	) {
		return;
	}

	tagInfo.textFormat = "NonBreakingSpace";
	if ("TagBreakingSpace" === step.kind || "BreakingSpace" === step.kind)
		tagInfo.textFormat = "BreakingSpace";
}

function pushElement(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	let tag = getTextFromStep(templateStr, step);
	let nextTagInfo = getTagInfoFrom(rules, tagInfo, tag);

	if (!nextTagInfo.bannedPath) {
		if (!nextTagInfo.preformattedTextPath) {
			pushFormattedSpace(results, tagInfo);
		}
		results.push("<");
		results.push(tag);
	}

	stack.push(nextTagInfo);
}

function pushElementSpace(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (tagInfo.bannedPath) return;

	if (
		"Initial" === tagInfo.textFormat ||
		"BreakingSpace" === tagInfo.textFormat
	) {
		return;
	}

	tagInfo.textFormat = "NonBreakingSpace";
	if ("TagBreakingSpace" === step.kind || "BreakingSpace" === step.kind)
		tagInfo.textFormat = "BreakingSpace";
}

function closeElement(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (!tagInfo.bannedPath) {
		if ("BreakingSpace" === tagInfo.textFormat) {
			results.push("\n");

			if (rules.respectIndentation()) {
				let indentOffset = tagInfo.inlineEl
					? tagInfo.indentCount
					: tagInfo.indentCount - 1;

				results.push("\t".repeat(indentOffset));
			}
		}
		results.push(">");
	}

	tagInfo.textFormat = "Text";

	if (!tagInfo.voidEl) return;

	stack.pop();
	let prevTagInfo = stack[stack.length - 1];
	if (prevTagInfo) prevTagInfo.textFormat = "Text";
}

// Self-closing logic requires a sieve between HTML elements and non-html elements.
// Html elements are also allowed in embedded elements (like a link around svg text).
//
// So for now
// - xml elements can self close
// - html, svg, mathml elements that self-close like <tag/>
//   expand into <tag></tag> and remain valid
function closeEmptyElement(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack.pop();
	if (!tagInfo) return;

	if (!tagInfo.bannedPath) {
		if ("xml" === tagInfo.embedded_content) {
			results.push("/>");
		} else {
			if (tagInfo.voidEl) {
				results.push(">");
			} else {
				results.push("></");
				results.push(tagInfo.tag);
				results.push(">");
			}
		}
	}

	let prevTagInfo = stack[stack.length - 1];
	if (prevTagInfo) prevTagInfo.textFormat = "Text";
}

function pushSpaceOnPop(
	results: string[],
	prevTagInfo: TagInfoInterface,
	tagInfo: TagInfoInterface,
) {
	if (tagInfo.preformattedTextPath) return;

	if ("NonBreakingSpace" === tagInfo.textFormat) results.push(" ");
	if ("BreakingSpace" === tagInfo.textFormat)
		results.push("\n", "\t".repeat(prevTagInfo.indentCount));
}

function popElement(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (tagInfo.bannedPath || tagInfo.voidEl) return;

	let tag = getTextFromStep(templateStr, step);

	let closedTag = tag;
	let altClosedTag = rules.getAltTextTagFromCloseSequence(tag);
	if (altClosedTag) closedTag = altClosedTag;

	let contentlessTag = rules.getContentlessTagFromCloseSequence(tag);
	if (contentlessTag) closedTag = contentlessTag;

	if (closedTag !== tagInfo.tag) return;

	if (!altClosedTag && !contentlessTag) {
		let prevTagInfo = stack[stack.length - 2];
		if (prevTagInfo) pushSpaceOnPop(results, prevTagInfo, tagInfo);
	}

	if (tag === closedTag) {
		results.push("</");
	}

	results.push(tag);
}

function closeTailTag(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack.pop();
	if (!tagInfo) return;

	if (!tagInfo.bannedPath) results.push(">");

	let prevTagInfo = stack[stack.length - 1];
	if (prevTagInfo) prevTagInfo.textFormat = "Text";
}

function pushText(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (tagInfo.bannedPath) return;

	if (!tagInfo.preformattedTextPath) pushFormattedSpace(results, tagInfo);

	let text = getTextFromStep(templateStr, step);
	results.push(text);

	tagInfo.textFormat = "Text";
}

function pushAltText(
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (tagInfo.bannedPath) return;

	let text = getTextFromStep(templateStr, step);
	results.push(text);

	tagInfo.textFormat = "Text";
}
