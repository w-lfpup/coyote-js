import type { StepKind } from "./routes.ts";
import type { StepInterface } from "./parse_str.ts";
import type { RulesetInterface } from "./rulesets.ts";

import { parseStr } from "./parse_str.js";
import { route } from "./routes.js";

export interface TemplateStepsInterface {
	steps: StepInterface[][];
	injs: (StepKind | undefined)[];
}

export class TemplateSteps implements TemplateStepsInterface {
	steps: StepInterface[][] = [[]];
	injs: (StepKind | undefined)[] = [];
}

function isInjection(kind: StepKind): boolean {
	return "AttrMapInjection" === kind || "DescendantInjection" === kind;
}

export function compose(
	ruleset: RulesetInterface,
	templateStr: string,
): TemplateStepsInterface {
	let results = new TemplateSteps();

	for (let step of parseStr(ruleset, templateStr, "Initial")) {
		if (isInjection(step.kind)) {
			pushInjection(results, step.kind);
			continue;
		}

		pushStep(results, step);
	}

	return results;
}

export function composeTemplateArr(
	ruleset: RulesetInterface,
	templateStrArr: TemplateStringsArray,
): TemplateStepsInterface {
	let results = new TemplateSteps();

	let stepKind: StepKind = "Initial";

	// every one except for the last
	for (let [index, templateStr] of templateStrArr.entries()) {
		let steps = parseStr(ruleset, templateStr, stepKind);

		for (let index = 1; index < steps.length; index++) {
			let step = steps[index];
			stepKind = step.kind;
			pushStep(results, step);
		}

		// if last template str stop
		if (index > templateStrArr.length - 1) continue;

		let injStepKind: StepKind | undefined = route("{", stepKind);
		if (!isInjection(injStepKind)) {
			injStepKind = undefined;
			continue;
		}
		
		pushInjection(results, injStepKind);

		if ("DescendantInjection" === injStepKind) stepKind = "Initial";
		// breaking or non-breaking space
		if ("AttrMapInjection" === injStepKind) stepKind = "NonBreakingSpace";
	}

	return results;
}

function pushStep(results: TemplateStepsInterface, step: StepInterface) {
	results.steps[results.steps.length - 1]?.push(step);
}

function pushInjection(results: TemplateStepsInterface, stepKind: StepKind) {
	results.steps.push([]);
	results.injs.push(stepKind);
}
