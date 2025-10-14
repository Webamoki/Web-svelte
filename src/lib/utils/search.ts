export function fuzzySearchHighlight(needle: string, haystack: string): string | null {
	const hlen = haystack.length;
	const nlen = needle.length;

	if (nlen === 0) return `<span>${haystack}</span>`;
	if (nlen > hlen) return null;

	let result = '';
	let j = 0; // haystack pointer
	let matchedCount = 0;

	for (let i = 0; i < nlen; i++) {
		const nch = needle[i].toLowerCase();
		let found = false;

		while (j < hlen) {
			const hch = haystack[j];
			if (hch.toLowerCase() === nch) {
				// match found → wrap in <b>
				result += `<b>${hch}</b>`;
				j++;
				found = true;
				matchedCount++;
				break;
			} else {
				// non-match → normal text
				result += hch;
				j++;
			}
		}

		if (!found) {
			// no match for current needle char → fail entirely
			return null;
		}
	}

	// add remaining unmatched characters
	result += haystack.slice(j);

	// sanity check — must have matched all needle chars
	if (matchedCount < nlen) return null;

	return `<span>${result}</span>`;
}
export function fuzzySearch(needle: string, haystack: string) {
	const hlen = haystack.length;
	const nlen = needle.length;

	if (nlen > hlen) {
		return false;
	}
	if (nlen === hlen) {
		return needle.toLowerCase() === haystack.toLowerCase();
	}

	const lowerNeedle = needle.toLowerCase();
	const lowerHaystack = haystack.toLowerCase();

	outer: for (let i = 0, j = 0; i < nlen; i++) {
		const nch = lowerNeedle.charCodeAt(i);
		while (j < hlen) {
			if (lowerHaystack.charCodeAt(j++) === nch) {
				continue outer;
			}
		}
		return false;
	}

	return true;
}
