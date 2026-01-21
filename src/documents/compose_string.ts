import type { Component } from "../components.ts";
import type { RulesetInterface } from "../template_steps/rulesets.ts";
import type { TemplateStepsInterface } from "../template_steps/template_steps.ts";
import type { BuilderInterface } from "./template_builders.ts";

import {
	TmplComponent,
	TaggedTmplComponent,
	AttrComponent,
	AttrValComponent,
} from "../components.js";

import { getTagInfoRoot, type TagInfoInterface } from "./tag_info.js";
import { composeSteps, pushFormattedSpace } from "./compose_steps.js";
import { pushMultilineAttribtue, pushTextComponent } from "./text_component.js";

class TemplateBit {
	component: TaggedTmplComponent | TmplComponent;
	template: TemplateStepsInterface;

	//
	stackDepth: number;
	injIndex = 0;

	constructor(
		component: TaggedTmplComponent | TmplComponent,
		results: TemplateStepsInterface,
		stackDepth: number,
	) {
		this.component = component;
		this.template = results;
		this.stackDepth = stackDepth;
	}
}

type StackBit = Component | TemplateBit;

export type Results = [string, Error?];

let forbiddenAttrGlyphs = new Set(["<", "=", '"', "'", "/", ">", "{"]);

export function composeString(
	builder: BuilderInterface,
	rules: RulesetInterface,
	component: Component,
): Results {
	let results: string[] = [];

	let tagInfoStack: TagInfoInterface[] = [getTagInfoRoot(rules)];
	let componentStack = [
		getStackBitFromComponent(tagInfoStack, builder, rules, component),
	];

	while (componentStack.length) {
		const cmpntBit = componentStack.pop();

		if (typeof cmpntBit === "string") {
			let escaped = removeTemplateGlyphs(cmpntBit);
			pushTextComponentInjection(results, tagInfoStack, escaped);
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
				if (cmpntBit.component instanceof TaggedTmplComponent) {
					templateStr = cmpntBit.component.templateArr[index];
				}
				if (templateStr) {
					composeSteps(
						rules,
						results,
						tagInfoStack,
						templateStr,
						chunk,
					);
				}
			} else {
				// end of the template, check for balance
				if (cmpntBit.stackDepth !== tagInfoStack.length) {
					return [
						results.join(""),
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
					addAttrInj(tagInfoStack, results, rules, injection);
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
	stack: TagInfoInterface[],
	builder: BuilderInterface,
	rules: RulesetInterface,
	component: Component,
): StackBit {
	if (typeof component === "string" || Array.isArray(component))
		return component;

	if (component instanceof TmplComponent) {
		let templateSteps = builder.compose(rules, component.templateStr);
		return new TemplateBit(component, templateSteps, stack.length);
	}

	if (component instanceof TaggedTmplComponent) {
		let templateSteps = builder.composeTemplateStringsArray(
			rules,
			component.templateArr,
		);
		return new TemplateBit(component, templateSteps, stack.length);
	}
}

function addAttrInj(
	stack: TagInfoInterface[],
	results: string[],
	rules: RulesetInterface,
	component: Component,
): Error | undefined {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	if (tagInfo.bannedPath) return;

	if (component instanceof AttrComponent) {
		let err = pushAttrComponent(results, rules, tagInfo, component.attr);
		if (err) return err;
	}

	if (component instanceof AttrValComponent) {
		let { attr, value } = component;
		let err = pushAttrValueComponent(results, rules, tagInfo, attr, value);
		if (err) return err;
	}

	if (Array.isArray(component)) {
		for (const cmpnt of component) {
			if (cmpnt instanceof AttrComponent) {
				let err = pushAttrComponent(
					results,
					rules,
					tagInfo,
					cmpnt.attr,
				);
				if (err) return err;
			}

			if (cmpnt instanceof AttrValComponent) {
				let { attr, value } = cmpnt;
				let err = pushAttrValueComponent(
					results,
					rules,
					tagInfo,
					attr,
					value,
				);
				if (err) return err;
			}
		}
	}

	tagInfo.textFormat = "Text";
}

function removeTemplateGlyphs(text: string): string {
	return text.replaceAll("<", "&lt;").replaceAll("{", "&123;");
}

function pushAttrComponent(
	results: string[],
	rules: RulesetInterface,
	tagInfo: TagInfoInterface,
	attr: string,
) {
	if (rules.attrIsBanned(attr)) return;
	let err = attrIsValid(attr);
	if (err) return err;

	pushFormattedSpace(results, tagInfo);
	results.push(attr);
}

function pushAttrValueComponent(
	results: string[],
	rules: RulesetInterface,
	tagInfo: TagInfoInterface,
	attr: string,
	val: string,
): Error | undefined {
	if (rules.attrIsBanned(attr)) return;
	let err = attrIsValid(attr);
	if (err) return err;

	pushFormattedSpace(results, tagInfo);
	results.push(attr);
	results.push('="');
	let escaped = val.replace('"', "&quot;").replace("'", "&apos");
	pushMultilineAttribtue(results, rules, escaped, tagInfo);
}

function attrIsValid(attr: string): Error | undefined {
	for (let index = 0; index < attr.length; index++) {
		let glyph = attr[index];
		if (forbiddenAttrGlyphs.has(glyph))
			return new Error(`InvalidAttribute: ${attr}`);
	}
}

function pushTextComponentInjection(
	results: string[],
	stack: TagInfoInterface[],
	text: string,
) {
	let tagInfo = stack[stack.length - 1];
	if (!tagInfo) return;

	pushTextComponent(results, text, tagInfo);

	tagInfo.textFormat = "Text";
}
