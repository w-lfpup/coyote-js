// #[derive(Debug, Clone, Eq, PartialEq)]
// pub enum Component {
//     Text(String),
//     Attr(String),
//     AttrVal(String, String),
//     Tmpl(Template),
//     List(Vec<Component>),
//     None,
// }

// #[derive(Debug, Clone, Eq, PartialEq)]
// pub struct Template {
//     pub template_str: String,
//     pub injections: Vec<Component>,
// }

// // ergonomic functions to quickly create componets without the typical rust verbosity
// //  (improves readability of component code considerably)
// pub fn tmpl<const N: usize>(template_str: &str, injections: [Component; N]) -> Component {
//     Component::Tmpl(Template {
//         template_str: template_str.to_string(),
//         injections: Vec::from(injections),
//     })
// }

class Component {}
class TmplComponent extends Component {}
//
// class TextComponent extends Component {}
// use string
class AttrComponent extends Component {}
class AttrValComponent extends Component {}
class UnescapedTextComponent extends Component {}

function tmpl(txt: string, injections: Component): Component {
	// return Tmpl Component new Text(text);
	return new TmplComponent();
}

function text(txt: string): string {
    return txt
		.replace("<", "&lt;")
		.replace("&", "&amp;")
		.replace("{", "&#123;");
	// return Text Component new Text(text);
}

// this could just be default string
// function unescaped_text(txt: string): Component {
//     return txt
// 		.replace("<", "&lt;")
// 		.replace("&", "&amp;")
// 		.replace("{", "&#123;");
// 	// return new UnescapedText(text);
// }

function attr(attrStr: string): Component {
	// return new Attr(attrStr);
	return new AttrComponent();
}

function attrVal(attr: string, val: string): Component {
	let escapedValue = val.replace("\"", "&quot;").replace("&", "&amp;");
	// return new AttrVal(attr, escapedValue);
	return new AttrValComponent();

}

// These are just arrays in javascript
// list
// vlist
// doesn't matter can just say "isArray" very important actually