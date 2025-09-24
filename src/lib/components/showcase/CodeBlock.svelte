<script lang="ts">
	import { highlight } from '$lib/highlight.js';
	import { onMount } from 'svelte';

	export let language: string = 'svelte';
	export let theme: string = 'nord';

	let highlightedCode = '';
	let codeBlock: HTMLDivElement;

	onMount(async () => {
		const code = codeBlock.textContent || '';
		const lines = code.split('\n');
		const firstLine = lines.find((line) => line.trim() !== '');

		// Dedent the code first
		let dedentedCode = '';
		if (firstLine) {
			const leadingSpaces = firstLine.match(/^\s*/)?.[0].length || 0;
			dedentedCode = lines
				.map((line) => line.slice(leadingSpaces))
				.join('\n')
				.trim();
		} else {
			dedentedCode = code.trim();
		}

		// Add tabs to each line and spacing above/below
		const spacedCode =
			'\n' +
			dedentedCode
				.split('\n')
				.map((line) => `\t${line}`)
				.join('\n') +
			'\n\n';

		highlightedCode = await highlight(spacedCode, language, theme);
	});
</script>

<div class="overflow-hidden rounded-b-xl border bg-gray-900">
	<div class="border-b border-gray-800 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200">
		Code
	</div>
	<div bind:this={codeBlock} class="overflow-x-auto text-sm" style="display: none;">
		<slot />
	</div>
	<div class="overflow-x-auto text-sm">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html highlightedCode}
	</div>
</div>
