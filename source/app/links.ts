
import {toBase64, fromBase64} from "../toolbox/bytes.js"
import {InviteLinkPayload, ByteEncoder, ByteDecoder, MessageLinkPayload} from "../types.js"

export const hintSize = 7
export const inviteRegex = /^#?invite-\S{7}([\S]+)$/
export const messageRegex = /^#?message-\S{7}([\S]+)$/
const encode: ByteEncoder = toBase64
const decode: ByteDecoder = fromBase64

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
	const encoded = encode(bytes)
	const sep = baseUrl.endsWith("/") ? "" : "/"
	return `${baseUrl}${sep}#invite-${hint}${encoded}`
}

export function decodeInviteLink({fragment}: {
		fragment: string
	}): InviteLinkPayload {
	const parse = inviteRegex.exec(fragment)
	if (parse) {
		const [,encoded] = parse
		const bytes = decode(encoded)
		const json = (new TextDecoder).decode(bytes)
		return JSON.parse(json)
	}
}

export function encodeMessageLink({baseUrl, payload}: {
		baseUrl: string
		payload: MessageLinkPayload
	}): string {
	const json = JSON.stringify(payload)
	const bytes = (new TextEncoder).encode(json)
	const hint1 = payload.sessionId.slice(0, 3)
	const hint2 = payload.cipherText.slice(0, hintSize - hint1.length)
	const hint = hint1 + hint2
	const encoded = encode(bytes)
	const sep = baseUrl.endsWith("/") ? "" : "/"
	return `${baseUrl}${sep}#message-${hint}${encoded}`
}
