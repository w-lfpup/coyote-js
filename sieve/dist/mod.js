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
class Sieve {
    // parse
    isComment(tag) {
        return isComment(tag);
    }
    getCloseSequenceFromAltTextTag(tag) {
        return getCloseSequenceFromAltTextTag(tag);
    }
    getTagFromCloseSequence(tag) {
        return getTagFromCloseSequence(tag);
    }
    // html
    respectIndentation() {
        return true;
    }
    isBannedEl(tag) {
        return bannedElements.has(tag);
    }
    isVoidEl(tag) {
        return voidElements.has(tag);
    }
    isNamespaceEl(tag) {
        return isNameSpaceEl(tag);
    }
    isPreservedTextEl(tag) {
        return isPreservedTextEl(tag);
    }
    isInlineEl(tag) {
        return inlineElements.has(tag);
    }
}
class ClientSieve {
    // parse
    isComment(tag) {
        return isComment(tag);
    }
    getCloseSequenceFromAltTextTag(tag) {
        return getCloseSequenceFromAltTextTag(tag);
    }
    getTagFromCloseSequence(tag) {
        return getTagFromCloseSequence(tag);
    }
    // html
    respectIndentation() {
        return false;
    }
    isBannedEl(tag) {
        return ("script" === tag ||
            "style" === tag ||
            "!--" === tag ||
            bannedElements.has(tag));
    }
    isVoidEl(tag) {
        return voidElements.has(tag);
    }
    isNamespaceEl(tag) {
        return isNameSpaceEl(tag);
    }
    isPreservedTextEl(tag) {
        return isPreservedTextEl(tag);
    }
    isInlineEl(tag) {
        if ("a" === tag)
            return true;
        return inlineElements.has(tag);
    }
}
function isComment(tag) {
    return "!--" === tag;
}
function getCloseSequenceFromAltTextTag(tag) {
    if ("script" === tag)
        return "</script>";
    if ("style" === tag)
        return "</style>";
    if ("!--" === tag)
        return "--!";
}
function getTagFromCloseSequence(tag) {
    if ("</script" === tag)
        return "script";
    if ("</style>" === tag)
        return "style";
    if ("-->" === tag)
        return "!--";
}
function isNameSpaceEl(tag) {
    return "html" === tag || "svg" === tag || "math" === tag;
}
function isPreservedTextEl(tag) {
    return "pre" === tag;
}
export { Sieve, ClientSieve };
