import type { RulesetInterface } from "../../rulesets/dist/mod.ts";
type StepKind = "AttrQuoteClosed" | "AttrQuote" | "AttrMapInjection" | "AttrSetter" | "AttrValue" | "AttrValueUnquoted" | "Attr" | "TailElementClosed" | "TailElementSolidus" | "TailElementSpace" | "TailTag" | "DescendantInjection" | "FragmentClosed" | "Fragment" | "EmptyElementClosed" | "EmptyElement" | "Initial" | "InjectionConfirmed" | "InjectionSpace" | "ElementClosed" | "ElementSpace" | "Element" | "Tag" | "Text" | "AltText" | "AltTextCloseSequence" | "CommentText";
interface StepInterface {
    kind: StepKind;
    origin: number;
    target: number;
}
declare class Step implements StepInterface {
    kind: StepKind;
    origin: number;
    target: number;
    constructor(kind: StepKind, origin?: number, target?: number);
}
type Results = Step[];
declare function parseStr(sieve: RulesetInterface, templateStr: string, initialKind: StepKind): StepInterface[];
declare function getTextFromStep(templateStr: string, step: StepInterface): string;
declare function isInjectionKind(stepKind: StepKind): boolean;
export type { StepKind, StepInterface, Results };
export { parseStr, getTextFromStep, isInjectionKind };
