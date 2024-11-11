let glyphGraph = new Map([
    ["Attr", getKindFromAttribute],
    ["AttrMapInjection", getKindFromInjection],
    ["AttrQuote", getKindFromAttributeQuote],
    ["AttrQuoteClosed", getKindFromAttributeQuoteClosed],
    ["AttrSetter", getKindFromAttributeSetter],
    ["AttrValue", getKindFromAttributeQuote],
    ["AttrValueUnquoted", getKindFromAttributeValueUnquoted],
    ["DescendantInjection", getKindFromInjection],
    ["Element", getKindFromElement],
    ["ElementSpace", getKindFromElementSpace],
    ["EmptyElement", getKindFromEmptyElement],
    ["InjectionSpace", getKindFromInjection],
    ["Tag", getKindFromTag],
    ["TailElementSolidus", getKindFromTailElementSolidus],
    ["TailElementSpace", getKindFromTailElementSpace],
    ["TailTag", getKindFromTailTag],
]);
function route(glyph, prevKind) {
    let router = glyphGraph.get(prevKind) ?? getKindFromInitial;
    return router(glyph);
}
function isSpace(glyph) {
    return glyph.length !== glyph.trim().length;
}
function getKindFromAttribute(glyph) {
    if ("=" === glyph)
        return "AttrSetter";
    if (">" === glyph)
        return "ElementClosed";
    if ("/" === glyph)
        return "EmptyElement";
    if ("{" === glyph)
        return "AttrMapInjection";
    if (isSpace(glyph))
        return "ElementSpace";
    return "Attr";
}
function getKindFromInjection(glyph) {
    if ("}" === glyph)
        return "InjectionConfirmed";
    return "InjectionSpace";
}
function getKindFromAttributeQuote(glyph) {
    if ('"' === glyph)
        return "AttrQuoteClosed";
    return "AttrValue";
}
function getKindFromAttributeQuoteClosed(glyph) {
    if (">" === glyph)
        return "ElementClosed";
    if ("/" === glyph)
        return "EmptyElement";
    return "ElementSpace";
}
function getKindFromAttributeSetter(glyph) {
    if ('"' === glyph)
        return "AttrQuote";
    if (isSpace(glyph))
        return "AttrSetter";
    return "AttrValueUnquoted";
}
function getKindFromAttributeValueUnquoted(glyph) {
    if (">" === glyph)
        return "ElementClosed";
    if (isSpace(glyph))
        return "ElementSpace";
    return "AttrValueUnquoted";
}
function getKindFromElement(glyph) {
    if ("/" === glyph)
        return "TailElementSolidus";
    if (">" === glyph)
        return "Fragment";
    if (isSpace(glyph))
        return "Element";
    return "Tag";
}
function getKindFromElementSpace(glyph) {
    if (">" === glyph)
        return "ElementClosed";
    if ("/" === glyph)
        return "EmptyElement";
    if ("{" === glyph)
        return "AttrMapInjection";
    if (isSpace(glyph))
        return "ElementSpace";
    return "Attr";
}
function getKindFromEmptyElement(glyph) {
    if (">" === glyph)
        return "EmptyElementClosed";
    return "EmptyElement";
}
function getKindFromTag(glyph) {
    if (">" === glyph)
        return "ElementClosed";
    if ("/" === glyph)
        return "EmptyElement";
    if (isSpace(glyph))
        return "ElementSpace";
    return "Tag";
}
function getKindFromTailElementSolidus(glyph) {
    if (">" === glyph)
        return "FragmentClosed";
    if (isSpace(glyph))
        return "TailElementSolidus";
    return "TailTag";
}
function getKindFromTailElementSpace(glyph) {
    if (">" === glyph)
        return "TailElementClosed";
    return "TailElementSpace";
}
function getKindFromTailTag(glyph) {
    if (">" === glyph)
        return "TailElementClosed";
    if (isSpace(glyph))
        return "TailElementSpace";
    return "TailTag";
}
function getKindFromInitial(glyph) {
    if ("<" === glyph)
        return "Element";
    if ("{" === glyph)
        return "DescendantInjection";
    return "Text";
}
export { route };
