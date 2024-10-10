type StepKind = 
	| "AttrQuoteClosed"
	| "AttrQuote"
	| "AttrMapInjection"
	| "AttrSetter"
	| "AttrValue"
	| "AttrValueUnquoted"
	| "Attr"
	| "TailElementClosed"
	| "TailElementSolidus"
	| "TailElementSpace"
	| "TailTag"
	| "DescendantInjection"
	| "FragmentClosed"
	| "Fragment"
	| "EmptyElementClosed"
	| "EmptyElement"
	| "Initial"
	| "InjectionConfirmed"
	| "InjectionSpace"
	| "ElementClosed"
	| "ElementSpace"
	| "Element"
	| "Tag"
	| "Text"
	| "AltText"
	| "AltTextCloseSequence"
	| "CommentText";

interface StepInterface {
	kind: StepKind;
	origin: number;
	target: number;
}

class Step implements StepInterface {
	kind: StepKind;
	origin: number;
	target: number;
}

type Results = Step[];


function getTextFromStep(templateStr: string, step: StepInterface): string {
	return templateStr.slice(step.origin, step.target);
}

function isInjectionKind(stepKind: StepKind): boolean {
	return (
		"AttrMapInjection" === stepKind ||
		"DescendantInjection" === stepKind
	)
}


export type { StepKind, StepInterface, Results }

export { Step }