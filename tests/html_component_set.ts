import type { Component } from "../dist/mod.js";
import { tmplStr, attr } from "../dist/mod.js";

export function empty_element_retains_spacing(): Component {
	return tmplStr(
		`
		<p></p>
		<p> </p><p>
		</p>
		`,
		[],
	);
}

export function fragments_dont_exist(): Component {
	return tmplStr(
		`
		<><>
		</></>
		`,
		[],
	);
}

export function block_element_with_text_retains_spacing(): Component {
	return tmplStr(
		`
		<p>hello!</p>
		<p> hello! </p>
		<p>
			hello
		</p><p>
hello
		</p>
		<p>hello
		</p>
		<p>
		hello</p>
		`,
		[],
	);
}

export function inline_element_with_text_retains_spacing(): Component {
	return tmplStr(
		`
		<b>hello!</b>
		<b> hello! </b>
		<b> hello
		</b>
		<b>
			hello </b>
		<b>
hello
		</b>
		<b>
			hello
		</b>
		<b>hello
		</b>
		<b>
		hello</b>
		`,
		[],
	);
}

export function comment_element_retains_spacing(): Component {
	return tmplStr(
		`
		<!---->
		<!--Hello!-->
		<!-- Hello! -->
		<!--Hello! -->
		<!-- Hello!-->
		<!--Hello!
		-->
		<!--
		Hello!-->
		<!--

		Hello!

		-->
		`,
		[],
	);
}

export function empty_element_stays_empty(): Component {
	return tmplStr(`<html></html>`, []);
}

export function unbalanced_empty_elemen_errors_out(): Component {
	return tmplStr(`<html>`, []);
}

export function forbidden_attribute_injection_glyph_errors_out(): Component {
	return tmplStr(`<p {}></p>`, [attr("a<b/c'd=e>f")]);
}

export function mozilla_spacing_example_passes(): Component {
	return tmplStr(
		`
		<h1>   Hello
				<span> World!</span>   </h1>`,
		[],
	);
}

export function attribute_value_retains_spacing(): Component {
	return tmplStr(
		`
		<h1 
			oh=''
			yikes='woah!'
			oh-no='
				it goes bye bye
			'
			wow='People use
			attributes in some very
			wild ways but thats okay'
		> Hello
				<span> World!</span>   </h1>
		<h1 oh='' yikes='woah!' oh-no='
				it goes bye bye
			' wow='

			People use attributes in some very

			wild ways but thats okay

		'>
			Hello! <span> World!</span>
		</h1>
		`,
		[],
	);
}

export function void_elements_retain_spacing(): Component {
	return tmplStr(
		`<input>   <input>
			<input><input> `,
		[],
	);
}

export function text_with_inline_elements_retain_spacing(): Component {
	return tmplStr(
		`beasts <span>	tread		</span>	 softly <span>	underfoot </span>	  .`,
		[],
	);
}

export function text_with_block_elements_retain_spacing(): Component {
	return tmplStr(`beasts <p>	tread		</p>	 softly <p>	underfoot </p>	  .`, []);
}

export function void_elements_can_have_attributes(): Component {
	return tmplStr(
		`
		<!DOCTYPE html><input type=checkbox>   <input woof=\"bark\">
			<input grrr><input> `,
		[],
	);
}

export function void_element_with_sibling(): Component {
	return tmplStr(
		`
			<input><p>hai :3</p>	`,
		[],
	);
}

export function nested_void_element_with_siblings_retains_spacing(): Component {
	return tmplStr(
		`
		<section>
			<input><p>hai :3</p>
		</section>
		`,
		[],
	);
}

export function nested_elements_and_text_retain_spacing(): Component {
	return tmplStr(`<a><label><input type=woofer>bark!</label><img></a>`, []);
}

export function document_retains_spacing(): Component {
	return tmplStr(
		`		<!DOCTYPE>
	<html>
	<head>

	</head>
		<body>
			<article>
				You're a <span>boy kisser</span> aren't you?
				Click <a>here</a> and go somewhere else.
			</article>
			<footer/>
		</body>
</html>`,
		[],
	);
}

export function document_with_alt_text_elements_retains_spacing(): Component {
	return tmplStr(
		`		<!DOCTYPE>
	<html>
	<head>
		<style>
			#woof .bark {
				color: doggo;
			}
		</style>
		<script>
			if 2 < 3 {
				console.log();
			}
		</script>
	</head>
		<body>
			<article></article>
			<footer/>
		</body>
</html>`,
		[],
	);
}

export function banned_attributes(): Component {
	return tmplStr(
		`<span onkeypress
    bowow onbowow click>UwU</span>`,
		[],
	);
}

export function banned_attributes_quoted(): Component {
	return tmplStr(
		`<span onclick=\"
        console.log('danger!')
        \" bark bark
        onbark>UwU</span>`,
		[],
	);
}

export function banned_attributes_single_quoted(): Component {
	return tmplStr(
		`<span onbegonia='
            console.log(\"BEGONIA!\")
        '
            dash='chase'
            up=down>UwU</span>`,
		[],
	);
}
