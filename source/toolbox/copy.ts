
export function copy(x: any) {
	return (x === undefined)
		? undefined
		: JSON.parse(JSON.stringify(x))
}
