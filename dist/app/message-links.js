var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as tinybin from "../toolbox/tinybin.js";
import { encode, decode } from "./portable-binary.js";
import { encryptMessage, decryptMessage } from "../toolbox/xcrypto.js";
export const messagePrefix = "m";
export const messageRegex = /^#?m(.+)$/;
export function encryptMessageData({ message, invite }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { aesCipherbinary, messageCipherbinary, } = yield encryptMessage({
            message,
            publicKey: invite.sessionPublicKey,
        });
        return {
            sessionId: invite.sessionId,
            aesCipherbinary: aesCipherbinary,
            messageCipherbinary: messageCipherbinary,
        };
    });
}
export function encodeMessageLink({ baseUrl, sessionId, messageCipherbinary, aesCipherbinary, }) {
    if (!baseUrl.endsWith("/"))
        baseUrl += "/";
    const binarySessionId = decode(sessionId).buffer;
    const randomByte = crypto.getRandomValues(new Uint8Array(1))[0];
    const randomSize = Math.floor((randomByte / 8) + 1);
    const random = crypto.getRandomValues(new Uint8Array(randomSize));
    const binary = tinybin.sequence([
        random.buffer,
        messageCipherbinary,
        aesCipherbinary,
        binarySessionId,
    ]);
    const encoded = encode(new Uint8Array(binary));
    return `${baseUrl}#${messagePrefix}${encoded}`;
}
export function decodeMessageLink(link) {
    const url = new URL(link);
    const parse = messageRegex.exec(url.hash);
    if (parse) {
        const [, encoded] = parse;
        const uint = decode(encoded);
        const [randomBuffer, messageCipherbinary, aesCipherbinary, binarySessionId,] = tinybin.unsequence(uint.buffer);
        return {
            baseUrl: url.origin + url.pathname,
            sessionId: encode(new Uint8Array(binarySessionId)),
            aesCipherbinary,
            messageCipherbinary,
        };
    }
}
export function decryptMessageData({ encrypted, getPrivateKey }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sessionId, aesCipherbinary, messageCipherbinary, } = encrypted;
        const privateKey = yield getPrivateKey(sessionId);
        if (!privateKey)
            throw new Error("no session");
        const message = yield decryptMessage({
            privateKey,
            aesCipherbinary,
            messageCipherbinary,
        });
        return message;
    });
}
//# sourceMappingURL=message-links.js.map