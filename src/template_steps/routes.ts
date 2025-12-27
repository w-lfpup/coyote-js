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
	| "TextAlt"

type Router = (glyph: string) => StepKind;

let glyphGraph = new Map<StepKind, Router>([
	["Attr", getKindFromAttribute],
	["AttrMapInjection", getKindFromInjection],
	["AttrSetter", getKindFromAttributeSetter],
	["AttrValueDoubleQuoteOpened", getKindFromAttributeDoubleQuote],
	["AttrValueDoubleQuoteClosed", getKindFromAttributeQuoteClosed],
	["AttrValueDoubleQuoted", getKindFromAttributeDoubleQuote],
	["AttrValueSingleQuoteOpened", getKindFromAttributeSingleQuote],
	["AttrValueSingleQuoteClosed", getKindFromAttributeQuoteClosed],
	["AttrValueSingleQuoted", getKindFromAttributeSingleQuote],
	["AttrValueUnquoted", getKindFromAttributeValueUnquoted],
	["DescendantInjection", getKindFromInjection],
	["Element", getKindFromElement],
	["ElementLineSpace", getKindFromElementSpace],
	["ElementSpace", getKindFromElementSpace],
	["EmptyElement", getKindFromEmptyElement],
	["InjectionSpace", getKindFromInjection],
	["Tag", getKindFromTag],
	["TailElementSolidus", getKindFromTailElementSolidus],
	["TailElementSpace", getKindFromTailElementSpace],
	["TailTag", getKindFromTailTag],
]);

export function route(glyph: string, prevKind: StepKind) {
	let glyphRoute = glyphGraph.get(prevKind) ?? getKindFromInitial;
	return glyphRoute(glyph);
}

function isSpace(glyph: string) {
	return glyph.length !== glyph.trim().length;
}

function getKindFromInitial(glyph: string): StepKind {
	if ("<" === glyph) return "Element";
	if ("{" === glyph) return "DescendantInjection";

	return "Text";
}

function getKindFromAttribute(glyph: string): StepKind {
	if ("=" === glyph) return "AttrSetter";
	if (">" === glyph) return "ElementClosed";
	if ("/" === glyph) return "EmptyElement";
	if ("{" === glyph) return "AttrMapInjection";

	if (isSpace(glyph)) return "ElementSpace";

	return "Attr";
}

function getKindFromInjection(glyph: string): StepKind {
	if ("}" === glyph) return "InjectionConfirmed";

	return "InjectionSpace";
}

function getKindFromAttributeDoubleQuote(glyph: string): StepKind {
	if ('"' === glyph) return "AttrValueDoubleQuoteClosed";

	return "AttrValueDoubleQuoted";
}

function getKindFromAttributeSingleQuote(glyph: string): StepKind {
	if ("'" === glyph) return "AttrValueSingleQuoteClosed";

	return "AttrValueSingleQuoted";
}


function getKindFromAttributeQuoteClosed(glyph: string): StepKind {
	if (">" === glyph) return "ElementClosed";
	if ("/" === glyph) return "EmptyElement";

	return "ElementSpace";
}

function getKindFromAttributeSetter(glyph: string): StepKind {
	if ('"' === glyph) return "AttrValueDoubleQuoted";

	if (isSpace(glyph)) return "AttrSetter";

	return "AttrValueUnquoted";
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
