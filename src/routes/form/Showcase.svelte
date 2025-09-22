<script lang="ts">
	export let id: string;
	export let title: string;
	export let description: string;
	export let code: string;
</script>

<section class="mb-12" {id}>
	<h2 class="mb-4 text-2xl font-semibold text-gray-800">{title}</h2>
	<p class="mb-6 text-gray-600">{description}</p>

	<!-- Preview -->
	<div class="overflow-hidden rounded-xl border bg-white shadow-sm">
		<div class="border-b bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">Preview</div>
		<div class="p-6">
			<slot />
			<!-- 👈 child preview content -->
		</div>
	</div>

	<!-- Code -->
	<div class="mt-4 overflow-hidden rounded-xl border bg-gray-900">
		<div class="border-b border-gray-800 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200">
			Code
		</div>
		<pre class="overflow-x-auto p-4 text-sm text-gray-100">{code}</pre>
	</div>
</section>
