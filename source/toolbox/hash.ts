
export function hash(input: string) {
	let result: number
	for (let i = 0; i < input.length; i++) {
		result = Math.imul(31, result) + input.charCodeAt(i) | 0
	}
	return result
}

export function hashAny(x: any) {
	return hash(x === undefined ? "" : JSON.stringify(x))
}
