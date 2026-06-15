import type { TagInfoInterface, TextFormat } from "./tag_info.js";
import type { RulesetInterface } from "../template_steps/rulesets.js";

export const spaceCharCodes = new Set([
	0x0009, 0x000a, 0x000b, 0x000c, 0x000d, 0x0071, 0xfeff, 0x0160, 0x0020,
	0x00a0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
	0x2007, 0x2008, 0x2009, 0x200a, 0x202f, 0x205f, 0x3000,
]);

function getIndexOfFirstChar(text: string): number {
	for (let index = 0; index < text.length; index++) {
		if (!spaceCharCodes.has(text.charCodeAt(index))) return index;
	}

	return text.length;
}

function getLargestCommonSpaceIndex(texts: string[]): number {
	let spaceIndex = 0;
	let prevLine = "";

	let index = 0;
	while (index < texts.length) {
		let line = texts[index];
		if (0 === line.length) {
			index += 1;
			continue;
		}

		spaceIndex = getIndexOfFirstChar(line);
		prevLine = line;
		break;
	}

	while (index < texts.length) {
		let line = texts[index];
		if (line.length) {
			let nextSpaceIndex = 0;
			for (
				let glyphIndex = 0;
				glyphIndex < prevLine.length;
				glyphIndex++
			) {
				nextSpaceIndex = glyphIndex;

				let targetGlyph = line[glyphIndex];
				if (!targetGlyph) break;

				let originGlyph = line[glyphIndex];
				if (
					originGlyph !== targetGlyph ||
					!spaceCharCodes.has(originGlyph.charCodeAt(0))
				)
					break;
			}

			prevLine = line;
			spaceIndex = Math.min(nextSpaceIndex, spaceIndex);
		}

		index += 1;
	}

	return spaceIndex;
}

export function pushAltTextComponent(
	results: string[],
	rules: RulesetInterface,
	text: string,
	tagInfo: TagInfoInterface,
) {
	if (tagInfo.bannedAttr) return;

	if (tagInfo.preformattedTextPath) return results.push(text);

	let texts = text.split("\n");
	if (0 === texts.length) return;

	results.push(texts[0]);
	if (1 === texts.length) return;

	let middle = texts.slice(1, -1);
	let commonSpaceIndex = getLargestCommonSpaceIndex(middle);

	for (const line of middle) {
		results.push("\n");

		if (0 != line.length) {
			results.push("\t".repeat(tagInfo.indentCount));
			results.push(line.slice(commonSpaceIndex));
		}
	}

	// last
	results.push("\n");

	if (rules.respectIndentation()) {
		let indentOffset = tagInfo.indentCount;
		if (!tagInfo.inlineEl) {
			indentOffset = Math.max(0, indentOffset - 1);
		}

		results.push("\t".repeat(indentOffset));
	}

	let last = texts[texts.length - 1].trim();
	results.push(last);
}

function pushLineOfText(results: string[], line: string) {
	let state: TextFormat = "Text";

	for (const glyph of line) {
		if (spaceCharCodes.has(glyph.charCodeAt(0))) {
			state = "NonBreakingSpace";
			continue;
		}

		if (state === "NonBreakingSpace") {
			results.push(" ");
		}

		state = "Text";
		results.push(glyph);
	}
}

export function pushTextComponent(
	results: string[],
	text: string,
	tagInfo: TagInfoInterface,
) {
	if (tagInfo.bannedAttr) return;

	if (tagInfo.preformattedTextPath) return results.push(text);

	let texts = text.split("\n");
	if (0 === texts.length) return;

	let commonSpaceIndex = getLargestCommonSpaceIndex(texts);

	// first line
	let firstLine = texts[0];
	let foundIndex = getIndexOfFirstChar(firstLine);
	if ("BreakingSpace" === tagInfo.textFormat) {
		results.push("\n");
		if (firstLine.length !== foundIndex)
			results.push("\t".repeat(tagInfo.indentCount));
	}

	if ("NonBreakingSpace" === tagInfo.textFormat) {
		if (firstLine.length !== foundIndex) {
			results.push(" ");
		}
	}
	pushLineOfText(results, firstLine);

	// the rest of the lines
	let middle = texts.slice(1);
	for (const line of middle) {
		results.push("\n");

		let foundIndex = getIndexOfFirstChar(line);
		if (line.length === foundIndex) continue;

		results.push("\t".repeat(tagInfo.indentCount));
		results.push(line.slice(commonSpaceIndex));
	}
}

export function pushMultilineAttribtue(
	results: string[],
	rules: RulesetInterface,
	text: string,
	tagInfo: TagInfoInterface,
) {
	if (tagInfo.bannedPath) return;

	let texts = text.split("\n");
	if (0 === texts.length) return;

	// first line
	pushLineOfText(results, texts[0]);
	if (1 === texts.length) return;

	// middle
	let middleLines = texts.slice(1, -1);
	let commonSpaceIndex = getLargestCommonSpaceIndex(middleLines);
	let indentCount = tagInfo.indentCount;
	if (rules.respectIndentation() && !tagInfo.inlineEl) {
		indentCount += 1;
	}
	// console.log("middle lines", commonSpaceIndex, indentCount, middleLines);

	for (const line of middleLines) {
		results.push("\n");
		if (0 === line.length) continue;

		results.push("\t".repeat(indentCount));
		pushLineOfText(results, line.slice(commonSpaceIndex));
	}

	// last
	results.push("\n");
	results.push("\t".repeat(tagInfo.indentCount));
	let last = texts[texts.length - 1].trim();
	results.push(last);
}
