import type { BuilderInterface } from "../documents/template_builders.js";
import type { RulesetInterface } from "../template_steps/rulesets.js";
import type { TemplateStepsInterface } from "../template_steps/template_steps.js";

import {
	compose,
	composeTemplateArr,
} from "../template_steps/template_steps.js";

export class Builder implements BuilderInterface {
	#resultsCache: Map<string | TemplateStringsArray, TemplateStepsInterface> =
		new Map();
	#memoryFootprint = 0;

	compose(
		ruleset: RulesetInterface,
		templateStr: string,
	): TemplateStepsInterface {
		let steps = this.#resultsCache.get(templateStr);
		if (steps) return steps;

		this.#memoryFootprint += templateStr.length;
		if (ruleset.getCacheMemoryLimit() < this.#memoryFootprint) {
			this.#memoryFootprint = templateStr.length;
			this.#resultsCache = new Map();
		}

		steps = compose(ruleset, templateStr);
		this.#resultsCache.set(templateStr, steps);

		return steps;
	}

	composeTemplateStringsArray(
		ruleset: RulesetInterface,
		templateArray: TemplateStringsArray,
	): TemplateStepsInterface {
		let steps = this.#resultsCache.get(templateArray);
		if (steps) return steps;

		this.#memoryFootprint += templateArray.raw.length;
		if (ruleset.getCacheMemoryLimit() < this.#memoryFootprint) {
			this.#memoryFootprint = templateArray.raw.length;
			this.#resultsCache = new Map();
		}

		steps = composeTemplateArr(ruleset, templateArray);
		this.#resultsCache.set(templateArray, steps);

		return steps;
	}
}
