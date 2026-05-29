import type { RulesetInterface } from "../template_steps/rulesets.js";
import type { DocumentParams } from "./flyweight.js";

const fallbackParams: DocumentParams = {
	cacheMemoryLimit: 1024,
	documentMemoryLimit: 5242880, // 5mb
	embeddedContent: "xml",
	respectIndentation: true,
};

export class XmlRules implements RulesetInterface {
	#params: DocumentParams;

	constructor(params: DocumentParams = fallbackParams) {
		this.#params = params;
	}

	getCacheMemoryLimit(): number {
		return this.#params.cacheMemoryLimit;
	}

	getDocumentMemoryLimit(): number {
		return this.#params.documentMemoryLimit;
	}

	getInitialEmbeddedContent(): string {
		return this.#params.embeddedContent;
	}

	respectIndentation(): boolean {
		return this.#params.respectIndentation;
	}

	tagIsInlineEl(_tag: string): boolean {
		return false;
	}

	tagIsEmbeddedContentEl(_tag: string): boolean {
		return false;
	}

	tagIsPreformattedTextEl(tag: string): boolean {
		return "!CDATA[[" === tag;
	}

	tagIsVoidEl(_tag: string): boolean {
		return false;
	}

	tagIsBannedEl(_tag: string): boolean {
		return false;
	}

	attrIsBanned(attr: string): boolean {
		return attr.startsWith("on");
	}

	getAltTextTagFromCloseSequence(_tag: string): string | undefined {
		return;
	}

	getCloseSequenceFromAltTextTag(tag: string): string | undefined {
		return;
	}

	getCloseSequenceFromContentlessTag(tag: string): string | undefined {
		if ("?" === tag) return "?";
		if ("!--" === tag) return "-->";
		if ("![CDATA[" === tag) return "]]>";
	}

	getContentlessTagFromCloseSequence(tag: string): string | undefined {
		if ("?" === tag) return "?";
		if ("--" === tag) return "!--";
		if ("]]" === tag) return "![CDATA[";
	}

	tagIsPrefixOfContentlessEl(tag: string): string | undefined {
		if (tag.startsWith("?")) return "?";
		if (tag.startsWith("!--")) return "!--";
		if (tag.startsWith("![CDATA[")) return "![CDATA[";
	}
}
