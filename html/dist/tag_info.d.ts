import type { RulesetInterface } from "../../rulesets/dist/mod.ts";
type DescendantStatus = "Text" | "Element" | "ElementClosed" | "InlineElement" | "InlineElementClosed" | "Initial";
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
declare class TagInfo implements TagInfoInterface {
    namespace: string;
    tag: string;
    mostRecentDescendant: DescendantStatus;
    indentCount: number;
    voidEl: boolean;
    inlineEl: boolean;
    preservedTextPath: boolean;
    bannedPath: boolean;
    constructor(sieve: RulesetInterface, tag: string);
}
declare function from(sieve: RulesetInterface, prevTagInfo: TagInfoInterface, tag: string): TagInfoInterface;
export type { TagInfoInterface, DescendantStatus };
export { TagInfo, from };
