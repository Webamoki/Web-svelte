<script lang="ts">
	import PasswordField from '$lib/components/form/fields/PasswordField.svelte';
	import TextField from '$lib/components/form/fields/TextField.svelte';
	import { superForm } from 'sveltekit-superforms';
	import Showcase from './Showcase.svelte';

	let { data } = $props();
	const form = superForm(data.form);
	const formData = form.form;
</script>

<div class="flex min-h-screen bg-gray-50">
	<!-- Sidebar -->
	<aside class="hidden w-64 border-r bg-white p-6 lg:block">
		<h2 class="mb-4 text-xl font-bold text-gray-900">Components</h2>
		<nav class="space-y-2">
			<a href="#textfield" class="block text-gray-600 hover:text-gray-900">TextField</a>
			<a href="#passwordfield" class="block text-gray-600 hover:text-gray-900">PasswordField</a>
		</nav>
	</aside>

	<!-- Main content -->
	<main class="flex-1 p-8">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">Form Components Showcase</h1>

		<Showcase
			id="textfield"
			title="TextField"
			description="A basic input field with validation support."
			code={`<TextField {form} label="Email" name="email" type="email" bind:value={$formData.email} />`}
		>
			<form method="POST" class="space-y-5">
				<TextField {form} label="Email" name="email" type="email" bind:value={$formData.email} />
			</form>
		</Showcase>

		<Showcase
			id="passwordfield"
			title="PasswordField"
			description="A password input with show/hide toggle."
			code={`<PasswordField {form} label="Password" name="password" bind:value={$formData.password} />`}
		>
			<form method="POST" class="space-y-5">
				<PasswordField {form} label="Password" name="password" bind:value={$formData.password} />
			</form>
		</Showcase>
	</main>
</div>
