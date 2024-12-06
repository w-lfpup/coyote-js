import {
	BuilderInterface,
	compose as buildComponent,
} from "../../component_string/dist/mod.js";
import { Component } from "../../coyote/dist/mod.js";
import {
	compose,
	composeTemplateArr,
	Results,
} from "../../template_str/dist/mod.js";
import { RulesetInterface } from "./mod.js";
import { compose as prettyHtml } from "../../html/dist/mod.js";

class Builder implements BuilderInterface {
	// place to add cache for:
	// - templateStr
	// - templateArr

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

class Html {
	builder: BuilderInterface;

	constructor(builder: BuilderInterface) {
		this.builder = builder;
	}

	build(ruleset: RulesetInterface, component: Component): string {
		let templateStr = buildComponent(this.builder, ruleset, component);
		return prettyHtml(ruleset, templateStr);
	}
}

export type { RulesetInterface } from "../../rulesets/dist/mod.ts";

export { compose as prettyHtml } from "../../html/dist/mod.js";
export { ClientRules, ServerRules } from "../../rulesets/dist/mod.js";

export { Builder };
