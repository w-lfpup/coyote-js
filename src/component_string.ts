import type { Component } from "./components.js";
import type { RulesetInterface } from "./rulesets.ts";
import type { Results as TemplateResults } from "./template_steps.js";

import {
	TmplComponent,
	TaggedTmplComponent,
	AttrComponent,
	AttrValComponent,
} from "./components.js";
import { TagInfo } from "./tag_info.js";
import {
	composeSteps,
	pushTextComponent,
	pushAttrComponent,
	pushAttrValueComponent,
} from "./compose_steps.js";

export type { BuilderInterface, Results };
export { composeString };

interface BuilderInterface {
	build(rules: RulesetInterface, templateStr: string): TemplateResults;
	buildTemplate(
		rules: RulesetInterface,
		templateArray: TemplateStringsArray,
	): TemplateResults;
}

class TemplateBit {
	component: TaggedTmplComponent | TmplComponent;
	template: TemplateResults;

	//
	stackDepth: number;
	injIndex = 0;

	constructor(
		component: TaggedTmplComponent | TmplComponent,
		results: TemplateResults,
		stackDepth: number,
	) {
		this.component = component;
		this.template = results;
		this.stackDepth = stackDepth;
	}
}

type StackBit = Component | TemplateBit;

type Results = [string?, Error?];

function composeString(
	builder: BuilderInterface,
	rules: RulesetInterface,
	component: Component,
): Results {
	let results: string[] = [];

	let tagInfoStack: TagInfo[] = [new TagInfo(rules, ":root")];
	let componentStack = [
		getStackBitFromComponent(tagInfoStack, builder, rules, component),
	];

	while (componentStack.length) {
		const cmpntBit = componentStack.pop();

		if (typeof cmpntBit === "string") {
			pushTextComponent(results, tagInfoStack, rules, cmpntBit);
		}

		if (Array.isArray(cmpntBit)) {
			for (let index = cmpntBit.length - 1; -1 < index; index--) {
				let bit = getStackBitFromComponent(
					tagInfoStack,
					builder,
					rules,
					cmpntBit[index],
				);
				componentStack.push(bit);
			}
		}

		if (cmpntBit instanceof TemplateBit) {
			// increase index
			let index = cmpntBit.injIndex;
			cmpntBit.injIndex += 1;

			// add text chunk
			let chunk = cmpntBit.template.steps[index];
			if (chunk) {
				let templateStr: string;
				if (cmpntBit.component instanceof TmplComponent) {
					templateStr = cmpntBit.component.templateStr;
				}
				if (templateStr) {
					composeSteps(rules, results, tagInfoStack, templateStr, chunk);
				}
			} else {
				// end of the template, check for balance
				if (cmpntBit.stackDepth !== tagInfoStack.length) {
					return [
						undefined,
						new Error(`
Coyote Err: the following template component is imbalanced:
${chunk}`),
					];
				}
			}

			// handle injection
			let injKind = cmpntBit.template.injs[index];
			let injection = cmpntBit.component.injections[index];
			if (injKind && injection) {
				if ("AttrMapInjection" === injKind) {
					addAttrInj(tagInfoStack, results, injection);
				}

				if ("DescendantInjection" === injKind) {
					componentStack.push(cmpntBit);

					let bit = getStackBitFromComponent(
						tagInfoStack,
						builder,
						rules,
						injection,
					);

					componentStack.push(bit);

					continue;
				}
			}

			// tail case
			if (index < cmpntBit.template.steps.length) {
				componentStack.push(cmpntBit);
			}
		}
	}

	return [results.join(""), undefined];
}

function getStackBitFromComponent(
	stack: TagInfo[],
	builder: BuilderInterface,
	rules: RulesetInterface,
	component: Component,
): StackBit {
	if (typeof component === "string" || Array.isArray(component))
		return component;

	if (component instanceof TmplComponent) {
		let templateSteps = builder.build(rules, component.templateStr);
		return new TemplateBit(component, templateSteps, stack.length);
	}
}

function addAttrInj(stack: TagInfo[], results: string[], component: Component) {
	if (component instanceof AttrComponent)
		return pushAttrComponent(results, stack, component.attr);
	if (component instanceof AttrValComponent) {
		pushAttrComponent(results, stack, component.attr);
		return pushAttrValueComponent(results, stack, component.value);
	}

	if (Array.isArray(component)) {
		for (const cmpnt of component) {
			if (cmpnt instanceof AttrComponent)
				pushAttrComponent(results, stack, cmpnt.attr);
			if (cmpnt instanceof AttrValComponent) {
				pushAttrComponent(results, stack, cmpnt.attr);
				pushAttrValueComponent(results, stack, cmpnt.value);
			}
		}
	}
}
