
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

// export function toBase64(bytes: Uint8Array) {
// 	const binary = String.fromCharCode.apply(null, bytes)
// 	return addEqualsPadding(
// 		btoa(binary)
// 			.replace(/=/g, "")
// 			.replace(/\+/g, "-")
// 			.replace(/\//g, "_")
// 	)
// }

// export function fromBase64(base64: string): Uint8Array {
// 	return (new TextEncoder).encode(atob(
// 		base64
// 			.replace(/-/g, "+")
// 			.replace(/_/g, "/")
// 	))
// }

// function addEqualsPadding(base64: string) {
// 	return base64 + Array((4 - base64.length % 4) % 4 + 1).join("=")
// }
