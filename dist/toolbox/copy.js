export function copy(x) {
    return (x === undefined)
        ? undefined
        : JSON.parse(JSON.stringify(x));
}
//# sourceMappingURL=copy.js.map