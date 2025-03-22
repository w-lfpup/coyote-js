# Document Builders

### Hello, world!

The example below creates an html document from a coyote component function.

```ts
import type { Component } from "coyote";

import { Html, tmpl } from "coyote";

function hai(): Component {
	tmpl`<p>omgawsh hai :3</p>`;
}

let helloWorld = hai();

let html = new Html();
let [doc, _error] = html.build(helloWorld);

console.log(doc);
```

The output will be:

```html
<p>hai :3</p>
```

### Hello, error!

`Document builders` will return (not throw) an `Error` when template components do not close all their tags.

The example below returns an `error` when a coyote function returns an imbalanced template.

```ts
import type { Component } from "coyote";

import { Html, tmpl } from "coyote";

function hai(): Component {
	tmpl`<p>omgawsh hai :3`;
}

let helloWorld = hai();

let html = new Html();
let [_doc, error] = html.build(helloWorld);

console.log(error);
```

The output will be:

```
Coyote Err: the following template component is imbalanced:
<p>omgawsh hai :3
```

### Hello, safer world!

The example below creates a _safer_ fragment for client-side renders using `ClientHtml`.

```ts
import type { Component } from "coyote";

import { ClientHtml, tmpl } from "coyote";

function malicious(): Component {
	return tmpl`
        <link rel=stylesheet href=a_dangerous_stylesheet.css>
        <style>
            * { color: malicious-blue; }
        </style>
        <script>
            console.log('a malicious script! grrr rawr');
        </script>
    `;
}

function hai(): Component {
	return tmpl`
		${malicious()}
		<p>omgawsh hai >:3</p>
	`;
}

let hello_world = hai();

let saferHtml = new ClientHtml();
let [doc, _error] = saferHtml.build(hello_world);

console.log(doc);
```

The output will be:

```html
<p>hai >:3</p>
```

`Coyote` composes templates with `rulesets`.

The `ruleset` for `ClientHtml` rejects elements like `<script>`, `<style>`, and `<link>` elements.
It also removes unneccessary spaces.

## License

`Coyote-rs` is released under the BSD-3-Clause License
