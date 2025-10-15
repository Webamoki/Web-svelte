<script lang="ts">
	import CodeBlock from '$lib/components/showcase/CodeBlock.svelte';
	import Container from '$lib/components/showcase/Container.svelte';
	import Preview from '$lib/components/showcase/Preview.svelte';
	import Sidebar from '$lib/components/showcase/Sidebar.svelte';
	import SidebarLink from '$lib/components/showcase/SidebarLink.svelte';
	import SearchBar from '$lib/components/ui/search/SearchBar.svelte';
	import ChoiceShowcase from './helpers/ChoiceShowcase.svelte';

	let searchValue = '';
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar>
		<SidebarLink title="Search" />
		<SidebarLink title="Choice" />
		<!-- Add more UI components here as they are created -->
	</Sidebar>

	<!-- Main content -->
	<main class="flex-1 p-8">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">UI Components Showcase</h1>

		<Container title="Search" description="A search input field with icon">
			<Preview slot="preview">
				<div class="w-full max-w-sm">
					<SearchBar
						defaultValue={searchValue}
						placeholder="Search items..."
						onChange={(value) => {
							searchValue = value;
							console.log('Search value:', value);
						}}
					/>
				</div>
			</Preview>
			<CodeBlock slot="code">
				{`<script lang="ts">

<SearchBar
  defaultValue={searchValue}
  placeholder="Search items..."
  onChange={(value) => {
    searchValue = value;
    console.log('Search value:', value);
  }}
/>`}
			</CodeBlock>
		</Container>

		<div class="mt-8">
			<ChoiceShowcase />
		</div>
	</main>
</div>
