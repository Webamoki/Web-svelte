<script>
	import { links } from './links.js';
</script>

<h1>Web-svelte showcase</h1>
<nav class="p-2">
	<p>Links:</p>
	<ul class="ml-4 list-disc">
		{#each links as { name, href } (href)}
			<li><a class="text-blue-500 hover:underline" {href}>{name}</a></li>
		{/each}
	</ul>
</nav>
