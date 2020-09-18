
import {Keys} from "../types.js"

export async function generateKeys(): Promise<Keys> {
	const {privateKey, publicKey} = await crypto.subtle.generateKey(
		{
			name: "RSA-OAEP",
			modulusLength: 4096,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
			hash: {name: "SHA-256"},
		},
		true,
		["encrypt", "decrypt"],
	)
	return {
		publicKey: await crypto.subtle.exportKey("jwk", publicKey),
		privateKey: await crypto.subtle.exportKey("jwk", privateKey),
	}
}
