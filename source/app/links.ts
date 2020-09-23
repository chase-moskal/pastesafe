
import {InviteLinkPayload} from "../types.js"
import {toHex, fromHex} from "../toolbox/bytes.js"

export const hintSize = 7
export const inviteRegex = /^#?invite-\S{7}([\S]+)$/

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
