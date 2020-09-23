
import {Suite, expect} from "cynic"

import {EncryptedMessage} from "./types.js"
import {encodeInviteLink, decodeInviteLink} from "./app/invite-links.js"
import {encryptMessageData, encodeMessageLink, decryptMessageData, decodeMessageLink} from "./app/message-links.js"

import {randex} from "./toolbox/randex.js"
import * as tinybin from "./toolbox/tinybin.js"
import {generateSessionKeys} from "./toolbox/xcrypto.js"
import {encodeHex, decodeHex, encodeBase64url, decodeBase64url} from "./toolbox/bytes.js"

const baseUrl = "https://pastesafe.org/"

export default <Suite>{
	"byte utils": {
		"hex back-and-forth": async() => {
			const {buffer} = crypto.getRandomValues(new Uint8Array(8))
			const hex = encodeHex(new Uint8Array(buffer))
			return expect(hex).equals(
				encodeHex(decodeHex(hex))
			)
		},
		"base64 back-and-forth works": async() => {
			const {buffer} = crypto.getRandomValues(new Uint8Array(8))
			const base64 = encodeBase64url(new Uint8Array(buffer))
			return expect(base64).equals(
				encodeBase64url(decodeBase64url(base64))
			)
		},
	},
	"tinybin": {
		"sequence and unsequence": async() => {
			const before1 = crypto.getRandomValues(new Uint8Array(8)).buffer
			const before2 = crypto.getRandomValues(new Uint8Array(5)).buffer
			const buffer = tinybin.sequence([
				before1,
				before2,
				before1,
				before2,
			])

			const [
				after1,
				after2,
				after3,
				after4,
			] = tinybin.unsequence(buffer)

			const h = (buffer: ArrayBuffer) => encodeHex(new Uint8Array(buffer))
			return expect(h(after1)).equals(h(before1))
				&& expect(h(after2)).equals(h(before2))
				&& expect(h(after3)).equals(h(before1))
				&& expect(h(after4)).equals(h(before2))
		},
	},
	"message links": {
		"encode and decode": async() => {
			const original: EncryptedMessage = {
				sessionId: "a123",
				aesCipherbinary: decodeHex("deadbeef01").buffer,
				messageCipherbinary: decodeHex("deadbeef02").buffer,
			}

			const link = encodeMessageLink({
				baseUrl,
				...original,
			})
			const decoded = decodeMessageLink(link)

			const aesHex = encodeHex(new Uint8Array(decoded.aesCipherbinary))
			const messageHex = encodeHex(new Uint8Array(decoded.messageCipherbinary))
			const aesMatch = aesHex === "deadbeef01"
			const messageMatch = messageHex === "deadbeef02"

			return expect(decoded.baseUrl).equals(baseUrl)
				&& expect(decoded.sessionId).equals(original.sessionId)
				&& expect(aesMatch).ok()
				&& expect(messageMatch).ok()
		},
		"encryption and decryption": async() => {
			const {publicKey, privateKey} = await generateSessionKeys()
			const sessionId = randex()
			const message = "abc123"
			const encrypted = await encryptMessageData({
				message,
				invite: {sessionId, sessionPublicKey: publicKey},
			})
			const message2 = await decryptMessageData({
				encrypted,
				getPrivateKey: async() => privateKey,
			})
			return expect(message).equals(message2)
		},
		"message end to end": async() => {
			const {publicKey, privateKey} = await generateSessionKeys()
			const sessionId = randex()
			const message = "abc123"
			const encrypted = await encryptMessageData({
				message,
				invite: {sessionId, sessionPublicKey: publicKey},
			})
			const link = encodeMessageLink({
				baseUrl,
				...encrypted,
			})
			const payload2 = decodeMessageLink(link)
			const message2 = await decryptMessageData({
				encrypted: payload2,
				getPrivateKey: async() => privateKey,
			})
			return expect(message).equals(message2)
		},
	},
	"crypto": {
		"pastesafe end to end": async() => {
			const sessionId = randex()
			const {publicKey, privateKey} = await generateSessionKeys()
			const inviteLink = encodeInviteLink({
				baseUrl,
				sessionId,
				sessionPublicKey: publicKey,
			})
			const invite = decodeInviteLink(inviteLink)
			const message = "abc123"
			const encrypted = await encryptMessageData({
				invite,
				message,
			})
			const messageLink = encodeMessageLink({
				baseUrl,
				...encrypted,
			})
			const encrypted2 = decodeMessageLink(messageLink)
			const message2 = await decryptMessageData({
				encrypted: encrypted2,
				getPrivateKey: async id => privateKey,
			})
			return (
				expect(invite.sessionId).equals(sessionId)
					&& expect(messageLink).ok()
					&& expect(message2).equals(message)
			)
		},
	},
}
