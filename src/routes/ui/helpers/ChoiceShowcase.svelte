<script lang="ts">
  import { Choice, ChoiceMulti } from '$lib/shared/components/ui/index.js';
  import AlignCenter from '@lucide/svelte/icons/align-center';
  import AlignJustify from '@lucide/svelte/icons/align-justify';
  import AlignLeft from '@lucide/svelte/icons/align-left';
  import AlignRight from '@lucide/svelte/icons/align-right';

  const items = ['item1', 'item2', 'item3', 'item4', 'item5'];
  const itemsShort = ['item1', 'item2', 'item3'];
  const alignItems = ['left', 'center', 'right', 'justify'];

  const identity = (v: string) => v;

  const alignIcons: Record<string, typeof AlignLeft> = {
    center: AlignCenter,
    justify: AlignJustify,
    left: AlignLeft,
    right: AlignRight
  };

  let valueOne: string | undefined = $state();
  let valueOneV: string | undefined = $state();
  let valueMultiple: string[] = $state([]);
  let valueMultipleV: string[] = $state([]);
  let valueAlign: string | undefined = $state();
  let valueAlignMulti: string[] = $state([]);
</script>

<h1>Choice</h1>
<div class="grid grid-cols-2 gap-4 p-4">
  <div>
    Single: {valueOne}
    <Choice
      getKey={identity}
      getLabel={identity}
      getValue={identity}
      {items}
      bind:value={valueOne}
    />
  </div>

  <div>
    Multiple: {valueMultiple}
    <ChoiceMulti
      getKey={identity}
      getLabel={identity}
      getValue={identity}
      {items}
      bind:value={valueMultiple}
    />
  </div>

  <div>
    Single Vertical: {valueOneV}
    <Choice
      getKey={identity}
      getLabel={identity}
      getValue={identity}
      items={itemsShort}
      vertical
      bind:value={valueOneV}
    />
  </div>

  <div>
    Multiple Vertical: {valueMultipleV}
    <ChoiceMulti
      getKey={identity}
      getLabel={identity}
      getValue={identity}
      items={itemsShort}
      vertical
      bind:value={valueMultipleV}
    />
  </div>

  <div>
    Icon Single: {valueAlign}
    <Choice
      getKey={identity}
      getLabel={identity}
      getValue={identity}
      items={alignItems}
      bind:value={valueAlign}
    >
      {#snippet buttonContent(item)}
        {@const Icon = alignIcons[item]}
        <Icon size={16} />
      {/snippet}
    </Choice>
  </div>

  <div>
    Icon Multi: {valueAlignMulti}
    <ChoiceMulti
      getKey={identity}
      getLabel={identity}
      getValue={identity}
      items={alignItems}
      bind:value={valueAlignMulti}
    >
      {#snippet buttonContent(item)}
        {@const Icon = alignIcons[item]}
        <Icon size={16} />
      {/snippet}
    </ChoiceMulti>
  </div>
</div>
