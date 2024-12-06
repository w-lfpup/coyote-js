import type { RulesetInterface } from "../../rulesets/dist/mod.ts";
declare const spaceCharCodes: Set<number>;
declare function compose(sieve: RulesetInterface, templateStr: string): string;
export { compose, spaceCharCodes };
