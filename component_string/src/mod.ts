import type { StepInterface, StepKind } from "../../parse_str/dist/mod.ts";
import type { RulesetInterface } from "../../rulesets/dist/mod.ts";
import type { Component } from "../../coyote/dist/mod.ts";

import {
	CoyoteComponent,
	TmplComponent,
	TaggedTmplComponent,
	AttrComponent,
	AttrValComponent,
} from "../../coyote/dist/mod.js";
import { Results as ParseResults } from "../../parse_str/dist/mod.js";

interface BuilderInterface {
	build(ruleset: RulesetInterface, templateStr): ParseResults;
}

class TemplateBit {
	injIndex = 0;
}

function compose(
	builder: BuilderInterface,
	ruleset: RulesetInterface,
	component: CoyoteComponent,
) {
	let results = [];

	let bit = getStackBitFromComponent(builder, ruleset, component);
	let stack = [bit];

	return results.join("");
}

function getStackBitFromComponent(
	builder: BuilderInterface,
	rules: RulesetInterface,
	component: CoyoteComponent,
): Component {
	if (typeof component === "string" || Array.isArray(component))
		return component;

	if (component instanceof TmplComponent) {
		// build template return tmplate_bit
	}

	if (component instanceof TaggedTmplComponent) {
		// build template return tmplate_bit
	}
}

function addAttrInj(results: string[], component: Component) {
	if (component instanceof AttrComponent)
		return addAttr(results, component.attr);
	if (component instanceof AttrValComponent)
		return addAttrVal(results, component.attr, component.value);

	if (Array.isArray(component)) {
		for (const cmpnt of component) {
			if (component instanceof AttrComponent)
				return addAttr(results, component.attr);
			if (component instanceof AttrValComponent)
				return addAttrVal(results, component.attr, component.value);
		}
	}
}

function addAttr(results: string[], attr: string) {
	results.push(" ");
	results.push(attr);
}

function addAttrVal(results: string[], attr: string, val: string) {
	results.push(" ");
	results.push(attr);
	results.push('="');
	results.push(val);
	results.push('"');
}

export { compose };
