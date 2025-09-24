<script lang="ts">
	import PasswordField from '$lib/components/form/fields/PasswordField.svelte';
	import TextField from '$lib/components/form/fields/TextField.svelte';
	import { arktypeClient } from 'sveltekit-superforms/adapters';
	import { masterSchema } from './master-schema.js';
	import { superForm } from 'sveltekit-superforms';
	import ChoiceMultiField from '$lib/components/form/fields/ChoiceMultiField.svelte';
	import CodeBlock from '../../lib/components/showcase/CodeBlock.svelte';
	import ChoiceField from '$lib/components/form/fields/ChoiceField.svelte';
	import WeekdayChoiceField from '$lib/components/form/fields/WeekdayChoiceField.svelte';
	import WeekdayChoiceMultiField from '$lib/components/form/fields/WeekdayChoiceMultiField.svelte';
	import Container from '$lib/components/showcase/Container.svelte';
	import Preview from '$lib/components/showcase/Preview.svelte';
	import Sidebar from '$lib/components/showcase/Sidebar.svelte';
	import SidebarLink from '$lib/components/showcase/SidebarLink.svelte';

	let { data } = $props();
	const form = superForm(data.form, {
		dataType: 'json',
		validators: arktypeClient(masterSchema)
	});
	const { form: formData, enhance } = form;
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar>
		<SidebarLink title="TextField" />
		<SidebarLink title="PasswordField" />
		<SidebarLink title="ChoiceField" />
		<SidebarLink title="ChoiceMultiField" />
		<SidebarLink title="WeekdayChoiceField" />
		<SidebarLink title="WeekdayChoiceMultiField" />
	</Sidebar>

	<!-- Main content -->
	<main class="flex-1 p-8">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">Form Components Showcase</h1>
		<Container title="TextField" description="A basic input field with validation support.">
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y-5">
					<TextField
						{form}
						label="Email"
						name="email"
						type="email"
						placeholder="johndoe@gmail.com"
						bind:value={$formData.email}
					/>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
				<TextField 
					{form} 
					label="Email" 
					name="email" 
					type="email" 
					placeholder="johndoe@gmail.com" 
					bind:value={$formData.email} 
				/>
			`}
			</CodeBlock>
		</Container>
		<Container title="PasswordField" description="A password input with show/hide toggle.">
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y-5">
					<PasswordField {form} label="Password" name="password" bind:value={$formData.password} />
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
				<PasswordField 
					{form} 
					label="Password" 
					name="password" 
					bind:value={$formData.password} 
				/>
			`}
			</CodeBlock>
		</Container>
		<Container
			title="ChoiceField"
			description="A multiple choice selection component (one value only)"
		>
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y">
					<div class="flex w-full space-x-5">
						<ChoiceField
							{form}
							label="Vertical"
							name="tag"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tag}
							vertical
						/>
						<ChoiceField
							{form}
							label="Vertical Disabled"
							name="tag"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tag}
							vertical
							disabled
						/>
						<ChoiceField
							{form}
							label="Vertical Readonly"
							name="tag"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tag}
							vertical
							readonly
						/>
					</div>
					<div class="flex w-full space-x-5">
						<ChoiceField
							{form}
							label="Horizontal"
							name="tag"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tag}
						/>
						<ChoiceField
							{form}
							label="Horizontal Disabled"
							name="tag"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tag}
							disabled
						/>
						<ChoiceField
							{form}
							label="Horizontal Readonly"
							name="tag"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tag}
							readonly
						/>
					</div>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
					<ChoiceMultiField
						{form} 
						label="Tags"
						name="tags"
						items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']} 
						getKey={item => item} 
						getLabel={item => item} 
						bind:value={$formData.tags}
					/>
				`}
			</CodeBlock>
		</Container>
		<Container title="ChoiceMultiField" description="A multiple choice selection component">
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y">
					<div class="flex w-full space-x-5">
						<ChoiceMultiField
							{form}
							label="Vertical"
							name="tags"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tags}
							vertical
						/>
						<ChoiceMultiField
							{form}
							label="Vertical Disabled"
							name="tags"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tags}
							vertical
							disabled
						/>
						<ChoiceMultiField
							{form}
							label="Vertical Readonly"
							name="tags"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tags}
							vertical
							readonly
						/>
					</div>
					<div class="flex w-full space-x-5">
						<ChoiceMultiField
							{form}
							label="Horizontal"
							name="tags"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tags}
						/>
						<ChoiceMultiField
							{form}
							label="Horizontal Disabled"
							name="tags"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tags}
							disabled
						/>
						<ChoiceMultiField
							{form}
							label="Horizontal Readonly"
							name="tags"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={(item) => item}
							getLabel={(item) => item}
							bind:value={$formData.tags}
							readonly
						/>
					</div>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
					<ChoiceMultiField
						{form} 
						label="Tags"
						name="tags"
						items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']} 
						getKey={item => item} 
						getLabel={item => item} 
						bind:value={$formData.tags}
						readonly?
						disabled?
					/>
				`}
			</CodeBlock>
		</Container>

		<Container
			title="WeekdayChoiceField"
			description="A multiple choice selection component  for weekdays (single value)"
		>
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y">
					<div class="flex w-full space-x-5">
						<WeekdayChoiceField
							{form}
							label="Vertical"
							name="weekday"
							bind:value={$formData.weekday}
							vertical
						/>
						<WeekdayChoiceField
							{form}
							label="Vertical Disabled"
							name="weekday"
							bind:value={$formData.weekday}
							vertical
							disabled
						/>
						<WeekdayChoiceField
							{form}
							label="Vertical Readonly"
							name="weekday"
							bind:value={$formData.weekday}
							vertical
							readonly
						/>
					</div>
					<div class="flex w-full space-x-5">
						<WeekdayChoiceField
							{form}
							label="Horizontal"
							name="weekday"
							bind:value={$formData.weekday}
						/>
						<WeekdayChoiceField
							{form}
							label="Horizontal Disabled"
							name="weekday"
							bind:value={$formData.weekday}
							disabled
						/>
						<WeekdayChoiceField
							{form}
							label="Horizontal Readonly"
							name="weekday"
							bind:value={$formData.weekday}
							readonly
						/>
					</div>
					<div class="flex w-full space-x-5">
						<WeekdayChoiceField
							{form}
							label="Horizontal ShortLabels"
							name="weekday"
							bind:value={$formData.weekday}
							shortLabels
						/>
						<WeekdayChoiceField
							{form}
							label="Horizontal LongLabels"
							name="weekday"
							bind:value={$formData.weekday}
							longLabels
						/>
					</div>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
					<WeekdayChoiceField
						{form} 
						label="Weekday"
						name="weekday"
						bind:value={$formData.weekdays}
						readonly?
						disabled?
						shortLabels?
						longLabels?
					/>
				`}
			</CodeBlock>
		</Container>
		<Container
			title="WeekdayChoiceMultiField"
			description="A multiple choice selection component  for weekdays"
		>
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y">
					<div class="flex w-full space-x-5">
						<WeekdayChoiceMultiField
							{form}
							label="Vertical"
							name="weekdays"
							bind:value={$formData.weekdays}
							vertical
						/>
						<WeekdayChoiceMultiField
							{form}
							label="Vertical Disabled"
							name="weekdays"
							bind:value={$formData.weekdays}
							vertical
							disabled
						/>
						<WeekdayChoiceMultiField
							{form}
							label="Vertical Readonly"
							name="weekdays"
							bind:value={$formData.weekdays}
							vertical
							readonly
						/>
					</div>
					<div class="flex w-full space-x-5">
						<WeekdayChoiceMultiField
							{form}
							label="Horizontal"
							name="weekdays"
							bind:value={$formData.weekdays}
						/>
						<WeekdayChoiceMultiField
							{form}
							label="Horizontal Disabled"
							name="weekdays"
							bind:value={$formData.weekdays}
							disabled
						/>
						<WeekdayChoiceMultiField
							{form}
							label="Horizontal Readonly"
							name="weekdays"
							bind:value={$formData.weekdays}
							readonly
						/>
					</div>
					<div class="flex w-full space-x-5">
						<WeekdayChoiceMultiField
							{form}
							label="Horizontal ShortLabels"
							name="weekdays"
							bind:value={$formData.weekdays}
							shortLabels
						/>
						<WeekdayChoiceMultiField
							{form}
							label="Horizontal LongLabels"
							name="weekdays"
							bind:value={$formData.weekdays}
							longLabels
						/>
					</div>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
					<WeekdayChoiceMultiField
						{form} 
						label="Weekday"
						name="weekday"
						bind:value={$formData.weekdays}
						readonly?
						disabled?
						shortLabels?
						longLabels?
					/>
				`}
			</CodeBlock>
		</Container>
	</main>
</div>
