import { compose as buildComponent, } from "../../component_string/dist/mod.js";
import { compose, composeTemplateArr, } from "../../template_str/dist/mod.js";
import { compose as prettyHtml } from "../../html/dist/mod.js";
class Builder {
    // place to add cache for:
    // - templateStr
    // - templateArr
    buildStr(ruleset, templateStr) {
        return compose(ruleset, templateStr);
    }
    buildTemplateStrs(ruleset, templateArray) {
        return composeTemplateArr(ruleset, templateArray);
    }
}
class Html {
    builder;
    constructor(builder) {
        this.builder = builder;
    }
    build(ruleset, component) {
        let templateStr = buildComponent(this.builder, ruleset, component);
        return prettyHtml(ruleset, templateStr);
    }
}
export { compose as prettyHtml } from "../../html/dist/mod.js";
export { ClientRules, ServerRules } from "../../rulesets/dist/mod.js";
export { Builder, Html };
