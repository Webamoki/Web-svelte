<script lang="ts">
  import CodeBlock from '$lib/components/showcase/CodeBlock.svelte';
  import Container from '$lib/components/showcase/Container.svelte';
  import Preview from '$lib/components/showcase/Preview.svelte';
  import ChoiceField from '$lib/shared/components/form-old/fields/ChoiceField.svelte';
  import ChoiceMultiField from '$lib/shared/components/form-old/fields/ChoiceMultiField.svelte';
  import SelectMultiField from '$lib/shared/components/form-old/fields/SelectMultiField.svelte';
  import WeekdayChoiceField from '$lib/shared/components/form-old/fields/WeekdayChoiceField.svelte';
  import WeekdayChoiceMultiField from '$lib/shared/components/form-old/fields/WeekdayChoiceMultiField.svelte';
  import { Sidebar } from '$lib/shared/components/ui/index.js';
  import { prepareEmptyForm } from '$lib/shared/utils/form-old/index.js';
  import { identity } from 'ramda';

  import { LegacySchema } from './schema.js';

  const { data: legacyData, form: legacyForm } = prepareEmptyForm(LegacySchema);
  const enhance = legacyForm.enhance;
</script>

<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header>
      <h2 class="px-2 text-xl font-bold">Legacy Components</h2>
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Legacy (not yet migrated)</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each [['selectmultifield', 'SelectMultiField'], ['choicefield', 'ChoiceField'], ['choicemultifield', 'ChoiceMultiField'], ['weekdaychoicefield', 'WeekdayChoiceField'], ['weekdaychoicemultifield', 'WeekdayChoiceMultiField']] as [anchor, label] (anchor)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
                  {#snippet child({ props })}
                    <a href="#{anchor}" {...props}>{label}</a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar.Root>

  <Sidebar.Inset>
    <main class="p-8">
      <h1 class="mb-2 text-3xl font-bold text-gray-900">Legacy Form Components</h1>
      <p class="mb-8 text-gray-600">Components not yet migrated to the new remote-form system.</p>

      <Container description="A multi-select field" title="SelectMultiField">
        <Preview slot="preview">
          <form class="space-y-5" method="POST" use:enhance>
            <SelectMultiField
              name="selects"
              form={legacyForm}
              getKey={identity}
              getLabel={(n: number) => (n * 2).toString()}
              getValue={identity}
              items={[1, 2, 3]}
              label="Select Multi"
              placeholder="Please select"
              bind:values={$legacyData.selects}
            />
          </form>
        </Preview>
        <CodeBlock slot="code">
          {`<SelectMultiField {form} label="Select Multi" name="selects" items={[1, 2, 3]} ... />`}
        </CodeBlock>
      </Container>

      <Container
        description="A multiple choice selection component (single value)"
        title="ChoiceField"
      >
        <Preview slot="preview">
          <form method="POST" use:enhance>
            <div class="flex w-full space-x-5">
              <ChoiceField
                name="tag"
                form={legacyForm}
                getKey={identity}
                getLabel={identity}
                getValue={identity}
                items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'zod']}
                label="Vertical"
                vertical
                bind:value={$legacyData.tag}
              />
              <ChoiceField
                name="tag"
                form={legacyForm}
                getKey={identity}
                getLabel={identity}
                getValue={identity}
                items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'zod']}
                label="Horizontal"
                bind:value={$legacyData.tag}
              />
            </div>
          </form>
        </Preview>
        <CodeBlock slot="code">
          {`<ChoiceField {form} label="Tag" name="tag" items={[...]} bind:value={$formData.tag} />`}
        </CodeBlock>
      </Container>

      <Container description="A multiple choice selection component" title="ChoiceMultiField">
        <Preview slot="preview">
          <form method="POST" use:enhance>
            <div class="flex w-full space-x-5">
              <ChoiceMultiField
                name="tags"
                form={legacyForm}
                getKey={identity}
                getLabel={identity}
                getValue={identity}
                items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'zod']}
                label="Vertical"
                vertical
                bind:value={$legacyData.tags}
              />
              <ChoiceMultiField
                name="tags"
                form={legacyForm}
                getKey={identity}
                getLabel={identity}
                getValue={identity}
                items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'zod']}
                label="Horizontal"
                bind:value={$legacyData.tags}
              />
            </div>
          </form>
        </Preview>
        <CodeBlock slot="code">
          {`<ChoiceMultiField {form} label="Tags" name="tags" items={[...]} bind:value={$formData.tags} />`}
        </CodeBlock>
      </Container>

      <Container
        description="A multiple choice selection component for weekdays (single value)"
        title="WeekdayChoiceField"
      >
        <Preview slot="preview">
          <form method="POST" use:enhance>
            <div class="flex w-full space-x-5">
              <WeekdayChoiceField
                name="weekday"
                form={legacyForm}
                label="Vertical"
                vertical
                bind:value={$legacyData.weekday}
              />
              <WeekdayChoiceField
                name="weekday"
                form={legacyForm}
                label="Horizontal"
                bind:value={$legacyData.weekday}
              />
              <WeekdayChoiceField
                name="weekday"
                form={legacyForm}
                label="Letter Labels"
                letterLabels
                bind:value={$legacyData.weekday}
              />
            </div>
          </form>
        </Preview>
        <CodeBlock slot="code">
          {`<WeekdayChoiceField {form} label="Weekday" name="weekday" bind:value={$formData.weekday} />`}
        </CodeBlock>
      </Container>

      <Container
        description="A multiple choice selection component for weekdays"
        title="WeekdayChoiceMultiField"
      >
        <Preview slot="preview">
          <form method="POST" use:enhance>
            <div class="flex w-full space-x-5">
              <WeekdayChoiceMultiField
                name="weekdays"
                form={legacyForm}
                label="Vertical"
                vertical
                bind:value={$legacyData.weekdays}
              />
              <WeekdayChoiceMultiField
                name="weekdays"
                form={legacyForm}
                label="Horizontal"
                bind:value={$legacyData.weekdays}
              />
            </div>
          </form>
        </Preview>
        <CodeBlock slot="code">
          {`<WeekdayChoiceMultiField {form} label="Weekdays" name="weekdays" bind:value={$formData.weekdays} />`}
        </CodeBlock>
      </Container>
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
