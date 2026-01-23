import { tmpl } from "../dist/mod.js";
export function text_element() {
    return tmpl `

			Beasts tread
				softly   underfoot.

	`;
}
export function empty_element() {
    return tmpl ` 
		<p>
		</p>
		`;
}
export function fragment() {
    return tmpl `
		<>
		</>
		`;
}
export function block_element_with_text() {
    return tmpl `
		<p>
			hello!
		</p>
		`;
}
export function block_element_with_text_for_string() {
    return tmpl `
		<p>
			hello!
		</p>
		`;
}
export function inline_element_with_text() {
    return tmpl `
		<b> hello! </b>
		`;
}
export function void_element() {
    return tmpl `
		<input>
		`;
}
export function void_element_with_self_closing() {
    return tmpl `
		<input />
		`;
}
export function non_void_element() {
    return tmpl `
		<p />
		`;
}
// needs updating
export function comment_element() {
    return tmpl `
		<!-- Hello! -->
		`;
}
export function alt_text_element() {
    return tmpl `<style>#woof .bark {
			color: doggo;
		}</style>`;
}
export function alt_element_has_no_descendants() {
    return tmpl `
		<script>
			{}
		</script>
		`;
}
export function preserved_text_element_retains_spacing() {
    return tmpl `
<pre>
	U w U
	  woof woof!
</pre>
		`;
}
export function attribute() {
    return tmpl `<span hai>UwU</span>`;
}
export function attribute_with_single_quote() {
    return tmpl `<span hai=''>UwU</span>`;
}
export function attribute_with_double_quote() {
    return tmpl `<span hai="">UwU</span>`;
}
export function attribute_with_single_quote_value() {
    return tmpl `<span hai='hewoo'>UwU</span>`;
}
export function attribute_with_double_quote_value() {
    return tmpl `<span hai="hewoo">UwU</span>`;
}
export function banned_attribute() {
    return tmpl `<span onkeypress>UwU</span>`;
}
export function banned_attribute_quoted() {
    return tmpl `<span onclick=\"console.log('danger!')\">UwU</span>`;
}
export function banned_attribute_single_quoted() {
    return tmpl `<span onbegonia='\nconsole.log(\"BEGONIA!\")\n'>UwU</span>`;
}
