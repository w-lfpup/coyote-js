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
		return;
	}
	getCloseSequenceFromAltTextTag(tag: string): string | undefined {
		return;
	}
	getCloseSequenceFromContentlessTag(tag: string): string | undefined {
		if ("!--" === tag) return "-->";
	}
	getContentlessTagFromCloseSequence(tag: string): string | undefined {
		if ("--" === tag) return "!--";
	}
	getInitialEmbeddedContent(): string {
		return "html";
	}
	tagIsPrefixOfContentlessEl(tag: string): string | undefined {
		if (tag.startsWith("!--")) return "!--";
	}
	respectIndentation(): boolean {
		return this.#params.respectIndentation;
	}
	tagIsBannedEl(tag: string): boolean {
		return false;
	}
	tagIsInlineEl(tag: string): boolean {
		return false;
	}
	tagIsEmbeddedContentEl(tag: string): boolean {
		return false;
	}
	tagIsPreformattedTextEl(tag: string): boolean {
		return "!CDATA[[" === tag;
	}
	tagIsVoidEl(tag: string): boolean {
		return false;
	}
}
