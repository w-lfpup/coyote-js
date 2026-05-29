import type { RulesetInterface } from "./rulesets.ts";
import type { SlidingWindowInterface } from "./sliding_window.ts";
import type { StepKind } from "./routes.ts";

import { route } from "./routes.js";
import { SlidingWindow } from "./sliding_window.js";

export interface StepInterface {
	kind: StepKind;
	origin: number;
	target: number;
}

class Step implements StepInterface {
	kind: StepKind;
	origin: number;
	target: number;

	constructor(
		kind: StepKind = "Initial",
		origin: number = 0,
		target: number = 0,
	) {
		this.kind = kind;
		this.origin = origin;
		this.target = target;
	}
}

export function parseStr(
	rules: RulesetInterface,
	templateStr: string,
	initialKind: StepKind,
): StepInterface[] {
	let steps = [new Step(initialKind)];

	let tag = "";
	let injectionKind = initialKind;
	let slidingWindow: SlidingWindowInterface | undefined;
	let contentless = false;

	for (let index = 0; index < templateStr.length; index++) {
		let glyph = templateStr[index];

		if (contentless) {
			contentless = false;
			pushContentlessStepsEdge(rules, steps, tag, index);
		}

		if (slidingWindow) {
			if (!slidingWindow.slide(glyph)) continue;

			if (rules.getCloseSequenceFromContentlessTag(tag)) {
				pushContentlessSteps(rules, steps, tag, index);
			}

			if (rules.getCloseSequenceFromAltTextTag(tag)) {
				pushAltElementSteps(rules, steps, tag, index);
			}

			slidingWindow = undefined;
			continue;
		}

		// route next step
		let end_step = steps[steps.length - 1];
		if (end_step === undefined) return steps;
		// mark progression
		end_step.target = index;

		let currKind =
			"InjectionConfirmed" === end_step.kind
				? route(glyph, injectionKind)
				: route(glyph, end_step.kind);

		if (currKind === end_step.kind) continue;

		if (isInjectionKind(currKind)) injectionKind = end_step.kind;

		// edge case ALT ELEMENTS
		if ("TagClosed" === end_step.kind) {
			let closeSequence = rules.getCloseSequenceFromAltTextTag(tag);
			if (closeSequence) {
				let slider = new SlidingWindow(closeSequence);
				slider.slide(glyph);
				slidingWindow = slider;
				currKind = "TextAlt";
			}
		}

		// edge case COMMENTS
		let nextStepOrigin = index;

		if ("Tag" === end_step.kind) {
			tag = getTextFromStep(templateStr, end_step);

			let prefix = rules.tagIsPrefixOfContentlessEl(tag);
			if (prefix) {
				let diff = tag.slice(prefix.length);
				tag = prefix;

				end_step.target = end_step.origin + prefix.length;
				nextStepOrigin = end_step.target;

				let closeSequence = rules.getCloseSequenceFromAltTextTag(tag);
				if (closeSequence) {
					currKind = "TextAlt";

					let slider = new SlidingWindow(closeSequence);
					for (let glypher of diff) {
						slider.slide(glypher);
					}

					slider.slide(glyph)
						? (contentless = true)
						: (slidingWindow = slider);
				}
			}
		}

		// Add CURRENT STEP
		steps.push(new Step(currKind, nextStepOrigin, index));
		// <!--comment_edge_case-->
		// if (contentless) pushContentlessStepsEdge(rules, steps, tag, index);
	}

	let step = steps[steps.length - 1];
	if (step) {
		step.target = templateStr.length;
	}

	return steps;
}

export function getTextFromStep(
	templateStr: string,
	step: StepInterface,
): string {
	return templateStr.slice(step.origin, step.target);
}

function isInjectionKind(stepKind: StepKind): boolean {
	return (
		"AttrMapInjection" === stepKind || "DescendantInjection" === stepKind
	);
}

function pushAltElementSteps(
	rules: RulesetInterface,
	steps: Step[],
	tag: string,
	index: number,
) {
	let step = steps[steps.length - 1];
	if (step === undefined) return;

	let closingSequence = rules.getCloseSequenceFromAltTextTag(tag);
	if (closingSequence) {
		step.target = index - (closingSequence.length - 1);
		steps.push(
			new Step(
				"TailTag",
				index - (closingSequence.length - 1),
				index - closingSequence.length,
			),
		);
	}
}

function pushContentlessSteps(
	rules: RulesetInterface,
	steps: Step[],
	tag: string,
	index: number,
) {
	let closingSequence = rules.getCloseSequenceFromContentlessTag(tag);
	if (!closingSequence) return;

	let step = steps[steps.length - 1];
	if (step === undefined) return;

	step.target = index - (closingSequence.length - 1);
	steps.push(
		new Step(
			"TailTag",
			index - (closingSequence.length - 1),
			index - closingSequence.length,
		),
	);
	steps.push(new Step("TailTagClosed", index, index));
}

function pushContentlessStepsEdge(
	rules: RulesetInterface,
	steps: Step[],
	tag: string,
	index: number,
) {
	let closingSequence = rules.getCloseSequenceFromContentlessTag(tag);
	if (!closingSequence) return;

	let step = steps[steps.length - 1];
	if (step === undefined) return;

	let { target } = step;

	step.target = step.target - closingSequence.length + 1;
	let next_origin = step.target;
	let next_target = step.target + closingSequence.length - 1;

	if (step.target === step.origin) {
		step.kind = "TailTag";
		step.target = next_target;
	} else {
		steps.push(new Step("TailTag", next_origin, next_target));
	}

	steps.push(new Step("TailTagClosed", target, index));
}
