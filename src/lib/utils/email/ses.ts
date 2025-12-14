import {
	SESClient,
	SendEmailCommand,
	type SendEmailCommandInput,
	type SendEmailCommandOutput
} from '@aws-sdk/client-ses';

// Create SES client once at module level for reuse across function calls
const sesClient = new SESClient({ region: process.env.AWS_REGION });

export interface SendEmailOptions {
	to: string | string[];
	cc?: string | string[];
	bcc?: string | string[];
	subject: string;
	text?: string;
	html?: string;
	from: string;
	fromName?: string;
	replyTo?: string | string[];
}

/**
 * Send an email using AWS SES.
 *
 * Environment variables required:
 * - AWS_REGION
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 *
 * @returns messageId returned by SES
 */
export async function sendEmail(options: SendEmailOptions): Promise<string> {
	if (!options) throw new Error('sendEmail: options is required');
	const { to, cc, bcc, subject, text, html, from, fromName, replyTo } = options;

	if (!subject) {
		throw new Error('sendEmail: subject is required');
	}

	if (!text && !html) {
		throw new Error('sendEmail: at least one of text or html body must be provided');
	}

	if (!from) {
		throw new Error('sendEmail: sender `from` is required');
	}

	// Normalize and validate addresses: convert to array and filter out empty/whitespace strings
	const normalizeAddresses = (addr?: string | string[]): string[] | undefined => {
		if (addr === undefined) return undefined;
		const addresses = Array.isArray(addr) ? addr : [addr];
		const filtered = addresses.filter((a) => a && a.trim() !== '');
		return filtered.length > 0 ? filtered : undefined;
	};

	const toAddresses = normalizeAddresses(to);
	const ccAddresses = normalizeAddresses(cc);
	const bccAddresses = normalizeAddresses(bcc);
	const replyToAddresses = normalizeAddresses(replyTo);

	if (!toAddresses || toAddresses.length === 0) {
		throw new Error('sendEmail: at least one valid recipient is required (to)');
	}

	// Format source with optional fromName
	const source = fromName ? `${fromName} <${from}>` : from;

	// Build message body
	const Message: SendEmailCommandInput['Message'] = {
		Subject: {
			Charset: 'UTF-8',
			Data: subject
		},
		Body: {}
	};
	if (html) {
		Message.Body!.Html = {
			Charset: 'UTF-8',
			Data: html
		};
	}
	if (text) {
		Message.Body!.Text = {
			Charset: 'UTF-8',
			Data: text
		};
	}

	const params: SendEmailCommandInput = {
		Source: source,
		Destination: {
			ToAddresses: toAddresses,
			CcAddresses: ccAddresses,
			BccAddresses: bccAddresses
		},
		Message,
		ReplyToAddresses: replyToAddresses
	};

	try {
		const command = new SendEmailCommand(params);
		const res: SendEmailCommandOutput = await sesClient.send(command);
		if (!res.MessageId) {
			throw new Error('sendEmail: SES response did not contain a MessageId');
		}
		return res.MessageId;
	} catch (err: unknown) {
		// Normalize error for callers
		const message = err instanceof Error ? err.message : String(err);
		let code: string | undefined;
		if (err && typeof err === 'object') {
			const e = err as Record<string, unknown>;
			if (typeof e['name'] === 'string') code = e['name'] as string;
		}
		const details = { message, code };
		// Re-throw a clear error for the caller to handle
		throw new Error(`sendEmail: failed to send email: ${JSON.stringify(details)}`);
	}
}
