var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const hash = "SHA-256";
const modulusLength = 2048;
export function generateSessionKeys() {
    return __awaiter(this, void 0, void 0, function* () {
        const extractable = true;
        const { privateKey, publicKey } = yield crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength,
            hash,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        }, extractable, ["encrypt", "decrypt"]);
        return {
            publicKey: yield crypto.subtle.exportKey("jwk", publicKey),
            privateKey: yield crypto.subtle.exportKey("jwk", privateKey),
        };
    });
}
const ivSize = 12;
function viewMessageBinary(buffer) {
    return {
        iv: new Uint8Array(buffer, 0, ivSize),
        message: new Uint8Array(buffer, ivSize, buffer.byteLength - ivSize),
    };
}
export function encryptMessage({ message, publicKey }) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        // generate aes encryption key
        //
        const aesCryptoKey = yield crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
        const aesKey = yield crypto.subtle.exportKey("jwk", aesCryptoKey);
        //
        // rsa-encrypt the aes key with the session public key
        //
        const rsaCryptoKey = yield crypto.subtle.importKey("jwk", publicKey, { name: "RSA-OAEP", hash }, false, ["encrypt"]);
        const aesPortable = (new TextEncoder).encode(JSON.stringify(aesKey));
        const aesCipherbinary = yield crypto.subtle.encrypt("RSA-OAEP", rsaCryptoKey, aesPortable);
        //
        // aes-encrypt the message
        //
        const messageBytes = (new TextEncoder).encode(message);
        const ivBytes = crypto.getRandomValues(new Uint8Array(ivSize));
        const messageCipherbytes = new Uint8Array(yield crypto.subtle.encrypt({ name: "AES-GCM", iv: ivBytes }, aesCryptoKey, messageBytes));
        const messageCipherbinary = new ArrayBuffer(ivSize + messageCipherbytes.byteLength);
        const views = viewMessageBinary(messageCipherbinary);
        views.iv.set(ivBytes);
        views.message.set(messageCipherbytes);
        return {
            aesCipherbinary,
            messageCipherbinary,
        };
    });
}
export function decryptMessage({ privateKey, aesCipherbinary, messageCipherbinary, }) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        // import our private key
        //
        const privateCryptoKey = yield crypto.subtle.importKey("jwk", privateKey, { name: "RSA-OAEP", hash }, false, ["decrypt"]);
        //
        // rsa-decrypt and import the aes key
        //
        const aesBinary = yield crypto.subtle.decrypt("RSA-OAEP", privateCryptoKey, aesCipherbinary);
        const aesKey = JSON.parse((new TextDecoder).decode(aesBinary));
        const aesCryptoKey = yield crypto.subtle.importKey("jwk", aesKey, "AES-GCM", false, ["decrypt"]);
        //
        // aes-decrypt the message
        //
        const views = viewMessageBinary(messageCipherbinary);
        const messageBinary = yield crypto.subtle.decrypt({ name: "AES-GCM", iv: views.iv }, aesCryptoKey, views.message);
        const message = new TextDecoder().decode(messageBinary);
        return message;
    });
}
//# sourceMappingURL=xcrypto.js.map