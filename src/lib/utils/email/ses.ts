import { signRequest } from './aws-signer.js';

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
 * Send an email using AWS SES API.
 * Uses AWS Signature V4 signing and fetch API for Cloudflare Workers compatibility.
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

	// Get AWS credentials from environment
	const region = process.env.AWS_REGION;
	const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

	if (!region || !accessKeyId || !secretAccessKey) {
		throw new Error(
			'sendEmail: missing required environment variables (AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)'
		);
	}

	// Format source with optional fromName
	const source = fromName ? `${fromName} <${from}>` : from;

	// Build form-encoded request body for SES API
	const params = new URLSearchParams();
	params.append('Action', 'SendEmail');
	params.append('Source', source);

	// Add destination addresses
	toAddresses.forEach((addr, i) => params.append(`Destination.ToAddresses.member.${i + 1}`, addr));
	if (ccAddresses) {
		ccAddresses.forEach((addr, i) =>
			params.append(`Destination.CcAddresses.member.${i + 1}`, addr)
		);
	}
	if (bccAddresses) {
		bccAddresses.forEach((addr, i) =>
			params.append(`Destination.BccAddresses.member.${i + 1}`, addr)
		);
	}

	// Add reply-to addresses
	if (replyToAddresses) {
		replyToAddresses.forEach((addr, i) => params.append(`ReplyToAddresses.member.${i + 1}`, addr));
	}

	// Add message subject
	params.append('Message.Subject.Data', subject);
	params.append('Message.Subject.Charset', 'UTF-8');

	// Add message body
	if (html) {
		params.append('Message.Body.Html.Data', html);
		params.append('Message.Body.Html.Charset', 'UTF-8');
	}
	if (text) {
		params.append('Message.Body.Text.Data', text);
		params.append('Message.Body.Text.Charset', 'UTF-8');
	}

	const body = params.toString();
	const host = `email.${region}.amazonaws.com`;
	const path = '/';

	try {
		// Sign the request
		const { headers } = await signRequest('POST', host, path, body, {
			accessKeyId,
			secretAccessKey,
			region
		});

		// Make the API request
		const response = await fetch(`https://${host}${path}`, {
			method: 'POST',
			headers: {
				...headers,
				Host: host,
				'Content-Length': body.length.toString()
			},
			body
		});

		const responseText = await response.text();

		if (!response.ok) {
			// Parse error response using regex (works in Node.js and browsers)
			let errorMessage = 'Unknown error';
			let errorCode: string | undefined;
			try {
				const codeMatch = responseText.match(/<Code>(.*?)<\/Code>/);
				const messageMatch = responseText.match(/<Message>(.*?)<\/Message>/);
				if (codeMatch) errorCode = codeMatch[1];
				if (messageMatch) errorMessage = messageMatch[1];
			} catch {
				errorMessage = responseText || `HTTP ${response.status} ${response.statusText}`;
			}

			throw new Error(
				`sendEmail: failed to send email: ${JSON.stringify({ message: errorMessage, code: errorCode })}`
			);
		}

		// Parse success response for MessageId using regex (works in Node.js and browsers)
		try {
			const messageIdMatch = responseText.match(/<MessageId>(.*?)<\/MessageId>/);

			if (!messageIdMatch || !messageIdMatch[1]) {
				throw new Error('sendEmail: SES response did not contain a MessageId');
			}

			return messageIdMatch[1];
		} catch (err) {
			if (err instanceof Error && err.message.includes('MessageId')) {
				throw err;
			}
			throw new Error(
				`sendEmail: failed to parse SES response: ${err instanceof Error ? err.message : String(err)}`
			);
		}
	} catch (err: unknown) {
		// Re-throw if already formatted
		if (err instanceof Error && err.message.startsWith('sendEmail:')) {
			throw err;
		}
		// Normalize other errors
		const message = err instanceof Error ? err.message : String(err);
		let code: string | undefined;
		if (err && typeof err === 'object') {
			const e = err as Record<string, unknown>;
			if (typeof e['name'] === 'string') code = e['name'] as string;
		}
		const details = { message, code };
		throw new Error(`sendEmail: failed to send email: ${JSON.stringify(details)}`);
	}
}
