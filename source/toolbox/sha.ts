
function curryHash(algo: "SHA-256" | "SHA-512") {
	return async(bytes: Uint8Array) => {
		const buffer = await crypto.subtle.digest(
			algo,
			bytes,
		)
		return new Uint8Array(buffer)
	}
}

export const sha256 = curryHash("SHA-256")
export const sha512 = curryHash("SHA-512")
