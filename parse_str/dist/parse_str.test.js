import { ServerRules } from "../../rulesets/dist/mod.js";
import { parseStr } from "./mod.js";
// way to check if steps are equal
function compareSteps() { }
function testCompose() {
    const expected = [];
    const templateStr = `<p class=text>hai :3</p>`;
    const rules = new ServerRules();
    const coyoteTemplate = parseStr(rules, templateStr, "Initial");
    if (expected !== coyoteTemplate) {
        console.log(`
      expected: ${expected}
      found: ${coyoteTemplate}
    `);
        return `incorrect steps found`;
    }
    return;
}
export const tests = [];
export const options = {
    title: import.meta.url,
    runAsynchronously: false,
};
