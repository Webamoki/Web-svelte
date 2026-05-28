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
    PasswordField,
    PinField,
    SelectField,
    SwitchField,
    TextField,
    TimeField
  } from '$lib/shared/components/form/index.js';
  import { Sidebar } from '$lib/shared/components/ui/index.js';
  import { Hash, MessageSquare, Tag, User } from '@lucide/svelte';
  import { identity } from 'ramda';

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
    TextNullableSchema,
    TextSchema,
    TimeSchema
  } from './schemas.js';

  let hiddenToken = $state<string | undefined>('abc123');
  let hiddenCount = $state<string | undefined>('1');
</script>

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
            {#each [['textfield', 'TextField'], ['emailfield', 'EmailField'], ['passwordfield', 'PasswordField'], ['numberfield', 'NumberField'], ['datefield', 'DateField'], ['daterangefield', 'DateRangeField'], ['timefield', 'TimeField'], ['checkboxfield', 'CheckboxField'], ['hexcolorfield', 'HexColorField'], ['messagefield', 'MessageField'], ['pinfield', 'PinField'], ['selectfield', 'SelectField'], ['filefield', 'FileField'], ['hidden-inputs', 'Hidden inputs'], ['form', 'Form']] as [anchor, label] (anchor)}
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
            <TextField name="text" form={textNullableForm} placeholder="optional">
              Text (nullable)
            </TextField>
            <Button form={textNullableForm}>Submit</Button>
          </Form>
        </Preview>
        <CodeBlock slot="code">
          {`<TextField name="text" form={remoteForm}>Text</TextField>`}
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
            <EmailField name="email" form={emailNullableForm} placeholder="optional">
              Email (nullable)
            </EmailField>
            <Button form={emailNullableForm}>Submit</Button>
          </Form>
        </Preview>
        <CodeBlock slot="code">
          {`<EmailField name="email" form={remoteForm}>Email</EmailField>`}
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
            <NumberField name="age" form={numberNullableForm} placeholder="optional">
              Age (nullable)
            </NumberField>
            <Button form={numberNullableForm}>Submit</Button>
          </Form>
        </Preview>
        <CodeBlock slot="code">
          {`<NumberField name="age" form={remoteForm}>Age</NumberField>`}
        </CodeBlock>
      </Container>

      <Container description="A date input field" title="DateField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={dateForm} schema={DateSchema}>
            <DateField name="date" form={dateForm}>Date (2026 or later)</DateField>
            <Button form={dateForm}>Submit</Button>
          </Form>
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
        </Preview>
        <CodeBlock slot="code">
          {`<CheckboxField name="agreed" form={remoteForm} description="...">
  I agree to the terms
</CheckboxField>`}
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
            <HexColorField name="color" form={colorNullableForm}>Color (nullable)</HexColorField>
            <Button form={colorNullableForm}>Submit</Button>
          </Form>
        </Preview>
        <CodeBlock slot="code">
          {`<HexColorField name="color" form={remoteForm}>Color</HexColorField>`}
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
            <PinField name="pin" form={pinNullableForm}>PIN (nullable)</PinField>
            <Button form={pinNullableForm}>Submit</Button>
          </Form>
        </Preview>
        <CodeBlock slot="code">
          {`<PinField name="pin" form={remoteForm} maxlength={6}>
  Verification Code
</PinField>`}
        </CodeBlock>
      </Container>

      <Container description="A single-select field (wraps ui/Select)" title="SelectField">
        <Preview slot="preview">
          <Form class="flex flex-col gap-4" form={selectForm} schema={SelectSchema}>
            <SelectField
              name="select"
              form={selectForm}
              getKey={identity}
              getLabel={(s: string) => s.toUpperCase()}
              getValue={identity}
              items={['apple', 'banana', 'cherry']}
              placeholder="Please select"
            >
              Select (pick cherry)
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
              getKey={identity}
              getLabel={(s: string) => s.toUpperCase()}
              getValue={identity}
              icon={Tag}
              items={['apple', 'banana', 'cherry']}
              placeholder="Please select"
            >
              With Icon
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
              getKey={identity}
              getLabel={(s: string) => s.toUpperCase()}
              getValue={identity}
              items={[...SELECT_OPTIONS]}
              nullable
              placeholder="Optional"
            >
              Select (nullable)
            </SelectField>
            <Button form={selectNullableForm}>Submit</Button>
          </Form>
        </Preview>
        <CodeBlock slot="code">
          {`<SelectField
  name="select"
  form={remoteForm}
  items={['apple', 'banana', 'cherry']}
  getKey={identity}
  getLabel={(s) => s.toUpperCase()}
  getValue={identity}
  placeholder="Please select"
>
  Select
</SelectField>`}
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
        </Preview>
        <CodeBlock slot="code">
          {`<FileField name="file" form={remoteForm}>Upload</FileField>
<FileField name="file" form={remoteForm} variant="dropzone">Upload</FileField>`}
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
              getKey={identity}
              getLabel={identity}
              getValue={identity}
              items={[...SELECT_OPTIONS]}
              placeholder="Please select"
            >
              Select
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
