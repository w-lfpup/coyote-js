class CoyoteComponent {}

type Component = CoyoteComponent | string | undefined;
// text component just string
class AttrComponent extends CoyoteComponent {}
class AttrValComponent extends CoyoteComponent {}
class UnescapedTextComponent extends CoyoteComponent {}
class TmplComponent extends CoyoteComponent {
  templateStr: string;
  injections: Component[];
}

function tmpl(txt: string, injections: Component[]): TmplComponent {
  // return Tmpl Component new Text(text);
  return new TmplComponent();
}

function text(txt: string): string {
  return txt.replace("<", "&lt;").replace("&", "&amp;").replace("{", "&#123;");
  // return Text Component new Text(text);
}

function attr(attrStr: string): Component {
  // return new Attr(attrStr);
  return new AttrComponent();
}

function attrVal(attr: string, val: string): Component {
  let escapedValue = val.replace('"', "&quot;").replace("&", "&amp;");
  // return new AttrVal(attr, escapedValue);
  return new AttrValComponent();
}

export type { Component, AttrValComponent };

export { tmpl, text, attr, attrVal };
