# Coyote-js

Create html with function components in Typescript / Javascript.

There are no dependencies.

## Install

```sh
npm install --save-dev https://github.com/wolfpup-software/coyote-js
```

## Components

Create documents with coyote [components](./components.md).

```TS
import { tmpl } from "coyote";

function hai() {
    return tmpl`<p>hai :3</p>`;
}
```

## Document Builders

Render components as `html` with [document builders](./document_builders.md).

```TS
import { Html, tmpl } from "coyote";

function hai() {
    return tmpl`<p>hai :3</p>`;
}

let helloWorld = hai();
let html = new Html();

let document = html.build(helloWorld);
console.log(document);
```

The output will be:

```html
<p>hai :3</p>
```

## License

`Coyote-js` is released under the BSD 3-Clause License.
