import { route } from "./routes.js";
import { SlidingWindow } from "./sliding_window.js";
class Step {
    kind = "Initial";
    origin = 0;
    target = 0;
    constructor(kind, origin = 0, target = 0) {
        this.kind = kind;
        this.origin = origin;
        this.target = target;
    }
}
function parseStr(sieve, templateStr, initialKind) {
    let steps = [new Step(initialKind)];
    let tag = "";
    let prevInjKind = initialKind;
    let slidingWindow;
    for (let index = 0; index < templateStr.length; index++) {
        let glyph = templateStr.charAt(index);
        // slide window
        if (slidingWindow) {
            if (!slidingWindow.slide(glyph))
                continue;
            if (!addReservedElementText(sieve, steps, tag, index))
                return steps;
            slidingWindow = undefined;
            continue;
        }
        let step = steps[steps.length - 1];
        if (step === undefined)
            return steps;
        let currKind = "InjectionConfirmed" === step.kind
            ? route(glyph, prevInjKind)
            : route(glyph, step.kind);
        if (currKind === step.kind)
            continue;
        if (isInjectionKind(currKind)) {
            prevInjKind = step.kind;
        }
        step.target = index;
        if ("Tag" === step.kind) {
            tag = getTextFromStep(templateStr, step);
        }
        if (sieve.isComment(tag)) {
            let closeSequence = sieve.getCloseSequenceFromAltTextTag(tag);
            if (closeSequence) {
                let slider = new SlidingWindow(closeSequence);
                slider.slide(glyph);
                slidingWindow = slider;
                currKind = "CommentText";
            }
        }
        if ("ElementClosed" === step.kind) {
            let closeSequence = sieve.getCloseSequenceFromAltTextTag(tag);
            if (closeSequence) {
                let slider = new SlidingWindow(closeSequence);
                slider.slide(glyph);
                slidingWindow = slider;
                currKind = "AltText";
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
function getTextFromStep(templateStr, step) {
    return templateStr.slice(step.origin, step.target);
}
function isInjectionKind(stepKind) {
    return "AttrMapInjection" === stepKind || "DescendantInjection" === stepKind;
}
function addReservedElementText(sieve, steps, tag, index) {
    let step = steps[steps.length - 1];
    if (step === undefined)
        return false;
    let closingSequence = sieve.getCloseSequenceFromAltTextTag(tag);
    if (closingSequence === undefined)
        return true;
    step.target = index - (closingSequence.length - 1);
    steps.push(new Step("AltTextCloseSequence", index - (closingSequence.length - 1), index - closingSequence.length));
    return true;
}
export { route, parseStr, getTextFromStep, isInjectionKind };
