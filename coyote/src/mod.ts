class CoyoteComponent {}
type Component = CoyoteComponent | string | undefined;

class AttrComponent extends CoyoteComponent {
  #attr: string;
  constructor(attr: string) {
    super();
    this.#attr = attr;
  }

  get attr() {
    return this.#attr;
  }
}

class AttrValComponent extends CoyoteComponent {
  #attr: string;
  #value: string;

  constructor(attr: string, val: string) {
    super();
    this.#attr = attr;
    this.#value = val;
  }

  get attr() {
    return this.#attr;
  }

  get value() {
    return this.#value;
  }
}

class TmplComponent extends CoyoteComponent {
  #templateStr: string;
  #injections: Component[];

  constructor(txt: string, injections: Component[]) {
    super();
    this.#templateStr = txt;
    this.#injections = injections;
  }

  get templateStr() {
    return this.#templateStr;
  }

  get injections() {
    return this.#injections;
  }
}

class TaggedTmplComponent extends CoyoteComponent {
  #templateArr: TemplateStringsArray;
  #injections: Component[];

  constructor(txts: TemplateStringsArray, injections: Component[]) {
    super();
    this.#templateArr = txts;
    this.#injections = injections;
  }

  get templateArr() {
    return this.#templateArr;
  }

  get injections() {
    return this.#injections;
  }
}

function tmpl(txt: string, injections: Component[]): TmplComponent {
  // return Tmpl Component new Text(text);
  return new TmplComponent(txt, injections);
}

function draw(txt: TemplateStringsArray, injections: Component[]): TaggedTmplComponent {
  // return Tmpl Component new Text(text);
  return new TaggedTmplComponent(txt, injections);
}

function text(txt: string): string {
  return txt.replace("<", "&lt;").replace("&", "&amp;").replace("{", "&#123;");
  // return Text Component new Text(text);
}

function attr(attrStr: string): AttrComponent {
  return new AttrComponent(attrStr);
}

function attrVal(attr: string, val: string): AttrValComponent {
  let escapedValue = val.replace('"', "&quot;").replace("&", "&amp;");
  return new AttrValComponent(attr, val);
}

export type { Component };

export { CoyoteComponent, AttrComponent, AttrValComponent, TmplComponent, tmpl, text, attr, attrVal };
