# Coyote-js

Create html with function components in Typescript / Javascript.

There are no dependencies.

## Install

```sh
npm install --save-dev https://github.com/wolfpup-software/coyote-js
```

## Components

```TS
import type { Component } from "coyote/coyote/mod.ts";

import { tmpl } from "coyote/coyote/mod.js";


function hai(): Component {
    return tmpl("<p>hai :3</p>", [])
}
```

## Html

```TS
import type { Component } from "coyote/coyote/mod.ts";

import { tmpl } from "coyote/coyote/mod.js";
import { Html } from "coyote/coyote_html/mod.js";

function hai(): Component {
    return tmpl("<p>hai :3</p>", [])
}

let hello_world = hai();

let html = new Html();
let document = html.compose(&rules, &hello_world);

console.log(document);
```

## License

`Coyote-js` is released under the BSD 3-Clause License.
