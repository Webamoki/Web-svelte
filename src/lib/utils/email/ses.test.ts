import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sendEmail } from './ses.js';

// Mock AWS SES Client
vi.mock('@aws-sdk/client-ses', () => {
	const mockSend = vi.fn();
	return {
		SESClient: vi.fn(() => ({
			send: mockSend
		})),
		SendEmailCommand: vi.fn((params) => params),
		mockSend
	};
});

describe('sendEmail', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Set up default environment variables
		process.env.AWS_REGION = 'us-east-1';
	});

	it('should throw error if options is not provided', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await expect(sendEmail(null as any)).rejects.toThrow('sendEmail: options is required');
	});

	it('should throw error if "to" field is missing', async () => {
		await expect(
			sendEmail({
				subject: 'Test',
				text: 'Test message'
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any)
		).rejects.toThrow('at least one recipient is required');
	});

	it('should throw error if "to" field is empty string', async () => {
		await expect(
			sendEmail({
				to: '   ',
				subject: 'Test',
				text: 'Test message',
				from: 'sender@example.com'
			})
		).rejects.toThrow('at least one recipient is required');
	});

	it('should throw error if "to" field is empty array', async () => {
		await expect(
			sendEmail({
				to: [],
				subject: 'Test',
				text: 'Test message',
				from: 'sender@example.com'
			})
		).rejects.toThrow('at least one recipient is required');
	});

	it('should throw error if subject is missing', async () => {
		await expect(
			sendEmail({
				to: 'test@example.com',
				text: 'Test message'
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any)
		).rejects.toThrow('subject is required');
	});

	it('should throw error if both text and html are missing', async () => {
		await expect(
			sendEmail({
				to: 'test@example.com',
				subject: 'Test'
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any)
		).rejects.toThrow('at least one of text or html body must be provided');
	});

	it('should throw error if from is not provided', async () => {
		await expect(
			sendEmail({
				to: 'test@example.com',
				subject: 'Test',
				text: 'Test message'
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any)
		).rejects.toThrow('sender `from` is required');
	});

	it('should accept single recipient as string', async () => {
		const { SESClient } = await import('@aws-sdk/client-ses');
		const mockSend = vi.fn().mockResolvedValue({ MessageId: 'test-message-id' });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(SESClient as any).mockImplementation(() => ({ send: mockSend }));

		await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(mockSend).toHaveBeenCalledTimes(1);
	});

	it('should accept multiple recipients as array', async () => {
		const { SESClient } = await import('@aws-sdk/client-ses');
		const mockSend = vi.fn().mockResolvedValue({ MessageId: 'test-message-id' });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(SESClient as any).mockImplementation(() => ({ send: mockSend }));

		await sendEmail({
			to: ['test1@example.com', 'test2@example.com'],
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(mockSend).toHaveBeenCalledTimes(1);
	});

	it('should format source with fromName when provided', async () => {
		const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');
		const mockSend = vi.fn().mockResolvedValue({ MessageId: 'test-message-id' });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(SESClient as any).mockImplementation(() => ({ send: mockSend }));

		await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com',
			fromName: 'Test Sender'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				Source: 'Test Sender <sender@example.com>'
			})
		);
	});

	it('should handle CC and BCC recipients', async () => {
		const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');
		const mockSend = vi.fn().mockResolvedValue({ MessageId: 'test-message-id' });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(SESClient as any).mockImplementation(() => ({ send: mockSend }));

		await sendEmail({
			to: 'test@example.com',
			cc: 'cc@example.com',
			bcc: ['bcc1@example.com', 'bcc2@example.com'],
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				Destination: expect.objectContaining({
					CcAddresses: ['cc@example.com'],
					BccAddresses: ['bcc1@example.com', 'bcc2@example.com']
				})
			})
		);
	});

	it('should include both HTML and text body when provided', async () => {
		const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');
		const mockSend = vi.fn().mockResolvedValue({ MessageId: 'test-message-id' });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(SESClient as any).mockImplementation(() => ({ send: mockSend }));

		await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Plain text version',
			html: '<p>HTML version</p>',
			from: 'sender@example.com'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				Message: expect.objectContaining({
					Body: expect.objectContaining({
						Text: expect.objectContaining({
							Data: 'Plain text version'
						}),
						Html: expect.objectContaining({
							Data: '<p>HTML version</p>'
						})
					})
				})
			})
		);
	});

	it('should return MessageId on success', async () => {
		const { SESClient } = await import('@aws-sdk/client-ses');
		const mockSend = vi.fn().mockResolvedValue({ MessageId: 'test-message-id-123' });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(SESClient as any).mockImplementation(() => ({ send: mockSend }));

		const result = await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com'
		});

		expect(result).toBe('test-message-id-123');
	});

	it('should handle SES errors gracefully', async () => {
		const { SESClient } = await import('@aws-sdk/client-ses');
		const mockError = new Error('SES Service Error');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(mockError as any).name = 'MessageRejected';
		const mockSend = vi.fn().mockRejectedValue(mockError);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(SESClient as any).mockImplementation(() => ({ send: mockSend }));

		await expect(
			sendEmail({
				to: 'test@example.com',
				subject: 'Test',
				text: 'Test message',
				from: 'sender@example.com'
			})
		).rejects.toThrow(/failed to send email/);
	});

	it('should handle reply-to addresses', async () => {
		const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');
		const mockSend = vi.fn().mockResolvedValue({ MessageId: 'test-message-id' });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(SESClient as any).mockImplementation(() => ({ send: mockSend }));

		await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com',
			replyTo: 'reply@example.com'
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				ReplyToAddresses: ['reply@example.com']
			})
		);
	});

	it('should handle multiple reply-to addresses', async () => {
		const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');
		const mockSend = vi.fn().mockResolvedValue({ MessageId: 'test-message-id' });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(SESClient as any).mockImplementation(() => ({ send: mockSend }));

		await sendEmail({
			to: 'test@example.com',
			subject: 'Test',
			text: 'Test message',
			from: 'sender@example.com',
			replyTo: ['reply1@example.com', 'reply2@example.com']
		});

		expect(SendEmailCommand).toHaveBeenCalledWith(
			expect.objectContaining({
				ReplyToAddresses: ['reply1@example.com', 'reply2@example.com']
			})
		);
	});
});
