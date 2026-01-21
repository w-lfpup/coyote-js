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

function isAtributeless(tag: string): boolean {
	return "!--" === tag;
}

function getCloseSequenceFromAltTextTag(tag: string): string | undefined {
	if ("!--" === tag) return "--";
	if ("script" === tag) return "</script";
	if ("style" === tag) return "</style";
}

function getAltTextTagFromCloseSequence(tag: string): string | undefined {
	if ("--" === tag) return "!--";
	if ("</script" === tag) return "script";
	if ("</style" === tag) return "style";
}

function isNameSpaceEl(tag: string): boolean {
	return "html" === tag || "svg" === tag || "math" === tag;
}

function isPreservedTextEl(tag: string): boolean {
	return "pre" === tag;
}
