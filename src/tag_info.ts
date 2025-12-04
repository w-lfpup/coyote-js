import type { RulesetInterface } from "./rulesets.ts";

export type TextFormat =
	| "Initial"
    | "LineSpace"
    | "Space"
    | "Text";

export interface TagInfoInterface {
	bannedPath: boolean;
	indentCount: number;
	inlineEl: boolean;
	namespace: string;
	preservedTextPath: boolean;
	tag: string;
	textFormat: TextFormat;
	voidEl: boolean;
}

export class TagInfo implements TagInfoInterface {
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

		this.bannedPath = rules.tagIsBannedEl(tag);
		this.indentCount = 0;
		this.inlineEl = rules.tagIsInlineEl(tag);
		this.preservedTextPath = rules.tagIsPreservedTextEl(tag);
		this.tag = tag;
		this.textFormat = "Initial";
		this.voidEl = rules.tagIsVoidEl(tag);
	}
}

export function from(
	rules: RulesetInterface,
	prevTagInfo: TagInfoInterface,
	tag: string,
): TagInfoInterface {
	let tagInfo = new TagInfo(rules, tag);

	tagInfo.namespace = prevTagInfo.namespace;
	tagInfo.indentCount = prevTagInfo.indentCount;
	tagInfo.textFormat = "Text";

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
