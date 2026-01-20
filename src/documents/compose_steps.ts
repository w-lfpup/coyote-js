import type { StepKind } from "../template_steps/routes.ts";
import type { StepInterface } from "../template_steps/parse_str.ts";
import type { RulesetInterface } from "../template_steps/rulesets.ts";
import type { TagInfoInterface } from "./tag_info.ts";

import { getRoot, from } from "./tag_info.js";
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
	let nextTagInfo = from(rules, tagInfo, tag);

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

// function pushElement(
// 	results: string[],
// 	stack: TagInfoInterface[],
// 	rules: RulesetInterface,
// 	templateStr: string,
// 	step: StepInterface,
// ) {
// 	let prevTagInfo = stack[stack.length - 1];
// 	if (undefined === prevTagInfo) return;

// 	let tag = getTextFromStep(templateStr, step);
// 	const tagInfo = from(rules, prevTagInfo, tag);

// 	if (tagInfo.bannedPath) {
// 		stack.push(tagInfo);
// 		return;
// 	}

// 	if (
// 		!rules.respectIndentation() &&
// 		"Initial" !== prevTagInfo.textFormat &&
// 		"Root" !== prevTagInfo.textFormat
// 	) {
// 		results.push(" ");
// 	}

// 	if (rules.respectIndentation()) {
// 		if (!tagInfo.inlineEl) {
// 			if ("Root" !== prevTagInfo.textFormat) {
// 				results.push("\n");
// 				results.push("\t".repeat(prevTagInfo.indentCount));
// 			}
// 			prevTagInfo.textFormat = "Block";
// 		}

// 		if (tagInfo.inlineEl) {
// 			if ("Inline" === prevTagInfo.textFormat) {
// 				results.push(" ");
// 			}
// 			prevTagInfo.textFormat = "Inline";
// 		}
// 	}

// 	results.push("<");
// 	results.push(tag);

// 	stack.push(tagInfo);
// }

// function closeElement(results: string[], stack: TagInfoInterface[]) {
// 	let tagInfo = stack[stack.length - 1];
// 	if (tagInfo === undefined) return;

// 	if (!tagInfo.bannedPath) {
// 		results.push(">");
// 	}

// 	if (tagInfo.voidEl && "html" === tagInfo.namespace) {
// 		stack.pop();
// 	}
// }

// function closeEmptyElement(results: string[], stack: TagInfoInterface[]) {
// 	let tagInfo = stack.pop();
// 	if (undefined === tagInfo) return;

// 	if (tagInfo.bannedPath) return;

// 	if ("html" !== tagInfo.namespace) {
// 		results.push("/>");
// 	} else {
// 		if (!tagInfo.voidEl) {
// 			results.push("></");
// 			results.push(tagInfo.tag);
// 		}

// 		results.push(">");
// 	}
// }

// function popElement(
// 	results: string[],
// 	stack: TagInfoInterface[],
// 	rules: RulesetInterface,
// 	templateStr: string,
// 	step: StepInterface,
// ) {
// 	let tagInfo = stack.pop();
// 	if (tagInfo === undefined) return;

// 	if (tagInfo.bannedPath) return;

// 	let tag = getTextFromStep(templateStr, step);
// 	let altTag = rules.getAltTextTagFromCloseSequence(tag);
// 	if (altTag) {
// 		tag = altTag;
// 	}

// 	if (tag !== tagInfo.tag) return;

// 	if (tagInfo.voidEl && "html" === tagInfo.namespace) {
// 		results.push(">");
// 		return;
// 	}

// 	let prevTagInfo = stack[stack.length - 1];
// 	if (undefined === prevTagInfo) return;

// 	if (
// 		rules.respectIndentation() &&
// 		!tagInfo.inlineEl &&
// 		!tagInfo.preservedTextPath &&
// 		"Initial" !== tagInfo.textFormat
// 	) {
// 		results.push("\n");
// 		results.push("\t".repeat(prevTagInfo.indentCount));
// 	}

