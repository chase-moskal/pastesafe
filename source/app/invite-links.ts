
import {InviteLink} from "../types.js"
import * as tinybin from "../toolbox/tinybin.js"
import {toHex, fromHex} from "../toolbox/bytes.js"

export const hintSize = 7
export const inviteRegex = /^#?inv([\S]+)$/

export function encodeInviteLink({
		baseUrl,
		sessionId,
		sessionPublicKey,
	}: InviteLink): string {
	if (!baseUrl.endsWith("/")) baseUrl += "/"
	const binarySessionId = fromHex(sessionId).buffer
	const binarySessionPublicKey = (new TextEncoder).encode(
		JSON.stringify(sessionPublicKey)
	).buffer
	const binary = tinybin.sequence([
		binarySessionId,
		binarySessionPublicKey,
	])
	const encoded = toHex(new Uint8Array(binary))
	return `${baseUrl}#inv${encoded}`
}

export function decodeInviteLink(link: string): InviteLink {
	const url = new URL(link)
	const parse = inviteRegex.exec(url.hash)
	if (parse) {
		const [,encoded] = parse
		const bytes = fromHex(encoded).buffer
		const [
			binarySessionId,
			binarySessionPublicKey,
		] = tinybin.unsequence(bytes)
		const sessionId = toHex(new Uint8Array(binarySessionId))
		const sessionPublicKey = JSON.parse((new TextDecoder).decode(binarySessionPublicKey))
		return {
			baseUrl: url.origin + url.pathname,
			sessionId,
			sessionPublicKey,
		}
	}
}
