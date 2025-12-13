import {
	SESClient,
	SendEmailCommand,
	type SendEmailCommandInput,
	type SendEmailCommandOutput
} from '@aws-sdk/client-ses';

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

	if (!to || (Array.isArray(to) ? to.length === 0 : to.trim() === '')) {
		throw new Error('sendEmail: at least one recipient is required (to)');
	}

	if (!subject) {
		throw new Error('sendEmail: subject is required');
	}

	if (!text && !html) {
		throw new Error('sendEmail: at least one of text or html body must be provided');
	}

	if (!from) {
		throw new Error('sendEmail: sender `from` is required');
	}

	// Format source with optional fromName
	const source = fromName ? `${fromName} <${from}>` : from;

	// Normalize address arrays to string arrays
	const normalize = (addr?: string | string[]) =>
		addr === undefined ? undefined : Array.isArray(addr) ? addr : [addr];

	const toAddresses = normalize(to)!;
	const ccAddresses = normalize(cc);
	const bccAddresses = normalize(bcc);
	const replyToAddresses = normalize(replyTo);

	const region = process.env.AWS_REGION;
	const client = new SESClient({ region });

	// Build message body
	const Message: SendEmailCommandInput['Message'] = {
		Subject: {
			Charset: 'UTF-8',
			Data: subject
		},
		Body: {}
	};
	if (html) {
		Message.Body = Message.Body ?? {};
		Message.Body.Html = {
			Charset: 'UTF-8',
			Data: html
		};
	}
	if (text) {
		Message.Body = Message.Body ?? {};
		Message.Body.Text = {
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
		const res: SendEmailCommandOutput = await client.send(command);
		// res.MessageId is the SES message id when successful
		if (res.MessageId) return res.MessageId;
		// If no MessageId, still return a stringified response so callers get something useful.
		return JSON.stringify(res);
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
