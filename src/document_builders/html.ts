import type { RulesetInterface } from "../template_steps/rulesets.js";
import type { DocumentParams } from "./flyweight.js";

import * as fw from "./flyweight.js";

const fallbackParams: DocumentParams = {
	cacheMemoryLimit: 1024,
	documentMemoryLimit: 5242880, // 5mb
	embeddedContent: "html",
	respectIndentation: true,
};

export class HtmlRules implements RulesetInterface {
	#params: DocumentParams;

	constructor(params: DocumentParams = fallbackParams) {
		this.#params = params;
	}

	attrIsBanned(attr: string): boolean {
		return false;
	}
	getCacheMemoryLimit(): number {
		return this.#params.cacheMemoryLimit;
	}
	getDocumentMemoryLimit(): number {
		return this.#params.documentMemoryLimit;
	}
	getAltTextTagFromCloseSequence(tag: string): string | undefined {
		return;
	}
	getCloseSequenceFromAltTextTag(tag: string): string | undefined {
		return;
	}
	getCloseSequenceFromContentlessTag(tag: string): string | undefined {
		if ("?" === tag) return "?>";
		if ("!--" === tag) return "-->";
		if ("![CDATA[" === tag) return "]]>";
	}
	getContentlessTagFromCloseSequence(tag: string): string | undefined {
		if ("?" === tag) return "?";
		if ("--" === tag) return "!--";
		if ("]]" === tag) return "![CDATA[";
	}
	getInitialEmbeddedContentEl(): string {
		return "html";
	}
	getPrefixOfContentlessEl(tag: string): string | undefined {
		if (tag.startsWith("?")) return "?";
		if (tag.startsWith("!--")) return "!--";
		if (tag.startsWith("![CDATA[")) return "![CDATA[";
	}
	respectIndentation(): boolean {
		return this.#params.respectIndentation;
	}
	tagIsBannedEl(tag: string): boolean {
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
