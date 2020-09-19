
import {toBase64, fromBase64} from "../toolbox/bytes.js"
import {InviteLinkPayload, ByteEncoder, ByteDecoder} from "../types.js"

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
	const encoded = encode(bytes)
	const sep = baseUrl.endsWith("/") ? "" : "/"
	return `${baseUrl}${sep}#invite-${encoded}`
}

export function decodeInviteLink({
		fragment,
		decode = fromBase64,
	}: {
		fragment: string
		decode?: ByteDecoder
	}): InviteLinkPayload {
	const parse = /^#?invite-([0-9a-f]+)$/.exec(fragment)
	if (parse) {
		const [,encoded] = parse
		const bytes = decode(encoded)
		const json = (new TextDecoder).decode(bytes)
		return JSON.parse(json)
	}
}
