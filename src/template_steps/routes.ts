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
	// ["AttrValueDoubleQuoted", getKindFromAttributeQuote],
	// // ["AttrValueDoubleQuote", getKindFromAttributeQuote],
	// ["AttrValueUnquoted", getKindFromAttributeValueUnquoted],
	// ["DescendantInjection", getKindFromInjection],
	// ["Tag", getKindFromElement],
	// ["TagLineSpace", getKindFromElementSpace],
	// ["TagSpace", getKindFromElementSpace],
	// ["EmptyElement", getKindFromEmptyElement],
	// ["InjectionSpace", getKindFromInjection],
	// ["Tag", getKindFromTag],
	// ["TailElementSolidus", getKindFromTailElementSolidus],
	// ["TailElementSpace", getKindFromTailElementSpace],
	// ["TailTag", getKindFromTailTag],
]);

export function route(glyph: string, prevKind: StepKind) {
	let glyphRoute = glyphGraph.get(prevKind) ?? getKindFromText;
	return glyphRoute(glyph);
}

function isSpace(glyph: string) {
	return glyph.length !== glyph.trim().length;
}

function getKindFromText(glyph: string): StepKind {
	if ("<" === glyph) return "TagOpened";
	if ("{" === glyph) return "DescendantInjection";
	if ("\n" === glyph) return "BreakingSpace";

	if (isSpace(glyph)) return "NonBreakingSpace";

	return "Text";
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

function getKindFromAttribute(glyph: string): StepKind {
	if ("=" === glyph) return "AttrSetter";
	if (">" === glyph) return "ElementClosed";
	if ("/" === glyph) return "EmptyElement";
	if ("{" === glyph) return "AttrMapInjection";

	if (isSpace(glyph)) return "ElementSpace";

	return "Attr";
}

function getKindFromAttributeQuote(glyph: string): StepKind {
	if ('"' === glyph) return "AttrValueQuoteClosed";

	return "AttrValue";
}

function getKindFromAttributeValueUnquoted(glyph: string): StepKind {
	if (">" === glyph) return "ElementClosed";

	if (isSpace(glyph)) return "ElementSpace";

	return "AttrValueUnquoted";
}

function getKindFromElement(glyph: string): StepKind {
	if ("/" === glyph) return "TailElementSolidus";
	if (">" === glyph) return "Fragment";

	if (isSpace(glyph)) return "Element";

	return "Tag";
}

function getKindFromElementSpace(glyph: string): StepKind {
	if (">" === glyph) return "ElementClosed";
	if ("/" === glyph) return "EmptyElement";
	if ("{" === glyph) return "AttrMapInjection";

	if (isSpace(glyph)) return "ElementSpace";

	return "Attr";
}

function getKindFromEmptyElement(glyph: string): StepKind {
	if (">" === glyph) return "EmptyElementClosed";

	return "EmptyElement";
}

function getKindFromTag(glyph: string): StepKind {
	if (">" === glyph) return "ElementClosed";
	if ("/" === glyph) return "EmptyElement";

	if (isSpace(glyph)) return "ElementSpace";

	return "Tag";
}

function getKindFromTailElementSolidus(glyph: string): StepKind {
	if (">" === glyph) return "FragmentClosed";

	if (isSpace(glyph)) return "TailElementSolidus";

	return "TailTag";
}

function getKindFromTailElementSpace(glyph: string): StepKind {
	if (">" === glyph) return "TailElementClosed";

	return "TailElementSpace";
}

function getKindFromTailTag(glyph: string): StepKind {
	if (">" === glyph) return "TailElementClosed";

	if (isSpace(glyph)) return "TailElementSpace";

	return "TailTag";
}
