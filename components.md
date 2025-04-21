# Components

`Coyote` creates documents from function components.

## Function Components

Function components are functions that return components!

```TS
import type { Component } from "coyote";

import { tmpl } from "coyote";

function hai(): Component {
    return tmpl`<p>omgawsh hai :3</p>`;
}
```

## Components

`Components` are used to build documents:

| Component            | Description                                                              | Type                                                            |
| -------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Attribute            | an element attribute                                                     | `attr(name: string): Component`                                 |
| Attribute with value | an element and attribute and value pair                                  | `attrVal(name: string, value: string): Component`               |
| Text                 | text with escaped HTML glyphs like `<` of `{`                            | `text(words: string): Component`                                |
| Template             | a document fragment described by a tagged template literal               | `tmpl(template: string, injections: ...Component): Component`   |
| TemplateString       | a document fragment described by a string template and a list injections | `tmplStr(template: string, injections: Component[]): Component` |

Coyote also supports:

- vanilla text for unescaped text purposes
- arrays for lists of components

## Template Syntax

Template components are used to create reusable chunks of XML.

### Tags, void elements, fragments

`Coyote-rs` supports self-closing tags, void elements, and fragments.

```ts
function syntaxStory(): Component {
	return tmpl`
        <article>
            <header>cool story!</header>
            <>
                <p>bro what else happened?</p>
                <p>no waaaay?</p>
            </>
            <footer>end of the story!</footer>
        </article>
    `;
}
```

### Injections

`Injections` nest templates and add attributes to elements.

There are only two valid _injections_ in a `tmpl` component:

- attributes
- descendants

Likewise there are only two valid injection locations in a `tmpl` component.

Any other instance of `{}` in a template component will not be considered an injection (read as a string).

### Strings

The following examples show how to create a template component from a string.

```ts
function strInjectionStory(): Component {
    let attribute = attr("uwu");
    let descendant = text("hai! :3");

    return tmplStr("
        <article {}>
            {}
        </article>
    ", [attribute, descendant]);
}
```

### Tagged Template Literals

Tagged template literals are great for javascript-first templates.

The following examples show how to create a template component from a tagged template literal.

```ts
function templateLiteralInjectionStory(): Component {
	let attribute = attr("uwu");
	let descendant = text("hai! :3");

	return tmpl`
        <article ${attribute}>
            ${descendant}
        </article>
    `;
}
```

## Nested components

Components reflect the `node: [node, text, node, ...]` heiarchy of an xml-like document.

The example below creates a form defined by lists of attributes, templates, and text.

```ts
import type { Component } from "coyote";

import { tmpl, text, attrVal } from "coyote";

function woof(): Component {
	return tmpl('<input type=submit value="yus -_-">', []);
}

function woofForm(): Component {
	let attributes = [attrVal("action", "/uwu"), attrVal("method", "post")];
	let descendants = [text("you're a boy kisser aren't you >:3"), woof()];

	return tmpl`<form ${attributes}>${descendants}</form>`;
}
```

## Components as an IMR

Components are not HTML or XML.

Components are a kind of (I)ntermediate (R)endering (F)ormat. They are the _potential_ for a document like HTML or XML.

## Renders

`Components` are not coupled to any particular markup language or output environment. This makes `coyote` an expressive way to create custom documents and object scenes from xml.

### HTML

Coyote supports [html](./document_builders.md).
