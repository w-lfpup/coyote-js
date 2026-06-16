import type { Results } from "../documents/compose_string.js";
import type { Component } from "../components.js";
import type { RulesetInterface } from "../template_steps/rulesets.js";

import { composeString } from "../documents/compose_string.js";
import { HtmlRules } from "./html.js";
import { Builder } from "./template_builder.js";

export class Coyote {
	#rules: RulesetInterface = new HtmlRules();
	#builder = new Builder();

	constructor(ruleset: RulesetInterface = new HtmlRules()) {
		this.#rules = ruleset;
	}

	render(component: Component): Results {
		return composeString(this.#builder, this.#rules, component);
	}
}
