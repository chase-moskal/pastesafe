
import * as tinybin from "../toolbox/tinybin.js"
import {toHex, fromHex} from "../toolbox/bytes.js"
import {encryptMessage, decryptMessage} from "../toolbox/xcrypto.js"
import {InviteLinkPayload, EncryptedMessage} from "../types.js"

export const messagePrefix = "m"
export const messageRegex = /^#?m([\S]+)$/

export async function encryptMessageData({message, invite}: {
		message: string
		invite: InviteLinkPayload
	}): Promise<EncryptedMessage> {
	const {
		aesCipherbinary,
		messageCipherbinary,
	} = await encryptMessage({
		message,
		publicKey: invite.sessionPublicKey,
	})
	return {
		sessionId: invite.sessionId,
		aesCipherbinary: aesCipherbinary,
		messageCipherbinary: messageCipherbinary,
	}
}

export function encodeMessageLink({baseUrl, sessionId, messageCipherbinary, aesCipherbinary}: EncryptedMessage & {baseUrl: string}): string {
	if (!baseUrl.endsWith("/")) baseUrl += "/"
	const binarySessionId = fromHex(sessionId).buffer

	const randomByte = crypto.getRandomValues(new Uint8Array(1))[0]
	const randomSize = Math.floor((randomByte / 8) + 1)
	const random = crypto.getRandomValues(new Uint8Array(randomSize))

	const binary = tinybin.sequence([
		random.buffer,
		messageCipherbinary,
		aesCipherbinary,
		binarySessionId,
	])

	const encoded = toHex(new Uint8Array(binary))
	return `${baseUrl}#${messagePrefix}${encoded}`
}

export function decodeMessageLink(link: string): EncryptedMessage & {baseUrl: string} {
	const url = new URL(link)
	const parse = messageRegex.exec(url.hash)
	if (parse) {
		const [,encoded] = parse
		const uint = fromHex(encoded)
		const [
			randomBuffer,
			messageCipherbinary,
			aesCipherbinary,
			binarySessionId,
		] = tinybin.unsequence(uint.buffer)
		return {
			baseUrl: url.origin + url.pathname,
			sessionId: toHex(new Uint8Array(binarySessionId)),
			aesCipherbinary,
			messageCipherbinary,
		}
	}
}

export async function decryptMessageData({encrypted, getPrivateKey}: {
		encrypted: EncryptedMessage
		getPrivateKey: (sessionId: string) => Promise<JsonWebKey | undefined>
	}): Promise<string> {
	const {
		sessionId,
		aesCipherbinary,
		messageCipherbinary,
	} = encrypted
	const privateKey = await getPrivateKey(sessionId)
	if (!privateKey) throw new Error("no session")
	const message = await decryptMessage({
		privateKey,
		aesCipherbinary,
		messageCipherbinary,
	})
	return message
}
