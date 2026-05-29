export function assert(expected, results) {
    let [doc, error] = results;
    if (error) {
        return error;
    }
    if (expected !== doc) {
        return `
Expected:
${expected}

Results:
${doc}

`;
    }
}
