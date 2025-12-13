# Email Utility Package

This package provides utilities for sending emails using AWS Simple Email Service (SES).

## Installation

The AWS SES SDK is already included as a dependency. You'll need to configure your AWS credentials and region.

## Configuration

### Environment Variables

The email utility requires the following environment variables:

- `AWS_REGION` - AWS region where SES is configured (e.g., `us-east-1`)
- `AWS_ACCESS_KEY_ID` - AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key

### SES Setup

Before using this utility, ensure:

1. Your AWS account has SES enabled in your chosen region
2. Your sender email address(es) are verified in SES
3. If in SES sandbox mode, recipient addresses must also be verified
4. Your account has the necessary IAM permissions to send emails via SES

## Usage

### Basic Example

```typescript
import { sendEmail } from '@webamoki/web-svelte/utils/email';

// Send a simple text email
const messageId = await sendEmail({
	to: 'recipient@example.com',
	subject: 'Hello from SES',
	text: 'This is a plain text email.',
	from: 'sender@example.com'
});

console.log('Email sent with message ID:', messageId);
```

### HTML Email

```typescript
await sendEmail({
	to: 'recipient@example.com',
	subject: 'Welcome!',
	html: '<h1>Welcome to our service!</h1><p>Thanks for signing up.</p>',
	text: 'Welcome to our service! Thanks for signing up.', // Fallback for email clients that don't support HTML
	from: 'noreply@example.com',
	fromName: 'My Application'
});
```

### Multiple Recipients

```typescript
await sendEmail({
	to: ['user1@example.com', 'user2@example.com'],
	cc: 'manager@example.com',
	bcc: ['archive@example.com', 'backup@example.com'],
	subject: 'Team Update',
	text: 'This is a team-wide announcement.',
	from: 'team@example.com'
});
```

### With Reply-To

```typescript
await sendEmail({
	to: 'customer@example.com',
	subject: 'Your order confirmation',
	html: '<p>Your order has been confirmed!</p>',
	from: 'noreply@example.com',
	fromName: 'Order System',
	replyTo: 'support@example.com'
});
```

## API Reference

### `sendEmail(options: SendEmailOptions): Promise<string>`

Sends an email via AWS SES.

**Returns:** Promise that resolves to the SES message ID on success.

**Throws:** Error with descriptive message if sending fails or validation errors occur.

### `SendEmailOptions`

```typescript
interface SendEmailOptions {
	to: string | string[]; // Required: recipient email address(es)
	cc?: string | string[]; // Optional: CC recipients
	bcc?: string | string[]; // Optional: BCC recipients
	subject: string; // Required: email subject
	text?: string; // Optional: plain text body
	html?: string; // Optional: HTML body
	from: string; // Required: sender email
	fromName?: string; // Optional: sender display name
	replyTo?: string | string[]; // Optional: reply-to address(es)
}
```

## Error Handling

The `sendEmail` function validates inputs and will throw errors for:

- Missing required fields (`to`, `from`, `subject`, at least one of `text` or `html`)
- Empty recipient list
- AWS SES errors (credentials, permissions, service issues)

Always wrap calls in try-catch:

```typescript
try {
	const messageId = await sendEmail({
		to: 'user@example.com',
		subject: 'Test',
		text: 'Hello!',
		from: 'sender@example.com'
	});
	console.log('Success:', messageId);
} catch (error) {
	console.error('Failed to send email:', error.message);
	// Handle error appropriately
}
```

## SvelteKit Integration

### Server-Only Usage

⚠️ **Important:** This utility should only be used in server-side code (e.g., `+page.server.ts`, `+server.ts`, or server-side functions) as it requires AWS credentials.

### Example: Contact Form Handler

```typescript
// src/routes/contact/+page.server.ts
import { sendEmail } from '@webamoki/web-svelte/utils/email';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const message = formData.get('message') as string;

		try {
			await sendEmail({
				to: 'admin@example.com',
				subject: `Contact form submission from ${email}`,
				text: message,
				from: 'noreply@example.com',
				replyTo: email
			});

			return { success: true };
		} catch (error) {
			console.error('Email error:', error);
			return { success: false, error: 'Failed to send message' };
		}
	}
};
```

## Best Practices

1. **Never expose AWS credentials in client-side code**
2. **Use environment variables for configuration**
3. **Verify sender addresses in SES before deploying**
4. **Always provide both `text` and `html` versions when sending HTML emails**
5. **Handle errors gracefully and log failures for monitoring**
6. **Consider rate limits** - SES has sending limits based on your account status
7. **Use BCC for bulk emails** to avoid exposing all recipients
8. **Set appropriate Reply-To addresses** for better user experience

## Troubleshooting

### "Sender not verified" error

Verify your sender email address in the AWS SES console for your region.

### "Access Denied" error

Ensure your AWS credentials have the `ses:SendEmail` permission.

### Emails not arriving

- Check SES sending statistics in AWS console
- Verify you're not in sandbox mode (or that recipients are verified)
- Check spam folders
- Review bounce and complaint notifications in SES

## License

MIT
