import type { Transport } from '@sveltejs/kit';

import { dateTransport } from '$lib/shared/utils/datetime/index.js';

export const transport: Transport = dateTransport;
