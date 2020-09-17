export declare function generateSessionKeys(): Promise<{
    publicKey: JsonWebKey;
    privateKey: JsonWebKey;
}>;
export declare function encryptMessage({ message, publicKey }: {
    message: string;
    publicKey: JsonWebKey;
}): Promise<{
    aesCipherbinary: ArrayBuffer;
    messageCipherbinary: ArrayBuffer;
}>;
export declare function decryptMessage({ privateKey, aesCipherbinary, messageCipherbinary, }: {
    privateKey: JsonWebKey;
    aesCipherbinary: ArrayBuffer;
    messageCipherbinary: ArrayBuffer;
}): Promise<string>;
