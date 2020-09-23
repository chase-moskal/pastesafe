
import {toHex} from "./bytes.js"

export function randex() {
	const randomBytes = crypto.getRandomValues(new Uint8Array(12))
	return toHex(randomBytes)
}
