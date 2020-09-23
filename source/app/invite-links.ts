
import {InviteLink} from "../types.js"
import {toHex, fromHex} from "../toolbox/bytes.js"

export const sessionIdLength = 24
export const hintSize = 7
export const inviteRegex = /^#?i([\S]+)$/

export function encodeInviteLink({
		baseUrl,
		sessionId,
		sessionPublicKey,
	}: InviteLink): string {
	if (!baseUrl.endsWith("/")) baseUrl += "/"
	const binarySessionPublicKey = (new TextEncoder)
		.encode(JSON.stringify(sessionPublicKey))
	const hexKey = toHex(binarySessionPublicKey)
	return `${baseUrl}#i${sessionId}${hexKey}`
}

export function decodeInviteLink(link: string): InviteLink {
	const url = new URL(link)
	const parse = inviteRegex.exec(url.hash)
	if (parse) {
		const [,encoded] = parse
		const sessionId = encoded.slice(0, sessionIdLength)
		const bytes = fromHex(encoded.slice(sessionIdLength)).buffer
		const sessionPublicKey = JSON.parse(
			(new TextDecoder).decode(bytes)
		)
		return {
			baseUrl: url.origin + url.pathname,
			sessionId,
			sessionPublicKey,
		}
	}
}
