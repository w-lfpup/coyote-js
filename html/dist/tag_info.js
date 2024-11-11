class TagInfo {
    namespace;
    tag;
    mostRecentDescendant;
    indentCount = 0;
    voidEl;
    inlineEl;
    preservedTextPath;
    bannedPath;
    constructor(sieve, tag) {
        this.namespace = sieve.isNamespaceEl(tag) ? tag : "html";
        this.tag = tag;
        this.mostRecentDescendant = "Initial";
        this.indentCount = 0;
        this.voidEl = sieve.isVoidEl(tag);
        this.inlineEl = sieve.isInlineEl(tag);
        // is preserved text element?
        this.preservedTextPath = false;
        this.bannedPath = sieve.isBannedEl(tag);
    }
}
function from(sieve, prevTagInfo, tag) {
    let tagInfo = new TagInfo(sieve, tag);
    tagInfo.indentCount = prevTagInfo.indentCount;
    if (sieve.isNamespaceEl(tag)) {
        tagInfo.namespace = tag;
    }
    if (sieve.isPreservedTextEl(prevTagInfo.tag)) {
        tagInfo.preservedTextPath = true;
    }
    if (sieve.isBannedEl(tag)) {
        tagInfo.bannedPath = true;
    }
    if (!sieve.isVoidEl(prevTagInfo.tag) && !sieve.isInlineEl(tag)) {
        tagInfo.indentCount += 1;
    }
    return tagInfo;
}
export { TagInfo, from };
