<script lang="ts">
  import { resolve } from '$app/paths';
  import CodeBlock from '$lib/components/showcase/CodeBlock.svelte';
  import Container from '$lib/components/showcase/Container.svelte';
  import Preview from '$lib/components/showcase/Preview.svelte';
  import {
    Button,
    CheckboxField,
    DateField,
    DateRangeField,
    EmailField,
    FileField,
    Form,
    HexColorField,
    MessageField,
    NumberField,
    Option,
    PasswordField,
    PinField,
    SelectField,
    SliderField,
    SwitchField,
    TextField,
    TimeField
  } from '$lib/shared/components/form/index.js';
  import { Sidebar } from '$lib/shared/components/ui/index.js';
  import { Hash, MessageSquare, Tag, User } from '@lucide/svelte';
  import { z } from 'zod/v4';

  import {
    checkboxForm,
    colorForm,
    colorNullableForm,
    dateForm,
    dateRangeForm,
    emailForm,
    emailNullableForm,
    fileForm,
    hiddenForm,
    messageForm,
    numberForm,
    numberNullableForm,
    passwordForm,
    pinForm,
    pinNullableForm,
    selectForm,
    selectNullableForm,
    showcaseForm,
    sliderForm,
    textForm,
    textNullableForm,
    timeForm
  } from './action.remote.js';
  import {
    CheckboxSchema,
    ColorNullableSchema,
    ColorSchema,
    DateRangeSchema,
    DateSchema,
    EmailNullableSchema,
    EmailSchema,
    FileSchema,
    HiddenSchema,
    MessageSchema,
    NumberNullableSchema,
    NumberSchema,
    PasswordSchema,
    PinNullableSchema,
    PinSchema,
    SELECT_OPTIONS,
    SelectNullableSchema,
    SelectSchema,
    ShowcaseSchema,
    SliderSchema,
    TextNullableSchema,
    TextSchema,
    TimeSchema
  } from './schemas.js';

  let hiddenToken = $state<string | undefined>('abc123');
  let hiddenCount = $state<string | undefined>('1');

  // Standalone (no form) demo state. Fields are controlled via bind:value /
  // bind:checked, validate against an optional per-field Zod schema, and fire
  // onInput / onChange callbacks.
  let saText = $state('');
  let saEmail = $state('');
  let saPassword = $state('');
  let saNumber = $state('');
  let saDate = $state('');
  let saTime = $state('');
  let saChecked = $state(false);
  let saSwitch = $state(false);
  let saColor = $state('');
  let saMessage = $state('');
  let saPin = $state('');
  let saSelect = $state<string | undefined>(undefined);
  let saStartDate = $state('');
  let saEndDate = $state('');
  let saFiles = $state<File[]>([]);
  let saSlider = $state(25);
  let saSliderRange = $state<number[]>([20, 80]);

  const StandaloneText = z.string().min(3, 'Minimum 3 characters');
  const StandaloneEmail = z.email('Invalid email');
  const StandaloneMessage = z.string().min(10, 'Minimum 10 characters');
  const StandaloneFiles = z.array(z.instanceof(File)).min(1, 'Select at least one file');
</script>

