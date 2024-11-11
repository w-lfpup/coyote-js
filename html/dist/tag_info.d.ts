import type { SieveInterface } from "../../sieve/dist/mod.ts";
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
    constructor(sieve: SieveInterface, tag: string);
}
declare function from(sieve: SieveInterface, prevTagInfo: TagInfoInterface, tag: string): TagInfoInterface;
export type { TagInfoInterface, DescendantStatus };
export { TagInfo, from };
