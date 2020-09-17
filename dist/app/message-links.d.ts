import { InvitePayload, EncryptedMessage, MessageLink } from "../types.js";
export declare const messagePrefix = "m";
export declare const messageRegex: RegExp;
export declare function encryptMessageData({ message, invite }: {
    message: string;
    invite: InvitePayload;
}): Promise<EncryptedMessage>;
export declare function encodeMessageLink({ baseUrl, sessionId, messageCipherbinary, aesCipherbinary, }: MessageLink): string;
export declare function decodeMessageLink(link: string): MessageLink;
export declare function decryptMessageData({ encrypted, getPrivateKey }: {
    encrypted: EncryptedMessage;
    getPrivateKey: (sessionId: string) => Promise<JsonWebKey | undefined>;
}): Promise<string>;
