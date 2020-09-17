import { randex } from "../toolbox/randex.js";
import { encode, decode } from "./portable-binary.js";
export const messagePrefix = "i";
export const inviteRegex = /^#?i(.+)$/;
export const sessionIdLength = randex().length;
export function encodeInviteLink({ baseUrl, sessionId, sessionPublicKey, }) {
    if (!baseUrl.endsWith("/"))
        baseUrl += "/";
    const binarySessionPublicKey = (new TextEncoder)
        .encode(JSON.stringify(sessionPublicKey));
    const hexKey = encode(binarySessionPublicKey);
    return `${baseUrl}#i${sessionId}${hexKey}`;
}
export function decodeInviteLink(link) {
    const url = new URL(link);
    const parse = inviteRegex.exec(url.hash);
    if (parse) {
        const [, encoded] = parse;
        const sessionId = encoded.slice(0, sessionIdLength);
        const bytes = decode(encoded.slice(sessionIdLength)).buffer;
        const sessionPublicKey = JSON.parse((new TextDecoder).decode(bytes));
        return {
            baseUrl: url.origin + url.pathname,
            sessionId,
            sessionPublicKey,
        };
    }
}
//# sourceMappingURL=invite-links.js.map