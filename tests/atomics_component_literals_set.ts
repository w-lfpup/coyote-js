import type { Component } from "../dist/mod.js";

import { tmpl } from "../dist/mod.js";

export function text_element(): Component {
	return tmpl`

			Beasts tread
				softly   underfoot.

	`;
}

export function empty_element(): Component {
	return tmpl` 
		<p>
		</p>
		`;
}

export function fragment(): Component {
	return tmpl`
		<>
		</>
		`;
}

export function block_element_with_text(): Component {
	return tmpl`
		<p>
			hello!
		</p>
		`;
}

export function block_element_with_text_for_string(): Component {
	return tmpl`
		<p>
			hello!
		</p>
		`;
}

export function inline_element_with_text(): Component {
	return tmpl`
		<b> hello! </b>
		`;
}

export function void_element(): Component {
	return tmpl`
		<input>
		`;
}

export function void_element_with_self_closing(): Component {
	return tmpl`
		<input />
		`;
}

export function non_void_element(): Component {
	return tmpl`
		<p />
		`;
}

// needs updating
export function comment_element(): Component {
	return tmpl`
		<!-- Hello! -->
		`;
}

export function alt_text_element(): Component {
	return tmpl`<style>#woof .bark {
			color: doggo;
		}</style>`;
}

export function alt_element_has_no_descendants(): Component {
	return tmpl`
		<script>
			{}
		</script>
		`;
}

export function preserved_text_element_retains_spacing(): Component {
	return tmpl`
<pre>
	U w U
	  woof woof!
</pre>
		`;
}

export function attribute(): Component {
	return tmpl`<span hai>UwU</span>`;
}

export function attribute_with_single_quote(): Component {
	return tmpl`<span hai=''>UwU</span>`;
}

export function attribute_with_double_quote(): Component {
	return tmpl`<span hai="">UwU</span>`;
}

export function attribute_with_single_quote_value(): Component {
	return tmpl`<span hai='hewoo'>UwU</span>`;
}

export function attribute_with_double_quote_value(): Component {
	return tmpl`<span hai="hewoo">UwU</span>`;
}

export function banned_attribute(): Component {
	return tmpl`<span onkeypress>UwU</span>`;
}

export function banned_attribute_quoted(): Component {
	return tmpl`<span onclick=\"console.log('danger!')\">UwU</span>`;
}

export function banned_attribute_single_quoted(): Component {
	return tmpl`<span onbegonia='\nconsole.log(\"BEGONIA!\")\n'>UwU</span>`;
}
