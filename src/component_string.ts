import type { Component } from "./components.js";
import type { RulesetInterface } from "./rulesets.ts";
import type { Results as TemplateSteps } from "./template_steps.js";

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
	build(rules: RulesetInterface, templateStr: string): TemplateSteps;
	buildTemplate(
		rules: RulesetInterface,
		templateArray: TemplateStringsArray,
	): TemplateSteps;
}

class TemplateBit {
	component: TaggedTmplComponent | TmplComponent;
	results: TemplateSteps;
	stackDepth: number;

	index = 0;

	constructor(
		component: TaggedTmplComponent | TmplComponent,
		results: TemplateSteps,
		stackDepth: number,
	) {
		this.component = component;
		this.results = results;
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
		// console.log("component stack: \n", componentStack);
		// console.log("componentStack:\n", componentStack);
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
				// componentStack.push(bit);
			}
		}

		if (cmpntBit instanceof TemplateBit) {
			// increase index
			let index = cmpntBit.index;
			cmpntBit.index += 1;

			// add text chunk
			let currChunk = cmpntBit.results.steps[index];
			if (currChunk) {
				let templateStr: string;
				if (component instanceof TmplComponent) {
					templateStr = component.templateStr;
				}
				if (templateStr) {
					composeSteps(rules, results, tagInfoStack, templateStr, currChunk);
				}
			} else {
				// end of the template, should be balanced
				console.log("finished a template!");
				console.log("index:", index);
				console.log("bit:", cmpntBit);
				console.log("tagInfoStack:", tagInfoStack);
				console.log("componentStack:", componentStack);
				console.log("results", results.join(""));
				if (cmpntBit.stackDepth !== tagInfoStack.length) {
					return [
						undefined,
						new Error(`
Coyote Err: the following template component is imbalanced:
${currChunk}`),
					];
				}
			}

			// handle injection
			let injKind = cmpntBit.results.injs[index];
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
			if (index < cmpntBit.results.steps.length) {
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
		let buildResults = builder.build(rules, component.templateStr);
		return new TemplateBit(component, buildResults, stack.length);
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
