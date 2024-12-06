import { compose, composeTemplateArr } from "../../template_str/dist/mod.js";
class Builder {
    buildStr(ruleset, templateStr) {
        return compose(ruleset, templateStr);
    }
    buildTemplateStrs(ruleset, templateArray) {
        return composeTemplateArr(ruleset, templateArray);
    }
}
export { compose as prettyHtml } from "../../html/dist/mod.js";
export { ClientRules, ServerRules } from "../../rulesets/dist/mod.js";
export { Builder };
