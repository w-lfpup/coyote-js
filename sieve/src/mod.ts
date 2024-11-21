interface SieveInterface {
	// parse
	isComment(tag: string): boolean;
	getCloseSequenceFromAltTextTag(tag: string): string | undefined;
	getTagFromCloseSequence(close_sequence: string): string | undefined;
	// html
	respectIndentation(): boolean;
	isBannedEl(tag: string): boolean;
	isVoidEl(tag: string): boolean;
	isNamespaceEl(tag: string): boolean;
	isPreservedTextEl(tag: string): boolean;
	isInlineEl(tag: string): boolean;
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
	"!--",
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

class Sieve implements SieveInterface {
	// parse
	isComment(tag: string): boolean {
		return isComment(tag);
	}
	getCloseSequenceFromAltTextTag(tag: string): string {
		return getCloseSequenceFromAltTextTag(tag);
	}
	getTagFromCloseSequence(tag: string): string {
		return getTagFromCloseSequence(tag);
	}
	// html
	respectIndentation(): boolean {
		return true;
	}
	isBannedEl(tag: string): boolean {
		return bannedElements.has(tag);
	}
	isVoidEl(tag: string): boolean {
		return voidElements.has(tag);
	}
	isNamespaceEl(tag: string): boolean {
		return isNameSpaceEl(tag);
	}
	isPreservedTextEl(tag: string): boolean {
		return isPreservedTextEl(tag);
	}
	isInlineEl(tag: string): boolean {
		return inlineElements.has(tag);
	}
}

class ClientSieve implements SieveInterface {
	// parse
	isComment(tag: string): boolean {
		return isComment(tag);
	}
	getCloseSequenceFromAltTextTag(tag: string): string {
		return getCloseSequenceFromAltTextTag(tag);
	}
	getTagFromCloseSequence(tag: string): string {
		return getTagFromCloseSequence(tag);
	}
	// html
	respectIndentation(): boolean {
		return false;
	}
	isBannedEl(tag: string): boolean {
		return (
			"script" === tag ||
			"style" === tag ||
			"!--" === tag ||
			bannedElements.has(tag)
		);
	}
	isVoidEl(tag: string): boolean {
		return voidElements.has(tag);
	}
	isNamespaceEl(tag: string): boolean {
		return isNameSpaceEl(tag);
	}
	isPreservedTextEl(tag: string): boolean {
		return isPreservedTextEl(tag);
	}
	isInlineEl(tag: string): boolean {
		if ("a" === tag) return true;

		return inlineElements.has(tag);
	}
}

function isComment(tag: string): boolean {
	return "!--" === tag;
}

function getCloseSequenceFromAltTextTag(tag: string): string | undefined {
	if ("script" === tag) return "</script>";
	if ("style" === tag) return "</style>";
	if ("!--" === tag) return "--!";
}

function getTagFromCloseSequence(tag: string): string | undefined {
	if ("</script" === tag) return "script";
	if ("</style>" === tag) return "style";
	if ("-->" === tag) return "!--";
}

function isNameSpaceEl(tag: string): boolean {
	return "html" === tag || "svg" === tag || "math" === tag;
}

function isPreservedTextEl(tag: string): boolean {
	return "pre" === tag;
}

export type { SieveInterface };

export { Sieve, ClientSieve };
