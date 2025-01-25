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
import { ClientRules, ServerRules } from "../../rulesets/dist/mod.js";

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
	// rules
	rules = new ServerRules();
	builder: BuilderInterface;

	build(component: Component): string {
		let templateStr = buildComponent(this.builder, this.rules, component);
		return prettyHtml(this.rules, templateStr);
	}
}

class ClientHtml {
	// rules
	rules = new ClientRules();
	builder = new Builder();

	build(component: Component): string {
		let templateStr = buildComponent(this.builder, this.rules, component);
		return prettyHtml(this.rules, templateStr);
	}
}

export type { RulesetInterface } from "../../rulesets/dist/mod.ts";

export { compose as prettyHtml } from "../../html/dist/mod.js";
export { Html, ClientHtml };
