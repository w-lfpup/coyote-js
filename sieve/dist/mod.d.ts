interface SieveInterface {
    isComment(tag: string): boolean;
    getCloseSequenceFromAltTextTag(tag: string): string | undefined;
    getTagFromCloseSequence(close_sequence: string): string | undefined;
    respectIndentation(): boolean;
    isBannedEl(tag: string): boolean;
    isVoidEl(tag: string): boolean;
    isNamespaceEl(tag: string): boolean;
    isPreservedTextEl(tag: string): boolean;
    isInlineEl(tag: string): boolean;
}
declare class Sieve implements SieveInterface {
    isComment(tag: string): boolean;
    getCloseSequenceFromAltTextTag(tag: string): string;
    getTagFromCloseSequence(tag: string): string;
    respectIndentation(): boolean;
    isBannedEl(tag: string): boolean;
    isVoidEl(tag: string): boolean;
    isNamespaceEl(tag: string): boolean;
    isPreservedTextEl(tag: string): boolean;
    isInlineEl(tag: string): boolean;
}
declare class ClientSieve implements SieveInterface {
    isComment(tag: string): boolean;
    getCloseSequenceFromAltTextTag(tag: string): string;
    getTagFromCloseSequence(tag: string): string;
    respectIndentation(): boolean;
    isBannedEl(tag: string): boolean;
    isVoidEl(tag: string): boolean;
    isNamespaceEl(tag: string): boolean;
    isPreservedTextEl(tag: string): boolean;
    isInlineEl(tag: string): boolean;
}
export type { SieveInterface };
export { Sieve, ClientSieve };
