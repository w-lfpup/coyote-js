import type { StepInterface, StepKind } from "./parse_str.ts";
import type { RulesetInterface } from "./rulesets.ts";
import type { DescendantStatus, TagInfoInterface } from "./tag_info.ts";

import { TagInfo, from } from "./tag_info.js";
import { getTextFromStep } from "./parse_str.js";

export { composeSteps, pushText, pushAttrValueComponent, pushAttrComponent };

type Router = (
	results: string[],
	stack: TagInfoInterface[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) => void;

const spaceCharCodes = new Set([
	0x0009, 0x000a, 0x000b, 0x000c, 0x000d, 0x0071, 0xfeff, 0x0160, 0x0020,
	0x00a0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
	0x2007, 0x2008, 0x2009, 0x200a, 0x202f, 0x205f, 0x3000,
]);

const htmlRoutes = new Map<StepKind, Router>([
	["Tag", pushElement],
	["ElementClosed", closeElement],
	["EmptyElementClosed", closeEmptyElement],
	["TailTag", popElement],
	["Text", pushTextStep],
	["Attr", pushAttr],
	["AttrValue", pushAttrValue],
	["AttrValueUnquoted", pushAttrValueUnquoted],
	["CommentText", pushTextStep],
	["AltText", pushTextStep],
	["AltTextCloseSequence", popClosingSquence],
]);

function composeSteps(
	rules: RulesetInterface,
	results: string[],
	tagInfoStack: TagInfo[],
	templateStr: string,
	steps: StepInterface[],
): string {
	for (const step of steps) {
		let route = htmlRoutes.get(step.kind);
		if (route) {
			route(results, tagInfoStack, rules, templateStr, step);
		}
	}

	return results.join("");
}

function pushElement(
	results: string[],
	stack: TagInfo[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tag = getTextFromStep(templateStr, step);
	let tagInfo = stack[stack.length - 1];
	tagInfo = tagInfo ? from(rules, tagInfo, tag) : new TagInfo(rules, tag);

	if (tagInfo.bannedPath) {
		let prevTagInfo = stack[stack.length - 1];
		if (prevTagInfo) {
			prevTagInfo.mostRecentDescendant = rules.isInlineEl(tag)
				? "InlineElement"
				: "Element";
		}

		stack.push(tagInfo);
		return;
	}

	if (rules.respectIndentation() && results.length > 0) {
		if (tagInfo.inlineEl) {
			results.push(" ");
		} else {
			results.push("\n");
			results.push("\t".repeat(tagInfo.indentCount));
		}
	}

	// combine these too, both use prevTagInfo
	if (!rules.respectIndentation() && tagInfo.inlineEl && !tagInfo.voidEl) {
		let prevTagInfo = stack[stack.length - 1];
		if (prevTagInfo && prevTagInfo.mostRecentDescendant === "Text") {
			results.push(" ");
		}
	}
	// combine with above
	let prevTagInfo = stack[stack.length - 1];
	if (prevTagInfo) {
		prevTagInfo.mostRecentDescendant = rules.isInlineEl(tag)
			? "InlineElement"
			: "Element";
	}

	results.push("<");
	results.push(tag);

	stack.push(tagInfo);
}

// tried, close
function closeElement(results: string[], stack: TagInfo[]) {
	let tagInfo = stack[stack.length - 1];
	if (tagInfo === undefined) return;

	if (!tagInfo.bannedPath) {
		results.push(">");
	}

	if (tagInfo.voidEl && "html" === tagInfo.namespace) {
		stack.pop();
	}
}

// tried close, should update RUST version
function closeEmptyElement(results: string[], stack: TagInfo[]) {
	let tagInfo = stack[stack.length - 1];
	if (undefined === tagInfo) return;

	if (tagInfo.bannedPath || tagInfo.voidEl) {
		stack.pop();
		return;
	}

	if ("html" !== tagInfo.namespace) {
		results.push("/>");
	}

	if ("html" === tagInfo.namespace) {
		if (!tagInfo.voidEl) {
			results.push("></");
			results.push(tagInfo.tag);
		}

		results.push(">");
	}

	let last_tag = stack.pop();
	let descdantStatus: DescendantStatus = last_tag.inlineEl
		? "InlineElementClosed"
		: "ElementClosed";
	updateMostRecentDescendant(stack, descdantStatus);
}

// RUST doesnt protect against banned

function popElement(
	results: string[],
	stack: TagInfo[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tag = getTextFromStep(templateStr, step);
	let tagInfo = stack[stack.length - 1];
	if (tagInfo === undefined) return;

	if (tag !== tagInfo.tag) return;

	if (tagInfo.bannedPath) {
		stack.pop();
		return;
	}

	if (tagInfo.voidEl && "html" !== tagInfo.namespace) {
		results.push(">");
		stack.pop();

		let prevTagInfo = stack[stack.length - 1];
		if (prevTagInfo) {
			prevTagInfo.mostRecentDescendant = "ElementClosed";
		}

		return;
	}

	if (
		rules.respectIndentation() &&
		!tagInfo.inlineEl &&
		!tagInfo.preservedTextPath &&
		"Initial" !== tagInfo.mostRecentDescendant
	) {
		results.push("\n");
		results.push("\t".repeat(tagInfo.indentCount));
	}

	results.push("</");
	results.push(tag);
	results.push(">");

	stack.pop();

	let prevTagInfo = stack[stack.length - 1];
	if (prevTagInfo) {
		prevTagInfo.mostRecentDescendant = rules.isInlineEl(tag)
			? "InlineElementClosed"
			: "ElementClosed";
	}
}

function pushAttr(
	results: string[],
	stack: TagInfo[],
	_rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let attr = getTextFromStep(templateStr, step);
	pushAttrComponent(results, stack, attr);
}

function pushAttrComponent(results: string[], stack: TagInfo[], attr: string) {
	let tagInfo = stack[stack.length - 1];
	if (tagInfo === undefined) return;

	if (tagInfo.bannedPath) return;

	results.push(" ");
	results.push(attr);
}

function pushAttrValue(
	results: string[],
	stack: TagInfo[],
	_rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let val = getTextFromStep(templateStr, step);
	pushAttrValueComponent(results, stack, val);
}

function pushAttrValueComponent(
	results: string[],
	stack: TagInfo[],
	val: string,
) {
	let tagInfo = stack[stack.length - 1];
	if (tagInfo === undefined) return;

	if (tagInfo.bannedPath) return;

	results.push('="');
	results.push(val);
	results.push('"');
}

function pushAttrValueUnquoted(
	results: string[],
	stack: TagInfo[],
	_rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack[stack.length - 1];
	if (tagInfo === undefined) return;

	if (tagInfo.bannedPath) return;

	let val = getTextFromStep(templateStr, step);
	results.push("=");
	results.push(val);
}

function pushTextStep(
	results: string[],
	stack: TagInfo[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let text = getTextFromStep(templateStr, step);
	pushText(results, stack, rules, text);
}

function pushText(
	results: string[],
	stack: TagInfo[],
	rules: RulesetInterface,
	text: string,
) {
	let tagInfo = stack[stack.length - 1];
	if (tagInfo === undefined) {
		for (let line of text.split("\n")) {
			if (allSpaces(line)) continue;

			results.push("\n");
			results.push(line.trim());
		}
		return;
	}

	if (tagInfo.bannedPath || tagInfo.voidEl) return;

	if (tagInfo.preservedTextPath) {
		tagInfo.mostRecentDescendant = "Text";
		results.push(text);
		return;
	}

	// alt text
	let altText = rules.getCloseSequenceFromAltTextTag(tagInfo.tag);
	if (altText) {
		let commonIndex = getMostCommonSpaceIndex(text);

		for (let line of text.split("\n")) {
			if (allSpaces(line)) continue;

			results.push("\n");
			results.push("\t".repeat(tagInfo.indentCount));
			results.push(line.slice(commonIndex).trimEnd());
		}

		tagInfo.mostRecentDescendant = "Text";
		return;
	}

	if (allSpaces(text)) return;

	if (rules.respectIndentation()) {
		if ("InlineElement" === tagInfo.mostRecentDescendant) {
			addInlineElementText(results, text, tagInfo);
		} else if ("InlineElementClosed" === tagInfo.mostRecentDescendant) {
			addInlineElementClosedText(results, text, tagInfo);
		} else if ("Initial" === tagInfo.mostRecentDescendant) {
			if (tagInfo.inlineEl) {
				addInlineElementText(results, text, tagInfo);
			} else {
				addText(results, text, tagInfo);
			}
		} else {
			addText(results, text, tagInfo);
		}
	} else {
		if ("InlineElementClosed" === tagInfo.mostRecentDescendant) {
			addUnprettyInlineElementClosedText(results, text);
		} else if ("Text" === tagInfo.mostRecentDescendant) {
			addInlineElementText(results, text, tagInfo);
		} else {
			addInlineElementText(results, text, tagInfo);
		}
	}

	tagInfo.mostRecentDescendant = "Text";
}

// helpers
function allSpaces(text: string): boolean {
	return text.length === getIndexOfFirstChar(text);
}

// tried, close
function addInlineElementText(
	results: string[],
	text: string,
	tagInfo: TagInfo,
) {
	let texts = text.split("\n");

	let index = 0;
	while (index < texts.length) {
		let line = texts[index];
		index += 1;

		if (!allSpaces(line)) {
			results.push(line.trimEnd());
			break;
		}
	}

	while (index < texts.length) {
		let line = texts[index];
		index += 1;

		if (allSpaces(line)) continue;

		results.push("\n");
		results.push("\t".repeat(tagInfo.indentCount));
		results.push(line.trim());
	}
}

// tried close
function addInlineElementClosedText(
	results: string[],
	text: string,
	tagInfo: TagInfo,
) {
	let texts = text.split("\n");

	let index = 0;
	while (index < texts.length) {
		let line = texts[index];
		index += 1;

		if (!allSpaces(line)) {
			results.push(" ");
			results.push(line.trim());
			break;
		}
	}

	while (index < texts.length) {
		let line = texts[index];
		index += 1;

		if (allSpaces(line)) continue;

		results.push("\n");
		results.push("\t".repeat(tagInfo.indentCount));
		results.push(line.trim());
	}
}

function addUnprettyInlineElementClosedText(results: string[], text: string) {
	for (let line of text.split("\n")) {
		if (allSpaces(line)) continue;

		results.push(" ", line.trim());
	}
}

function addText(results: string[], text: string, tagInfo: TagInfo) {
	for (let line of text.split("\n")) {
		if (allSpaces(line)) {
			continue;
		}

		results.push("\n");
		results.push("\t".repeat(tagInfo.indentCount + 1));
		results.push(line.trim());
	}
}

// tried, seems close
function popClosingSquence(
	results: string[],
	stack: TagInfo[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let closingSequence = getTextFromStep(templateStr, step);
	let tag = rules.getTagFromCloseSequence(closingSequence);
	if (tag === undefined) return;

	let tagInfo = stack[stack.length - 1];
	if (tagInfo === undefined) return;

	if (tag !== tagInfo.tag) return;

	if (tagInfo.bannedPath) {
		stack.pop();
		return;
	}

	stack.pop();

	let prevTagInfo = stack[stack.length - 1];
	if (prevTagInfo === undefined) return;

	if (
		rules.respectIndentation() &&
		!prevTagInfo.inlineEl &&
		!prevTagInfo.preservedTextPath &&
		"Initial" != prevTagInfo.mostRecentDescendant
	) {
		results.push("\n");
		results.push("\t".repeat(prevTagInfo.indentCount));
	}

	results.push(closingSequence);
}

function updateMostRecentDescendant(
	stack: TagInfo[],
	descdantStatus: DescendantStatus,
) {
	let tag_info = stack[stack.length - 1];
	if (tag_info) {
		tag_info.mostRecentDescendant = descdantStatus;
	}
}

function getIndexOfFirstChar(text: string): number {
	for (let index = 0; index < text.length; index++) {
		if (!spaceCharCodes.has(text.charCodeAt(index))) return index;
	}

	return text.length;
}

// this is probably wrong
function getMostCommonSpaceIndex(text: string): number {
	let prevSpaceIndex = text.length;
	let spaceIndex = text.length;

	let prevLine = "";

	let texts = text.split("\n");
	let firstLine = texts[0];
	if (firstLine) {
		prevLine = firstLine;
	}

	for (let index = 1; index < texts.length; index++) {
		const line = texts[index];
		if (line === undefined) break;

		let firstChar = getIndexOfFirstChar(line);
		if (line.length === firstChar) continue;

		spaceIndex = getMostCommonIndexBetweenTwoStrings(prevLine, line);
		if (spaceIndex < prevSpaceIndex) {
			prevSpaceIndex = spaceIndex;
		}

		prevLine = line;
	}

	return spaceIndex;
}

// this is probably wrong
function getMostCommonIndexBetweenTwoStrings(
	source: string,
	target: string,
): number {
	let minLength = Math.min(source.length, target.length);
	for (let index = 0; index < minLength; index++) {
		let sourceChar = source.charCodeAt(index);
		let targetChar = target.charCodeAt(index);

		if (sourceChar === targetChar && spaceCharCodes.has(sourceChar)) {
			continue;
		}

		return index;
	}

	return minLength - 1;
}
