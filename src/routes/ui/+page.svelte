<script lang="ts">
  import CodeBlock from '$lib/components/showcase/CodeBlock.svelte';
  import Container from '$lib/components/showcase/Container.svelte';
  import Preview from '$lib/components/showcase/Preview.svelte';
  import Sidebar from '$lib/components/showcase/Sidebar.svelte';
  import SidebarLink from '$lib/components/showcase/SidebarLink.svelte';
  import SearchBar from '$lib/shared/components/ui/search/SearchBar.svelte';

  import ButtonShowcase from './helpers/ButtonShowcase.svelte';
  import ChoiceShowcase from './helpers/ChoiceShowcase.svelte';

  let searchValue = '';
</script>

<div class="flex min-h-screen bg-gray-50">
  <Sidebar>
    <SidebarLink title="Button" />
    <SidebarLink title="Search" />
    <SidebarLink title="Choice" />
    <!-- Add more UI components here as they are created -->
  </Sidebar>

  <!-- Main content -->
  <main class="flex-1 p-8">
    <h1 class="mb-8 text-3xl font-bold text-gray-900">UI Components Showcase</h1>

    <Container description="Wrapper around shadcn Button with loading state" title="Button">
      <Preview slot="preview">
        <ButtonShowcase />
      </Preview>
      <CodeBlock slot="code">
        {`<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>
<Button size="lg">Large</Button>
<Button size="sm">Small</Button>
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Button loading loadingMessage="Saving...">Save</Button>`}
      </CodeBlock>
    </Container>

    <Container description="A search input field with icon" title="Search">
      <Preview slot="preview">
        <div class="w-full max-w-sm">
          <SearchBar
            defaultValue={searchValue}
            onChange={(value) => {
              searchValue = value;
              console.log('Search value:', value);
            }}
            placeholder="Search items..."
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

    <div id="choice" class="mt-8">
      <ChoiceShowcase />
    </div>
  </main>
</div>
