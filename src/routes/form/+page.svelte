<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import ChoiceField from '$lib/components/form/fields/ChoiceField.svelte';
	import ChoiceMultiField from '$lib/components/form/fields/ChoiceMultiField.svelte';
	import DateField from '$lib/components/form/fields/DateField.svelte';
	import HexColorField from '$lib/components/form/fields/HexColorField.svelte';
	import MessageField from '$lib/components/form/fields/MessageField.svelte';
	import PasswordField from '$lib/components/form/fields/PasswordField.svelte';
	import SelectField from '$lib/components/form/fields/SelectField.svelte';
	import SelectMultiField from '$lib/components/form/fields/SelectMultiField.svelte';
	import TextField from '$lib/components/form/fields/TextField.svelte';
	import TextFieldNullable from '$lib/components/form/fields/TextFieldNullable.svelte';
	import TimeField from '$lib/components/form/fields/TimeField.svelte';
	import WeekdayChoiceField from '$lib/components/form/fields/WeekdayChoiceField.svelte';
	import WeekdayChoiceMultiField from '$lib/components/form/fields/WeekdayChoiceMultiField.svelte';
	import Container from '$lib/components/showcase/Container.svelte';
	import Preview from '$lib/components/showcase/Preview.svelte';
	import Sidebar from '$lib/components/showcase/Sidebar.svelte';
	import SidebarLink from '$lib/components/showcase/SidebarLink.svelte';
	import { identity } from 'ramda';
	import CodeBlock from '../../lib/components/showcase/CodeBlock.svelte';
	import { MasterSchema, TextNullSchema, VirtualFormSchema } from './schema.js';
	import { prepareEmptyForm } from '$lib/utils/form/index.js';
	import { VirtualForm } from '$lib/utils/form/virtual-form.js';
	import { resolve } from '$app/paths';

	const { form, data: formData } = prepareEmptyForm(MasterSchema);
	const enhance = form.enhance;
	const { form: textNullForm, data: textNullData } = prepareEmptyForm(TextNullSchema);

	const virtualForm = new VirtualForm(VirtualFormSchema, resolve('/form'), {
		onSuccess: (data) => {
			console.log('Virtual form submitted successfully:', data);
		}
	});
	function submitVirtualForm() {
		virtualForm.submit({
			email: 'example@example.com',
			message: 'aasdasdasdsd'
		});
	}
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar>
		<SidebarLink title="TextField" />
		<SidebarLink title="TextFieldNullable" />
		<SidebarLink title="PasswordField" />
		<SidebarLink title="MessageField" />
		<SidebarLink title="HexColorField" />
		<SidebarLink title="SelectField" />
		<SidebarLink title="SelectMultiField" />
		<SidebarLink title="TimeField" />
		<SidebarLink title="DateField" />
		<SidebarLink title="ChoiceField" />
		<SidebarLink title="ChoiceMultiField" />
		<SidebarLink title="WeekdayChoiceField" />
		<SidebarLink title="WeekdayChoiceMultiField" />
		<button on:click={submitVirtualForm}>Submit</button>
	</Sidebar>
	<!-- Main content -->
	<main class="flex-1 p-8">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">Form Components Showcase</h1>
		<Container title="TextField" description="A basic input field with validation support">
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
				<form method="POST" use:textNullForm.enhance class="space-y-5">
					<TextFieldNullable
						form={textNullForm}
						label="Email"
						name="emailNull"
						type="email"
						placeholder="johndoe@gmail.com"
						bind:value={$textNullData.emailNull}
					/>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
				<TextField | TextfieldNullable
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
		<Container title="PasswordField" description="A password input with show/hide toggle">
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

		<Container title="MessageField" description="A textarea field with height lock feature">
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y-5">
					<MessageField
						{form}
						label="Message"
						name="message"
						placeholder="Enter your message here..."
						defaultHeight={150}
						bind:value={$formData.message}
					/>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
				<MessageField
					{form}
					label="Message"
					name="message"
					placeholder="Enter your message here..."
					defaultHeight={150}
					bind:value={$formData.message}
				/>
			`}
			</CodeBlock>
		</Container>

		<Container title="HexColorField" description="A hex color input">
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y-5">
					<HexColorField {form} label="Color" name="color" bind:value={$formData.color} />
					<Button type="submit">Submit</Button>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
				<HexColorField
					{form}
					label="Color"
					name="color"
					bind:value={$formData.color}
				/>
			`}
			</CodeBlock>
		</Container>

		<Container title="SelectField" description="select field">
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y-5">
					<SelectField
						{form}
						label="Select"
						name="select"
						items={[1, 2, 3]}
						getKey={identity}
						getLabel={(n: number) => (n * 2).toString()}
						getValue={identity}
						placeholder="Please select"
						bind:value={$formData.select}
					/>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
				<SelectField
						{form}
						label="Select"
						name="select"
						items={[1, 2, 3]}
						getKey={identity}
						getLabel={(n: number) => (n * 2).toString()}
						getValue={identity}
						placeholder="Please select"
						bind:value={$formData.select}
					/>
			`}
			</CodeBlock>
		</Container>
		<Container title="SelectMultiField" description="select multi field">
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y-5">
					<SelectMultiField
						{form}
						label="Select Multi"
						name="selects"
						items={[1, 2, 3]}
						getKey={identity}
						getLabel={(n: number) => (n * 2).toString()}
						getValue={identity}
						placeholder="Please select"
						bind:values={$formData.selects}
					/>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
				<SelectMultiField
						{form}
						label="Select Multi"
						name="selects"
						items={[1, 2, 3]}
						getKey={identity}
						getLabel={(n: number) => (n * 2).toString()}
						getValue={identity}
						placeholder="Please select"
						bind:value={$formData.selects}
					/>
			`}
			</CodeBlock>
		</Container>
		<Container title="TimeField" description="time field">
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y-5">
					<TimeField {form} label="Time" name="time" bind:value={$formData.time} />
					<Button type="submit">Submit</Button>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
				<TimeField
					{form}
					label="Time"
					name="time"
					bind:value={$formData.time}
				/>
			`}
			</CodeBlock>
		</Container>

		<Container title="DateField" description="date field">
			<Preview slot="preview">
				<form method="POST" use:enhance class="space-y-5">
					<DateField {form} label="Date" name="calendarDate" bind:value={$formData.calendarDate} />
					<Button type="submit">Submit</Button>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
				<DateField
					{form}
					label="Date"
					name="date"
					bind:value={$formData.calendarDate}
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
							getKey={identity}
							getLabel={identity}
							getValue={identity}
							bind:value={$formData.tag}
							vertical
						/>
						<ChoiceField
							{form}
							label="Vertical Disabled"
							name="tag"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={identity}
							getLabel={identity}
							getValue={identity}
							bind:value={$formData.tag}
							vertical
							disabled
						/>
						<ChoiceField
							{form}
							label="Vertical Readonly"
							name="tag"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={identity}
							getLabel={identity}
							getValue={identity}
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
							getKey={identity}
							getLabel={identity}
							getValue={identity}
							bind:value={$formData.tag}
						>
							{#snippet buttonContent(label)}
								<span class="text-sm font-medium">s{label}</span>
							{/snippet}
						</ChoiceField>
						<ChoiceField
							{form}
							label="Horizontal Disabled"
							name="tag"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={identity}
							getLabel={identity}
							getValue={identity}
							bind:value={$formData.tag}
							disabled
						/>
						<ChoiceField
							{form}
							label="Horizontal Readonly"
							name="tag"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={identity}
							getLabel={identity}
							getValue={identity}
							bind:value={$formData.tag}
							readonly
						/>
					</div>
				</form>
			</Preview>
			<CodeBlock slot="code">
				{`
					<ChoiceField
						{form}
						label="Tag"
						name="tag"
						items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
						getKey={item => item}
						getLabel={item => item}
						bind:value={$formData.tag}
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
							getKey={identity}
							getLabel={identity}
							getValue={identity}
							bind:value={$formData.tags}
							vertical
						/>
						<ChoiceMultiField
							{form}
							label="Vertical Disabled"
							name="tags"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={identity}
							getLabel={identity}
							getValue={identity}
							bind:value={$formData.tags}
							vertical
							disabled
						/>
						<ChoiceMultiField
							{form}
							label="Vertical Readonly"
							name="tags"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={identity}
							getLabel={identity}
							getValue={identity}
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
							getKey={identity}
							getLabel={identity}
							getValue={identity}
							bind:value={$formData.tags}
						/>
						<ChoiceMultiField
							{form}
							label="Horizontal Disabled"
							name="tags"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={identity}
							getLabel={identity}
							getValue={identity}
							bind:value={$formData.tags}
							disabled
						/>
						<ChoiceMultiField
							{form}
							label="Horizontal Readonly"
							name="tags"
							items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
							getKey={identity}
							getLabel={identity}
							getValue={identity}
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
							label="Horizontal LetterLabels"
							name="weekday"
							bind:value={$formData.weekday}
							letterLabels
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
						bind:value={$formData.weekday}
						readonly?
						disabled?
						letterLabels?
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
							label="Horizontal LetterLabels"
							name="weekdays"
							bind:value={$formData.weekdays}
							letterLabels
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
						label="Weekdays"
						name="weekdays"
						bind:value={$formData.weekdays}
						readonly?
						disabled?
						letterLabels?
						longLabels?
					/>
				`}
			</CodeBlock>
		</Container>
	</main>
</div>
