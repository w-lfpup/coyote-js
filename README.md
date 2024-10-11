# Coyote-js

Coyote templates for Typescript / Javascript!

## Meaningful Differences

Javascript ships with many MANY string utilities.

There is also an expectation for Javascript to work in servers and clients.

Which can make life bonkers.

Javascript also ships with template tagged literals which makes string building easy.

## Go with the flow

### SSR First

Embrace javascript's string interpolation.

On a server, create a string and run it through pretty_html(sieve, templateStr), send it to the client.

Easy safe html, done, sent from server to client.

### Client second

What if a client lazy loads a chunk of DOM?

Dom needs to be produced by the steps.

Where "html" creates html, a similar library named "dom" creates DOM from a template.

// on the server would be:
```TS
let username = "wolfpup";
let html = `<p>hai, {username}<p>`;
let pretty = prettyHtml(sieve, html);

return new Response("wolfpup.com/", pretty);
```
// or
```TS
let templateStr = await File.read("./greeting.html");
let pre_html = tmpl(templateStr, [username]);
let htmlStr = html(pre_html);
let pretty = prettyHtml(sieve, html);

return new Response("wolfpup.com/", pretty);
```


// on the client would be something like:
```TS
new CoyoteDom("<p>hai!{}</p>", [username]);
```

Honestly it's too much choice.

String interpolation in javascript is solid. Just go for backticks, call it a day.

Long as results are run through pretty_html, it's all good.

This doesn't translate for logic for dom though.
DOM needs a different process.