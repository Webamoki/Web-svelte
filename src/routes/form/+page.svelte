<script lang="ts">
  import { resolve } from '$app/paths';
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
  import Form from '$lib/components/form/Form.svelte';
  import Container from '$lib/components/showcase/Container.svelte';
  import Preview from '$lib/components/showcase/Preview.svelte';
  import Sidebar from '$lib/components/showcase/Sidebar.svelte';
  import SidebarLink from '$lib/components/showcase/SidebarLink.svelte';
  import { prepareEmptyForm } from '$lib/utils/form/index.js';
  import { VirtualForm } from '$lib/utils/form/virtual-form.js';
  import { Calendar, Clock, Lock, Mail, MessageSquare, Tag } from '@lucide/svelte';
  import { identity } from 'ramda';

  import CodeBlock from '../../lib/components/showcase/CodeBlock.svelte';
  import { FormSchema, MasterSchema, TextNullSchema, VirtualFormSchema } from './schema.js';

  const { data: formData, form } = prepareEmptyForm(MasterSchema);
  const enhance = form.enhance;
  const { data: textNullData, form: textNullForm } = prepareEmptyForm(TextNullSchema);

  const virtualForm = new VirtualForm(VirtualFormSchema, resolve('/form'), {
    actionName: 'normal',
    onError: (message) => {
      console.error('Virtual form submission failed:', message);
    },
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
  const { data: testData, form: testForm } = prepareEmptyForm(FormSchema);
</script>

<div class="mx-auto max-w-6xl p-8">
  <div class="mb-8">
    <h1 class="mb-2 text-4xl font-bold text-gray-900">Form Showcase</h1>
    <p class="text-gray-600">Explore different form submission methods and components</p>
  </div>

  <div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
    <!-- Normal Form Submission Card -->
    <div
      class="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
    >
      <div class="mb-4">
        <h2 class="mb-1 text-2xl font-semibold text-gray-900">Normal Form Submission</h2>
        <p class="text-sm text-gray-500">
          Traditional server-side form handling with progressive enhancement
        </p>
      </div>

      <Form actionName="normal" actionPath={resolve('/form')} form={testForm}>
        <div class="space-y-4">
          <TextField name="email" form={testForm} label="Email" bind:value={$testData.email} />
          <MessageField
            name="message"
            form={testForm}
            label="Message"
            bind:value={$testData.message}
          />
          <Button type="submit">Submit Form</Button>
        </div>
      </Form>
    </div>

    <!-- Virtual Form Submission Card -->
    <div
      class="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
    >
      <div class="mb-4">
        <h2 class="mb-1 text-2xl font-semibold text-gray-900">Virtual Form Submission</h2>
        <p class="text-sm text-gray-500">
          Client-side form handling with custom success/error callbacks
        </p>
      </div>

      <div class="space-y-4">
        <div class="rounded-md border border-gray-200 bg-gray-50 p-4">
          <p class="mb-2 text-sm font-medium text-gray-700">Submission Data:</p>
          <pre class="overflow-x-auto text-xs text-gray-600"><code
              >{JSON.stringify(
                { email: 'example@example.com', message: 'aasdasdasdsd' },
                null,
                2
              )}</code
            ></pre>
        </div>
        <Button loading={virtualForm.isProcessing} onclick={submitVirtualForm}
          >Submit Virtual Form</Button
        >
      </div>
    </div>
  </div>
</div>

<div class="flex min-h-screen bg-gray-50">
  <Sidebar>
    <SidebarLink title="TextField" />
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
  </Sidebar>
  <!-- Main content -->
  <main class="flex-1 p-8">
    <h1 class="mb-8 text-3xl font-bold text-gray-900">Form Components Showcase</h1>
    <Container description="A basic input field with validation support" title="TextField">
      <Preview slot="preview">
        <form class="space-y-5" method="POST" use:enhance>
          <TextField
            name="email"
            {form}
            label="Email"
            placeholder="johndoe@gmail.com"
            type="email"
            bind:value={$formData.email}
          />
          <TextField
            name="email"
            {form}
            icon={Mail}
            label="Email with Icon"
            placeholder="johndoe@gmail.com"
            type="email"
            bind:value={$formData.email}
          />
        </form>
        <form class="space-y-5" method="POST" use:textNullForm.enhance>
          <TextFieldNullable
            name="emailNull"
            form={textNullForm}
            label="Email"
            placeholder="johndoe@gmail.com"
            type="email"
            bind:value={$textNullData.emailNull}
          />
        </form>
      </Preview>
      <CodeBlock slot="code">
        {`
				import { Mail } from '@lucide/svelte';

				<TextField | TextfieldNullable
					{form}
					label="Email"
					name="email"
					type="email"
					placeholder="johndoe@gmail.com"
					icon={Mail}
					bind:value={$formData.email}
				/>
			`}
      </CodeBlock>
    </Container>
    <Container description="A password input with show/hide toggle" title="PasswordField">
      <Preview slot="preview">
        <form class="space-y-5" method="POST" use:enhance>
          <PasswordField name="password" {form} label="Password" bind:value={$formData.password} />
          <PasswordField
            name="password"
            {form}
            icon={Lock}
            label="Password with Icon"
            bind:value={$formData.password}
          />
        </form>
      </Preview>
      <CodeBlock slot="code">
        {`
				import { Lock } from '@lucide/svelte';

				<PasswordField
					{form}
					label="Password"
					name="password"
					icon={Lock}
					bind:value={$formData.password}
				/>
			`}
      </CodeBlock>
    </Container>

    <Container description="A textarea field with height lock feature" title="MessageField">
      <Preview slot="preview">
        <form class="space-y-5" method="POST" use:enhance>
          <MessageField
            name="message"
            defaultHeight={150}
            {form}
            label="Message"
            placeholder="Enter your message here..."
            bind:value={$formData.message}
          />
          <MessageField
            name="message"
            defaultHeight={100}
            {form}
            label="Message Resisable"
            placeholder="Enter your message here..."
            resize
            bind:value={$formData.message}
          />
          <MessageField
            name="message"
            defaultHeight={150}
            {form}
            icon={MessageSquare}
            label="Message with Icon"
            placeholder="Enter your message here..."
            bind:value={$formData.message}
          />
        </form>
      </Preview>
      <CodeBlock slot="code">
        {`
				import { MessageSquare } from '@lucide/svelte';

				<MessageField
					{form}
					label="Message"
					name="message"
					placeholder="Enter your message here..."
					defaultHeight={150}
					icon={MessageSquare}
					bind:value={$formData.message}
				/>
			`}
      </CodeBlock>
    </Container>

    <Container description="A hex color input" title="HexColorField">
      <Preview slot="preview">
        <form class="space-y-5" method="POST" use:enhance>
          <HexColorField name="color" {form} label="Color" bind:value={$formData.color} />
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

    <Container description="select field" title="SelectField">
      <Preview slot="preview">
        <form class="space-y-5" method="POST" use:enhance>
          <SelectField
            name="select"
            {form}
            getKey={identity}
            getLabel={(n: number) => (n * 2).toString()}
            getValue={identity}
            items={[1, 2, 3]}
            label="Select"
            placeholder="Please select"
            bind:value={$formData.select}
          />
          <SelectField
            name="select"
            {form}
            getKey={identity}
            getLabel={(n: number) => (n * 2).toString()}
            getValue={identity}
            icon={Tag}
            items={[1, 2, 3]}
            label="Select with Icon"
            placeholder="Please select"
            bind:value={$formData.select}
          />
        </form>
      </Preview>
      <CodeBlock slot="code">
        {`
				import { Tag } from '@lucide/svelte';

				<SelectField
						{form}
						label="Select"
						name="select"
						items={[1, 2, 3]}
						getKey={identity}
						getLabel={(n: number) => (n * 2).toString()}
						getValue={identity}
						placeholder="Please select"
						icon={Tag}
						bind:value={$formData.select}
					/>
			`}
      </CodeBlock>
    </Container>
    <Container description="select multi field" title="SelectMultiField">
      <Preview slot="preview">
        <form class="space-y-5" method="POST" use:enhance>
          <SelectMultiField
            name="selects"
            {form}
            getKey={identity}
            getLabel={(n: number) => (n * 2).toString()}
            getValue={identity}
            items={[1, 2, 3]}
            label="Select Multi"
            placeholder="Please select"
            bind:values={$formData.selects}
          />
          <SelectMultiField
            name="selects"
            {form}
            getKey={identity}
            getLabel={(n: number) => (n * 2).toString()}
            getValue={identity}
            icon={Tag}
            items={[1, 2, 3]}
            label="Select Multi with Icon"
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
    <Container description="time field" title="TimeField">
      <Preview slot="preview">
        <form class="space-y-5" method="POST" use:enhance>
          <TimeField name="time" {form} label="Time" bind:value={$formData.time} />
          <TimeField
            name="time"
            {form}
            icon={Clock}
            label="Time with Icon"
            bind:value={$formData.time}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Preview>
      <CodeBlock slot="code">
        {`
				import { Clock } from '@lucide/svelte';

				<TimeField
					{form}
					label="Time"
					name="time"
					icon={Clock}
					bind:value={$formData.time}
				/>
			`}
      </CodeBlock>
    </Container>

    <Container description="date field" title="DateField">
      <Preview slot="preview">
        <form class="space-y-5" method="POST" use:enhance>
          <DateField name="calendarDate" {form} label="Date" bind:value={$formData.calendarDate} />
          <DateField
            name="calendarDate"
            {form}
            icon={Calendar}
            label="Date with Icon"
            bind:value={$formData.calendarDate}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Preview>
      <CodeBlock slot="code">
        {`
				import { Calendar } from '@lucide/svelte';

				<DateField
					{form}
					label="Date"
					name="date"
					icon={Calendar}
					bind:value={$formData.calendarDate}
				/>
			`}
      </CodeBlock>
    </Container>
    <Container
      description="A multiple choice selection component (one value only)"
      title="ChoiceField"
    >
      <Preview slot="preview">
        <form class="space-y" method="POST" use:enhance>
          <div class="flex w-full space-x-5">
            <ChoiceField
              name="tag"
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Vertical"
              vertical
              bind:value={$formData.tag}
            />
            <ChoiceField
              name="tag"
              disabled
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Vertical Disabled"
              vertical
              bind:value={$formData.tag}
            />
            <ChoiceField
              name="tag"
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Vertical Readonly"
              readonly
              vertical
              bind:value={$formData.tag}
            />
          </div>
          <div class="flex w-full space-x-5">
            <ChoiceField
              name="tag"
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Horizontal"
              bind:value={$formData.tag}
            >
              {#snippet buttonContent(label)}
                <span class="text-sm font-medium">s{label}</span>
              {/snippet}
            </ChoiceField>
            <ChoiceField
              name="tag"
              disabled
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Horizontal Disabled"
              bind:value={$formData.tag}
            />
            <ChoiceField
              name="tag"
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Horizontal Readonly"
              readonly
              bind:value={$formData.tag}
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
    <Container description="A multiple choice selection component" title="ChoiceMultiField">
      <Preview slot="preview">
        <form class="space-y" method="POST" use:enhance>
          <div class="flex w-full space-x-5">
            <ChoiceMultiField
              name="tags"
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Vertical"
              vertical
              bind:value={$formData.tags}
            />
            <ChoiceMultiField
              name="tags"
              disabled
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Vertical Disabled"
              vertical
              bind:value={$formData.tags}
            />
            <ChoiceMultiField
              name="tags"
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Vertical Readonly"
              readonly
              vertical
              bind:value={$formData.tags}
            />
          </div>
          <div class="flex w-full space-x-5">
            <ChoiceMultiField
              name="tags"
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Horizontal"
              bind:value={$formData.tags}
            />
            <ChoiceMultiField
              name="tags"
              disabled
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Horizontal Disabled"
              bind:value={$formData.tags}
            />
            <ChoiceMultiField
              name="tags"
              {form}
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={['svelte', 'sveltekit', 'formsnap', 'shadcn', 'arktype']}
              label="Horizontal Readonly"
              readonly
              bind:value={$formData.tags}
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
      description="A multiple choice selection component  for weekdays (single value)"
      title="WeekdayChoiceField"
    >
      <Preview slot="preview">
        <form class="space-y" method="POST" use:enhance>
          <div class="flex w-full space-x-5">
            <WeekdayChoiceField
              name="weekday"
              {form}
              label="Vertical"
              vertical
              bind:value={$formData.weekday}
            />
            <WeekdayChoiceField
              name="weekday"
              disabled
              {form}
              label="Vertical Disabled"
              vertical
              bind:value={$formData.weekday}
            />
            <WeekdayChoiceField
              name="weekday"
              {form}
              label="Vertical Readonly"
              readonly
              vertical
              bind:value={$formData.weekday}
            />
          </div>
          <div class="flex w-full space-x-5">
            <WeekdayChoiceField
              name="weekday"
              {form}
              label="Horizontal"
              bind:value={$formData.weekday}
            />
            <WeekdayChoiceField
              name="weekday"
              disabled
              {form}
              label="Horizontal Disabled"
              bind:value={$formData.weekday}
            />
            <WeekdayChoiceField
              name="weekday"
              {form}
              label="Horizontal Readonly"
              readonly
              bind:value={$formData.weekday}
            />
          </div>
          <div class="flex w-full space-x-5">
            <WeekdayChoiceField
              name="weekday"
              {form}
              label="Horizontal LetterLabels"
              letterLabels
              bind:value={$formData.weekday}
            />
            <WeekdayChoiceField
              name="weekday"
              {form}
              label="Horizontal LongLabels"
              longLabels
              bind:value={$formData.weekday}
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
      description="A multiple choice selection component  for weekdays"
      title="WeekdayChoiceMultiField"
    >
      <Preview slot="preview">
        <form class="space-y" method="POST" use:enhance>
          <div class="flex w-full space-x-5">
            <WeekdayChoiceMultiField
              name="weekdays"
              {form}
              label="Vertical"
              vertical
              bind:value={$formData.weekdays}
            />
            <WeekdayChoiceMultiField
              name="weekdays"
              disabled
              {form}
              label="Vertical Disabled"
              vertical
              bind:value={$formData.weekdays}
            />
            <WeekdayChoiceMultiField
              name="weekdays"
              {form}
              label="Vertical Readonly"
              readonly
              vertical
              bind:value={$formData.weekdays}
            />
          </div>
          <div class="flex w-full space-x-5">
            <WeekdayChoiceMultiField
              name="weekdays"
              {form}
              label="Horizontal"
              bind:value={$formData.weekdays}
            />
            <WeekdayChoiceMultiField
              name="weekdays"
              disabled
              {form}
              label="Horizontal Disabled"
              bind:value={$formData.weekdays}
            />
            <WeekdayChoiceMultiField
              name="weekdays"
              {form}
              label="Horizontal Readonly"
              readonly
              bind:value={$formData.weekdays}
            />
          </div>
          <div class="flex w-full space-x-5">
            <WeekdayChoiceMultiField
              name="weekdays"
              {form}
              label="Horizontal LetterLabels"
              letterLabels
              bind:value={$formData.weekdays}
            />
            <WeekdayChoiceMultiField
              name="weekdays"
              {form}
              label="Horizontal LongLabels"
              longLabels
              bind:value={$formData.weekdays}
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
