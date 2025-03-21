export type { RulesetInterface };

export { ClientRules, ServerRules, XmlRules };

interface RulesetInterface {
	getInitialNamespace(): string;
	tagIsAtributeless(tag: string): boolean;
	getCloseSequenceFromAltTextTag(tag: string): string | undefined;
	getAltTtextTagFromCloseSequence(close_sequence: string): string | undefined;
	respectIndentation(): boolean;
	tagIsBannedEl(tag: string): boolean;
	tagIsVoidEl(tag: string): boolean;
	tagIsNamespaceEl(tag: string): boolean;
	tagIsPreservedTextEl(tag: string): boolean;
	tagIsInlineEl(tag: string): boolean;
}

let bannedElements = new Set([
	"acronym",
	"big",
	"center",
	"content",
	"dir",
	"font",
	"frame",
	"framset",
	"image",
	"marquee",
	"menuitem",
	"nobr",
	"noembed",
	"noframes",
	"param",
	"plaintext",
	"rb",
	"rtc",
	"shadow",
	"strike",
	"tt",
	"xmp",
]);

let inlineElements = new Set([
	"abbr",
	"b",
	"bdi",
	"bdo",
	"cite",
	"code",
	"data",
	"dfn",
	"em",
	"i",
	"kbd",
	"mark",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"small",
	"span",
	"strong",
	"sub",
	"sup",
	"time",
	"u",
	"var",
	"wbr",
	"area",
	"audio",
	"img",
	"map",
	"track",
	"video",
	"embed",
	"iframe",
	"object",
	"picture",
	"portal",
	"source",
]);

let voidElements = new Set([
	"!DOCTYPE",
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
]);

class ServerRules implements RulesetInterface {
	getInitialNamespace(): string {
		return "html";
	}
	tagIsAtributeless(tag: string): boolean {
		return isAtributeless(tag);
	}
	getCloseSequenceFromAltTextTag(tag: string): string | undefined {
		return getCloseSequenceFromAltTextTag(tag);
	}
	getAltTtextTagFromCloseSequence(tag: string): string | undefined {
		return getAltTtextTagFromCloseSequence(tag);
	}
	respectIndentation(): boolean {
		return true;
	}
	tagIsBannedEl(tag: string): boolean {
		return bannedElements.has(tag);
	}
	tagIsVoidEl(tag: string): boolean {
		return voidElements.has(tag);
	}
	tagIsNamespaceEl(tag: string): boolean {
		return isNameSpaceEl(tag);
	}
	tagIsPreservedTextEl(tag: string): boolean {
		return isPreservedTextEl(tag);
	}
	tagIsInlineEl(tag: string): boolean {
		return inlineElements.has(tag);
	}
}

class ClientRules implements RulesetInterface {
	getInitialNamespace(): string {
		return "html";
	}
	tagIsAtributeless(tag: string): boolean {
		return isAtributeless(tag);
	}
	getCloseSequenceFromAltTextTag(tag: string): string {
		return getCloseSequenceFromAltTextTag(tag);
	}
	getAltTtextTagFromCloseSequence(tag: string): string {
		return getAltTtextTagFromCloseSequence(tag);
	}
	respectIndentation(): boolean {
		return false;
	}
	tagIsBannedEl(tag: string): boolean {
		return (
			"!--" === tag ||
			"link" === tag ||
			"script" === tag ||
			"style" === tag ||
			bannedElements.has(tag)
		);
	}
	tagIsVoidEl(tag: string): boolean {
		return voidElements.has(tag);
	}
	tagIsNamespaceEl(tag: string): boolean {
		return isNameSpaceEl(tag);
	}
	tagIsPreservedTextEl(tag: string): boolean {
		return isPreservedTextEl(tag);
	}
	tagIsInlineEl(tag: string): boolean {
		if ("a" === tag) return true;

		return inlineElements.has(tag);
	}
}

class XmlRules implements RulesetInterface {
	getInitialNamespace(): string {
		return "xml";
	}
	tagIsAtributeless(tag: string): boolean {
		return isAtributeless(tag);
	}
	getCloseSequenceFromAltTextTag(tag: string): string | undefined {
		if ("!--" === tag) return "-->";
		if ("![CDATA[" === tag) return "]]>";
	}
	getAltTtextTagFromCloseSequence(tag: string): string | undefined {
		if ("-->" === tag) return "!--";
		if ("]]>" === tag) return "![CDATA[";
	}
	respectIndentation(): boolean {
		return true;
	}
	tagIsBannedEl(tag: string): boolean {
		return false;
	}
	tagIsVoidEl(tag: string): boolean {
		return false;
	}
	tagIsNamespaceEl(tag: string): boolean {
		return false;
	}
	tagIsPreservedTextEl(tag: string): boolean {
		return false;
	}
	tagIsInlineEl(tag: string): boolean {
		return false;
	}
}

function isAtributeless(tag: string): boolean {
	return "!--" === tag;
}

function getCloseSequenceFromAltTextTag(tag: string): string | undefined {
	if ("script" === tag) return "</script>";
	if ("style" === tag) return "</style>";
	if ("!--" === tag) return "--!";
}

function getAltTtextTagFromCloseSequence(tag: string): string | undefined {
	if ("</script>" === tag) return "script";
	if ("</style>" === tag) return "style";
	if ("-->" === tag) return "!--";
}

function isNameSpaceEl(tag: string): boolean {
	return "html" === tag || "svg" === tag || "math" === tag;
}

function isPreservedTextEl(tag: string): boolean {
	return "pre" === tag;
}
