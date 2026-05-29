export interface DocumentParams {
	cacheMemoryLimit: number;
	documentMemoryLimit: number;
	embeddedContent: string;
	respectIndentation: boolean;
}

export const bannedElements = new Set([
	"acronym",
	"big",
	"center",
	"content",
	"dir",
	"font",
	"frame",
	"frameset",
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

export const inlineElements = new Set([
	"a",
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

export function isEmbeddedContentEl(tag: string): boolean {
	return "html" === tag || "svg" === tag || "math" === tag;
}

export function isPreformattedTextEl(tag: string): boolean {
	return "pre" === tag;
}
