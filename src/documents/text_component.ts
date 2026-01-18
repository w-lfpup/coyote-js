import type { TagInfoInterface, TextFormat } from "./tag_info.js";
import type { RulesetInterface } from "../template_steps/rulesets.js";

const spaceCharCodes = new Set([
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

function getLargestCommonSpaceIndex(text: string): number {
	let texts = text.split("\n");

	let spaceIndex = text.length;
	let prevLine = "";

	let index = 0;
	while (index < texts.length) {
		index += 1;

		let line = texts[index];
		if (0 === line.length) continue;

		spaceIndex = getIndexOfFirstChar(line);
		prevLine = line;
		break;
	}

	while (index < texts.length) {
		index += 1;

		let line = texts[index];
		if (0 === line.length) continue;

		let nextSpaceIndex = 0;
		for (let glyphIndex = 0; glyphIndex < line.length; glyphIndex++) {
			nextSpaceIndex = glyphIndex;

			let targetGlyph = line[glyphIndex];
			if (!targetGlyph) break;

			let originGlyph = line[glyphIndex];
			if (
				originGlyph !== targetGlyph ||
				spaceCharCodes.has(originGlyph.charCodeAt(0))
			)
				break;
		}

		prevLine = line;
		spaceIndex = Math.min(nextSpaceIndex, spaceIndex);
	}

	return spaceIndex;
}

export function pushAltTextComponent() {}

function pushLineOfText() {}

export function pushTextComponent() {}
