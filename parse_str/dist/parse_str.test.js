import { Sieve } from "../../sieve/dist/mod.js";
import { parseStr } from "./mod.js";
// way to check if steps are equal
function compareSteps() { }
function testCompose() {
    const expected = [];
    const templateStr = `<p class=text>hai :3</p>`;
    const sieve = new Sieve();
    const coyoteTemplate = parseStr(sieve, templateStr, "Initial");
    if (expected !== coyoteTemplate) {
        return `incorrect steps found`;
    }
    return;
}
export const tests = [testCompose];
export const options = {
    title: import.meta.url,
    runAsynchronously: false,
};