{#snippet standaloneLabel(note?: string)}
  <p class="mt-6 mb-3 border-t border-gray-200 pt-4 text-xs font-semibold text-gray-500">
    Standalone (no form){note ? ` — ${note}` : ''}
  </p>
{/snippet}

<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header>
      <h2 class="px-2 text-xl font-bold">Components</h2>
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>New (Remote Forms)</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each [['textfield', 'TextField'], ['emailfield', 'EmailField'], ['passwordfield', 'PasswordField'], ['numberfield', 'NumberField'], ['datefield', 'DateField'], ['daterangefield', 'DateRangeField'], ['timefield', 'TimeField'], ['checkboxfield', 'CheckboxField'], ['hexcolorfield', 'HexColorField'], ['messagefield', 'MessageField'], ['pinfield', 'PinField'], ['selectfield', 'SelectField'], ['sliderfield', 'SliderField'], ['filefield', 'FileField'], ['hidden-inputs', 'Hidden inputs'], ['form', 'Form']] as [anchor, label] (anchor)}
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

      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={resolve('/fields/legacy')} {...props}>Legacy components →</a>
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
      <h1 class="mb-2 text-3xl font-bold text-gray-900">Form Components Showcase</h1>
      <p class="mb-8 text-gray-600">
        New components use SvelteKit remote forms. Legacy components remain for fields not yet
        migrated.
      </p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">New (Remote Forms)</h2>

      <p class="mb-8 text-sm text-gray-500">
        Fields are <strong>required by default</strong> — a red star shows on the label. Add the
        <code>optional</code> shorthand to drop the star. When a field has no label the cue moves to
        the placeholder, which is prefixed with <code>(Required)</code> or <code>(Optional)</code>.
        The “(optional)” examples below use <code>optional</code>.
      </p>

      <Container description="A basic text input field" title="TextField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={textForm} schema={TextSchema}>
            <TextField name="text" form={textForm} placeholder="show success">Text</TextField>
            <Button form={textForm}>Submit</Button>
          </Form>
          <Form class="mt-4 flex flex-col gap-4" form={textForm.for('icon')} schema={TextSchema}>
            <TextField name="text" form={textForm.for('icon')} icon={User} placeholder="with icon">
              With Icon
            </TextField>
            <Button form={textForm.for('icon')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={textNullableForm}
            schema={TextNullableSchema}
          >
            <TextField name="text" form={textNullableForm} optional placeholder="no star">
              Text (optional)
            </TextField>
            <TextField name="text" form={textNullableForm} optional placeholder="no label" />
            <Button form={textNullableForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:value + schema + onInput')}
          <TextField
            name="text"
            onInput={(v) => (saText = v)}
            placeholder="min 3 chars"
            schema={StandaloneText}
            bind:value={saText}
          >
            Text
          </TextField>
          <p class="mt-1 text-xs text-gray-600">value: {saText || '(empty)'}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<TextField name="text" form={remoteForm}>Text</TextField>
<TextField name="text" form={remoteForm} optional>Text</TextField>
<TextField name="text" form={remoteForm} optional placeholder="no label" />`}
        </CodeBlock>
      </Container>

      <Container description="An email input field" title="EmailField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={emailForm} schema={EmailSchema}>
            <EmailField name="email" form={emailForm} placeholder="success@example.com"
              >Email</EmailField
            >
            <Button form={emailForm}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={emailNullableForm}
            schema={EmailNullableSchema}
          >
            <EmailField name="email" form={emailNullableForm} optional placeholder="no star">
              Email (optional)
            </EmailField>
            <Button form={emailNullableForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:value + schema')}
          <EmailField name="email" schema={StandaloneEmail} bind:value={saEmail}>Email</EmailField>
          <p class="mt-1 text-xs text-gray-600">value: {saEmail || '(empty)'}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<EmailField name="email" form={remoteForm}>Email</EmailField>
<EmailField name="email" form={remoteForm} optional>Email</EmailField>`}
        </CodeBlock>
      </Container>

      <Container description="A password input field" title="PasswordField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={passwordForm} schema={PasswordSchema}>
            <PasswordField name="password" form={passwordForm} placeholder="password123"
              >Password</PasswordField
            >
            <Button form={passwordForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:value')}
          <PasswordField name="password" bind:value={saPassword}>Password</PasswordField>
          <p class="mt-1 text-xs text-gray-600">length: {saPassword.length}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<PasswordField name="password" form={remoteForm}>Password</PasswordField>`}
        </CodeBlock>
      </Container>

      <Container description="A number input field" title="NumberField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={numberForm} schema={NumberSchema}>
            <NumberField name="age" form={numberForm} placeholder="18 or older">Age</NumberField>
            <Button form={numberForm}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={numberForm.for('icon')}
            schema={NumberSchema}
          >
            <NumberField
              name="age"
              form={numberForm.for('icon')}
              icon={Hash}
              placeholder="with icon"
            >
              With Icon
            </NumberField>
            <Button form={numberForm.for('icon')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={numberNullableForm}
            schema={NumberNullableSchema}
          >
            <NumberField name="age" form={numberNullableForm} optional placeholder="no star">
              Age (optional)
            </NumberField>
            <Button form={numberNullableForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:value')}
          <NumberField name="age" placeholder="any number" bind:value={saNumber}>Age</NumberField>
          <p class="mt-1 text-xs text-gray-600">value: {saNumber || '(empty)'}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<NumberField name="age" form={remoteForm}>Age</NumberField>
<NumberField name="age" form={remoteForm} optional>Age</NumberField>`}
        </CodeBlock>
      </Container>

      <Container description="A date input field" title="DateField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={dateForm} schema={DateSchema}>
            <DateField name="date" form={dateForm}>Date (2026 or later)</DateField>
            <Button form={dateForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:value')}
          <DateField name="date" bind:value={saDate}>Date</DateField>
          <p class="mt-1 text-xs text-gray-600">value: {saDate || '(empty)'}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<DateField name="date" form={remoteForm}>Date</DateField>`}
        </CodeBlock>
      </Container>

      <Container description="A start/end date range field" title="DateRangeField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={dateRangeForm} schema={DateRangeSchema}>
            <DateRangeField endName="endDate" form={dateRangeForm} startName="startDate">
              Date range
            </DateRangeField>
            <Button form={dateRangeForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:startValue / bind:endValue')}
          <DateRangeField
            endName="endDate"
            startName="startDate"
            bind:endValue={saEndDate}
            bind:startValue={saStartDate}
          >
            Date range
          </DateRangeField>
          <p class="mt-1 text-xs text-gray-600">
            {saStartDate || '(empty)'} → {saEndDate || '(empty)'}
          </p>
        </Preview>
        <CodeBlock slot="code">
          {`<DateRangeField startName="startDate" endName="endDate" form={remoteForm}>
  Date range
</DateRangeField>`}
        </CodeBlock>
      </Container>

      <Container description="A time input field" title="TimeField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={timeForm} schema={TimeSchema}>
            <TimeField name="time" form={timeForm}>Time (afternoon, 12:00+)</TimeField>
            <Button form={timeForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:value')}
          <TimeField name="time" bind:value={saTime}>Time</TimeField>
          <p class="mt-1 text-xs text-gray-600">value: {saTime || '(empty)'}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<TimeField name="time" form={remoteForm}>Time</TimeField>`}
        </CodeBlock>
      </Container>

      <Container description="A checkbox field for boolean values" title="CheckboxField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={checkboxForm} schema={CheckboxSchema}>
            <CheckboxField name="agreed" form={checkboxForm}
              >I agree to the terms (must check)</CheckboxField
            >
            <Button form={checkboxForm}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={checkboxForm.for('description')}
            schema={CheckboxSchema}
          >
            <CheckboxField
              name="agreed"
              description="You must accept to continue"
              form={checkboxForm.for('description')}
            >
              With Description
            </CheckboxField>
            <Button form={checkboxForm.for('description')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={checkboxForm.for('optional')}
            schema={CheckboxSchema}
          >
            <CheckboxField name="agreed" form={checkboxForm.for('optional')} optional>
              Optional (no star)
            </CheckboxField>
            <Button form={checkboxForm.for('optional')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={checkboxForm.for('disabled')}
            schema={CheckboxSchema}
          >
            <CheckboxField name="agreed" disabled form={checkboxForm.for('disabled')}>
              Disabled
            </CheckboxField>
            <Button form={checkboxForm.for('disabled')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={checkboxForm.for('switch')}
            schema={CheckboxSchema}
          >
            <SwitchField name="agreed" form={checkboxForm.for('switch')}>As a switch</SwitchField>
            <Button form={checkboxForm.for('switch')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={checkboxForm.for('switch-description')}
            schema={CheckboxSchema}
          >
            <SwitchField
              name="agreed"
              description="Toggle to enable"
              form={checkboxForm.for('switch-description')}
            >
              Switch with description
            </SwitchField>
            <Button form={checkboxForm.for('switch-description')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={checkboxForm.for('switch-disabled')}
            schema={CheckboxSchema}
          >
            <SwitchField name="agreed" disabled form={checkboxForm.for('switch-disabled')}>
              Disabled switch
            </SwitchField>
            <Button form={checkboxForm.for('switch-disabled')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={checkboxForm.for('onoff')}
            schema={CheckboxSchema}
          >
            <SwitchField name="agreed" form={checkboxForm.for('onoff')} variant="onoff">
              As an ON/OFF toggle
            </SwitchField>
            <Button form={checkboxForm.for('onoff')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={checkboxForm.for('button')}
            schema={CheckboxSchema}
          >
            <SwitchField name="agreed" form={checkboxForm.for('button')} variant="button">
              As a button
            </SwitchField>
            <Button form={checkboxForm.for('button')}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:checked + onChange')}
          <CheckboxField name="agreed" onChange={(v) => (saChecked = v)} bind:checked={saChecked}>
            I agree
          </CheckboxField>
          <SwitchField name="enabled" bind:checked={saSwitch}>As a switch</SwitchField>
          <SwitchField name="enabled" variant="onoff" bind:checked={saSwitch}>
            As an ON/OFF toggle
          </SwitchField>
          <SwitchField name="enabled" variant="button" bind:checked={saSwitch}>
            As a button
          </SwitchField>
          <SwitchField
            name="power"
            offLabel="NO"
            onLabel="YES"
            variant="onoff"
            bind:checked={saSwitch}
          >
            Custom labels
          </SwitchField>
          <p class="mt-1 text-xs text-gray-600">checkbox: {saChecked} · switch: {saSwitch}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<CheckboxField name="agreed" form={remoteForm}>I agree to the terms</CheckboxField>
<CheckboxField name="agreed" form={remoteForm} optional>Optional</CheckboxField>

<!-- switch (default) vs onoff (ON/OFF labels) vs button (.btn) variants -->
<SwitchField name="enabled" bind:checked>As a switch</SwitchField>
<SwitchField name="enabled" variant="onoff" bind:checked>Toggle</SwitchField>
<SwitchField name="enabled" variant="button" bind:checked>As a button</SwitchField>
<SwitchField name="power" variant="onoff" onLabel="YES" offLabel="NO" bind:checked>Custom</SwitchField>`}
        </CodeBlock>
      </Container>

      <Container description="A hex color picker input" title="HexColorField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={colorForm} schema={ColorSchema}>
            <HexColorField name="color" form={colorForm}>Color (pick green #00ff00)</HexColorField>
            <Button form={colorForm}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={colorNullableForm}
            schema={ColorNullableSchema}
          >
            <HexColorField name="color" form={colorNullableForm} optional>
              Color (optional)
            </HexColorField>
            <Button form={colorNullableForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:value')}
          <HexColorField name="color" bind:value={saColor}>Color</HexColorField>
          <p class="mt-1 text-xs text-gray-600">value: {saColor || '(empty)'}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<HexColorField name="color" form={remoteForm}>Color</HexColorField>
<HexColorField name="color" form={remoteForm} optional>Color</HexColorField>`}
        </CodeBlock>
      </Container>

      <Container description="A textarea field with height lock feature" title="MessageField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={messageForm} schema={MessageSchema}>
            <MessageField
              name="message"
              defaultHeight={150}
              form={messageForm}
              placeholder="Must contain the word 'success'"
            >
              Message
            </MessageField>
            <MessageField
              name="message"
              defaultHeight={100}
              form={messageForm}
              placeholder="Enter your message here..."
              resize
            >
              Resizable
            </MessageField>
            <MessageField
              name="message"
              defaultHeight={150}
              form={messageForm}
              icon={MessageSquare}
              placeholder="Enter your message here..."
            >
              With Icon
            </MessageField>
            <Button form={messageForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:value + schema')}
          <MessageField name="message" schema={StandaloneMessage} bind:value={saMessage}>
            Message
          </MessageField>
          <p class="mt-1 text-xs text-gray-600">length: {saMessage.length}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<MessageField
  name="message"
  form={remoteForm}
  defaultHeight={150}
  icon={MessageSquare}
>
  Message
</MessageField>`}
        </CodeBlock>
      </Container>

      <Container description="A 6-digit PIN input for 2FA verification" title="PinField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={pinForm} schema={PinSchema}>
            <PinField name="pin" form={pinForm}>Verification Code (enter 123456)</PinField>
            <Button form={pinForm}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={pinForm.for('description')}
            schema={PinSchema}
          >
            <PinField
              name="pin"
              description="Enter the 6-digit code sent to your device"
              form={pinForm.for('description')}
            >
              With Description
            </PinField>
            <Button form={pinForm.for('description')}>Submit</Button>
          </Form>
          <Form class="mt-4 flex flex-col gap-4" form={pinForm.for('disabled')} schema={PinSchema}>
            <PinField name="pin" disabled form={pinForm.for('disabled')}>Disabled</PinField>
            <Button form={pinForm.for('disabled')}>Submit</Button>
          </Form>
          <Form class="mt-4 flex flex-col gap-4" form={pinNullableForm} schema={PinNullableSchema}>
            <PinField name="pin" form={pinNullableForm} optional>PIN (optional)</PinField>
            <Button form={pinNullableForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:value')}
          <PinField name="pin" bind:value={saPin}>PIN</PinField>
          <p class="mt-1 text-xs text-gray-600">value: {saPin || '(empty)'}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<PinField name="pin" form={remoteForm} maxlength={6}>
  Verification Code
</PinField>`}
        </CodeBlock>
      </Container>

      <Container
        description="A single-select field — declarative <Option> children, native <select><option>-style"
        title="SelectField"
      >
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={selectForm} schema={SelectSchema}>
            <SelectField
              name="select"
              form={selectForm}
              label="Select (pick cherry)"
              placeholder="Please select"
            >
              <Option value="apple">APPLE</Option>
              <Option value="banana">BANANA</Option>
              <Option value="cherry">CHERRY</Option>
            </SelectField>
            <Button form={selectForm}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={selectForm.for('icon')}
            schema={SelectSchema}
          >
            <SelectField
              name="select"
              form={selectForm.for('icon')}
              icon={Tag}
              label="With Icon"
              placeholder="Please select"
            >
              <Option value="apple">APPLE</Option>
              <Option value="banana">BANANA</Option>
              <Option value="cherry">CHERRY</Option>
            </SelectField>
            <Button form={selectForm.for('icon')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            form={selectNullableForm}
            schema={SelectNullableSchema}
          >
            <SelectField
              name="select"
              form={selectNullableForm}
              label="Select (optional)"
              nullable
              optional
              placeholder="Please select"
            >
              {#each SELECT_OPTIONS as opt (opt)}
                <Option value={opt}>{opt.toUpperCase()}</Option>
              {/each}
            </SelectField>
            <Button form={selectNullableForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('bind:value + onchange')}
          <SelectField
            name="select"
            label="Select"
            placeholder="Please select"
            bind:value={saSelect}
          >
            <Option value="apple">APPLE</Option>
            <Option value="banana">BANANA</Option>
            <Option value="cherry">CHERRY</Option>
          </SelectField>
          <p class="mt-1 text-xs text-gray-600">value: {saSelect ?? '(none)'}</p>
        </Preview>
        <CodeBlock slot="code">
          {`<SelectField name="select" form={remoteForm} label="Select" placeholder="Please select">
  <Option value="apple">APPLE</Option>
  <Option value="banana">BANANA</Option>
  <Option value="cherry">CHERRY</Option>
</SelectField>
<SelectField name="select" form={remoteForm} nullable optional label="Select (optional)" ...>
  ...
</SelectField>`}
        </CodeBlock>
      </Container>

      <Container
        description="A range slider (single or dual-thumb) styled like the switch"
        title="SliderField"
      >
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={sliderForm} schema={SliderSchema}>
            <SliderField name="level" form={sliderForm}>Level (set 50 or higher)</SliderField>
            <Button form={sliderForm}>Submit</Button>
          </Form>
          {@render standaloneLabel('single — bind:value + onChange')}
          <SliderField
            name="level"
            onChange={(v) => (saSlider = v as number)}
            bind:value={saSlider}
          >
            Volume
          </SliderField>
          <p class="mt-1 text-xs text-gray-600">value: {saSlider}</p>
          {@render standaloneLabel('range — bind:value=[low, high]')}
          <SliderField name="price" range bind:value={saSliderRange}>Price</SliderField>
          <p class="mt-1 text-xs text-gray-600">
            range: {saSliderRange[0]} – {saSliderRange[1]}
          </p>
        </Preview>
        <CodeBlock slot="code">
          {`<!-- form mode -->
<SliderField name="level" form={remoteForm}>Level</SliderField>

<!-- standalone single -->
<SliderField name="volume" bind:value min={0} max={100} step={1}>Volume</SliderField>

<!-- standalone dual-thumb range -->
<SliderField name="price" range bind:value={[low, high]}>Price</SliderField>`}
        </CodeBlock>
      </Container>

      <Container
        description="A file upload field with button and drag-and-drop variants"
        title="FileField"
      >
        <Preview slot="preview">
          <Form
            class="flex flex-col gap-4"
            enctype="multipart/form-data"
            form={fileForm.for('button')}
            schema={FileSchema}
          >
            <FileField name="file" form={fileForm.for('button')}>Upload (button)</FileField>
            <Button form={fileForm.for('button')}>Submit</Button>
          </Form>
          <Form
            class="mt-4 flex flex-col gap-4"
            enctype="multipart/form-data"
            form={fileForm.for('dropzone')}
            schema={FileSchema}
          >
            <FileField name="file" form={fileForm.for('dropzone')} variant="dropzone">
              Upload (drag &amp; drop)
            </FileField>
            <Button form={fileForm.for('dropzone')}>Submit</Button>
          </Form>
          {@render standaloneLabel('onSelect + schema')}
          <FileField name="file" multiple onSelect={(f) => (saFiles = f)} schema={StandaloneFiles}>
            Upload
          </FileField>
          <p class="mt-1 text-xs text-gray-600">
            selected: {saFiles.length === 0 ? '(none)' : saFiles.map((f) => f.name).join(', ')}
          </p>
        </Preview>
        <CodeBlock slot="code">
          {`<!-- required by default; the asterisk shows but the native input is never marked
     required (it would block edit-form submits — validation is handled by Zod) -->
<FileField name="file" form={remoteForm}>Upload</FileField>
<FileField name="file" form={remoteForm} variant="dropzone">Upload</FileField>
<FileField name="file" form={remoteForm} optional>Upload</FileField>`}
        </CodeBlock>
      </Container>

      <Container
        description="Hidden inputs driven by external state; cleared values are skipped (no render error) and changes propagate reactively"
        title="Hidden inputs"
      >
        <Preview slot="preview">
          <div class="flex gap-6">
            <div class="flex flex-col gap-2">
              <button
                class="btn ghost"
                onclick={() => (hiddenToken = crypto.randomUUID().slice(0, 8))}
                type="button"
              >
                Set random token
              </button>
              <button class="btn ghost" onclick={() => (hiddenToken = undefined)} type="button">
                Clear token
              </button>
              <button
                class="btn ghost"
                onclick={() => (hiddenCount = String(Number(hiddenCount ?? '0') + 1))}
                type="button"
              >
                Increment count
              </button>
              <button class="btn ghost" onclick={() => (hiddenCount = undefined)} type="button">
                Clear count
              </button>
              <p class="text-xs text-gray-600">
                token: {hiddenToken ?? '(none)'}<br />count: {hiddenCount ?? '(none)'}
              </p>
            </div>
            <Form
              class="flex flex-1 flex-col gap-4"
              form={hiddenForm}
              hidden={{ count: hiddenCount, token: hiddenToken }}
              onSuccess={(data) => console.log('Submitted:', data)}
              schema={HiddenSchema}
            >
              <TextField name="label" form={hiddenForm}>Label</TextField>
              <Button form={hiddenForm}>Submit</Button>
            </Form>
          </div>
        </Preview>
        <CodeBlock slot="code">
          {`<Form form={hiddenForm} hidden={{ token, count }} schema={HiddenSchema}>
  <TextField name="label" form={hiddenForm}>Label</TextField>
  <Button form={hiddenForm}>Submit</Button>
</Form>`}
        </CodeBlock>
      </Container>

      <Container
        description="A complete form using remote functions with success/error toasts"
        title="Form"
      >
        <Preview slot="preview">
          <Form
            class="flex flex-col gap-4"
            form={showcaseForm.for('form-demo')}
            onSuccess={(data) => console.log('Submitted:', data)}
            schema={ShowcaseSchema}
          >
            <TextField name="text" form={showcaseForm.for('form-demo')}>Text</TextField>
            <EmailField name="email" form={showcaseForm.for('form-demo')}>Email</EmailField>
            <PasswordField name="password" form={showcaseForm.for('form-demo')}
              >Password</PasswordField
            >
            <NumberField name="age" form={showcaseForm.for('form-demo')}>Age</NumberField>
            <DateField name="date" form={showcaseForm.for('form-demo')}>Date</DateField>
            <TimeField name="time" form={showcaseForm.for('form-demo')}>Time</TimeField>
            <CheckboxField name="agreed" form={showcaseForm.for('form-demo')}>I agree</CheckboxField
            >
            <MessageField name="message" form={showcaseForm.for('form-demo')}>Message</MessageField>
            <PinField name="pin" form={showcaseForm.for('form-demo')}>PIN</PinField>
            <HexColorField name="color" form={showcaseForm.for('form-demo')}>Color</HexColorField>
            <SelectField
              name="select"
              form={showcaseForm.for('form-demo')}
              label="Select"
              placeholder="Please select"
            >
              {#each SELECT_OPTIONS as opt (opt)}
                <Option value={opt}>{opt}</Option>
              {/each}
            </SelectField>
            <Button form={showcaseForm.for('form-demo')}>Submit</Button>
          </Form>
        </Preview>
        <CodeBlock slot="code">
          {`<Form remote={remoteForm} onSuccess={(data) => console.log(data)}>
  <TextField name="text" form={remoteForm}>Text</TextField>
  ...
  <Button form={remoteForm}>Submit</Button>
</Form>`}
        </CodeBlock>
      </Container>
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
