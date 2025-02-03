# Document Builders

### Hello, world!

The example below creates an html document from a coyote component function.

```ts
import type { Component } from "coyote";

import { Html, tmpl } from "coyote";

function hai(): Component {
    tmpl`<p>omgawsh hai :3</p>`;
}

let hello_world = hai();

let html = new Html();
let document = html.build(hello_world); 

console.log(document);
```

The output will be:
```html
<p>hai :3</p>
```

### Hello, safer world!

The example below creates a _safer_ fragment for client-side renders using `ClientHtml`. 

```ts
import type { Component } from "coyote";

import { ClientHtml, tmpl } from "coyote";

function maliciousComponent(): Component {
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
		${maliciousComponent()}
		<p>omgawsh hai >:3</p>
	`;
}

let hello_world = hai();

let safer_html = ClientHtml::new();    
let document = safer_html.build(hello_world); 

console.log(document);
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