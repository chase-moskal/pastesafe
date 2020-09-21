
import {toHex, fromHex} from "../toolbox/bytes.js"
import {InviteLinkPayload, MessageLinkPayload} from "../types.js"
import {encryptMessage, decryptMessage} from "../toolbox/xcrypto.js"

export const hintSize = 7
export const inviteRegex = /^#?invite-\S{7}([\S]+)$/
export const messageRegex = /^#?message-\S{7}([\S]+)$/

export function encodeInviteLink({
		baseUrl,
		payload,
	}: {
		baseUrl: string
		payload: InviteLinkPayload
	}): string {
	const json = JSON.stringify(payload)
	const bytes = (new TextEncoder).encode(json)
	const hint = payload.sessionId.slice(0, hintSize)
	const encoded = toHex(bytes)
	const sep = baseUrl.endsWith("/") ? "" : "/"
	return `${baseUrl}${sep}#invite-${hint}${encoded}`
}

export function decodeInviteLink(link: string): InviteLinkPayload {
	const fragment = new URL(link).hash
	const parse = inviteRegex.exec(fragment)
	if (parse) {
		const [,encoded] = parse
		const bytes = fromHex(encoded)
		const json = (new TextDecoder).decode(bytes)
		return JSON.parse(json)
	}
}

export async function encryptMessageLink({baseUrl, message, invite}: {
		baseUrl: string
		message: string
		invite: InviteLinkPayload
	}): Promise<string> {
	const {
		aesCipherbinary,
		messageCipherbinary,
	} = await encryptMessage({
		message,
		publicKey: invite.sessionPublicKey,
	})
	const payload: MessageLinkPayload = {
		sessionId: invite.sessionId,
		aesCiphertext: toHex(new Uint8Array(aesCipherbinary)),
		messageCiphertext: toHex(new Uint8Array(messageCipherbinary)),
	}
	const json = JSON.stringify(payload)
	const bytes = (new TextEncoder).encode(json)
	const hint1 = payload.sessionId.slice(0, 3)
	const hint2 = payload.messageCiphertext.slice(0, hintSize - hint1.length)
	const hint = hint1 + hint2
	const encoded = toHex(bytes)
	const sep = baseUrl.endsWith("/") ? "" : "/"
	return `${baseUrl}${sep}#message-${hint}${encoded}`
}

export async function decryptMessageLink({link, getPrivateKey}: {
		link: string
		getPrivateKey: (sessionId: string) => Promise<JsonWebKey | undefined>
	}): Promise<string> {
	const fragment = new URL(link).hash
	const parse = messageRegex.exec(fragment)
	if (parse) {
		const [,encoded] = parse
		const bytes = fromHex(encoded)
		const json = (new TextDecoder).decode(bytes)
		const payload: MessageLinkPayload = JSON.parse(json)
		const aesCipherbinary = fromHex(payload.aesCiphertext).buffer
		const messageCipherbinary = fromHex(payload.messageCiphertext).buffer
		const privateKey = await getPrivateKey(payload.sessionId)
		if (!privateKey) throw new Error("no session")
		const message = await decryptMessage({
			privateKey,
			aesCipherbinary,
			messageCipherbinary,
		})
		return message
	}
}
