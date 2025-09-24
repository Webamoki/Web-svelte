<script lang="ts">
	export let title: string;
	export let description: string;
	let id = title.toLowerCase().replace(/\s+/g, '-');
</script>

<section {id} class="mx-auto mb-12 w-full max-w-screen px-4">
	<h2 class="mb-4 text-2xl font-semibold text-gray-800">{title}</h2>
	<p class="mb-6 text-gray-600">{description}</p>

	<slot name="preview" />
	<slot name="code" />
</section>
