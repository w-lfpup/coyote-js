import type { RulesetInterface } from "./rulesets.js";
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
	kind: StepKind = "Initial";
	origin: number = 0;
	target: number = 0;

	constructor(kind: StepKind, origin: number = 0, target: number = 0) {
		this.kind = kind;
		this.origin = origin;
		this.target = target;
	}
}

export function parseStr(
	sieve: RulesetInterface,
	templateStr: string,
	initialKind: StepKind,
): StepInterface[] {
	let steps = [new Step(initialKind)];

	let tag = "";
	let prevInjKind = initialKind;
	let slidingWindow: SlidingWindowInterface | undefined;

	for (let index = 0; index < templateStr.length; index++) {
		let glyph = templateStr[index];
		if (slidingWindow) {
			if (!slidingWindow.slide(glyph)) continue;
			if (!addAltElementText(sieve, steps, tag, index)) return steps;

			slidingWindow = undefined;
			continue;
		}

		let step = steps[steps.length - 1];
		if (step === undefined) return steps;
		step.target = index;

		let currKind =
			"InjectionConfirmed" === step.kind
				? route(glyph, prevInjKind)
				: route(glyph, step.kind);

		if (currKind === step.kind) continue;

		if (isInjectionKind(currKind)) {
			prevInjKind = step.kind;
		}

		if ("Tag" === step.kind) {
			tag = getTextFromStep(templateStr, step);

			if (sieve.tagIsAtributeless(tag)) {
				let closeSequence = sieve.getCloseSequenceFromAltTextTag(tag);
				if (closeSequence) {
					let slider = new SlidingWindow(closeSequence);
					slider.slide(glyph);
					slidingWindow = slider;
					currKind = "Text";
				}
			}
		}

		if ("ElementClosed" === step.kind) {
			let closeSequence = sieve.getCloseSequenceFromAltTextTag(tag);
			if (closeSequence) {
				let slider = new SlidingWindow(closeSequence);
				slider.slide(glyph);
				slidingWindow = slider;
				currKind = "Text";
			}
		}

		steps.push(new Step(currKind, index, index));
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

function addAltElementText(
	sieve: RulesetInterface,
	steps: Step[],
	tag: string,
	index: number,
): boolean {
	let step = steps[steps.length - 1];
	if (step === undefined) return false;

	let closingSequence = sieve.getCloseSequenceFromAltTextTag(tag);
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

	return true;
}
