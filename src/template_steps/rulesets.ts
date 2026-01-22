export interface RulesetInterface {
	attrIsBanned(attr: string): boolean;
	getDocumentMemoryLimit(): number;
	getCacheMemoryLimit(): number;
	getAltTextTagFromCloseSequence(close_sequence: string): string | undefined;
	getCloseSequenceFromAltTextTag(tag: string): string | undefined;
	getCloseSequenceFromContentlessTag(tag: string): string | undefined;
	getContentlessTagFromCloseSequence(tag: string): string | undefined;
	getInitialEmbeddedContentEl(): string;
	getPrefixOfContentlessEl(tag: string): string | undefined;
	respectIndentation(): boolean;
	tagIsBannedEl(tag: string): boolean;
	tagIsEmbeddedContentEl(tag: string): boolean;
	tagIsInlineEl(tag: string): boolean;
	tagIsPreformattedTextEl(tag: string): boolean;
	tagIsVoidEl(tag: string): boolean;
}
