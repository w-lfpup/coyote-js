import type { StepInterface, StepKind } from "../../parse_str/dist/mod.ts";
import type { RulesetInterface } from "../../rulesets/dist/mod.ts";

import { Results as ParseResults } from "../../parse_str/dist/mod.js";

interface BuilderInterface {
	build(ruleset: RulesetInterface, templateStr): ParseResults;
}

class TemplateBit {
	injIndex = 0;
}

class StackBit {}
class TmplStackBit extends StackBit {}
class CmpntStackBit extends StackBit {}

type StackBit = Component | TmplComponent | undefined;

function compose(ruleset: RulesetInterface, templateStr: string): string {
	let results = [];

	return results.join("");
}

export { compose };
