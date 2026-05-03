<script lang="ts">
  import CodeBlock from '$lib/components/showcase/CodeBlock.svelte';
  import Container from '$lib/components/showcase/Container.svelte';
  import Preview from '$lib/components/showcase/Preview.svelte';
  import { Sidebar } from '$lib/shared/components/ui/index.js';
  import SearchBar from '$lib/shared/components/ui/search/SearchBar.svelte';

  import ButtonShowcase from './helpers/ButtonShowcase.svelte';
  import ChoiceShowcase from './helpers/ChoiceShowcase.svelte';

  let searchValue = '';
</script>

<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header>
      <h2 class="px-2 text-xl font-bold">Components</h2>
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href="#button" {...props}>Button</a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href="#search" {...props}>Search</a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href="#choice" {...props}>Choice</a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar.Root>

  <Sidebar.Inset>
    <main class="p-8">
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
  </Sidebar.Inset>
</Sidebar.Provider>
