import type { RulesetInterface } from "../template_steps/rulesets.js";
import type { DocumentParams } from "./flyweight.js";

import * as fw from "./flyweight.js";

const fallbackParams: DocumentParams = {
	cacheMemoryLimit: 1024,
	documentMemoryLimit: 5242880, // 5mb
	embeddedContent: "html",
	respectIndentation: true,
};

export class HtmlOnlyRules implements RulesetInterface {
	#params: DocumentParams;

	constructor(params: DocumentParams = fallbackParams) {
		this.#params = params;
	}

	attrIsBanned(attr: string): boolean {
		return attr.startsWith("on");
	}

	getCacheMemoryLimit(): number {
		return this.#params.cacheMemoryLimit;
	}

	getDocumentMemoryLimit(): number {
		return this.#params.documentMemoryLimit;
	}

	getAltTextTagFromCloseSequence(tag: string): string | undefined {
		if ("</script" === tag) return "script";
		if ("</style" === tag) return "style";
	}

	getCloseSequenceFromAltTextTag(tag: string): string | undefined {
		if ("script" === tag) return "</script";
		if ("style" === tag) return "</style";
	}

	getCloseSequenceFromContentlessTag(tag: string): string | undefined {
		if ("!--" === tag) return "-->";
	}

	getContentlessTagFromCloseSequence(tag: string): string | undefined {
		if ("--" === tag) return "!--";
	}

	getInitialEmbeddedContent(): string {
		return this.#params.embeddedContent;
	}

	tagIsPrefixOfContentlessEl(tag: string): string | undefined {
		if (tag.startsWith("!--")) return "!--";
	}

	respectIndentation(): boolean {
		return this.#params.respectIndentation;
	}

	tagIsBannedEl(tag: string): boolean {
		if ("link" === tag) return true;
		if ("script" === tag) return true;

		return fw.bannedElements.has(tag);
	}

	tagIsInlineEl(tag: string): boolean {
		return fw.inlineElements.has(tag);
	}

	tagIsEmbeddedContentEl(tag: string): boolean {
		return fw.isEmbeddedContentEl(tag);
	}

	tagIsPreformattedTextEl(tag: string): boolean {
		return fw.isPreformattedTextEl(tag);
	}

	tagIsVoidEl(tag: string): boolean {
		return fw.voidElements.has(tag);
	}
}
