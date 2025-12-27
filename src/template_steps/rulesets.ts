export interface RulesetInterface {
	attrIsBanned(): boolean;
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
	tagIsPrefixOfContentless(tag: string): boolean;
	tagIsPreformattedTextEl(tag: string): boolean;
	tagIsVoidEl(tag: string): boolean;
}
