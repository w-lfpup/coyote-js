# Coyote-js

[![Tests](https://github.com/w-lfpup/wctk-js/actions/workflows/tests.yml/badge.svg)](https://github.com/w-lfpup/wctk-js/actions/workflows/Tests.yml)

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
import { Coyote, tmpl } from "coyote";

function hai() {
    return tmpl`<p>hai :3</p>`;
}

let coyote = new Coyote();

let [document, _error] = coyote.render(hai());

console.log(document);
```

The output will be:

```html
<p>hai :3</p>
```

## License

`Coyote-js` is released under the BSD 3-Clause License.
