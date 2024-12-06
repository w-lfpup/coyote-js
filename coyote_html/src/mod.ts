import { BuilderInterface } from "../../component_string/dist/mod.js";
import {
	compose,
	composeTemplateArr,
	Results,
} from "../../template_str/dist/mod.js";
import { RulesetInterface } from "./mod.js";

class Builder implements BuilderInterface {
	buildStr(ruleset: RulesetInterface, templateStr: string): Results {
		return compose(ruleset, templateStr);
	}

	buildTemplateStrs(
		ruleset: RulesetInterface,
		templateArray: TemplateStringsArray,
	): Results {
		return composeTemplateArr(ruleset, templateArray);
	}
}

export type { RulesetInterface } from "../../rulesets/dist/mod.ts";

export { compose as prettyHtml } from "../../html/dist/mod.js";
export { ClientRules, ServerRules } from "../../rulesets/dist/mod.js";

export { Builder };
