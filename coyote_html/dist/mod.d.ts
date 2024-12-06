import { BuilderInterface } from "../../component_string/dist/mod.js";
import { Results } from "../../template_str/dist/mod.js";
import { RulesetInterface } from "./mod.js";
declare class Builder implements BuilderInterface {
    buildStr(ruleset: RulesetInterface, templateStr: string): Results;
    buildTemplateStrs(ruleset: RulesetInterface, templateArray: TemplateStringsArray): Results;
}
export type { RulesetInterface } from "../../rulesets/dist/mod.ts";
export { compose as prettyHtml } from "../../html/dist/mod.js";
export { ClientRules, ServerRules } from "../../rulesets/dist/mod.js";
export { Builder };
