export function hash(input) {
    let result;
    for (let i = 0; i < input.length; i++) {
        result = Math.imul(31, result) + input.charCodeAt(i) | 0;
    }
    return result;
}
export function hashAny(x) {
    return hash(x === undefined ? "" : JSON.stringify(x));
}
//# sourceMappingURL=hash.js.map