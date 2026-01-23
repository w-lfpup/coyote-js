import {Component, tmplStr} from "../dist/mod.js"

export function text_element(): Component {
    return tmplStr(`

			Beasts tread
				softly   underfoot.

		`,
		[],
	)
}

export function empty_element(): Component {
    return tmplStr(
		`
		<p>
		</p>
		`,
        [],
    )
}

export function fragment(): Component {
    return tmplStr(
		`
		<>
		</>
		`,
        [],
    )
}

export function block_element_with_text(): Component {
    return tmplStr(
		`
		<p>
			hello!
		</p>
		`,
        [],
    )
}

export function block_element_with_text_for_string(): Component {
    return tmplStr(
		`
		<p>
			hello!
		</p>
		`,
        [],
    )
}

export function inline_element_with_text(): Component {
    return tmplStr(
		`
		<b> hello! </b>
		`,
        [],
    )
}

export function void_element(): Component {
    return tmplStr(
		`
		<input>
		`,
        [],
    )
}

export function void_element_with_self_closing(): Component {
    return tmplStr(
		`
		<input />
		`,
        [],
    )
}

export function non_void_element(): Component {
    return tmplStr(
		`
		<p />
		`,
        [],
    )
}

// needs updating
export function comment_element(): Component {
    return tmplStr(
		`
		<!-- Hello! -->
		`,
        [],
    )
}

export function alt_text_element(): Component {
    return tmplStr(
		`<style>#woof .bark {
			color: doggo;
		}</style>`,
        [],
    )
}

export function alt_element_has_no_descendants(): Component {
    return tmplStr(
		`
		<script>
			{}
		</script>
		`,
        [],
    )
}

export function preserved_text_element_retains_spacing(): Component {
    return tmplStr(
		`
<pre>
	U w U
	  woof woof!
</pre>
		`,
        [],
    )
}

export function attribute(): Component {
    return tmplStr("<span hai>UwU</span>", [])
}

export function attribute_with_single_quote(): Component {
    return tmplStr("<span hai=''>UwU</span>", [])
}

export function attribute_with_double_quote(): Component {
    return tmplStr("<span hai=\"\">UwU</span>", [])
}

export function attribute_with_single_quote_value(): Component {
    return tmplStr("<span hai='hewoo'>UwU</span>", [])
}

export function attribute_with_double_quote_value(): Component {
    return tmplStr("<span hai=\"hewoo\">UwU</span>", [])
}

export function banned_attribute(): Component {
    return tmplStr("<span onkeypress>UwU</span>", [])
}

export function banned_attribute_quoted(): Component {
    return tmplStr("<span onclick=\"console.log('danger!')\">UwU</span>", [])
}

export function banned_attribute_single_quoted(): Component {
    return tmplStr(
	`<span onbegonia='\nconsole.log(\"BEGONIA!\")\n'>UwU</span>`,
        [],
    )
}
