<script lang="ts">
  import { Button } from '$lib/shared/components/form/index.js';
</script>

<h1 class="mb-4 text-xl font-semibold">Button</h1>

<div class="space-y-6">
  <div>
    <p class="mb-2 text-sm text-gray-500">Variants</p>
    <div class="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost-destructive">Ghost Destructive</Button>
    </div>
  </div>

  <div>
    <p class="mb-2 text-sm text-gray-500">States</p>
    <div class="flex flex-wrap gap-2">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button loading loadingMessage="Saving...">Save</Button>
    </div>
  </div>

  <div>
    <p class="mb-2 text-sm text-gray-500">Link</p>
    <div class="flex flex-wrap gap-2">
      <Button href="#">Link Button</Button>
    </div>
  </div>
</div>