// 	let closeSeq = rules.getCloseSequenceFromAltTextTag(tag);
// 	if (closeSeq) {
// 		results.push(closeSeq);
// 		results.push(">");
// 		return;
// 	}

// 	results.push("</");
// 	results.push(tag);
// 	results.push(">");
// }

// function pushAttrComponent(results: string[], stack: TagInfoInterface[], attr: string) {
// 	let tagInfo = stack[stack.length - 1];
// 	if (tagInfo === undefined) return;

// 	if (tagInfo.bannedPath) return;

// 	results.push(" ");
// 	results.push(attr.trim());
// }

// function pushAttrValue(
// 	results: string[],
// 	stack: TagInfoInterface[],
// 	_rules: RulesetInterface,
// 	templateStr: string,
// 	step: StepInterface,
// ) {
// 	let val = getTextFromStep(templateStr, step);
// 	pushAttrValueComponent(results, stack, val);
// }

// function pushAttrValueComponent(
// 	results: string[],
// 	stack: TagInfoInterface[],
// 	val: string,
// ) {
// 	let tagInfo = stack[stack.length - 1];
// 	if (tagInfo === undefined) return;

// 	if (tagInfo.bannedPath) return;

// 	results.push('="');
// 	results.push(val.trim());
// 	results.push('"');
// }

// function pushAttrValueUnquoted(
// 	results: string[],
// 	stack: TagInfoInterface[],
// 	_rules: RulesetInterface,
// 	templateStr: string,
// 	step: StepInterface,
// ) {
// 	let tagInfo = stack[stack.length - 1];
// 	if (tagInfo === undefined) return;

// 	if (tagInfo.bannedPath) return;

// 	let val = getTextFromStep(templateStr, step);
// 	results.push("=");
// 	results.push(val);
// }

// function pushText(
// 	results: string[],
// 	stack: TagInfoInterface[],
// 	rules: RulesetInterface,
// 	templateStr: string,
// 	step: StepInterface,
// ) {
// 	let text = getTextFromStep(templateStr, step);
// 	pushTextComponent(results, stack, rules, text);
// }

// function pushTextComponent(
// 	results: string[],
// 	stack: TagInfoInterface[],
// 	rules: RulesetInterface,
// 	text: string,
// ) {
// 	if (allSpaces(text)) return;

// 	let tagInfo = stack[stack.length - 1];
// 	if (tagInfo === undefined) return;

// 	if (tagInfo.bannedPath || tagInfo.voidEl) return;

// 	// preserved text
// 	if (tagInfo.preservedTextPath) {
// 		results.push(text);
// 		tagInfo.textFormat = "Inline";
// 		return;
// 	}

// 	// alt text
// 	let altText = rules.getCloseSequenceFromAltTextTag(tagInfo.tag);
// 	if (altText) {
// 		addAltElementText(results, text, tagInfo);
// 		tagInfo.textFormat = "Inline";
// 		return;
// 	}

// 	// if unformatted
// 	if (!rules.respectIndentation()) {
// 		addInlineText(results, text, tagInfo);
// 		tagInfo.textFormat = "Inline";
// 		return;
// 	}

// 	// formatted
// 	if ("Inline" === tagInfo.textFormat) {
// 		results.push(" ");
// 	}

// 	if (tagInfo.inlineEl || "Inline" === tagInfo.textFormat) {
// 		addFirstLineText(results, text, tagInfo);
// 	} else {
// 		addText(results, text, tagInfo);
// 	}

// 	tagInfo.textFormat = "Inline";
// }

// // helpers
// function allSpaces(text: string): boolean {
// 	return text.length === getIndexOfFirstChar(text);
// }

// function addAltElementText(results: string[], text: string, tagInfo: TagInfo) {
// 	let commonIndex = getMostCommonSpaceIndex(text);

// 	for (let line of text.split("\n")) {
// 		if (allSpaces(line)) continue;

