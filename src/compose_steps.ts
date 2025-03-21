import type { StepInterface, StepKind } from "./parse_str.ts";
import type { RulesetInterface } from "./rulesets.ts";
import type { TextFormat, TagInfoInterface } from "./tag_info.ts";

import { TagInfo, from } from "./tag_info.js";
import { getTextFromStep } from "./parse_str.js";

export {
	composeSteps,
	pushTextComponent,
	pushAttrValueComponent,
	pushAttrComponent,
};

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
	["Tag", pushElement], //
	["ElementClosed", closeElement], //
	["EmptyElementClosed", closeEmptyElement], //
	["TailTag", popElement], //
	["Text", pushText],
	["Attr", pushAttr],
	["AttrValue", pushAttrValue],
	["AttrValueUnquoted", pushAttrValueUnquoted],
]);

function composeSteps(
	rules: RulesetInterface,
	results: string[],
	tagInfoStack: TagInfo[],
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

function pushElement(
	results: string[],
	stack: TagInfo[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let prevTagInfo = stack[stack.length - 1];
	if (undefined === prevTagInfo) return;

	let tag = getTextFromStep(templateStr, step);
	const tagInfo = from(rules, prevTagInfo, tag);

	if (tagInfo.bannedPath) {
		stack.push(tagInfo);
		return;
	}

	if (
		!rules.respectIndentation() &&
		"Initial" !== prevTagInfo.textFormat &&
		"Root" !== prevTagInfo.textFormat
	) {
		results.push(" ");
	}

	if (rules.respectIndentation()) {
		if (!tagInfo.inlineEl) {
			if ("Root" !== prevTagInfo.textFormat) {
				results.push("\n");
				results.push("\t".repeat(prevTagInfo.indentCount));
			}
			prevTagInfo.textFormat = "Block";
		}

		if (tagInfo.inlineEl) {
			if ("Inline" === prevTagInfo.textFormat) {
				results.push(" ");
			}
			prevTagInfo.textFormat = "Inline";
		}
	}

	results.push("<");
	results.push(tag);

	stack.push(tagInfo);
}

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

function closeEmptyElement(results: string[], stack: TagInfo[]) {
	let tagInfo = stack.pop();
	if (undefined === tagInfo) return;

	if (tagInfo.bannedPath) return;

	if ("html" !== tagInfo.namespace) {
		results.push("/>");
	} else {
		if (!tagInfo.voidEl) {
			results.push("></");
			results.push(tagInfo.tag);
		}

		results.push(">");
	}
}

function popElement(
	results: string[],
	stack: TagInfo[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let tagInfo = stack.pop();
	if (tagInfo === undefined) return;

	if (tagInfo.bannedPath) return;

	let tag = getTextFromStep(templateStr, step);
	let altTag = rules.getAltTextTagFromCloseSequence(tag);
	if (altTag) {
		tag = altTag;
	}

	if (tag !== tagInfo.tag) return;

	if (tagInfo.voidEl && "html" === tagInfo.namespace) {
		results.push(">");
		return;
	}

	let prevTagInfo = stack[stack.length - 1];
	if (undefined === prevTagInfo) return;

	if (
		rules.respectIndentation() &&
		!tagInfo.inlineEl &&
		!tagInfo.preservedTextPath &&
		"Initial" !== tagInfo.textFormat
	) {
		results.push("\n");
		results.push("\t".repeat(prevTagInfo.indentCount));
	}

	let closeSeq = rules.getCloseSequenceFromAltTextTag(tag);
	if (closeSeq) {
		results.push(closeSeq);
		results.push(">");
		return;
	}

	results.push("</");
	results.push(tag);
	results.push(">");
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
	results.push(attr.trim());
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
	results.push(val.trim());
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

function pushText(
	results: string[],
	stack: TagInfo[],
	rules: RulesetInterface,
	templateStr: string,
	step: StepInterface,
) {
	let text = getTextFromStep(templateStr, step);
	pushTextComponent(results, stack, rules, text);
}

function pushTextComponent(
	results: string[],
	stack: TagInfo[],
	rules: RulesetInterface,
	text: string,
) {
	if (allSpaces(text)) return;

	let tagInfo = stack[stack.length - 1];
	if (tagInfo === undefined) return;

	if (tagInfo.bannedPath || tagInfo.voidEl) return;

	// preserved text
	if (tagInfo.preservedTextPath) {
		results.push(text);
		tagInfo.textFormat = "Inline";
		return;
	}

	// alt text
	let altText = rules.getCloseSequenceFromAltTextTag(tagInfo.tag);
	if (altText) {
		addAltElementText(results, text, tagInfo);
		tagInfo.textFormat = "Inline";
		return;
	}

	// if unformatted
	if (!rules.respectIndentation()) {
		addInlineText(results, text, tagInfo);
		tagInfo.textFormat = "Inline";
		return;
	}

	// formatted
	if ("Inline" === tagInfo.textFormat) {
		results.push(" ");
	}

	if (tagInfo.inlineEl || "Inline" === tagInfo.textFormat) {
		addFirstLineText(results, text, tagInfo);
	} else {
		addText(results, text, tagInfo);
	}

	tagInfo.textFormat = "Inline";
}

// helpers
function allSpaces(text: string): boolean {
	return text.length === getIndexOfFirstChar(text);
}

function addAltElementText(results: string[], text: string, tagInfo: TagInfo) {
	let commonIndex = getMostCommonSpaceIndex(text);

	for (const line of text.split("\n")) {
		if (allSpaces(line)) continue;

		results.push("\n");
		results.push("\t".repeat(tagInfo.indentCount));
		results.push(line.slice(commonIndex).trimEnd());
	}
}

function addFirstLineText(results: string[], text: string, tagInfo: TagInfo) {
	let texts = text.split("\n");

	let index = 0;
	while (index < texts.length) {
		let line = texts[index];
		index += 1;

		if (!allSpaces(line)) {
			results.push(line);
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

function addInlineText(results: string[], text: string, tagInfo: TagInfo) {
	let texts = text.split("\n");

	let index = 0;
	while (index < texts.length) {
		let line = texts[index];
		index += 1;

		if (allSpaces(line)) continue;

		if ("Root" !== tagInfo.textFormat && "Initial" !== tagInfo.textFormat) {
			results.push(" ");
		}

		results.push(line.trim());
		break;
	}

	while (index < texts.length) {
		let line = texts[index];
		index += 1;

		if (!allSpaces(line)) {
			results.push(" ");
			results.push(line.trim());
		}
	}
}

function addText(results: string[], text: string, tagInfo: TagInfo) {
	let texts = text.split("\n");

	let index = 0;
	while (index < texts.length) {
		let line = texts[index];
		index += 1;

		if (allSpaces(line)) continue;

		if ("Root" !== tagInfo.textFormat) {
			results.push("\n");
		}

		results.push("\t".repeat(tagInfo.indentCount));
		results.push(line.trim());
		break;
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

function getIndexOfFirstChar(text: string): number {
	for (let index = 0; index < text.length; index++) {
		if (!spaceCharCodes.has(text.charCodeAt(index))) return index;
	}

	return text.length;
}

function getMostCommonSpaceIndex(text: string): number {
	let spaceIndex = text.length;
	let prevLine = "";

	let texts = text.split("\n");

	let index = 0;
	while (index < text.length) {
		let line = texts[index];
		index += 1;

		if (allSpaces(line)) continue;

		spaceIndex = getIndexOfFirstChar(line);
		prevLine = line;
		break;
	}

	while (index < text.length) {
		let line = texts[index];
		index += 1;

		if (allSpaces(line)) continue;

		let currIndex = getMostCommonIndexBetweenTwoStrings(prevLine, line);
		if (currIndex < spaceIndex) {
			spaceIndex = currIndex;
		}

		prevLine = line;
	}

	return spaceIndex;
}

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
