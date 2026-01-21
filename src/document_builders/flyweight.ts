export const bannedElements = new Set([
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

export const inlineElements = new Set([
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
]);

export const voidElements = new Set([
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

export function isAtributeless(tag: string): boolean {
	return "!--" === tag;
}

export function getCloseSequenceFromAltTextTag(
	tag: string,
): string | undefined {
	if ("!--" === tag) return "--";
	if ("script" === tag) return "</script";
	if ("style" === tag) return "</style";
}

export function getAltTextTagFromCloseSequence(
	tag: string,
): string | undefined {
	if ("--" === tag) return "!--";
	if ("</script" === tag) return "script";
	if ("</style" === tag) return "style";
}

export function isNameSpaceEl(tag: string): boolean {
	return "html" === tag || "svg" === tag || "math" === tag;
}

export function isPreservedTextEl(tag: string): boolean {
	return "pre" === tag;
}
