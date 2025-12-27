import type { BuilderInterface } from "./documents/component_string.js";
import type { RulesetInterface } from "./template_steps/rulesets.js";
import type { Results as StepResults } from "./template_steps.js";

// import { compose } from "./template_steps.js";
import { compose, composeTemplateArr } from "./template_steps.js";

export { Builder };

class Builder implements BuilderInterface {
	// place to add cache for:
	// - templateStr
	// - templateArr

	build(ruleset: RulesetInterface, templateStr: string): StepResults {
		return compose(ruleset, templateStr);
	}

	buildTemplateLiteral(
		ruleset: RulesetInterface,
		templateArray: TemplateStringsArray,
	): StepResults {
		return composeTemplateArr(ruleset, templateArray);
	}
}
