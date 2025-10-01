/* --- String functions --- */
export function toTitleCase(str: string) {
	return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
