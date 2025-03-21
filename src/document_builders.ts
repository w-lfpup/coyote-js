import type { Results } from "./component_string.js";
import type { Component } from "./components.js";

import { ClientRules, ServerRules, XmlRules } from "./rulesets.js";
import { composeString } from "./component_string.js";

import { Builder } from "./template_builders.js";

export { ClientHtml, Html, Xml };

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
