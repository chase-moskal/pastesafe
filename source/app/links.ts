
import {toBase64, fromBase64} from "../toolbox/bytes.js"
import {InviteLinkPayload, ByteEncoder, ByteDecoder} from "../types.js"

export const idchunkSize = 7
export const inviteRegex = /^#?invite-\S{7}([\S]+)$/

export function encodeInviteLink({
		baseUrl,
		payload,
		encode = toBase64,
	}: {
		baseUrl: string
		payload: InviteLinkPayload
		encode?: ByteEncoder
	}): string {
	const json = JSON.stringify(payload)
	const bytes = (new TextEncoder).encode(json)
	const idchunk = payload.sessionId.slice(0, idchunkSize)
	const encoded = encode(bytes)
	const sep = baseUrl.endsWith("/") ? "" : "/"
	return `${baseUrl}${sep}#invite-${idchunk}${encoded}`
}

export function decodeInviteLink({
		fragment,
		decode = fromBase64,
	}: {
		fragment: string
		decode?: ByteDecoder
	}): InviteLinkPayload {
	const parse = inviteRegex.exec(fragment)
	if (parse) {
		const [,encoded] = parse
		const bytes = decode(encoded)
		const json = (new TextDecoder).decode(bytes)
		return JSON.parse(json)
	}
}
