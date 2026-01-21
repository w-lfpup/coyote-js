import type { RulesetInterface } from "../template_steps/rulesets.js";

export class HtmlOnlyRules implements RulesetInterface {
	attrIsBanned(attr: string): boolean {
		return false;
	}
	getCacheMemoryLimit(): number {
		return 1024;
	}
	getAltTextTagFromCloseSequence(tag: string): string | undefined {
		return getAltTextTagFromCloseSequence(tag);
	}
	getCloseSequenceFromAltTextTag(tag: string): string | undefined {
		return getCloseSequenceFromAltTextTag(tag);
	}
	getCloseSequenceFromContentlessTag(tag: string): string | undefined {
		return;
	}
	getContentlessTagFromCloseSequence(tag: string): string | undefined {
		return getAltTextTagFromCloseSequence(tag);
	}
	getInitialEmbeddedContentEl(): string {
		return "html";
	}
	getPrefixOfContentlessEl(tag: string): string | undefined {
		return;
	}
	respectIndentation(): boolean {
		return true;
	}
	tagIsBannedEl(tag: string): boolean {
		return bannedElements.has(tag);
	}
	tagIsInlineEl(tag: string): boolean {
		return inlineElements.has(tag);
	}
	tagIsEmbeddedContentEl(tag: string): boolean {
		return isNameSpaceEl(tag);
	}
	tagIsPreformattedTextEl(tag: string): boolean {
		return isPreservedTextEl(tag);
	}
	tagIsVoidEl(tag: string): boolean {
		return voidElements.has(tag);
	}
}
