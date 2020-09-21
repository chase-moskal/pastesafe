
export async function generateSessionKeys(): Promise<{
		publicKey: JsonWebKey
		privateKey: JsonWebKey
	}> {
	const extractable = true
	const {privateKey, publicKey} = <CryptoKeyPair>await crypto.subtle.generateKey(
		{
			name: "RSA-OAEP",
			modulusLength: 4096,
			hash: "SHA-512",
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
		},
		extractable,
		["encrypt", "decrypt"],
	)
	return {
		publicKey: await crypto.subtle.exportKey("jwk", publicKey),
		privateKey: await crypto.subtle.exportKey("jwk", privateKey),
	}
}

const ivSize = 12

function viewMessageBinary(buffer: ArrayBuffer) {
	return {
		iv: new Uint8Array(buffer, 0, ivSize),
		message: new Uint8Array(buffer, ivSize, buffer.byteLength - ivSize),
	}
}

export async function encryptMessage({message, publicKey}: {
		message: string
		publicKey: JsonWebKey
	}) {

	//
	// generate aes encryption key
	//

	const aesCryptoKey = await crypto.subtle.generateKey(
		{name: "AES-GCM", length: 256},
		true,
		["encrypt", "decrypt"]
	)

	const aesKey = await crypto.subtle.exportKey("jwk", aesCryptoKey)

	//
	// rsa-encrypt the aes key with the session public key
	//

	const rsaCryptoKey = await crypto.subtle.importKey(
		"jwk",
		publicKey,
		{name: "RSA-OAEP", hash: "SHA-512"},
		false,
		["encrypt"]
	)

	const aesPortable = (new TextEncoder).encode(JSON.stringify(aesKey))
	const aesCipherbinary = await crypto.subtle.encrypt(
		"RSA-OAEP",
		rsaCryptoKey,
		aesPortable
	)

	//
	// aes-encrypt the message
	//

	const messageBytes = (new TextEncoder).encode(message)
	const ivBytes = crypto.getRandomValues(new Uint8Array(ivSize))
	const messageCipherbytes = new Uint8Array(await crypto.subtle.encrypt(
		{name: "AES-GCM", iv: ivBytes},
		aesCryptoKey,
		messageBytes
	))
	const messageCipherbinary = new ArrayBuffer(
		ivSize + messageCipherbytes.byteLength
	)
	const views = viewMessageBinary(messageCipherbinary)
	views.iv.set(ivBytes)
	views.message.set(messageCipherbytes)

	return {
		aesCipherbinary,
		messageCipherbinary,
	}
}

export async function decryptMessage({
		privateKey,
		aesCipherbinary,
		messageCipherbinary,
	}: {
		privateKey: JsonWebKey
		aesCipherbinary: ArrayBuffer
		messageCipherbinary: ArrayBuffer
	}) {

	//
	// import our private key
	//

	const privateCryptoKey = await crypto.subtle.importKey(
		"jwk",
		privateKey,
		{name: "RSA-OAEP", hash: "SHA-512"},
		false,
		["decrypt"]
	)

	//
	// rsa-decrypt and import the aes key
	//

	const aesBinary = await crypto.subtle.decrypt(
		"RSA-OAEP",
		privateCryptoKey,
		aesCipherbinary
	)

	const aesKey: JsonWebKey = JSON.parse(
		(new TextDecoder).decode(aesBinary)
	)

	const aesCryptoKey = await crypto.subtle.importKey(
		"jwk",
		aesKey,
		"AES-GCM",
		false,
		["decrypt"]
	)

	//
	// aes-decrypt the message
	//

	const views = viewMessageBinary(messageCipherbinary)

	const messageBinary = await crypto.subtle.decrypt(
		{name: "AES-GCM", iv: views.iv},
		aesCryptoKey,
		views.message
	)

	const message = new TextDecoder().decode(messageBinary)
	return message
}
