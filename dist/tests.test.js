var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect } from "cynic";
import { encodeInviteLink, decodeInviteLink } from "./app/invite-links.js";
import { encryptMessageData, encodeMessageLink, decryptMessageData, decodeMessageLink } from "./app/message-links.js";
import { randex } from "./toolbox/randex.js";
import * as tinybin from "./toolbox/tinybin.js";
import { generateSessionKeys } from "./toolbox/xcrypto.js";
import { encodeHex, decodeHex, encodeBase64url, decodeBase64url } from "./toolbox/bytes.js";
const baseUrl = "https://pastesafe.org/";
export default {
    "byte utils": {
        "hex back-and-forth": () => __awaiter(void 0, void 0, void 0, function* () {
            const { buffer } = crypto.getRandomValues(new Uint8Array(8));
            const hex = encodeHex(new Uint8Array(buffer));
            return expect(hex).equals(encodeHex(decodeHex(hex)));
        }),
        "base64 back-and-forth works": () => __awaiter(void 0, void 0, void 0, function* () {
            const { buffer } = crypto.getRandomValues(new Uint8Array(8));
            const base64 = encodeBase64url(new Uint8Array(buffer));
            return expect(base64).equals(encodeBase64url(decodeBase64url(base64)));
        }),
    },
    "tinybin": {
        "sequence and unsequence": () => __awaiter(void 0, void 0, void 0, function* () {
            const before1 = crypto.getRandomValues(new Uint8Array(8)).buffer;
            const before2 = crypto.getRandomValues(new Uint8Array(5)).buffer;
            const buffer = tinybin.sequence([
                before1,
                before2,
                before1,
                before2,
            ]);
            const [after1, after2, after3, after4,] = tinybin.unsequence(buffer);
            const h = (buffer) => encodeHex(new Uint8Array(buffer));
            return expect(h(after1)).equals(h(before1))
                && expect(h(after2)).equals(h(before2))
                && expect(h(after3)).equals(h(before1))
                && expect(h(after4)).equals(h(before2));
        }),
    },
    "message links": {
        "encode and decode": () => __awaiter(void 0, void 0, void 0, function* () {
            const original = {
                sessionId: "a123",
                aesCipherbinary: decodeHex("deadbeef01").buffer,
                messageCipherbinary: decodeHex("deadbeef02").buffer,
            };
            const link = encodeMessageLink(Object.assign({ baseUrl }, original));
            const decoded = decodeMessageLink(link);
            const aesHex = encodeHex(new Uint8Array(decoded.aesCipherbinary));
            const messageHex = encodeHex(new Uint8Array(decoded.messageCipherbinary));
            const aesMatch = aesHex === "deadbeef01";
            const messageMatch = messageHex === "deadbeef02";
            return expect(decoded.baseUrl).equals(baseUrl)
                && expect(decoded.sessionId).equals(original.sessionId)
                && expect(aesMatch).ok()
                && expect(messageMatch).ok();
        }),
        "encryption and decryption": () => __awaiter(void 0, void 0, void 0, function* () {
            const { publicKey, privateKey } = yield generateSessionKeys();
            const sessionId = randex();
            const message = "abc123";
            const encrypted = yield encryptMessageData({
                message,
                invite: { sessionId, sessionPublicKey: publicKey },
            });
            const message2 = yield decryptMessageData({
                encrypted,
                getPrivateKey: () => __awaiter(void 0, void 0, void 0, function* () { return privateKey; }),
            });
            return expect(message).equals(message2);
        }),
        "message end to end": () => __awaiter(void 0, void 0, void 0, function* () {
            const { publicKey, privateKey } = yield generateSessionKeys();
            const sessionId = randex();
            const message = "abc123";
            const encrypted = yield encryptMessageData({
                message,
                invite: { sessionId, sessionPublicKey: publicKey },
            });
            const link = encodeMessageLink(Object.assign({ baseUrl }, encrypted));
            const payload2 = decodeMessageLink(link);
            const message2 = yield decryptMessageData({
                encrypted: payload2,
                getPrivateKey: () => __awaiter(void 0, void 0, void 0, function* () { return privateKey; }),
            });
            return expect(message).equals(message2);
        }),
    },
    "crypto": {
        "pastesafe end to end": () => __awaiter(void 0, void 0, void 0, function* () {
            const sessionId = randex();
            const { publicKey, privateKey } = yield generateSessionKeys();
            const inviteLink = encodeInviteLink({
                baseUrl,
                sessionId,
                sessionPublicKey: publicKey,
            });
            const invite = decodeInviteLink(inviteLink);
            const message = "abc123";
            const encrypted = yield encryptMessageData({
                invite,
                message,
            });
            const messageLink = encodeMessageLink(Object.assign({ baseUrl }, encrypted));
            const encrypted2 = decodeMessageLink(messageLink);
            const message2 = yield decryptMessageData({
                encrypted: encrypted2,
                getPrivateKey: (id) => __awaiter(void 0, void 0, void 0, function* () { return privateKey; }),
            });
            return (expect(invite.sessionId).equals(sessionId)
                && expect(messageLink).ok()
                && expect(message2).equals(message));
        }),
    },
};
//# sourceMappingURL=tests.test.js.map