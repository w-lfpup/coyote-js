export interface RulesetInterface {
	attrIsBanned(attr: string): boolean;
	getDocumentMemoryLimit(): number;
	getCacheMemoryLimit(): number;
	getAltTextTagFromCloseSequence(close_sequence: string): string | undefined;
	getCloseSequenceFromAltTextTag(tag: string): string | undefined;
	getCloseSequenceFromContentlessTag(tag: string): string | undefined;
	getContentlessTagFromCloseSequence(tag: string): string | undefined;
	getInitialEmbeddedContent(): string;
	respectIndentation(): boolean;
	tagIsBannedEl(tag: string): boolean;
	tagIsInlineEl(tag: string): boolean;
	tagIsEmbeddedContentEl(tag: string): boolean;
	tagIsPrefixOfContentlessEl(tag: string): string | undefined;
	tagIsPreformattedTextEl(tag: string): boolean;
	tagIsVoidEl(tag: string): boolean;
}
