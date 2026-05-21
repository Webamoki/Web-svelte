import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { z } from 'zod';

import { invalid } from '@sveltejs/kit';

/**
 * Parses specific fields from form data and retains untouched fields.
 * Throws an invalid issue on failure to halt execution.
 */
export function parseForm<
  // Infer the concrete validated data directly so untouched fields keep their types.
  TData extends Record<string, unknown>,
  TParsers extends Record<string, z.ZodTypeAny>
>(
  data: TData,
  issue: IssueFactory<TData>,
  parsers: TParsers & {
    // Any parser key not present in TData collapses to `never`, forcing a type error.
    [K in keyof TParsers]: K extends keyof TData ? z.ZodTypeAny : never;
  }
): Omit<TData, Extract<keyof TParsers, string>> & {
  [K in keyof TParsers]: z.infer<TParsers[K]>;
} {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resultData: any = { ...data };

  for (const key in parsers) {
    const parser = parsers[key];
    if (!parser) continue;

    const result = parser.safeParse(data[key as keyof typeof data]);
    if (!result.success) {
      const e = prettifyError(result.error);

      // FIX: Cast issue to any for dynamic function invocation.
      // TS cannot evaluate `issue[key]` dynamically when the object contains multiple distinct generic function signatures.
      throw invalid(issue[key](e));
    }

    // Overwrite with parsed value
    resultData[key] = result.data;
  }

  return resultData;
}

/**
 * The subset of `InvalidField` we touch: a per-key issue factory.
 */
type IssueFactory<TData> = ((message: string) => StandardSchemaV1.Issue) & {
  [K in keyof TData]: (message: string) => StandardSchemaV1.Issue;
};

function prettifyError(error: z.ZodError) {
  // Could use z.prettifyError but it has icons
  return error.issues
    .map((iss) => {
      const lines = [`${iss.message}`];
      if (iss.path.length) lines.push(`  → at ${iss.path.join('.')}`);
      return lines.join('\n');
    })
    .join('\n');
}
