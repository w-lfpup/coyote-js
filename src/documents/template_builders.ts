import type { RulesetInterface } from "../template_steps/rulesets.js";
import type { TemplateStepsInterface } from "../template_steps/template_steps.js";

export interface BuilderInterface {
	compose(
		rules: RulesetInterface,
		templateStr: string,
	): TemplateStepsInterface;
	composeTemplateStringsArray(
		rules: RulesetInterface,
		templateArray: TemplateStringsArray,
	): TemplateStepsInterface;
}
