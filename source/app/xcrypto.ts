
import * as bytes from "../toolbox/bytes.js"

const algo: RsaHashedKeyGenParams = {
	name: "RSA-OAEP",
	modulusLength: 4096,
	publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
	hash: {name: "SHA-512"},
}

export async function generateKeys(): Promise<{
		publicKey: JsonWebKey
		privateKey: JsonWebKey
	}> {
	const extractable = true
	const {privateKey, publicKey} = <CryptoKeyPair>await crypto.subtle.generateKey(
		algo,
		extractable,
		["encrypt", "decrypt"],
	)
	return {
		publicKey: await crypto.subtle.exportKey("jwk", publicKey),
		privateKey: await crypto.subtle.exportKey("jwk", privateKey),
	}
}

export async function encrypt({text, publicKey}: {
		text: string
		publicKey: JsonWebKey
	}): Promise<string> {
	const cryptoKey = await importKey(publicKey, ["encrypt"])
	const data = (new TextEncoder).encode(text)
	const cipherData = await crypto.subtle.encrypt(
		{name: algo.name},
		cryptoKey,
		data,
	)
	const cipherText = bytes.toBase64(new Uint8Array(cipherData))
	return cipherText
}

export async function decrypt({cipherText, privateKey}: {
		cipherText: string
		privateKey: JsonWebKey
	}): Promise<string> {
	const cryptoKey = await importKey(privateKey, ["decrypt"])
	const cipherData = bytes.fromBase64(cipherText)
	const data = await crypto.subtle.decrypt(
		{name: algo.name},
		cryptoKey,
		cipherData,
	)
	const text = (new TextDecoder).decode(data)
	return text
}

async function importKey(key: JsonWebKey, usages: ("encrypt" | "decrypt")[]) {
	const unextractable = false
	return crypto.subtle.importKey(
		"jwk",
		key,
		{name: algo.name, hash: algo.hash},
		unextractable,
		usages,
	)
}
