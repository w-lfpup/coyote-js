import type { BuilderInterface } from "./component_string.js";
import type { Component } from "./components.js";
import type { RulesetInterface } from "./rulesets.js";
import type { Results } from "./template_steps.js";

import { compose, composeTemplateArr } from "./template_steps.js";
import { ClientRules, ServerRules, XmlRules } from "./rulesets.js";
import { composeString } from "./component_string.js";

class Builder implements BuilderInterface {
	// place to add cache for:
	// - templateStr
	// - templateArr

	build(ruleset: RulesetInterface, templateStr: string): Results {
		return compose(ruleset, templateStr);
	}

	buildTemplate(
		ruleset: RulesetInterface,
		templateArray: TemplateStringsArray,
	): Results {
		return composeTemplateArr(ruleset, templateArray);
	}
}

// return [string, Error | undefined];
class Html {
	// rules
	rules = new ServerRules();
	builder = new Builder();

	build(component: Component): string {
		return composeString(this.builder, this.rules, component);
	}
}

class ClientHtml {
	// rules
	rules = new ClientRules();
	builder = new Builder();

	build(component: Component): string {
		return composeString(this.builder, this.rules, component);
	}
}

class Xml {
	// rules
	rules = new XmlRules();
	builder = new Builder();

	build(component: Component): string {
		return composeString(this.builder, this.rules, component);
	}
}

export { ClientHtml, Html, Xml };