// 		results.push("\n");
// 		results.push("\t".repeat(tagInfo.indentCount));
// 		results.push(line.slice(commonIndex).trimEnd());
// 	}
// }

// function addFirstLineText(results: string[], text: string, tagInfo: TagInfo) {
// 	let texts = text.split("\n");

// 	let index = 0;
// 	while (index < texts.length) {
// 		let line = texts[index];
// 		index += 1;

// 		if (!allSpaces(line)) {
// 			results.push(line.trim());
// 			break;
// 		}
// 	}

// 	while (index < texts.length) {
// 		let line = texts[index];
// 		index += 1;

// 		if (allSpaces(line)) continue;

// 		results.push("\n");
// 		results.push("\t".repeat(tagInfo.indentCount));
// 		results.push(line.trim());
// 	}
// }

// function addInlineText(results: string[], text: string, tagInfo: TagInfo) {
// 	let texts = text.split("\n");

// 	let index = 0;
// 	while (index < texts.length) {
// 		let line = texts[index];
// 		index += 1;

// 		if (allSpaces(line)) continue;

// 		if ("Root" !== tagInfo.textFormat && "Initial" !== tagInfo.textFormat) {
// 			results.push(" ");
// 		}

// 		results.push(line.trim());
// 		break;
// 	}

// 	while (index < texts.length) {
// 		let line = texts[index];
// 		index += 1;

// 		if (!allSpaces(line)) {
// 			results.push(" ");
// 			results.push(line.trim());
// 		}
// 	}
// }

// function addText(results: string[], text: string, tagInfo: TagInfo) {
// 	let texts = text.split("\n");

// 	let index = 0;
// 	while (index < texts.length) {
// 		let line = texts[index];
// 		index += 1;

// 		if (allSpaces(line)) continue;

// 		if ("Root" !== tagInfo.textFormat) {
// 			results.push("\n");
// 		}

// 		results.push("\t".repeat(tagInfo.indentCount));
// 		results.push(line.trim());
// 		break;
// 	}

// 	while (index < texts.length) {
// 		let line = texts[index];
// 		index += 1;

// 		if (allSpaces(line)) continue;

// 		results.push("\n");
// 		results.push("\t".repeat(tagInfo.indentCount));
// 		results.push(line.trim());
// 	}
// }

// function getIndexOfFirstChar(text: string): number {
// 	for (let index = 0; index < text.length; index++) {
// 		if (!spaceCharCodes.has(text.charCodeAt(index))) return index;
// 	}

// 	return text.length;
// }

// function getMostCommonSpaceIndex(text: string): number {
// 	let spaceIndex = text.length;
// 	let prevLine = "";

// 	let texts = text.split("\n");

// 	let index = 0;
// 	while (index < texts.length) {
// 		let line = texts[index];
// 		index += 1;

// 		if (allSpaces(line)) continue;

// 		spaceIndex = getIndexOfFirstChar(line);
// 		prevLine = line;
// 		break;
// 	}

// 	while (index < texts.length) {
// 		let line = texts[index];
// 		index += 1;

// 		if (allSpaces(line)) continue;

// 		let currIndex = getMostCommonIndexBetweenTwoStrings(prevLine, line);
// 		if (currIndex < spaceIndex) {
// 			spaceIndex = currIndex;
// 		}

// 		prevLine = line;
// 	}

// 	return spaceIndex;
// }

// function getMostCommonIndexBetweenTwoStrings(
// 	source: string,
// 	target: string,
// ): number {
// 	let minLength = Math.min(source.length, target.length);
// 	for (let index = 0; index < minLength; index++) {
// 		let sourceChar = source.charCodeAt(index);
// 		let targetChar = target.charCodeAt(index);

// 		if (sourceChar === targetChar && spaceCharCodes.has(sourceChar)) {
// 			continue;
// 		}

// 		return index;
// 	}

// 	return minLength - 1;
// }
