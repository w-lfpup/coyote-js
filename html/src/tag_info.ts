import type { SieveInterface } from "../../sieve/dist/mod.ts";

type DescendantStatus =
  | "Text"
  | "Element"
  | "ElementClosed"
  | "InlineElement"
  | "InlineElementClosed"
  | "Initial";

interface TagInfoInterface {
  namespace: string;
  tag: string;
  mostRecentDescendant: DescendantStatus;
  indentCount: number;
  voidEl: boolean;
  inlineEl: boolean;
  preservedTextPath: boolean;
  bannedPath: boolean;
}

class TagInfo implements TagInfoInterface {
  namespace: string;
  tag: string;
  mostRecentDescendant: DescendantStatus;
  indentCount = 0;
  voidEl: boolean;
  inlineEl: boolean;
  preservedTextPath: boolean;
  bannedPath: boolean;

  constructor(sieve: SieveInterface, tag: string) {
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

function from(
  sieve: SieveInterface,
  prevTagInfo: TagInfoInterface,
  tag: string,
): TagInfoInterface {
  let tagInfo = new TagInfo(sieve, tag);

  if (sieve.isNamespaceEl(tag)) {
    tagInfo.namespace = tag;
  }

  if (sieve.isPreservedTextEl(prevTagInfo.tag)) {
    tagInfo.preservedTextPath = true;
  }

  if (sieve.isBannedEl(tag)) {
    tagInfo.bannedPath = true;
  }

  if (sieve.isVoidEl(prevTagInfo.tag) && !sieve.isInlineEl(tag)) {
    tagInfo.indentCount += 1;
  }

  return tagInfo;
}

export type { TagInfoInterface, DescendantStatus };
export { TagInfo, from };
