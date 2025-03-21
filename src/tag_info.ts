import type { RulesetInterface } from "./rulesets.ts";

export type { TagInfoInterface, TextFormat };

export { TagInfo, from };

type TextFormat = "Block" | "Initial" | "Inline" | "Root";

interface TagInfoInterface {
	namespace: string;
	tag: string;
	textFormat: TextFormat;
	indentCount: number;
	voidEl: boolean;
	inlineEl: boolean;
	preservedTextPath: boolean;
	bannedPath: boolean;
}

class TagInfo implements TagInfoInterface {
	namespace: string;
	tag: string;
	textFormat: TextFormat;
	indentCount = 0;
	voidEl: boolean;
	inlineEl: boolean;
	preservedTextPath: boolean;
	bannedPath: boolean;

	constructor(rules: RulesetInterface, tag: string) {
		this.namespace = !rules.tagIsNamespaceEl(tag)
			? rules.getInitialNamespace()
			: tag;

		this.tag = tag;
		this.textFormat = "Root";
		this.indentCount = 0;
		this.voidEl = rules.tagIsVoidEl(tag);
		this.inlineEl = rules.tagIsInlineEl(tag);
		this.preservedTextPath = rules.tagIsPreservedTextEl(tag);
		this.bannedPath = rules.tagIsBannedEl(tag);
	}
}

function from(
	rules: RulesetInterface,
	prevTagInfo: TagInfoInterface,
	tag: string,
): TagInfoInterface {
	let tagInfo = new TagInfo(rules, tag);

	tagInfo.namespace = prevTagInfo.namespace;
	tagInfo.indentCount = prevTagInfo.indentCount;
	tagInfo.textFormat = "Initial";

	if (rules.tagIsNamespaceEl(tag)) {
		tagInfo.namespace = tag;
	}

	if (rules.tagIsPreservedTextEl(prevTagInfo.tag)) {
		tagInfo.preservedTextPath = true;
	}

	if (rules.tagIsBannedEl(tag)) {
		tagInfo.bannedPath = true;
	}

	if (!rules.tagIsVoidEl(prevTagInfo.tag) && !rules.tagIsInlineEl(tag)) {
		tagInfo.indentCount += 1;
	}

	return tagInfo;
}
