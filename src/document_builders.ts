import type { BuilderInterface, Results } from "./component_string.js";
import type { Component } from "./components.js";
import type { RulesetInterface } from "./rulesets.js";
import type { Results as StepResults } from "./template_steps.js";

import { compose, composeTemplateArr } from "./template_steps.js";
import { ClientRules, ServerRules, XmlRules } from "./rulesets.js";
import { composeString } from "./component_string.js";

export { ClientHtml, Html, Xml };

class Builder implements BuilderInterface {
	// place to add cache for:
	// - templateStr
	// - templateArr

	build(ruleset: RulesetInterface, templateStr: string): StepResults {
		return compose(ruleset, templateStr);
	}

	buildTemplate(
		ruleset: RulesetInterface,
		templateArray: TemplateStringsArray,
	): StepResults {
		return composeTemplateArr(ruleset, templateArray);
	}
}

class Html {
	rules = new ServerRules();
	builder = new Builder();

	build(component: Component): Results {
		return composeString(this.builder, this.rules, component);
	}
}

class ClientHtml {
	rules = new ClientRules();
	builder = new Builder();

	build(component: Component): Results {
		return composeString(this.builder, this.rules, component);
	}
}

class Xml {
	rules = new XmlRules();
	builder = new Builder();

	build(component: Component): Results {
		return composeString(this.builder, this.rules, component);
	}
}
