import type { RulesetInterface } from "../template_steps/rulesets.js";

export type TextFormat =
	| "Initial"
	| "BreakingSpace"
	| "NonBreakingSpace"
	| "Text";

export interface TagInfoInterface {
	bannedAttr: boolean;
	bannedPath: boolean;
	indentCount: number;
	inlineEl: boolean;
	embedded_content: string;
	preformattedTextPath: boolean;
	tag: string;
	textFormat: TextFormat;
	voidEl: boolean;
}

export function getTagInfoRoot(rules: RulesetInterface): TagInfoInterface {
	return {
		bannedAttr: false,
		bannedPath: false,
		indentCount: 0,
		inlineEl: true,
		embedded_content: rules.getInitialEmbeddedContentEl(),
		preformattedTextPath: false,
		tag: ":root",
		textFormat: "Initial",
		voidEl: false,
	};
}

export function getTagInfoFrom(
	rules: RulesetInterface,
	prevTagInfo: TagInfoInterface,
	tag: string,
): TagInfoInterface {
	let tagInfo: TagInfoInterface = { ...prevTagInfo };

	tagInfo.tag = tag;
	tagInfo.voidEl = rules.tagIsVoidEl(tag);
	tagInfo.inlineEl = rules.tagIsInlineEl(tag);
	tagInfo.textFormat = "Text";

	if (rules.tagIsEmbeddedContentEl(tag)) {
		tagInfo.embedded_content = tag;
	}

	if (rules.tagIsPreformattedTextEl(prevTagInfo.tag)) {
		tagInfo.preformattedTextPath = true;
	}

	if (rules.tagIsBannedEl(tag)) {
		tagInfo.bannedPath = true;
	}

	if (
		rules.respectIndentation() &&
		!rules.tagIsVoidEl(prevTagInfo.tag) &&
		!rules.tagIsInlineEl(tag)
	) {
		tagInfo.indentCount += 1;
	}

	return tagInfo;
}
