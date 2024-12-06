import { compose } from "./mod.js";
import { ServerRules, ClientRules } from "../../rulesets/dist/mod.js";

function testCompose() {
	const expected = `<form>
	<input>
	<div></div>
	<p>
		you're a boy kisser,
		aren't you!
	</p>
	<input type=checkbox>
</form>`;

	const templateStr = `
		<form>
			<input></input>
			<div>
			</div>
			<p>
					you're a boy kisser,
						aren't you!</p>
			<input type=checkbox>
		</form>
	`;

	const sieve = new ServerRules();
	// const sieve = new ClientRules();
	const coyoteTemplate = compose(sieve, templateStr);

	if (expected !== coyoteTemplate) {
		return `
expected:
${expected}
		
found:
${coyoteTemplate}`;
	}

	return;
}

export const tests = [testCompose];

export const options = {
	title: import.meta.url,
	runAsynchronously: false,
};
