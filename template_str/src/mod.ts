import type { StepInterface, StepKind } from "../../parse_str/dist/mod.ts";
import type { RulesetInterface } from "../../rulesets/dist/mod.js";

import { getTextFromStep, parseStr } from "../../parse_str/dist/mod.js";

interface ResultsInterface {
	strs: string[][];
	injs: StepKind[];
}

class Results implements ResultsInterface {
	strs = [];
	injs = [];
}

function compose(
	ruleset: RulesetInterface,
	templateStr: string,
): ResultsInterface {
	let results = new Results();

	for (let step of parseStr(ruleset, templateStr, "Initial")) {
		if (step.kind === "AttrMapInjection") {
			pushAttrMapInjection(results);
			continue;
		}

		if (step.kind === "DescendantInjection") {
			pushDescendantInjection(results);
			continue;
		}

		if (step.kind === "InjectionSpace") continue;
		if (step.kind === "InjectionConfirmed") continue;

		pushText(results, templateStr, step);
	}

	return results;
}

function pushText(
	results: ResultsInterface,
	templateStr: string,
	step: StepInterface,
) {
	const text = getTextFromStep(templateStr, step);
	let last_str = results.strs[results.strs.length - 1];
	if (last_str) {
		last_str.push(text);
	}
}

function pushAttrMapInjection(results: ResultsInterface) {
	results.strs.push([]);
	results.injs.push("AttrMapInjection");
}

function pushDescendantInjection(results: ResultsInterface) {
	results.strs.push([]);
	results.injs.push("DescendantInjection");
}

export type { ResultsInterface };
export { Results, compose };
