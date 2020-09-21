
import {Suite, expect} from "cynic"

import {randex} from "./toolbox/randex.js"
import {generateKeys, encrypt} from "./toolbox/xcrypto.js"
import {encodeInviteLink, decodeInviteLink, encodeMessageLink} from "./app/links.js"

export default <Suite>{
	"crypto": {
		"inivte links, encoding and decoding": async() => {
			const baseUrl = "https://pastesafe.org/"
			const sessionId = randex()
			const {publicKey, privateKey} = await generateKeys()

			const inviteLink = encodeInviteLink({
				baseUrl,
				payload: {
					sessionId,
					sessionPublicKey: publicKey,
				},
			})
			const invite = decodeInviteLink({
				fragment: new URL(inviteLink).hash
			})

			const text = "abc123"
			const cipherText = await encrypt({text, publicKey})
			const messageLink = encodeMessageLink({
				baseUrl,
				payload: {
					sessionId,
					cipherText,
				},
			})

			return (
				expect(invite.sessionId).equals(sessionId)
				&& expect(messageLink).ok()
			)
		},
		"generic encryption": async() => {
			const {publicKey} = await generateKeys()
			async function encryptLength(n: number): Promise<string> {
				let text = ""
				for (let i = 0; i < n; i++) text += "a"
				return encrypt({text, publicKey})
			}
			const minisuite = {}
			for (const n of [0, 10, 380, 385, 1000])
				minisuite[`encrypt ${n} characters`] = async() => expect(
					await encryptLength(n)
				).ok()
			return minisuite
		}
	},
}
