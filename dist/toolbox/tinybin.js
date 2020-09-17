export function sequence(buffers) {
    let total = 0;
    const parts = [];
    for (const buffer of buffers) {
        const indexBuffer = makeIndexBuffer(buffer.byteLength);
        parts.push(indexBuffer, buffer);
        total += indexBuffer.byteLength + buffer.byteLength;
    }
    let runningTotal = 0;
    const uint = new Uint8Array(total);
    for (const buffer of parts) {
        uint.set(new Uint8Array(buffer), runningTotal);
        runningTotal += buffer.byteLength;
    }
    return uint.buffer;
}
export function unsequence(buffer) {
    const uint = new Uint8Array(buffer);
    const buffers = [];
    let progress = 0;
    while (progress < buffer.byteLength) {
        const index = new Uint16Array(uint.slice(progress, progress + 2).buffer);
        progress += index.byteLength;
        const contentLength = index[0];
        const content = uint.slice(progress, progress + contentLength).buffer;
        buffers.push(content);
        progress += contentLength;
    }
    return buffers;
}
function makeIndexBuffer(byteLength) {
    if (byteLength > (Math.pow(2, 16)))
        throw new Error("16-bit index too small for content");
    const uint = new Uint16Array([1]);
    uint.set([byteLength]);
    return uint.buffer;
}
//# sourceMappingURL=tinybin.js.map