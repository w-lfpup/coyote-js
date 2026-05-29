import { tmplStr } from "../dist/mod.js";
export function text_element() {
    return tmplStr(`

			Beasts tread
				softly   underfoot.

		`, []);
}
export function empty_element() {
    return tmplStr(` 
		<p>
		</p>
		`, []);
}
export function fragment() {
    return tmplStr(`
		<>
		</>
		`, []);
}
export function block_element_with_text() {
    return tmplStr(`
		<p>
			hello!
		</p>
		`, []);
}
export function block_element_with_text_for_string() {
    return tmplStr(`
		<p>
			hello!
		</p>
		`, []);
}
export function inline_element_with_text() {
    return tmplStr(`
		<b> hello! </b>
		`, []);
}
export function void_element() {
    return tmplStr(`
		<input>
		`, []);
}
export function void_element_with_self_closing() {
    return tmplStr(`
		<input />
		`, []);
}
export function non_void_element() {
    return tmplStr(`
		<p />
		`, []);
}
// needs updating
export function comment_element() {
    return tmplStr(`
		<!-- Hello! -->
		`, []);
}
export function alt_text_element() {
    return tmplStr(`<style>#woof .bark {
			color: doggo;
		}</style>`, []);
}
export function alt_element_has_no_descendants() {
    return tmplStr(`
		<script>
			{}
		</script>
		`, []);
}
export function preserved_text_element_retains_spacing() {
    return tmplStr(`
<pre>
	U w U
	  woof woof!
</pre>
		`, []);
}
export function attribute() {
    return tmplStr("<span hai>UwU</span>", []);
}
export function attribute_with_single_quote() {
    return tmplStr("<span hai=''>UwU</span>", []);
}
export function attribute_with_double_quote() {
    return tmplStr('<span hai="">UwU</span>', []);
}
export function attribute_with_single_quote_value() {
    return tmplStr("<span hai='hewoo'>UwU</span>", []);
}
export function attribute_with_double_quote_value() {
    return tmplStr('<span hai="hewoo">UwU</span>', []);
}
export function banned_attribute() {
    return tmplStr("<span onkeypress>UwU</span>", []);
}
export function banned_attribute_quoted() {
    return tmplStr("<span onclick=\"console.log('danger!')\">UwU</span>", []);
}
export function banned_attribute_single_quoted() {
    return tmplStr(`<span onbegonia='\nconsole.log(\"BEGONIA!\")\n'>UwU</span>`, []);
}
