# Coyote-js

Coyote templates for Typescript / Javascript!

## Meaningful Differences

`Coyote` was originally written in rust for fast (and optionally dynamic) server side rendering.

Javascript ships with many MANY string utilities including tagged template literals.

## Go with the flow

### SSR First

Embrace javascript's string interpolation.

On a server, create a nested string and run it through pretty_html(sieve, templateStr), send it to the client.

Easy safe html, done, sent from server to client.

```TS
let username = "wolfpup";
let html = `<p>hai, {username}<p>`;
let pretty = prettyHtml(sieve, html);

return new Response("wolfpup.com/", pretty);
```

## Read from disk

```TS
let jsonFile = await File.read("./user_data.json");
let userData = JSON.parse(jsonFile);

let templateStr = await File.read("./greeting.html");
let htmlImr = tmpl(templateStr, [userData.username]);

let htmlStr = html(htmlImr);
let pretty = prettyHtml(sieve, htmlImr);

return new Response("wolfpup.com/", pretty);
```
