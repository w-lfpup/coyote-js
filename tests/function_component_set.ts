import type { Component } from "../dist/mod.js";
import { attr, attrVal, tmplStr } from "../dist/mod.js";

function submit_button(): Component {
	return tmplStr(
		`
		<input type=submit value=\"yus -_-\">
		`,
		[],
	);
}

export function form_component_retains_spacing(): Component {
	let attributes = [attrVal("action", "/uwu"), attrVal("method", "post")];

	let descendants: Component[] = [];
	descendants.push("you're a boy kisser aren't you >:3");
	descendants.push(submit_button());

	return tmplStr(
		`
		<form {}>
			{}
		</form>
		`,
		[attributes, descendants],
	);
}

function lil_divs(hai: () => Component): Component {
	return tmplStr(
		`

		<div>{}{}</div>
		<div>
			{}{}
		</div>
		<div>{} {}</div>
		<div>
			{} {}
		</div>
		<div>
			{}
			{}
		</div>
		<div>
			{}

			{}
		</div>
		`,
		[
			hai(),
			hai(),
			hai(),
			hai(),
			hai(),
			hai(),
			hai(),
			hai(),
			hai(),
			hai(),
			hai(),
			hai(),
			hai(),
		],
	);
}

function hai(): Component {
	return "hai :3";
}

export function elememt_and_text_components_retains_spacing(): Component {
	return lil_divs(hai);
}

function spacey_hai(): Component {
	return `
		hai :3
		`;
}

export function element_and_text_components_retain_extra_spacey_spacing(): Component {
	return lil_divs(spacey_hai);
}

function el_hai(): Component {
	return tmplStr("<span> hai :3 </span>", []);
}

export function element_components_retain_spacing(): Component {
	return lil_divs(el_hai);
}

function el_hai_extra_spacey(): Component {
	return tmplStr(
		`
        <span> hai :3 </span>
	`,
		[],
	);
}

export function element_components_retain_extra_spacey_spacing(): Component {
	return lil_divs(el_hai_extra_spacey);
}

export function attributes_retain_spacing(): Component {
	return tmplStr(
		`
		<p hai></p>
		<p hai
		></p>
		<p
		hai ></p>
		<p
		hai
		>
		</p>
		`,
		[],
	);
}

function attribute_list(): Component {
	return [
		attr("hai"),
		attr("hello"),
		attrVal("yo", "what's good!"),
		attrVal(
			"hey",
			`
			howdy!

			howdy!

			hurray!
		`,
		),
	];
}

function lil_attributes(hai: () => Component): Component {
	return tmplStr(
		`
		<p {}>
		</p>
		<p
			{}>
		</p>
		<span {}></span>
		<span {}></span>
		`,
		[hai(), hai(), hai(), hai()],
	);
}

export function attribute_component_injections_retain_spacing(): Component {
	return lil_attributes(attribute_list);
}
