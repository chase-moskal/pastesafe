
import {Suite, expect} from "cynic"

import {randex} from "./toolbox/randex.js"
import {toHex, fromHex} from "./toolbox/bytes.js"
import {generateSessionKeys} from "./toolbox/xcrypto.js"
import {encodeInviteLink, decodeInviteLink, encryptMessageLink, decryptMessageLink} from "./app/links.js"

const baseUrl = "https://pastesafe.org/"

export default <Suite>{
	"crypto": {
		"end to end": async() => {
			const sessionId = randex()
			const {publicKey, privateKey} = await generateSessionKeys()
			const inviteLink = encodeInviteLink({
				baseUrl,
				payload: {
					sessionId,
					sessionPublicKey: publicKey,
				},
			})
			const invite = decodeInviteLink(inviteLink)
			const message = "abc123"
			const messageLink = await encryptMessageLink({
				invite,
				baseUrl,
				message,
			})
			const message2 = await decryptMessageLink({
				link: messageLink,
				getPrivateKey: async id => privateKey,
			})
			return (
				expect(invite.sessionId).equals(sessionId)
				&& expect(messageLink).ok()
				&& expect(message2).equals(message)
			)
		},
		"message links": async() => {
			const {publicKey, privateKey} = await generateSessionKeys()
			const sessionId = randex()
			const message = "abc123"
			const link = await encryptMessageLink({
				message,
				baseUrl,
				invite: {sessionId, sessionPublicKey: publicKey},
			})
			const message2 = await decryptMessageLink({
				link,
				getPrivateKey: async() => privateKey,
			})
			return expect(message).equals(message2)
		},
		"hex back-and-forth works": async() => {
			const {buffer} = crypto.getRandomValues(new Uint8Array(8))
			const hex = toHex(new Uint8Array(buffer))
			return expect(hex).equals(
				toHex(fromHex(hex))
			)
		},
		// "base64 back-and-forth works": async() => {
		// 	const {buffer} = crypto.getRandomValues(new Uint8Array(8))
		// 	const base64 = toBase64(new Uint8Array(buffer))
		// 	return expect(base64).equals(
		// 		toBase64(fromBase64(base64))
		// 	)
		// },
	},
}
