export { assert };
function assert(expected, results) {
    let [document, error] = results;
    if (error) {
        return error;
    }
    if (expected !== document) {
        return `
Expected:
${expected}

Results:
${document}

`;
    }
}
