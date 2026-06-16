export class CoyoteComponent {}
export type Component = CoyoteComponent | Node | string | undefined;

export class AttrComponent extends CoyoteComponent {
	#attr: string;
	constructor(attr: string) {
		super();
		this.#attr = attr;
	}

	get attr() {
		return this.#attr;
	}
}

export class AttrValComponent extends CoyoteComponent {
	#attr: string;
	#value: string;

	constructor(attr: string, val: string) {
		super();
		this.#attr = attr;
		this.#value = val.replaceAll('"', "&quot;");
	}

	get attr() {
		return this.#attr;
	}

	get value() {
		return this.#value;
	}
}

export class TmplComponent extends CoyoteComponent {
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

export class TaggedTmplComponent extends CoyoteComponent {
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

export function tmplStr(txt: string, injections: Component[]): TmplComponent {
	return new TmplComponent(txt, injections);
}

export function tmpl(
	txts: TemplateStringsArray,
	...injections: Component[]
): TaggedTmplComponent {
	return new TaggedTmplComponent(txts, injections);
}

export function attr(attrStr: string): AttrComponent {
	return new AttrComponent(attrStr);
}

export function attrVal(attr: string, val: string): AttrValComponent {
	return new AttrValComponent(attr, val);
}
