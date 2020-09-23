
export function toHex(bytes: Uint8Array) {
	let result = ""
	for (const byte of bytes) {
		result += ('0' + (byte & 0xFF).toString(16)).slice(-2)
	}
	return result
}

export function fromHex(hex: string): Uint8Array {
	const result: number[] = []
	for (let i = 0; i < hex.length; i += 2)
		result.push(parseInt(hex.substr(i, 2), 16))
	return new Uint8Array(result)
}

export function toBase64url(bytes: Uint8Array): string {
	return btoa(String.fromCharCode(...bytes))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
}

export function fromBase64url(base64: string): Uint8Array {
	return new Uint8Array(
		Array.from(
			atob(
				addEqualsPadding(
					base64
						.replace(/-/g, "+")
						.replace(/_/g, "/")
				)
			)
		)
		.map(character => character.charCodeAt(0))
	)
}

function addEqualsPadding(base64: string) {
	return base64 + Array((4 - base64.length % 4) % 4 + 1).join("=")
}
