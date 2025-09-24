<script lang="ts">
	export let title: string;

	let id = title.toLowerCase().replace(/\s+/g, '-');
</script>

<a href="#{id}" class="block text-gray-600 hover:text-gray-900">{title}</a>
