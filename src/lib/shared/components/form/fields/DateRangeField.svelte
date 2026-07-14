<script generics="Input extends RemoteFormInput" lang="ts">
  import type { CalendarDate } from '@internationalized/date';
  import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { ZodType } from 'zod/v4';

  import { type DateValue, parseDate } from '@internationalized/date';
  import Calendar from '@lucide/svelte/icons/calendar';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import { type DateRange, Popover, RangeCalendar } from 'bits-ui';

  import { formatDateFull } from '../../../utils/datetime/index.js';
  import { createFormView, createLocalSelectView, type FieldView } from '../field-view.svelte.js';
  import FieldLabel from '../FieldLabel.svelte';

  interface Props {
    children?: Snippet;
    endName: keyof Input & string;
    endSchema?: ZodType;
    endValue?: string;
    form?: Omit<RemoteForm<Input, unknown>, 'for'> | RemoteForm<Input, unknown>;
    onChange?: (range: { end: string; start: string }) => void;
    optional?: boolean;
    startName: keyof Input & string;
    startSchema?: ZodType;
    startValue?: string;
  }

  let {
    children,
    endName,
    endSchema,
    endValue = $bindable(''),
    form,
    onChange,
    optional,
    startName,
    startSchema,
    startValue = $bindable('')
  }: Props = $props();

  // `as('date')` is reached only via the `form` branch; standalone uses local state.
  // svelte-ignore state_referenced_locally
  const startView: FieldView = form
    ? createFormView(form, startName, 'date')
    : createLocalSelectView<string>({
        get: () => startValue,
        name: startName,
        schema: startSchema,
        write: (v) => (startValue = v)
      });
  // svelte-ignore state_referenced_locally
  const endView: FieldView = form
    ? createFormView(form, endName, 'date')
    : createLocalSelectView<string>({
        get: () => endValue,
        name: endName,
        schema: endSchema,
        write: (v) => (endValue = v)
      });

  const required = $derived(!optional);
  const startAttrs = $derived(startView.attrs);
  const endAttrs = $derived(endView.attrs);

  let open = $state(false);

  function toDateValue(iso: unknown): DateValue | undefined {
    if (typeof iso !== 'string' || !iso) return undefined;
    try {
      return parseDate(iso);
    } catch {
      return undefined;
    }
  }

  function toIso(date: DateValue | undefined): string {
    return date ? date.toString() : '';
  }

  const calendarValue: DateRange = $derived({
    end: toDateValue(endAttrs.value),
    start: toDateValue(startAttrs.value)
  });

  const displayLabel = $derived(
    calendarValue.start && calendarValue.end
      ? `${formatDateFull(calendarValue.start as CalendarDate)} – ${formatDateFull(calendarValue.end as CalendarDate)}`
      : 'Select date range'
  );

  // Scratch copy the calendar edits freely while the range is incomplete, so
  // picking a start day doesn't blank/validate the committed end field. Only
  // a complete range gets written back via `.set()`.
  let localRange: DateRange = $state({ end: undefined, start: undefined });

  $effect(() => {
    if (!open) localRange = calendarValue;
  });

  function handleRangeChange(range: DateRange) {
    localRange = range;
    if (!range.start || !range.end) return;

    const startIso = toIso(range.start);
    const endIso = toIso(range.end);
    startView.set(startIso);
    endView.set(endIso);
    onChange?.({ end: endIso, start: startIso });
    open = false;
  }
</script>

<div class="form-field">
  {#if children}
    <FieldLabel for={startAttrs.name} {required}>{@render children()}</FieldLabel>
  {/if}
  <Popover.Root bind:open>
    <Popover.Trigger
      id={startAttrs.name}
      class={[
        'form-input',
        'form-select',
        'form-input--with-icon',
        !(calendarValue.start && calendarValue.end) && 'form-select--placeholder'
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div class="form-input-icon"><Calendar size={14} /></div>
      <span class="form-select-value">{displayLabel}</span>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content class="form-daterange-menu" sideOffset={4}>
        <RangeCalendar.Root
          onValueChange={handleRangeChange}
          value={localRange}
          weekdayFormat="short"
        >
          {#snippet children({ months, weekdays })}
            {#each months as month (month.value.toString())}
              <div class="form-daterange-header">
                <RangeCalendar.PrevButton class="form-daterange-nav">
                  <ChevronLeft size={14} />
                </RangeCalendar.PrevButton>
                <RangeCalendar.Heading class="form-daterange-heading" />
                <RangeCalendar.NextButton class="form-daterange-nav">
                  <ChevronRight size={14} />
                </RangeCalendar.NextButton>
              </div>
              <RangeCalendar.Grid class="form-daterange-grid">
                <RangeCalendar.GridHead>
                  <RangeCalendar.GridRow class="form-daterange-row">
                    {#each weekdays as weekday (weekday)}
                      <RangeCalendar.HeadCell class="form-daterange-headcell">
                        {weekday.slice(0, 2)}
                      </RangeCalendar.HeadCell>
                    {/each}
                  </RangeCalendar.GridRow>
                </RangeCalendar.GridHead>
                <RangeCalendar.GridBody>
                  {#each month.weeks as weekDates (weekDates[0].toString())}
                    <RangeCalendar.GridRow class="form-daterange-row">
                      {#each weekDates as date (date.toString())}
                        <RangeCalendar.Cell class="form-daterange-cell" {date} month={month.value}>
                          <RangeCalendar.Day class="form-daterange-day" />
                        </RangeCalendar.Cell>
                      {/each}
                    </RangeCalendar.GridRow>
                  {/each}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
            {/each}
          {/snippet}
        </RangeCalendar.Root>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
  <input name={startAttrs.name} type="hidden" value={startAttrs.value} />
  <input name={endAttrs.name} type="hidden" value={endAttrs.value} />
  {#each startView.issues() as issue (`start-${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
  {#each endView.issues() as issue (`end-${issue.path}`)}
    <p class="form-error">{issue.message}</p>
  {/each}
</div>
