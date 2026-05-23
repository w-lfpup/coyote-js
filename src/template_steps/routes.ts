export type StepKind =
	| "Attr"
	| "AttrMapInjection"
	| "AttrSetter"
	| "AttrValueDoubleQuoteClosed"
	| "AttrValueDoubleQuoted"
	| "AttrValueDoubleQuoteOpened"
	| "AttrValueSingleQuoteClosed"
	| "AttrValueSingleQuoted"
	| "AttrValueSingleQuoteOpened"
	| "AttrValueUnquoted"
	| "BreakingSpace"
	| "DescendantInjection"
	| "Fragment"
	| "FragmentClosed"
	| "Initial"
	| "InjectionConfirmed"
	| "InjectionSpace"
	| "NonBreakingSpace"
	| "Tag"
	| "TagBreakingSpace"
	| "TagClosed"
	| "TagClosedEmpty"
	| "TagNonBreakingSpace"
	| "TagOpened"
	| "TagSolidus"
	| "TailTag"
	| "TailTagClosed"
	| "TailTagSolidus"
	| "TailTagSpace"
	| "Text"
	| "TextAlt";

type Router = (glyph: string) => StepKind;

let glyphGraph = new Map<StepKind, Router>([
	["Attr", getKindFromAttribute],
	["AttrMapInjection", getKindFromInjection],
	["AttrSetter", getKindFromAttributeSetter],
	["AttrValueDoubleQuoteClosed", getKindFromAttributeQuoteClosed],
	["AttrValueDoubleQuoted", getKindFromAttributeDoubleQuoted],
	["AttrValueDoubleQuoteOpened", getKindFromAttributeDoubleQuoted],
	["AttrValueSingleQuoteClosed", getKindFromAttributeSingleQuoted],
	["AttrValueSingleQuoted", getKindFromAttributeSingleQuoted],
	["AttrValueSingleQuoteOpened", getKindFromAttributeSingleQuoted],
	["AttrValueUnquoted", getKindFromAttributeValueUnquoted],
	["DescendantInjection", getKindFromInjection],
	["InjectionSpace", getKindFromInjection],
	["Tag", getKindFromTag],
	["TagBreakingSpace", getKindFromElementSpace],
	["TagNonBreakingSpace", getKindFromElementSpace],
	["TagOpened", getKindFromElement],
	["TagSolidus", getKindFromEmptyElement],
	["TailTag", getKindFromTailTag],
	["TailTagSolidus", getKindFromTailTagSolidus],
	["TailTagSpace", getKindFromTailTagSpace],
]);

export function route(glyph: string, prevKind: StepKind) {
	let glyphRoute = glyphGraph.get(prevKind) ?? getKindFromText;
	return glyphRoute(glyph);
}

function isSpace(glyph: string) {
	return glyph.length !== glyph.trim().length;
}

function getKindFromAttribute(glyph: string): StepKind {
	if ("=" === glyph) return "AttrSetter";
	if ("{" === glyph) return "AttrMapInjection";
	if ("\n" === glyph) return "TagBreakingSpace";
	if (">" === glyph) return "TagClosed";
	if ("/" === glyph) return "TagSolidus";

	if (isSpace(glyph)) return "TagNonBreakingSpace";

	return "Attr";
}

function getKindFromInjection(glyph: string): StepKind {
	if ("}" === glyph) return "InjectionConfirmed";

	return "InjectionSpace";
}

function getKindFromAttributeSetter(glyph: string): StepKind {
	if ("'" === glyph) return "AttrValueSingleQuoteOpened";
	if ('"' === glyph) return "AttrValueDoubleQuoteOpened";
	if (isSpace(glyph)) return "AttrSetter";

	return "AttrValueUnquoted";
}

function getKindFromAttributeQuoteClosed(glyph: string): StepKind {
	if ("\n" === glyph) return "TagBreakingSpace";
	if (">" === glyph) return "TagClosed";
	if ("/" === glyph) return "TagSolidus";
	if (isSpace(glyph)) return "TagNonBreakingSpace";

	return "Attr";
}

function getKindFromAttributeDoubleQuoted(glyph: string): StepKind {
	if ('"' === glyph) return "AttrValueDoubleQuoteClosed";

	return "AttrValueDoubleQuoted";
}

function getKindFromAttributeSingleQuoted(glyph: string): StepKind {
	if ("'" === glyph) return "AttrValueSingleQuoteClosed";

	return "AttrValueSingleQuoted";
}

function getKindFromAttributeValueUnquoted(glyph: string): StepKind {
	if (">" === glyph) return "TagClosed";
	if ("\n" === glyph) return "TagBreakingSpace";

	if (isSpace(glyph)) return "TagNonBreakingSpace";

	return "AttrValueUnquoted";
}

function getKindFromTag(glyph: string): StepKind {
	if (">" === glyph) return "TagClosed";
	if ("/" === glyph) return "TagSolidus";
	if ("\n" === glyph) return "TagBreakingSpace";

	if (isSpace(glyph)) return "TagNonBreakingSpace";

	return "Tag";
}

function getKindFromElementSpace(glyph: string): StepKind {
	if (">" === glyph) return "TagClosed";
	if ("/" === glyph) return "TagSolidus";
	if ("{" === glyph) return "AttrMapInjection";
	if ("\n" === glyph) return "TagBreakingSpace";

	if (isSpace(glyph)) return "TagNonBreakingSpace";

	return "Attr";
}

function getKindFromElement(glyph: string): StepKind {
	if (">" === glyph) return "Fragment";
	if ("/" === glyph) return "TailTagSolidus";
	if ("{" === glyph) return "AttrMapInjection";
	if ("\n" === glyph) return "TagBreakingSpace";

	if (isSpace(glyph)) return "TagNonBreakingSpace";

	return "Tag";
}

function getKindFromEmptyElement(glyph: string): StepKind {
	if (">" === glyph) return "TagClosedEmpty";

	return "TagSolidus";
}

function getKindFromTailTag(glyph: string): StepKind {
	if (">" === glyph) return "TailTagClosed";

	if (isSpace(glyph)) return "TailTagSpace";

	return "TailTag";
}

function getKindFromTailTagSolidus(glyph: string): StepKind {
	if (">" === glyph) return "FragmentClosed";

	if (isSpace(glyph)) return "TailTagSolidus";

	return "TailTag";
}

function getKindFromTailTagSpace(glyph: string): StepKind {
	if (">" === glyph) return "TailTagClosed";

	return "TailTagSpace";
}

function getKindFromText(glyph: string): StepKind {
	if ("<" === glyph) return "TagOpened";
	if ("{" === glyph) return "DescendantInjection";
	if ("\n" === glyph) return "BreakingSpace";

	if (isSpace(glyph)) return "NonBreakingSpace";

	return "Text";
}
